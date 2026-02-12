import { Client } from '@notionhq/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Notion client
const notion = new Client({ auth: process.env.NOTION_TOKEN });
const databaseId = process.env.NOTION_DATABASE_ID;

/**
 * Flatten nested token object into array for processing
 */
function flattenTokens(obj, prefix = '') {
  const tokens = [];

  Object.keys(obj).forEach(key => {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    const value = obj[key];

    if (value.$value) {
      // This is a token
      tokens.push({
        path: fullPath,
        value: value.$value,
        type: value.$type || '',
        description: value.$description || '',
        category: value.$extensions?.['com.notion']?.category || '',
        status: value.$extensions?.['com.notion']?.status || 'Draft',
        notionId: value.$extensions?.['com.notion']?.notionId || null
      });
    } else if (typeof value === 'object' && value !== null) {
      // Recurse for nested objects
      tokens.push(...flattenTokens(value, fullPath));
    }
  });

  return tokens;
}

/**
 * Update an existing Notion page
 */
async function updateNotionPage(pageId, token) {
  try {
    await notion.pages.update({
      page_id: pageId,
      properties: {
        'Value': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: token.value
              }
            }
          ]
        },
        'Type': {
          select: {
            name: token.type
          }
        },
        'Category': {
          select: {
            name: token.category
          }
        },
        'Description': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: token.description
              }
            }
          ]
        }
      }
    });
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to update "${token.path}":`, error.message);
    return false;
  }
}

/**
 * Create a new Notion page in the database
 */
async function createNotionPage(token) {
  try {
    await notion.pages.create({
      parent: {
        database_id: databaseId
      },
      properties: {
        'Name': {
          title: [
            {
              type: 'text',
              text: {
                content: token.path
              }
            }
          ]
        },
        'Token Path': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: token.path
              }
            }
          ]
        },
        'Value': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: token.value
              }
            }
          ]
        },
        'Type': {
          select: {
            name: token.type
          }
        },
        'Category': {
          select: {
            name: token.category
          }
        },
        'Description': {
          rich_text: [
            {
              type: 'text',
              text: {
                content: token.description
              }
            }
          ]
        },
        'Status': {
          select: {
            name: 'Draft'
          }
        }
      }
    });
    return true;
  } catch (error) {
    console.error(`  ❌ Failed to create "${token.path}":`, error.message);
    return false;
  }
}

/**
 * Fetch all tokens currently in Notion database
 * Returns a map of token path -> Notion data for quick lookup
 */
async function fetchExistingTokensFromNotion() {
  try {
    let allPages = [];
    let hasMore = true;
    let startCursor = undefined;

    // Fetch all pages from database
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor
      });

      allPages = [...allPages, ...response.results];
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    // Build lookup map of token path -> Notion data
    const notionTokens = {};

    allPages.forEach(page => {
      const props = page.properties;
      const tokenPath = props['Token Path']?.rich_text[0]?.plain_text;

      if (tokenPath) {
        notionTokens[tokenPath] = {
          id: page.id,
          value: props.Value?.rich_text[0]?.plain_text || '',
          type: props.Type?.select?.name || '',
          description: props.Description?.rich_text[0]?.plain_text || '',
          category: props.Category?.select?.name || ''
        };
      }
    });

    return notionTokens;
  } catch (error) {
    console.error('Error fetching from Notion:', error.message);
    throw error;
  }
}

/**
 * Compare local token with Notion version to detect changes
 */
function hasTokenChanged(local, notion) {
  if (!notion) return true; // New token (doesn't exist in Notion)

  return (
    local.value !== notion.value ||
    local.type !== notion.type ||
    local.description !== notion.description ||
    local.category !== notion.category
  );
}

/**
 * Main function to push tokens to Notion
 */
async function pushTokens() {
  console.log('📤 Pushing tokens to Notion...\n');

  // Read current tokens from JSON
  const tokensPath = path.join(__dirname, 'tokens', 'tokens.json');
  if (!fs.existsSync(tokensPath)) {
    console.error('❌ tokens/tokens.json not found. Run "npm run sync" first.');
    process.exit(1);
  }

  const tokensData = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));
  const localTokens = flattenTokens(tokensData);

  // Fetch current state from Notion
  console.log('🔍 Checking Notion database for existing tokens...\n');
  const notionTokens = await fetchExistingTokensFromNotion();

  // Find changed, new, and unchanged tokens
  const changedTokens = [];
  const newTokens = [];
  const unchangedTokens = [];

  localTokens.forEach(token => {
    const notionToken = notionTokens[token.path];

    if (!notionToken) {
      newTokens.push(token);
    } else if (hasTokenChanged(token, notionToken)) {
      // Update the notionId so we can update the right page
      token.notionId = notionToken.id;
      changedTokens.push(token);
    } else {
      unchangedTokens.push(token);
    }
  });

  // Report what we found
  console.log(`Found ${localTokens.length} tokens total:`);
  console.log(`  • ${unchangedTokens.length} unchanged (skipping)`);
  console.log(`  • ${changedTokens.length} changed`);
  console.log(`  • ${newTokens.length} new\n`);

  if (changedTokens.length === 0 && newTokens.length === 0) {
    console.log('✨ Everything is already synced! Nothing to do.\n');
    return;
  }

  let updated = 0;
  let created = 0;

  // Push changed tokens
  for (const token of changedTokens) {
    process.stdout.write(`📝 Updating "${token.path}"... `);
    if (await updateNotionPage(token.notionId, token)) {
      console.log('✅');
      updated++;
    }
  }

  // Push new tokens
  for (const token of newTokens) {
    process.stdout.write(`✨ Creating "${token.path}"... `);
    if (await createNotionPage(token)) {
      console.log('✅');
      created++;
    }
  }

  console.log(`\n✅ Push complete!`);
  console.log(`   Updated: ${updated} tokens`);
  console.log(`   Created: ${created} new tokens`);
  if (created > 0) {
    console.log(`\n⚠️  Note: New tokens are created with "Draft" status. Update their status in Notion.`);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  pushTokens().catch(console.error);
}

export { pushTokens };
