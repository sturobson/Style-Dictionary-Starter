import StyleDictionary from 'style-dictionary';

/**
 * Filter function to identify microcopy tokens
 */
function isMicrocopyToken(token) {
  return token.$extensions &&
    token.$extensions['com.alwaystwisted.microcopy'] &&
    token.$extensions['com.alwaystwisted.microcopy'].enabled;
}

/**
 * Build nested object from flat token paths
 */
function buildNestedObject(tokens) {
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
}

/**
 * Register custom formats for microcopy tokens
 */
function registerMicrocopyFormats() {
  // JavaScript/ES6 format
  StyleDictionary.registerFormat({
    name: 'javascript/microcopy',
    format: async function ({ dictionary }) {
      const microcopyTokens = dictionary.allTokens.filter(isMicrocopyToken);
      const nested = buildNestedObject(microcopyTokens);
      return `export const microcopy = ${JSON.stringify(nested, null, 2)};`;
    }
  });

  // JSON format for use in other systems
  StyleDictionary.registerFormat({
    name: 'json/microcopy',
    format: async function ({ dictionary }) {
      const microcopyTokens = dictionary.allTokens.filter(isMicrocopyToken);
      const nested = buildNestedObject(microcopyTokens);
      return JSON.stringify(nested, null, 2);
    }
  });

  // Nunjucks template variables
  StyleDictionary.registerFormat({
    name: 'nunjucks/microcopy',
    format: async function ({ dictionary }) {
      const microcopyTokens = dictionary.allTokens.filter(isMicrocopyToken);
      
      return microcopyTokens
        .map(token => {
          const name = token.path.join('_').toUpperCase();
          const value = token.$value.replace(/"/g, '\\"');
          return `{% set ${name} = "${value}" %}`;
        })
        .join('\n');
    }
  });

  // TypeScript interface format
  StyleDictionary.registerFormat({
    name: 'typescript/microcopy-interface',
    format: async function ({ dictionary }) {
      const microcopyTokens = dictionary.allTokens.filter(isMicrocopyToken);
      const structure = buildNestedObject(microcopyTokens);

      const jsonToInterface = (obj, indent = 0) => {
        const spaces = '  '.repeat(indent);
        let result = '{\n';

        for (const [key, value] of Object.entries(obj)) {
          if (typeof value === 'string') {
            result += `${spaces}  ${key}: string;\n`;
          } else {
            result += `${spaces}  ${key}: ${jsonToInterface(value, indent + 1)};\n`;
          }
        }

        result += `${spaces}}`;
        return result;
      };

      return `export interface Microcopy ${jsonToInterface(structure)}\n\n` +
        `export const microcopy: Microcopy;`;
    }
  });
}

/**
 * Style Dictionary configuration for microcopy tokens
 * Generates interface copy tokens in multiple formats for different platforms
 */
export function createStyleDictionaryConfig() {
  return {
    source: ['tokens/copy/**/*.json'],
    platforms: {
      js: {
        transformGroup: 'js',
        buildPath: 'build/js/',
        files: [
          {
            destination: 'microcopy.js',
            format: 'javascript/microcopy'
          },
          {
            destination: 'microcopy.json',
            format: 'json/microcopy'
          }
        ]
      },
      nunjucks: {
        transformGroup: 'js',
        buildPath: 'build/nunjucks/',
        files: [
          {
            destination: 'microcopy.njk',
            format: 'nunjucks/microcopy'
          }
        ]
      },
      typescript: {
        transformGroup: 'js',
        buildPath: 'build/ts/',
        files: [
          {
            destination: 'microcopy.d.ts',
            format: 'typescript/microcopy-interface'
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
  registerMicrocopyFormats();
  const config = createStyleDictionaryConfig();
  return new StyleDictionary(config);
}
