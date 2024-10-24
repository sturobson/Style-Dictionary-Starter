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
      ],
    },
  },
});

await myStyleDictionary.buildAllPlatforms();