import StyleDictionary from 'style-dictionary';

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
  const config = createStyleDictionaryConfig();
  return new StyleDictionary(config);
}
