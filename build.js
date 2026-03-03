import StyleDictionary from 'style-dictionary';
import config from './style-dictionary-config.js';

const sd = new StyleDictionary(config);
sd.buildAllPlatforms();
