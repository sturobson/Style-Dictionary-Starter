import { createStyleDictionary } from './style-dictionary-config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const notionDatabaseId = process.env.NOTION_DATABASE_ID;

/**
 * Add Notion metadata comment to generated files
 */
function addNotionHeader(filePath) {
  const notionUrl = `https://www.notion.so/${notionDatabaseId}`;
  const header = `/**
 * Do not edit directly, this file was auto-generated.
 * 
 * Generated from Notion Design Tokens
 * Database: ${notionUrl}
 * Last updated: ${new Date().toISOString()}
 */\n\n`;

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Remove all comment blocks at the top of the file
  let contentStartIndex = 0;
  let inComment = false;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('/**')) {
      inComment = true;
    }
    if (inComment && lines[i].includes('*/')) {
      contentStartIndex = i + 1;
      // Skip empty lines after comment
      while (contentStartIndex < lines.length && lines[contentStartIndex].trim() === '') {
        contentStartIndex++;
      }
      break;
    }
  }

  const newContent = header + lines.slice(contentStartIndex).join('\n').trimStart();
  fs.writeFileSync(filePath, newContent, 'utf-8');
}

async function build() {
  console.log('🏗️  Building with Style Dictionary...\n');

  // Create configured Style Dictionary instance
  const sd = createStyleDictionary();

  // Build all platforms
  await sd.buildAllPlatforms();

  // Add Notion metadata to generated files
  addNotionHeader(path.join(__dirname, 'build/css/variables.css'));
  addNotionHeader(path.join(__dirname, 'build/scss/_variables.scss'));

  console.log('\n✅ Build complete!');
}

build().catch(console.error);
