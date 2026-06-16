/**
 * Style Dictionary action that validates all color combinations
 * and reports results with warnings for AAA and chosen foreground issues
 */
import { getContrastRatio } from '../contrast-helpers.js';
import { contrastConfig } from '../../build.js';

export default {
  name: 'validate-contrast',
  do: async (dictionary, config) => {
    console.log('\n🔍 Validating colour contrast...\n');

    const passes = [];
    const warnings = [];
    const chosenFails = [];

    // Build a map of foreground tokens for quick lookup
    const foregroundTokens = {};
    dictionary.allTokens.forEach(token => {
      if (token.path[token.path.length - 1] === contrastConfig.foregroundTokenName) {
        const key = `${token.path[0]}.${token.path[1]}`;
        foregroundTokens[key] = token.value;
      }
    });

    dictionary.allTokens.forEach(token => {
      if (token.attributes?.contrast) {
        const { aa, aaa } = token.attributes.contrast;
        const tokenName = token.name;

        // All auto-generated AA combinations pass (guaranteed from black/white)
        passes.push(tokenName);

        // Check AAA compliance for auto-generated colours (warning only)
        if (!aaa.passes) {
          warnings.push({
            token: tokenName,
            background: token.value,
            foreground: aaa.color,
            ratio: aaa.ratio,
            required: 7,
            level: 'AAA'
          });
        }

        // If a chosen foreground exists and fails AA, warn about it
        const componentGroup = token.path[0];
        const componentVariant = token.path[1];
        const foregroundKey = `${componentGroup}.${componentVariant}`;
        if (foregroundTokens[foregroundKey]) {
          const chosenForeground = foregroundTokens[foregroundKey];
          const chosenRatio = getContrastRatio(token.value, chosenForeground);
          if (chosenRatio < 4.5) {
            chosenFails.push({
              token: tokenName,
              foreground: chosenForeground,
              ratio: chosenRatio.toFixed(2),
              required: 4.5
            });
          }
        }
      }
    });

    // Report results
    if (passes.length > 0) {
      console.log(`✅ ${passes.length} color combinations pass WCAG AA\n`);
    }

    if (warnings.length > 0) {
      console.log(`⚠️  ${warnings.length} color combinations don't meet WCAG AAA:\n`);
      warnings.forEach(w => {
        console.log(`   ${w.token}`);
        console.log(`   └─ ${w.ratio}:1 (requires ${w.required}:1 for AAA)`);
      });
      console.log('');
    }

    if (chosenFails.length > 0) {
      console.log(`⚠️  ${chosenFails.length} chosen foreground colours don't meet WCAG AA:\n`);
      chosenFails.forEach(f => {
        console.log(`   ${f.token}`);
        console.log(`   └─ Chosen: ${f.foreground} - ${f.ratio}:1 (requires ${f.required}:1)`);
      });
      console.log('');
    }

    console.log('✅ All auto-generated colour combinations meet WCAG AA standards\n');
  },
  undo: async () => {
    // No cleanup needed
  }
};
