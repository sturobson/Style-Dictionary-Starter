# Notion + Style Dictionary Design Tokens

This project demonstrates syncing design tokens from a Notion database with Style Dictionary to generate platform-specific CSS, Sass, and JavaScript files.

## Prerequisites

- Node.js (v16+)
- A Notion workspace
- A Notion database with tokens

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Your Notion Integration

1. Go to [https://www.notion.com/my-integrations](https://www.notion.com/my-integrations)
2. Click **+ New integration**
3. Give it a name (e.g., "Design Tokens Sync")
4. Select your workspace
5. Under **Capabilities**, make sure "Read content" is checked
6. Click **Save**
7. Copy the **Internal Integration Token** (the long string starting with `ntn_`)

### 3. Create Your Notion Database

Create a database in Notion with these exact properties:

| Property Name | Type | Purpose |
|---------------|------|---------|
| Name | Title | Token name (e.g., "Primary Blue") |
| Token Path | Text | JSON path (e.g., "color.brand.primary") |
| Value | Text | Token value (e.g., "#007bff") |
| Type | Select | Token type (color, dimension, fontFamily, fontWeight, etc.) |
| Category | Select | Grouping (brand, semantic, component, foundation, etc.) |
| Description | Text | What the token is for and when to use it |
| Status | Select | Draft, Review, Approved, Deprecated |

**Important:** Only tokens with "Approved" status will be synced. This ensures you have a review workflow.

### 4. Get Your Database ID

**This is important—many people get this wrong.**

1. Open your Notion database (the actual table view)
2. Look at the URL in your browser
3. It looks like: `https://www.notion.so/abc123def456ghi789jkl?v=xyz&t=123`
4. Copy the part **before the `?v=`** (just the long hex string)
5. That's your database ID

### 5. Connect the Integration to Your Database

**This step is critical.** If you skip it, you'll get a "database not found" error.

1. Open your Notion database
2. Click **•••** in the top right
3. Scroll to **Connections**
4. Click **+ Add connections**
5. Select your integration name
6. Confirm access

The integration now has permission to read from that database.

### 6. Configure Your Environment

Create or update `.env` in the project root:

```env
NOTION_TOKEN=ntn_your_integration_token_here
NOTION_DATABASE_ID=abc123def456ghi789jkl
```

**Note:** The `.env` file is ignored by git for security.

## Usage

### Sync tokens from Notion only:

```bash
npm run sync
```

This fetches all "Approved" tokens from your Notion database and generates `tokens/tokens.json`.

### Push token changes back to Notion:

```bash
npm run push
```

If you've edited `tokens/tokens.json` locally and want to update those changes back to your Notion database, this command will:
- Update existing tokens (matching by Notion ID)
- Create new tokens that don't exist in Notion yet (with "Draft" status)

This is useful for workflows where developers make token adjustments locally, then push them back for team review.

### Build with Style Dictionary only:

```bash
npm run build
```

Generates CSS, Sass, and JavaScript files from existing tokens.

### Sync and build (recommended):

```bash
npm run sync:build
```

Pulls latest tokens from Notion, then generates all platform files in one command.

### Watch for changes:

```bash
npm run watch
```

Watches the `tokens/` directory and rebuilds whenever tokens change.

## Output

After building, you'll have:

- `build/css/variables.css` - CSS custom properties
- `build/scss/_variables.scss` - Sass variables  
- `build/js/tokens.js` - JavaScript ES6 module

Each file includes:
- A header with the Notion database URL
- The sync timestamp
- Inline documentation comments (`/** ... */`)

Example CSS output:

```css
/**
 * Do not edit directly, this file was auto-generated.
 * 
 * Generated from Notion Design Tokens
 * Database: https://www.notion.so/abc123def456ghi789jkl
 * Last updated: 2026-02-09T16:21:01.600Z
 */

:root {
  --color-brand-primary: #007bff; /** Primary brand color used for buttons and links */
  --spacing-base: 8px; /** Base unit for spacing scale (1x) */
  --typography-size-base: 16px; /** Base font size for body text */
}
```

## How It Works

1. **fetch-tokens.js** connects to Notion and fetches all "Approved" tokens
2. **token-validation.js** validates token data and reports any issues
3. Tokens are organized into a nested JSON structure matching your Token Path
4. Notion metadata (status, ID, sync time) is stored in `$extensions` for reference
5. **build.js** uses **style-dictionary-config.js** to run Style Dictionary and transform the JSON into CSS, Sass, and JS
6. **push-tokens.js** can sync local changes back to Notion for bidirectional workflows

### Modular Architecture

This example demonstrates good separation of concerns:

- **fetch-tokens.js**: Notion API integration and data fetching
- **push-tokens.js**: Bidirectional sync (JSON → Notion)
- **style-dictionary-config.js**: Platform-specific build configurations
- **build.js**: Build orchestration and file generation

## Troubleshooting

When you run `npm run sync`, the script checks if any tokens in your local `tokens/tokens.json` have different values than what's currently in Notion. If there are conflicts, it warns you before syncing:

```
Found 2 conflicts (local changes != Notion):
   color.brand.primary:
     Local: #007bff
     Notion: #C0FFEE
   spacing.base:
     Local: 8px
     Notion: 8px

Syncing from Notion (Notion values take precedence)
```

**Important:** Notion is always the source of truth. If you've edited tokens locally and they differ from Notion, the Notion values will override your local changes. If you want to keep local edits, push them back to Notion first with `npm run push`.

## Token Architecture

Your Notion tokens are transformed into a nested structure. For example:

```json
{
  "color": {
    "brand": {
      "primary": {
        "$value": "#007bff",
        "$type": "color",
        "$description": "Primary brand color",
        "$extensions": {
          "com.notion": {
            "status": "Approved",
            "category": "brand",
            "notionId": "abc123...",
            "lastSynced": "2026-02-09T16:21:01.600Z"
          }
        }
      }
    }
  }
}
```

The `$extensions` field preserves Notion metadata for:
- Audit trails (when was it synced?)
- Approval status tracking
- Linking back to the Notion page
- Debugging and documentation

## Troubleshooting

### "Could not find database with ID"

**Cause:** The integration doesn't have access to the database, or you used the wrong ID.

**Solution:**
1. Make sure you added the integration to the database's **Connections** (Step 5 above)
2. Double-check your database ID—get it from the URL before the `?v=`
3. Make sure you copied the integration token correctly

### "Provided ID is a page, not a database"

**Cause:** You copied the ID of a page that *contains* the database, not the database itself.

**Solution:**
1. Open the actual database/table view (not the parent page)
2. Copy the ID from that URL

### No tokens appear in generated files

**Cause:** Tokens don't have "Approved" status, or they have validation errors.

**Solution:**
1. Check that your tokens in Notion have `Status = "Approved"`
2. Check the terminal output for validation warnings
3. Verify your Token Path matches the expected format (`color.brand.primary`, etc.)

### "Cannot find module '@notionhq/client'"

**Cause:** Dependencies not installed.

**Solution:**
```bash
npm install
```

## File Structure

```
.
├── fetch-tokens.js              # Notion API integration and data fetching
├── push-tokens.js               # Bidirectional sync (JSON → Notion)
├── build.js                     # Build orchestration
├── style-dictionary-config.js   # Style Dictionary configuration
├── .env                         # Notion credentials (keep this private!)
├── .env.example                 # Template for environment variables
├── tokens/
│   └── tokens.json              # Generated token file
└── build/
    ├── css/
    │   └── variables.css        # CSS custom properties
    ├── scss/
    │   └── _variables.scss      # Sass variables
    └── js/
        └── tokens.js            # JavaScript ES6 module
```

## Tips

- **Token Path format:** Use dot notation (`color.brand.primary`, not `color/brand/primary`)
- **Updates:** Run `npm run sync:build` anytime you change tokens in Notion
- **Status workflow:** Use Status field to control which tokens make it to production
- **Categories:** Keep your categories consistent for easier organization
- **Descriptions:** Add meaningful descriptions to help your team understand each token

## Next Steps

Once you have this working:

- Add more tokens to your Notion database
- Customize token types to match your design system
- Set up a scheduled GitHub Action to sync automatically
- Connect this to your design tool (Figma, Penpot) for bidirectional sync
- Use the generated files in your actual project
