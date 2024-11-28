/**
 * Do not edit directly, this file was auto-generated.
 */

(function(root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else if (typeof exports === "object") {
    exports["_styleDictionary"] = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else {
    root["_styleDictionary"] = factory();
  }
}(this, function() {
  return {
  "color": {
    "primary": {
      "$value": "#007bff",
      "filePath": "src/tokens/tokens.json",
      "isSource": true,
      "$type": "color",
      "original": {
        "$value": "#007bff",
        "$type": "color"
      },
      "name": "ColorPrimary",
      "attributes": {
        "category": "color",
        "type": "primary"
      },
      "path": [
        "color",
        "primary"
      ]
    },
    "secondary": {
      "$value": "#6c757d",
      "filePath": "src/tokens/tokens.json",
      "isSource": true,
      "$type": "color",
      "original": {
        "$value": "#6c757d",
        "$type": "color"
      },
      "name": "ColorSecondary",
      "attributes": {
        "category": "color",
        "type": "secondary"
      },
      "path": [
        "color",
        "secondary"
      ]
    }
  },
  "spacing": {
    "none": {
      "$value": "0",
      "filePath": "src/tokens/spacing.json5",
      "isSource": true,
      "$type": "spacing",
      "original": {
        "$value": "0",
        "$type": "spacing"
      },
      "name": "SpacingNone",
      "attributes": {
        "category": "spacing",
        "type": "none"
      },
      "path": [
        "spacing",
        "none"
      ]
    },
    "small": {
      "$value": "0.5rem",
      "filePath": "src/tokens/spacing.json5",
      "isSource": true,
      "$type": "spacing",
      "original": {
        "$value": "0.5rem",
        "$type": "spacing"
      },
      "name": "SpacingSmall",
      "attributes": {
        "category": "spacing",
        "type": "small"
      },
      "path": [
        "spacing",
        "small"
      ]
    },
    "medium": {
      "$value": "1rem",
      "filePath": "src/tokens/spacing.json5",
      "isSource": true,
      "$type": "spacing",
      "original": {
        "$value": "1rem",
        "$type": "spacing"
      },
      "name": "SpacingMedium",
      "attributes": {
        "category": "spacing",
        "type": "medium"
      },
      "path": [
        "spacing",
        "medium"
      ]
    },
    "large": {
      "$value": "2rem",
      "filePath": "src/tokens/spacing.json5",
      "isSource": true,
      "$type": "spacing",
      "original": {
        "$value": "2rem",
        "$type": "spacing"
      },
      "name": "SpacingLarge",
      "attributes": {
        "category": "spacing",
        "type": "large"
      },
      "path": [
        "spacing",
        "large"
      ]
    }
  },
  "typography": {
    "font": {
      "family": {
        "body": {
          "$value": "Roboto, sans-serif",
          "filePath": "src/tokens/typography.yaml",
          "isSource": true,
          "$type": "fontFamily",
          "original": {
            "$value": "Roboto, sans-serif",
            "$type": "fontFamily"
          },
          "name": "TypographyFontFamilyBody",
          "attributes": {
            "category": "typography",
            "type": "font",
            "item": "family",
            "subitem": "body"
          },
          "path": [
            "typography",
            "font",
            "family",
            "body"
          ]
        },
        "heading": {
          "$value": "Arial, sans-serif",
          "filePath": "src/tokens/typography.yaml",
          "isSource": true,
          "$type": "fontFamily",
          "original": {
            "$value": "Arial, sans-serif",
            "$type": "fontFamily"
          },
          "name": "TypographyFontFamilyHeading",
          "attributes": {
            "category": "typography",
            "type": "font",
            "item": "family",
            "subitem": "heading"
          },
          "path": [
            "typography",
            "font",
            "family",
            "heading"
          ]
        }
      },
      "size": {
        "base": {
          "$value": "1rem",
          "filePath": "src/tokens/tokens.json",
          "isSource": true,
          "$type": "fontSize",
          "original": {
            "$value": "1rem",
            "$type": "fontSize"
          },
          "name": "TypographyFontSizeBase",
          "attributes": {
            "category": "typography",
            "type": "font",
            "item": "size",
            "subitem": "base"
          },
          "path": [
            "typography",
            "font",
            "size",
            "base"
          ]
        },
        "lg": {
          "$value": "1.25rem",
          "filePath": "src/tokens/tokens.json",
          "isSource": true,
          "$type": "fontSize",
          "original": {
            "$value": "1.25rem",
            "$type": "fontSize"
          },
          "name": "TypographyFontSizeLg",
          "attributes": {
            "category": "typography",
            "type": "font",
            "item": "size",
            "subitem": "lg"
          },
          "path": [
            "typography",
            "font",
            "size",
            "lg"
          ]
        },
        "small": {
          "$value": "0.875rem",
          "filePath": "src/tokens/typography.yaml",
          "isSource": true,
          "$type": "fontSize",
          "original": {
            "$value": "0.875rem",
            "$type": "fontSize"
          },
          "name": "TypographyFontSizeSmall",
          "attributes": {
            "category": "typography",
            "type": "font",
            "item": "size",
            "subitem": "small"
          },
          "path": [
            "typography",
            "font",
            "size",
            "small"
          ]
        },
        "large": {
          "$value": "1.25rem",
          "filePath": "src/tokens/typography.yaml",
          "isSource": true,
          "$type": "fontSize",
          "original": {
            "$value": "1.25rem",
            "$type": "fontSize"
          },
          "name": "TypographyFontSizeLarge",
          "attributes": {
            "category": "typography",
            "type": "font",
            "item": "size",
            "subitem": "large"
          },
          "path": [
            "typography",
            "font",
            "size",
            "large"
          ]
        }
      }
    }
  },
  "animation": {
    "duration": {
      "short": {
        "$value": "200ms",
        "filePath": "src/tokens/animation.hjson",
        "isSource": true,
        "original": {
          "$value": "200ms"
        },
        "name": "AnimationDurationShort",
        "attributes": {
          "category": "animation",
          "type": "duration",
          "item": "short"
        },
        "path": [
          "animation",
          "duration",
          "short"
        ]
      },
      "medium": {
        "$value": "500ms",
        "filePath": "src/tokens/animation.hjson",
        "isSource": true,
        "original": {
          "$value": "500ms"
        },
        "name": "AnimationDurationMedium",
        "attributes": {
          "category": "animation",
          "type": "duration",
          "item": "medium"
        },
        "path": [
          "animation",
          "duration",
          "medium"
        ]
      },
      "long": {
        "$value": "1000ms",
        "filePath": "src/tokens/animation.hjson",
        "isSource": true,
        "original": {
          "$value": "1000ms"
        },
        "name": "AnimationDurationLong",
        "attributes": {
          "category": "animation",
          "type": "duration",
          "item": "long"
        },
        "path": [
          "animation",
          "duration",
          "long"
        ]
      }
    }
  }
};
}))
