# Branch 15: Using Design Tokens for Microcopy

Implementation of the article "A Design Tokens Workflow (part 15) - Using Design Tokens for Microcopy" from alwaystwisted.com.

## What's Included

This branch demonstrates how to manage interface copy (microcopy) as design tokens using Style Dictionary and the DTCG specification's `$extensions` pattern.

### Token Files

Located in `tokens/copy/en/`, these JSON files define interface copy organized by context:

- **button.tokens.json** - Button labels for primary, secondary, submit, and delete actions
- **form.tokens.json** - Form field labels, placeholders, and hints for email and password inputs  
- **error.tokens.json** - Validation messages and system error messages
- **feedback.tokens.json** - Success, loading, and empty state messages

Each token uses the `com.alwaystwisted.microcopy` extension to identify it as microcopy, allowing selective generation.

### Configuration

**style-dictionary-config.js** updated with:
- Custom `javascript/microcopy` format that filters tokens by the microcopy extension
- Builds a nested JavaScript object structure from microcopy tokens
- Added `microcopy.js` output alongside standard token output

The format transforms token paths into nested objects:
```
tokens/copy/button/primary/label → microcopy.button.primary.label
```

### Generated Output

Running `npm run build` generates `build/js/microcopy.js`:

```javascript
export const microcopy = {
  button: {
    primary: { label: "Continue" },
    secondary: { label: "Cancel" },
    submit: { label: "Submit" },
    delete: { label: "Delete", confirm: "Are you sure..." }
  },
  form: {
    input: {
      email: { label: "Email address", placeholder: "...", hint: "..." },
      password: { label: "Password", placeholder: "...", hint: "..." }
    }
  },
  error: {
    validation: { required: "This field is required", ... },
    system: { generic: "Something went wrong...", ... }
  },
  feedback: {
    success: { save: "Your changes have been saved", ... },
    loading: { default: "Loading...", ... },
    emptyState: { noResults: "No results found", ... }
  }
};
```

### Examples

The `examples/` directory includes practical implementations:

#### SignUpForm.jsx
React component showing how to use microcopy tokens in a sign-up form with validation feedback.

Key patterns:
- Import and reference tokens directly in JSX
- Use tokens for labels, placeholders, and aria-describedby hints
- Pass validation messages from tokens to error displays

#### FormValidator.js
Reusable validation class that returns validation messages directly from tokens:
```javascript
const validator = new FormValidator();
const result = validator.validateEmail(email);
if (!result.valid) {
  showError(result.message); // Message comes from token
}
```

#### form-controller.js
Vanilla JavaScript implementation showing:
- Form field validation with token-based messages
- Error/success message display from tokens
- Event listener setup for blur and submit

#### form-example.html
Standalone HTML example with complete form styling and structure, demonstrating the visual implementation.

### Key Benefits

1. **Single Source of Truth** - All interface copy in one place, not scattered across components
2. **Consistency** - Same button labels, error messages, and help text everywhere
3. **Collaboration** - Copywriters, designers, and developers work from shared tokens
4. **Version Control** - Every copy change has git history, commit messages, and review process
5. **Multi-Platform** - Generate platform-specific outputs (JavaScript, TypeScript, Nunjucks, etc.) from single token source
6. **Accessibility** - Centralize aria-labels, descriptions, and alt text
7. **Localization** - Support multiple languages with consistent structure

### Token Structure Rules

Microcopy tokens use:
- `$value` - The actual text to display
- `$type` - Usually "string" at individual token level
- `$extensions` - Custom metadata using `com.alwaystwisted.microcopy` identifier
- `$description` - Documentation for context and tone

Example:
```json
{
  "button": {
    "submit": {
      "label": {
        "$value": "Submit",
        "$type": "string",
        "$description": "Primary form submission button label",
        "$extensions": {
          "com.alwaystwisted.microcopy": {
            "enabled": true,
            "category": "button"
          }
        }
      }
    }
  }
}
```

### Specification Compliance

The DTCG spec doesn't define a `string` or `content` type. This implementation:
- Uses `string` type at token level for clarity
- Uses `$extensions` to mark tokens as microcopy (per spec design)
- Filters by extension in the custom format
- Maintains forward compatibility with future spec updates

### Next Steps

To extend this implementation:

1. **Add More Token Files**
   - `tokens/copy/en/navigation.tokens.json` - Menu and breadcrumb labels
   - `tokens/copy/en/modals.tokens.json` - Dialog titles and confirmations
   - `tokens/copy/en/tooltips.tokens.json` - Help text and tooltips

2. **Add Multi-Language Support**
   ```
   tokens/copy/en/button.tokens.json
   tokens/copy/fr/button.tokens.json
   tokens/copy/de/button.tokens.json
   ```

3. **Add TypeScript Support**
   - Register `typescript/microcopy-interface` format
   - Generate type definitions for autocomplete and type safety

4. **Add Template Language Support**
   - Register `nunjucks/variables` format for server-side rendering
   - Register `handlebars/partials` format for email templates

5. **Add Validation**
   - Script to check button labels aren't too long
   - Linting rules for tone of voice consistency
   - CI integration for copy review

### Files Modified

- `style-dictionary-config.js` - Added format registration and config
- `build/js/microcopy.js` - Generated microcopy output (auto-generated)

### Files Added

- `tokens/copy/en/*.tokens.json` - Token definitions
- `examples/SignUpForm.jsx` - React example
- `examples/FormValidator.js` - Validation class
- `examples/form-controller.js` - Vanilla JS controller
- `examples/form-example.html` - HTML example
- `examples/README.md` - Examples documentation

### Related Articles

See the main series for context:
- Part 1: Getting Started with Design Tokens
- Part 14: Notion Integration
- Understanding $extensions in the Design Tokens Specification

### Branches

- `main` - Default branch
- `14-notion-design-tokens` - Previous implementation with Notion integration
- `15-microcopy-tokens` - This branch (current)
- `15-tailwind-css` - Alternative branch for Tailwind CSS integration
