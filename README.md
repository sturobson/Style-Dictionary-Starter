# Design Tokens Workflow (Part 15) - Using Design Tokens for Microcopy

This project demonstrates managing interface copy (microcopy) as design tokens using Style Dictionary and the DTCG specification's `$extensions` pattern.

Microcopy is the small text throughout your interface—button labels, form hints, error messages, empty states, and confirmations. Instead of scattering this copy throughout your code, manage it like you manage colors and spacing: as tokens.

## What is Microcopy?

Button labels, form hints, error messages, empty states—these aren't just strings. They're design decisions that directly impact how users understand and trust your product.

**Before:** Copy scattered across component files, inconsistent across platforms, impossible to collaborate on.

**After:** Single source of truth, version control, team collaboration, multi-platform consistency.

## Prerequisites

- Node.js (v16+)
- Basic knowledge of design tokens and JSON

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Build the Tokens

```bash
npm run build
```

This generates:
- `build/js/tokens.js` - Visual design tokens (colors, spacing, typography, etc.)
- `build/js/microcopy.js` - Interface copy tokens (button labels, messages, hints, etc.)

## Token Structure

Microcopy tokens are organized by context and component type:

```
tokens/copy/en/
├── button.tokens.json    # Button labels (primary, secondary, submit, delete)
├── form.tokens.json      # Form labels, placeholders, hints
├── error.tokens.json     # Validation and system error messages
└── feedback.tokens.json  # Success, loading, empty state messages
```

### Example Token

```json
{
  "copy": {
    "button": {
      "submit": {
        "label": {
          "$value": "Submit",
          "$type": "string",
          "$description": "Primary form submission button",
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
}
```

The `com.alwaystwisted.microcopy` extension identifies this as a microcopy token, allowing the build process to filter and generate these separately from visual design tokens.

## Generated Output

Running `npm run build` generates `build/js/microcopy.js`:

```javascript
export const microcopy = {
  button: {
    primary: { label: "Continue" },
    secondary: { label: "Cancel" },
    submit: { label: "Submit" },
    delete: { label: "Delete", confirm: "Are you sure you want to delete this item?" }
  },
  form: {
    input: {
      email: {
        label: "Email address",
        placeholder: "you@example.com",
        hint: "We'll never share your email with anyone else"
      },
      password: {
        label: "Password",
        placeholder: "Enter your password",
        hint: "Must be at least 8 characters"
      }
    }
  },
  error: {
    validation: {
      required: "This field is required",
      email: { invalid: "Please enter a valid email address" },
      password: {
        tooShort: "Password must be at least 8 characters",
        mismatch: "Passwords do not match"
      }
    },
    system: {
      generic: "Something went wrong. Please try again.",
      network: "Unable to connect. Please check your internet connection."
    }
  },
  feedback: {
    success: {
      save: "Your changes have been saved",
      delete: "Item deleted successfully"
    },
    loading: {
      default: "Loading...",
      saving: "Saving your changes..."
    },
    emptyState: {
      noResults: "No results found",
      noItems: "You don't have any items yet"
    }
  }
};
```

## Usage Examples

### React Component

```jsx
import { microcopy } from './build/js/microcopy.js';

function SignUpForm() {
  return (
    <form>
      <label htmlFor="email">
        {microcopy.form.input.email.label}
      </label>
      <input
        id="email"
        type="email"
        placeholder={microcopy.form.input.email.placeholder}
        aria-describedby="email-hint"
      />
      <small id="email-hint">
        {microcopy.form.input.email.hint}
      </small>
      
      <button type="submit">
        {microcopy.button.submit.label}
      </button>
    </form>
  );
}
```

### Form Validation with Tokens

```javascript
import { microcopy } from './build/js/microcopy.js';

class FormValidator {
  validateEmail(value) {
    if (!value) {
      return {
        valid: false,
        message: microcopy.error.validation.required
      };
    }
    if (!value.includes('@')) {
      return {
        valid: false,
        message: microcopy.error.validation.email.invalid
      };
    }
    return { valid: true };
  }
}
```

