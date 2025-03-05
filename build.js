import { globSync } from 'glob';
import path from 'path';
import StyleDictionary from 'style-dictionary';

// Find token files
const tokenFiles = globSync('src/tokens/**/*.tokens');
const HEADER_COMMENT = `/**
 * Do not edit directly, this file was auto-generated.
 */\n\n`;

// Create a new Style Dictionary instance
const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    css_base: {
      transformGroup: 'css',
      buildPath: 'build/css/base/',
      files: [
        {
          destination: 'colors.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('base'),
        },
      ],
    },
    css_semantic: {
      transformGroup: 'css',
      buildPath: 'build/css/semantic/',
      files: [
        {
          destination: 'colors.css',
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic'),
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'colors.dark.css',
          format: 'css/variables-dark',
          filter: (token) => token.filePath.includes('semantic') && token.filePath.includes('dark'),
          options: {
            outputReferences: true,
          },
        },
        {
          destination: 'colors.combined.css', // New output file
          format: 'css/variables-combined', // Use the new combined format
          options: {
            outputReferences: true,
          },
        },
        
      ],
    },
  },
});


StyleDictionary.hooks.formats['css/variables-dark'] = function({ dictionary, options }) {
  const { outputReferences } = options;
  const darkTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('semantic') && token.filePath.includes('dark')
  );
  const tokens = darkTokens.map((token) => {
    const { name, comment } = token;
    const baseVariableName = token.original['$value'].replace(/^\{|\}$/g, ''); // Remove curly braces
    const cssVariableName = `var(--${baseVariableName.replace(/\./g, '-').replace(/_/g, '-')})`;
    return `  --${name}: ${cssVariableName};${comment ? ` /* ${comment} */` : ''}`;
  }).join('\n');
  return `${HEADER_COMMENT}@media (prefers-color-scheme: dark) {\n  :root {\n${tokens}\n  }\n}`;
};

// Register a new format for combined light and dark mode CSS
StyleDictionary.hooks.formats['css/variables-combined'] = function({ dictionary, options }) {
  const { outputReferences } = options;
  const semanticTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('semantic')
  );
  const darkTokens = dictionary.allTokens.filter(token => 
    token.filePath.includes('semantic') && token.filePath.includes('dark')
  );
  const semanticVariables = semanticTokens.map((token) => {
    const { name, comment } = token;
    const baseVariableName = token.original['$value'].replace(/^\{|\}$/g, ''); // Remove curly braces
    const cssVariableName = `var(--${baseVariableName.replace(/\./g, '-').replace(/_/g, '-')})`;
    return `  --${name}: ${cssVariableName};${comment ? ` /* ${comment} */` : ''}`;
  }).join('\n');
  const darkVariables = darkTokens.map((token) => {
    const { name, comment } = token;
    const baseVariableName = token.original['$value'].replace(/^\{|\}$/g, ''); // Remove curly braces
    const cssVariableName = `var(--${baseVariableName.replace(/\./g, '-').replace(/_/g, '-')})`;
    return `  --${name}: ${cssVariableName};${comment ? ` /* ${comment} */` : ''}`;
  }).join('\n');
  
  return `${HEADER_COMMENT}:root {\n${semanticVariables}\n}\n\n@media (prefers-color-scheme: dark) {\n  :root {\n${darkVariables}\n  }\n}`;
};


// Build all platforms
myStyleDictionary.buildAllPlatforms();

console.log('Build completed!');
