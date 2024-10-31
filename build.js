import StyleDictionary from 'style-dictionary';

const myStyleDictionary = new StyleDictionary({
  source: [`src/tokens/**/*.json`],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'build/',
      files: [
        {
          destination: 'variables.css',
          format: 'css/variables',
        },
      ],
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'build/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
        },
        {
          destination: 'tokens-map.scss',
          format: 'scss/map-flat',
        },
        {
          destination: 'tokens-map-deep.scss',
          format: 'scss/map-deep',
        },
      ],
    },
    js: {
      transformGroup: 'js',
      buildPath: 'build/js/',
      files: [
        {
          destination: 'tokens.js',
          format: 'javascript/object',
        },
        {
          destination: 'tokens-flat.js',
          format: 'javascript/module-flat',
        },
        {
          destination: 'tokens-umd.js',
          format: 'javascript/umd',
        },
      ],
    },
    ts: {
      transformGroup: 'js',
      buildPath: 'build/types/',
      files: [
        {
          destination: 'tokens.d.ts',
          format: 'typescript/es6-declarations',
        },
      ],
    },
    android: {
      transformGroup: 'android',
      buildPath: 'build/android/',
      files: [
        {
          destination: 'values/tokens.xml',
          format: 'android/resources',
        },
      ],
    },
    ios: {
      transformGroup: 'ios-swift',
      buildPath: 'build/ios/',
      files: [
        {
          destination: 'Tokens.swift',
          format: 'ios-swift/class.swift',
          className: 'Tokens', // Name of the Swift class
        },
      ],
    },
  },
});

await myStyleDictionary.buildAllPlatforms();