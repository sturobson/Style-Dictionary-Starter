import fs from 'fs';
import StyleDictionary from 'style-dictionary';

// Read all .tokens files from the 'src/tokens' directory
const tokenFiles = fs.readdirSync('src/tokens').filter((file) => file.endsWith('.tokens'));

// Configure Style Dictionary
const myStyleDictionary = new StyleDictionary({
  source: tokenFiles.map((file) => `src/tokens/${file}`),
  platforms: {
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/scss/',
      files: tokenFiles.map((file) => ({
        destination: `${file.replace('.tokens', '.scss')}`, // Replace '.tokens' with '.scss' for the destination
        format: 'scss/variables',
        filter: (token) => file === token.filePath.split('/').pop(), // Match tokens by filename
      })),
    },
  },
  hooks: {
    transformGroups: {
      scss: ['size/pxToRem'],
    },
  },
});

// Build all platforms
myStyleDictionary.buildAllPlatforms();

console.log('Build completed!');