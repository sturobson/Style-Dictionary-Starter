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
 * Fetch all approved tokens from Notion database
 */
async function fetchTokensFromNotion() {
  try {
    let allResults = [];
    let hasMore = true;
    let startCursor = undefined;

    // Handle pagination
    while (hasMore) {
      const response = await notion.databases.query({
        database_id: databaseId,
        start_cursor: startCursor,
        filter: {
          property: 'Status',
          select: {
            equals: 'Approved'
          }
        }
      });

      allResults = [...allResults, ...response.results];
      hasMore = response.has_more;
      startCursor = response.next_cursor;
    }

    return allResults;
  } catch (error) {
    console.error('Error fetching from Notion:', error.message);
    throw error;
  }
}

/**
 * Extract token data from Notion page properties
 */
function extractTokenData(page) {
  const properties = page.properties;

  return {
    id: page.id,
    name: properties.Name?.title[0]?.plain_text || '',
    path: properties['Token Path']?.rich_text[0]?.plain_text || '',
    value: properties.Value?.rich_text[0]?.plain_text || '',
    type: properties.Type?.select?.name || '',
    category: properties.Category?.select?.name || '',
    status: properties.Status?.select?.name || 'Draft',
    description: properties.Description?.rich_text[0]?.plain_text || ''
  };
}

/**
 * Convert flat token list to nested JSON structure
 */
function buildTokenTree(tokens) {
  const tree = {};

  tokens.forEach(token => {
    const pathParts = token.path.split('.');
    let current = tree;

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) {
        // Last part - add the token
        current[part] = {
          $value: token.value,
          $type: token.type
        };

        if (token.description) {
          current[part].$description = token.description;
        }

        // Add Notion metadata as extensions
        current[part].$extensions = {
          'com.notion': {
            status: token.status,
            category: token.category,
            notionId: token.id,
            lastSynced: new Date().toISOString()
          }
        };
      } else {
        // Create nested object if it doesn't exist
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
    });
  });

  return tree;
}

/**
 * Flatten nested token object back into array (for comparison/conflict detection)
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
 * Main function to sync tokens from Notion
 */
async function syncTokens() {
  console.log('🔄 Fetching tokens from Notion...');

  const pages = await fetchTokensFromNotion();
  console.log(`✅ Found ${pages.length} approved tokens\n`);

  const notionTokens = pages.map(extractTokenData);
  const newTokenTree = buildTokenTree(notionTokens);

  // Create tokens directory if it doesn't exist
  const tokensDir = path.join(__dirname, 'tokens');
  if (!fs.existsSync(tokensDir)) {
    fs.mkdirSync(tokensDir, { recursive: true });
  }

  // Check for conflicts with existing tokens.json
  const outputPath = path.join(tokensDir, 'tokens.json');
  let existingTokens = {};
  let conflicts = [];

  if (fs.existsSync(outputPath)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
      existingTokens = flattenTokens(existingData);
    } catch (error) {
      console.warn('⚠️  Could not read existing tokens.json, treating as new file\n');
    }
  }

  // Flatten new tokens for comparison
  const flatNewTokens = flattenTokens(newTokenTree);

  // Check for conflicts (token exists in both but with different values)
  flatNewTokens.forEach(newToken => {
    const existing = existingTokens.find(t => t.path === newToken.path);
    if (existing && existing.value !== newToken.value) {
      conflicts.push({
        path: newToken.path,
        local: existing.value,
        notion: newToken.value
      });
    }
  });

  // Report what we found
  if (conflicts.length > 0) {
    console.log(`⚠️  Found ${conflicts.length} conflicts (local changes != Notion):`);
    conflicts.forEach(conflict => {
      console.log(`   ${conflict.path}:`);
      console.log(`     Local: ${conflict.local}`);
      console.log(`     Notion: ${conflict.notion}`);
    });
    console.log(`\n📝 Syncing from Notion (Notion values take precedence)\n`);
  }

  // Write tokens to JSON file (Notion is source of truth)
  fs.writeFileSync(
    outputPath,
    JSON.stringify(newTokenTree, null, 2),
    'utf-8'
  );

  console.log(`💾 Tokens saved to /tokens/tokens.json`);
  console.log('✨ Sync complete!');

  return newTokenTree;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  syncTokens().catch(console.error);
}

export { syncTokens };