See `examples/` for complete React, vanilla JavaScript, and HTML examples.

## Benefits

### For Copywriters
- Edit JSON files directly (no code needed)
- Propose changes via pull requests
- See all copy at a glance
- Understand context through grouping and descriptions

### For Developers
- Clean, semantic references to copy
- No hardcoded strings scattered throughout components
- Type-safe access (with TypeScript support)
- Automatic updates when tokens change

### For Designers
- Reference same tokens in design tools
- Ensure design and code stay in sync
- Participate in copy review process

## File Structure

```
.
├── build.js                     # Build orchestration
├── style-dictionary-config.js   # Style Dictionary configuration with microcopy format
├── tokens/
│   ├── tokens.json              # Visual design tokens (colors, spacing, etc.)
│   └── copy/
│       └── en/
│           ├── button.tokens.json    # Button labels
│           ├── form.tokens.json      # Form field copy
│           ├── error.tokens.json     # Error messages
│           └── feedback.tokens.json  # Success, loading, empty states
├── examples/
│   ├── SignUpForm.jsx           # React component example
│   ├── FormValidator.js         # Form validation class
│   ├── form-controller.js       # Vanilla JavaScript implementation
│   ├── form-example.html        # HTML demo with styling
│   └── README.md                # Detailed examples guide
└── build/
    ├── js/
    │   ├── tokens.js            # Visual design tokens (auto-generated)
    │   └── microcopy.js         # Interface copy tokens (auto-generated)
    ├── css/
    │   └── variables.css        # CSS custom properties
    └── scss/
        └── _variables.scss      # Sass variables
```

## Adding More Microcopy

Create new token files following the existing pattern:

1. Create a new file in `tokens/copy/en/` (e.g., `navigation.tokens.json`)
2. Use the same token structure with `$extensions.com.alwaystwisted.microcopy.enabled: true`
3. Run `npm run build` to regenerate `build/js/microcopy.js`

Example for navigation:

```json
{
  "copy": {
    "navigation": {
      "menu": {
        "home": {
          "$value": "Home",
          "$extensions": {
            "com.alwaystwisted.microcopy": { "enabled": true }
          }
        }
      }
    }
  }
}
```

## Multi-Language Support

Organize tokens by language:

```
tokens/copy/
├── en/
│   ├── button.tokens.json
│   └── form.tokens.json
├── fr/
│   ├── button.tokens.json
│   └── form.tokens.json
└── de/
    ├── button.tokens.json
    └── form.tokens.json
```

Then update `style-dictionary-config.js` to build each language separately. See the examples and `BRANCH-15-MICROCOPY.md` for details.

## TypeScript Support

To generate TypeScript type definitions for type-safe microcopy access:

1. Register a `typescript/microcopy-interface` format in `style-dictionary-config.js`
2. Add TypeScript output to your build config
3. Import types in your TypeScript files for autocomplete and type checking

See the main article for implementation details.

## Why This Approach Works

**Specification Compliant:** Uses DTCG's `$extensions` field as designed—for tool-specific metadata without breaking the standard.

**Version Control:** Every copy change has git history, commit messages, and code review.

**Collaboration:** Copywriters, designers, and developers work from shared tokens, not scattered files.

**Consistency:** Impossible to have different button labels across your app.

**Maintainability:** Change a message in one place, update everywhere.

**Accessibility:** Centralize aria-labels, descriptions, and alt text.

**Scalability:** Scales from single-language apps to multi-platform, multi-language systems.

## Next Steps

1. **Expand tokens:** Add more token files for different parts of your interface
2. **Add languages:** Create language-specific token files for localization
3. **Type safety:** Generate TypeScript definitions for type-safe access
4. **Integration:** Use generated `microcopy.js` in your actual application
5. **Templates:** Generate formats for Nunjucks, Handlebars, or other template languages

## Learn More

- Read the full article: "A Design Tokens Workflow (part 15) - Using Design Tokens for Microcopy"
- See `BRANCH-15-MICROCOPY.md` for branch-specific documentation
- Check `examples/` for complete implementation examples
- Review the token structure in `tokens/copy/` for organization patterns
