import StyleDictionary from 'style-dictionary';
import chroma from 'chroma-js';

// Register additional transforms
StyleDictionary.registerTransform({
  name: 'color/hexToDisplayP3',
  type: 'value',
  filter: (token) => token.$type === 'color',
  transform: (token) => {
    const rgb = chroma(token.$value).rgb(); // Possible issue here
    return `color(display-p3 ${rgb[0] / 255} ${rgb[1] / 255} ${rgb[2] / 255})`;
  }
});

// Configure Style Dictionary
const myStyleDictionary = new StyleDictionary({
  source: [`src/tokens/**/*.tokens`],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/css/',
      files: [
        {
          destination: 'all.css',
          format: 'css/variables',
        },
      ],
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [
        {
          destination: 'all.xml',
          format: 'android/resources',
        },
      ],
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [
        {
          destination: 'all.swift',
          format: 'ios-swift/class.swift',
        },
      ],
    },
  },
  hooks: {
    transformGroups: {
      css: ['attribute/cti', 'name/kebab', 'color/hexToDisplayP3'],
      android: ['attribute/cti', 'name/snake', 'size/remToSp', 'color/hex8android'],
      ios: ['attribute/cti', 'name/pascal', 'size/swift/remToCGFloat', 'color/UIColorSwift'],
    },
  },
});

// Build all platforms
myStyleDictionary.buildAllPlatforms();

console.log('Build completed!');