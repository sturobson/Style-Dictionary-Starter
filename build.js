import { globSync } from 'glob';
import path from 'path';
import StyleDictionary from 'style-dictionary';

const tokenFiles = globSync('src/tokens/**/*.tokens');

const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: tokenFiles.map((file) => {
        const relativeFilePath = path.relative('src/tokens', file).replace(/\\/g, '/');
        return {
          destination: relativeFilePath.replace('.tokens', '.css'),
          format: 'css/variables',
          filter: (token) => token.filePath.endsWith(relativeFilePath),
          options: {
            outputReferences: file.includes('semantic'),
          },
        };
      }),
    },
  },
});

// Build all platforms
myStyleDictionary.buildAllPlatforms();

console.log('Build completed!');