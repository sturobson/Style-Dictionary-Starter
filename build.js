import StyleDictionary from 'style-dictionary';
import contrastTransform from './lib/transforms/contrast.js';
import cssWithContrastFormat from './lib/formats/css-with-contrast.js';
import jsonContrastMapFormat from './lib/formats/json-contrast-map.js';
import validateContrastAction from './lib/actions/validate-contrast.js';

// Contrast system configuration
// Customize these to match your token naming conventions
export const contrastConfig = {
  backgroundTokenName: 'background',  // e.g., 'bg', 'surface', 'pane', 'background'
  foregroundTokenName: 'foreground'   // e.g., 'text', 'color', 'foreground'
};

// Register custom transform
StyleDictionary.registerTransform(contrastTransform);

// Register custom formats
StyleDictionary.registerFormat(cssWithContrastFormat);
StyleDictionary.registerFormat(jsonContrastMapFormat);

// Register validation action
StyleDictionary.registerAction(validateContrastAction);

// Configure and build
const sd = new StyleDictionary({
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      // Add our custom transform
      transforms: ['attribute/cti', 'name/kebab', 'color/add-contrast'],
      buildPath: 'build/css/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables-with-contrast'
        }
      ],
      // Run validation after build
      actions: ['validate-contrast']
    },
    json: {
      transformGroup: 'js',
      transforms: ['attribute/cti', 'name/kebab', 'color/add-contrast'],
      buildPath: 'build/json/',
      files: [
        {
          destination: 'contrast-map.json',
          format: 'json/contrast-map'
        }
      ]
    }
  }
});

console.log('🎨 Building design tokens...\n');

try {
  await sd.buildAllPlatforms();
  console.log('✅ Build complete!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
