import { globSync } from 'glob';
import StyleDictionary from 'style-dictionary';

const tokenFiles = globSync('src/tokens/**/*.tokens');
const HEADER_COMMENT = `/**
 * Do not edit directly, this file was auto-generated.
 */\n\n`;

// Custom format for Sass-backed CSS custom properties
StyleDictionary.hooks.formats['css/sass-ref'] = function ({ dictionary }) {
  const tokens = dictionary.allTokens.map((token) => {
    const sassVariable = token.original.$value.startsWith('{spacing.')
      ? `$spacing-${token.original.$value.match(/spacing\.(\d+)\.\$value/)[1]}`
      : `$${token.name}`; // Resolve to base token if it's a reference
    return `  --${token.name}: #{${sassVariable}};`; // Correct interpolation
  }).join('\n');
  return `${HEADER_COMMENT}@use "../base/_base-tokens.scss";\n\n:root {\n${tokens}\n}`;
};

const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    sass_base: {
      transformGroup: 'scss',
      buildPath: 'build/sass/base/',
      files: [
        {
          destination: '_base-tokens.scss',
          format: 'scss/variables',
          filter: (token) => token.filePath.includes('base'), // Only base tokens
        },
      ],
    },
    css_semantic: {
      transformGroup: 'scss',
      buildPath: 'build/sass/semantic/',
      files: [
        {
          destination: 'variables.scss',
          format: 'css/sass-ref',
          filter: (token) => token.filePath.includes('semantic'), // Only semantic tokens
        },
      ],
    },
  },
});

myStyleDictionary.buildAllPlatforms();
console.log('Build completed!');
