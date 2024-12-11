import StyleDictionary from 'style-dictionary';

// Configure Style Dictionary
const myStyleDictionary = new StyleDictionary({
  source: ['src/tokens/**/*.tokens'],

  platforms: {
    css: {
      transformGroup: 'css',
      // Resolve references to generate hard values
      resolveReferences: true,
      buildPath: 'build/css/',
      files: [
        {
          destination: 'base/tokens.css', // Output file for base tokens
          format: 'css/variables',
          filter: (token) => token.filePath.includes('base'), // Filter for base tokens
        },
        {
          destination: 'semantic/tokens.css', // Output file for semantic tokens
          format: 'css/variables',
          filter: (token) => token.filePath.includes('semantic'), // Filter for semantic tokens
        },
      ],
    },
  },
});

// Build all platforms
myStyleDictionary.buildAllPlatforms();

console.log('Build completed!');