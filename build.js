import { globSync } from 'glob'; // For file pattern matching
import StyleDictionary from 'style-dictionary';

// Find all token files matching the pattern
const tokenFiles = globSync('src/tokens/**/*.tokens');

// Header comment for generated files
const HEADER_COMMENT = `// Do not edit directly, this file was auto-generated.\n\n`;

// Configure Style Dictionary instance
const myStyleDictionary = new StyleDictionary({
  source: tokenFiles,
  platforms: {
    sass_base: {
      transformGroup: 'scss', // Use standard SCSS transforms
      buildPath: 'build/sass/base/',
      files: [{
        destination: '_base-tokens.scss',
        format: 'scss/variables', // SCSS variables format
        filter: (token) => token.filePath.includes('base'), // Only process base tokens
      }],
    },
    css_semantic: {
      transformGroup: 'scss', // Use SCSS transforms
      buildPath: 'build/sass/semantic/',
      files: [{
        destination: 'variables.scss',
        format: 'css/sass-ref', // Custom format defined in hooks
        filter: (token) => token.filePath.includes('semantic'), // Only process semantic tokens
      }],
    },
  },
  // Custom format definitions
  hooks: {
    formats: {
      // Custom CSS format that references Sass variables
      'css/sass-ref': function ({ dictionary }) {
        // Process all tokens in the dictionary
        const tokens = dictionary.allTokens.map((token) => {
          const isReference = typeof token.original.$value === 'string' && 
          token.original.$value.startsWith('{') && 
          token.original.$value.endsWith('}');
          
          const sassVariable = isReference 
          ? `$${token.original.$value
            .slice(1, -1) // Remove curly braces
            .replace(/\.\$value/g, '') // Remove .$value suffix first
            .replace(/\./g, '-')}` // Then convert remaining dots to hyphens
            : `$${token.name}`;
            
            return `  --${token.name}: #{${sassVariable}};`;
          }).join('\n');
          
          // Combine header, Sass import, and CSS variables
          return `${HEADER_COMMENT}@use "../base/_base-tokens.scss";\n\n:root {\n${tokens}\n}`;
        }
      }
    }
  });
  
  // Execute the build process for all platforms
  myStyleDictionary.buildAllPlatforms();
  console.log('Build completed!');
  