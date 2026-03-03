# Microcopy Tokens Examples

This directory contains practical examples of how to use design tokens for managing interface copy (microcopy) in your projects.

## What is Microcopy?

Microcopy is the small text scattered throughout your interface—button labels, form hints, error messages, empty states, and confirmation dialogs. Treating these as tokens gives you:

- **Consistency**: Same language everywhere
- **Accessibility**: Centralized aria-labels and descriptions
- **Localisation**: Single structure with language-specific layers
- **Team collaboration**: Designers, copywriters, and developers working from the same source
- **Version control**: Full audit trail of copy changes

## Files in This Directory

### `SignUpForm.jsx`
A React component demonstrating microcopy token usage in a form. Shows how to:
- Use tokens for labels, placeholders, and hints
- Display validation messages from tokens
- Handle form submission with accessible feedback

### `FormValidator.js`
A reusable form validator class that returns validation messages directly from microcopy tokens. Use this to ensure consistent error messages across your application.

### `form-controller.js`
A vanilla JavaScript implementation showing how to:
- Attach form validation to DOM elements
- Display error and success messages from tokens
- Manage form state and user feedback

### `form-example.html`
A standalone HTML example demonstrating the form UI. This can be used to test the form styling and behavior.

## How Tokens Are Generated

When you run `npm run build` (or `node build.js`), Style Dictionary:

1. Reads all token files from `tokens/copy/`
2. Filters tokens with the `com.alwaystwisted.microcopy` extension enabled
3. Generates a nested JavaScript object in `build/js/microcopy.js`

The output structure mirrors your token organization:

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
      email: {
        label: "Email address",
        placeholder: "you@example.com",
        hint: "We'll never share..."
      },
      password: {
        label: "Password",
        placeholder: "Enter your password",
        hint: "Must be at least..."
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
      generic: "Something went wrong...",
      network: "Unable to connect..."
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

## Using Microcopy Tokens

### In React

```jsx
import { microcopy } from '../build/js/microcopy.js';

function MyForm() {
  return (
    <label htmlFor="email">
      {microcopy.form.input.email.label}
    </label>
  );
}
```

### In Vanilla JavaScript

```javascript
import { microcopy } from '../build/js/microcopy.js';
import { FormValidator } from './FormValidator.js';

const validator = new FormValidator();
const result = validator.validateEmail(email);

if (!result.valid) {
  errorElement.textContent = result.message;
}
```

### With Template Languages

For Nunjucks or Handlebars, you can extend the configuration to generate variable files or includes. See the main article for more details.

## Benefits

**For Copywriters**
- Edit JSON files directly
- Propose changes via pull requests
- See all copy at a glance
- Understand context through grouping and descriptions

**For Developers**
- Clean, semantic references to copy
- No hardcoded strings scattered throughout
- Type-safe access (with TypeScript support)
- Automatic updates when tokens change

**For Designers**
- Reference same tokens in design tools
- Ensure design and code stay in sync
- Participate in copy review process

## Token Structure

Microcopy tokens use the token `$extensions` property to identify themselves:

```json
{
  "button": {
    "submit": {
      "label": {
        "$value": "Submit",
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

The `com.alwaystwisted.microcopy` extension is a custom property that:
- Marks the token as microcopy (so the build system knows to include it)
- Can store additional metadata like category and context
- Follows the DTCG spec's `$extensions` pattern

## Next Steps

1. **Build the tokens**: Run `npm run build` to generate `build/js/microcopy.js`
2. **Import in your app**: Use the examples above to reference tokens
3. **Expand**: Add more token files as needed
4. **Collaborate**: Share with designers and copywriters

See `tokens/copy/` for the token file structure, and the main article for advanced topics like multi-language support and TypeScript type generation.
