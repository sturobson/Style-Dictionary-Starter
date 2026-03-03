import StyleDictionary from 'style-dictionary';

/**
 * Register custom format for microcopy tokens
 * Filters tokens with microcopy extension and outputs a nested JavaScript object
 */
function registerMicrocopyFormat() {
  StyleDictionary.registerFormat({
    name: 'javascript/microcopy',
    format: async function ({ dictionary }) {
      // Filter for tokens with our microcopy extension
      const microcopyTokens = dictionary.allTokens.filter(token => {
        return token.$extensions &&
          token.$extensions['com.alwaystwisted.microcopy'] &&
          token.$extensions['com.alwaystwisted.microcopy'].enabled;
      });

      // Build nested object matching token paths
      const buildNestedObject = (tokens) => {
        const result = {};

        tokens.forEach(token => {
          const path = token.path;
          let current = result;

          path.forEach((key, index) => {
            if (index === path.length - 1) {
              current[key] = token.$value;
            } else {
              current[key] = current[key] || {};
              current = current[key];
            }
          });
        });

        return result;
      };

      const nested = buildNestedObject(microcopyTokens);
      return `export const microcopy = ${JSON.stringify(nested, null, 2)};`;
    }
  });
}

/**
 * Style Dictionary configuration for Notion-based design tokens
 * This configuration defines how tokens are transformed and built for different platforms
 */
export function createStyleDictionaryConfig() {
  return {
    source: ['tokens/**/*.json'],
    platforms: {
      css: {
        transformGroup: 'css',
        buildPath: 'build/css/',
        files: [
          {
            destination: 'variables.css',
            format: 'css/variables'
          }
        ]
      },
      scss: {
        transformGroup: 'scss',
        buildPath: 'build/scss/',
        files: [
          {
            destination: '_variables.scss',
            format: 'scss/variables'
          }
        ]
      },
      js: {
        transformGroup: 'js',
        buildPath: 'build/js/',
        files: [
          {
            destination: 'tokens.js',
            format: 'javascript/es6'
          },
          {
            destination: 'microcopy.js',
            format: 'javascript/microcopy'
          }
        ]
      }
    }
  };
}

/**
 * Create and return a configured Style Dictionary instance
 */
export function createStyleDictionary() {
  registerMicrocopyFormat();
  const config = createStyleDictionaryConfig();
  return new StyleDictionary(config);
}
