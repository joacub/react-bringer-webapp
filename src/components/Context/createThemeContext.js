/* eslint-disable no-underscore-dangle */

import { create } from 'jss';
// import rtl from 'jss-rtl';
import { createMuiTheme } from '@material-ui/core/styles';

import {
  // createGenerateClassName,
  ServerStyleSheets
} from '@material-ui/styles';

import createGenerateClassName from 'utils/styles/createGenerateClassName';

// import blue from '@material-ui/core/colors/blue';
import shadowsDefault from '@material-ui/core/styles/shadows';


import jssPluginRuleValueFunction from 'jss-plugin-rule-value-function';
import jssPluginGlobal from 'jss-plugin-global';
import jssPluginNested from 'jss-plugin-nested';
import jssPluginCamelCase from 'jss-plugin-camel-case';
import jssPluginDefaultUnit from 'jss-plugin-default-unit';
import jssPluginVendorPrefixer from 'utils/styles/vendor-prefixer';
import jssPluginPropsSort from 'jss-plugin-props-sort';

function jssPreset() {
  return {
    plugins: [jssPluginRuleValueFunction(), jssPluginGlobal(), jssPluginNested(), jssPluginCamelCase(), jssPluginDefaultUnit(),
    // Disable the vendor prefixer server-side, it does nothing.
    // This way, we can get a performance boost.
    // In the documentation, we are using `autoprefixer` to solve this problem.
      typeof window === 'undefined' ? null : jssPluginVendorPrefixer(), jssPluginPropsSort()]
  };
}

shadowsDefault[1] = 'rgba(0, 0, 0, 0.1) 0px 1px 4px';
shadowsDefault[2] = '0 1px 7px rgba(0,0,0,.05)';

const breakpoints = {
  values: {
    xs: 0,
    sm: 768,
    md: 960,
    lg: 1280,
    xl: 1920
  }
};
const fontWeightMedium = 400;

function getTheme(uiTheme) {
  const theme = createMuiTheme({
    props: {
      MuiWithWidth: {
        // Initial width property
        initialWidth: 'lg' // Breakpoint being globally set 🌎!
      }
    },
    breakpoints,
    direction: uiTheme.direction,
    nprogress: {
      color: uiTheme.paletteType === 'light' ? '#000' : '#fff'
    },
    palette: {
      error: {
        main: '#cc5454'
      },
      primary: {
        main: 'rgba(0,0,0,.84)'
      },
      secondary: {
        // Darken so we reach the AA contrast ratio level.
        main: '#03a87c'
      },
      type: uiTheme.paletteType,
      action: {
        hover: 'rgba(0,0,0,.05)'
      },
      text: {
        secondary: 'rgba(0,0,0,.68)'
      }
    },
    typography: {
      useNextVariants: true,
      // Use the system font.
      // eslint-disable-next-line
      fontWeightMedium,
      letterSpacing: 0,
      fontWeight: 700,
      textRendering: 'optimizeLegibility',
      '-webkit-font-smoothing': 'antialiased',
      body1: {
        fontWeight: fontWeightMedium,
        fontSize: 20,
        lineHeight: 1.4,
        letterSpacing: 0,
        color: 'rgba(0,0,0,.84)'
      },
      body2: {
        fontWeight: fontWeightMedium,
        fontSize: 16,
        lineHeight: 1.4,
        letterSpacing: 0
      },
      h1: {
        fontWeight: 700,
        fontSize: 42,
        '--x-height-multiplier': '0.342',
        '--baseline-multiplier': '0.22',
        letterSpacing: '-.015em',
        fontStyle: 'normal',
        fallbacks: [
          {
            letterSpacing: '0'
          },
          {
            letterSpacing: '-.02em'
          }
        ],
        marginLeft: -2.63,
        lineHeight: '1.04',
        paddingTop: '5px'
      },
      h2: {
        fontWeight: 700,
        fontSize: 26,
      },
      h3: {
        fontWeight: 700,
        fontSize: 20,
        lineHeight: 1.4,
      },
      caption: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '16px',
        lineHeight: '20px',
        '--x-height-multiplier': '0.342',
        '--baseline-multiplier': '0.22'
      },
      textSecondary: {
        color: 'rgba(0,0,0,.54)'
      }
    },
    shadows: shadowsDefault,
    overrides: {
      MuiSnackbar: {
        anchorOriginTopCenter: {
          transform: props => props.transform ? `${props.transform}` : false,
          [`@media (min-width:${breakpoints.values.sm}px)`]: {
            transform: props => props.transform ? `${props.transform} translateX(-50%)` : 'translateX(-50%)'
          }
        },
        anchorOriginBottomCenter: {
          transform: props => props.transform ? `${props.transform}` : false,
          [`@media (min-width:${breakpoints.values.sm}px)`]: {
            transform: props => props.transform ? `${props.transform} translateX(-50%)` : 'translateX(-50%)'
          }
        },
        anchorOriginTopRight: {
          transform: props => props.transform ? `${props.transform}` : false,
        },
        anchorOriginBottomRight: {
          transform: props => props.transform ? `${props.transform}` : false,
        },
        anchorOriginTopLeft: {
          transform: props => props.transform ? `${props.transform}` : false,
        },
        anchorOriginBottomLeft: {
          transform: props => props.transform ? `${props.transform}` : false,
        },
      },
      MuiToolbar: {
        regular: {
          minHeight: 65,
          height: 65,
          '@media screen and (max-width: 767px)': {
            minHeight: 56,
            height: 56,
          }
        }
      },
      MuiFormHelperText: {
        root: {
          '&.error': {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiInputLabel: {
        root: {
          '&.error': {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiInputBase: {
        root: {
          '&.error': {
            backgroundColor: 'transparent'
          }
        }
      },
      MuiTooltip: {
        tooltip: {
          backgroundImage: 'linear-gradient(to bottom,rgba(49,49,47,.99),#262625)',
          color: '#fff',
          backgroundRepeat: 'repeat-x',
          fontSize: 15
        }
      },
      MuiInput: {
        root: {
          fontSize: 20
        }
      },
      MuiPaper: {
        root: {
          border: '1px solid rgba(0, 0, 0, 0.1)'
        },
        elevation1: {
          border: '1px solid rgba(0, 0, 0, 0.1)'
        },
        elevation2: {
          border: '1px solid rgba(0,0,0,.04)'
        }
      },
      MuiButtonBase: {
        root: {
          fontSize: 16
        }
      },
      MuiIconButton: {
        root: {
          color: 'rgba(0,0,0,.54)'
        }
      },
      MuiButton: {
        label: {
          paddingLeft: 0,
          paddingRight: 0
        },
        root: {
          padding: '4px 16px',
          minWidth: 0,
          minHeight: 0,
          fontSize: 16,
          color: 'rgba(0,0,0,.54)',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: 'transparent',
            color: 'rgba(0, 0, 0, 0.9)'
          },
          '@media screen and (max-width: 767px)': {
            padding: '1px 14px',
          }
        },
        // Name of the component ⚛️ / style sheet
        textPrimary: {
          color: 'rgba(0,0,0,.54)',
          '&:hover': {
            color: 'rgba(0,0,0,.68)'
          }
        },
        text: {
          color: 'rgba(0,0,0,.54)',
          '&:hover': {
            background: 'transparent',
            color: 'rgba(0, 0, 0, 0.9)',
            fill: 'rgba(0, 0, 0, 0.9)'
          }
        },
        outlined: {
          padding: '4px 16px',
          border: `1px solid ${uiTheme.paletteType === 'light' ? 'rgba(0,0,0,.15)' : 'rgba(255, 255, 255, 0.23)'}`,
          '&:hover': {
            borderColor: 'rgba(0,0,0,.54)',
            color: 'rgba(0,0,0,.68)'
          },
          '@media screen and (max-width: 767px)': {
            padding: '1px 14px',
          }
        },
        containedPrimary: {
          '&:hover': {
            backgroundColor: '#000',
            borderColor: '#000',
            color: 'rgba(255,255,255,.97)'
          }
        }
      }
    }
  });

  // Expose the theme as a global variable so people can play with it.
  if (process.browser) {
    window.theme = theme;
  }

  return theme;
}
const cache = new Map();
const theme = getTheme({
  direction: 'ltr',
  paletteType: 'light'
});
// Configure JSS
const jss = create({ plugins: [...jssPreset().plugins] });
jss.options.insertionPoint = process.browser && document.getElementById('insertion-point-jss');

function createPageContext() {
  // const theme = getTheme(uitheme);

  const generateClassName = createGenerateClassName({
    productionPrefix: 'j' // Reduce the bandwidth usage.
  });

  return {
    jss,
    theme,
    sheetsCache: cache,
    // This is needed in order to deduplicate the injection of CSS in the page.
    // sheetsManager: new Map(),
    // This is needed in order to inject the critical CSS.
    sheetsRegistry: new ServerStyleSheets({ serverGenerateClassName: generateClassName, jss }),
    generateClassName
  };
}

export function updatePageContext(uiTheme) {
  const pageContext = {
    ...global.__MUI_PAGE_CONTEXT__,
    theme: getTheme(uiTheme)
  };
  global.__MUI_PAGE_CONTEXT__ = pageContext;

  return pageContext;
}

export default function getPageContext(
  uiTheme = {
    direction: 'ltr',
    paletteType: 'light'
  }
) {
  // Make sure to create a new store for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return createPageContext(uiTheme);
  }

  // Reuse context on the client-side
  if (!global.__MUI_PAGE_CONTEXT__) {
    global.__MUI_PAGE_CONTEXT__ = createPageContext(uiTheme);
  }

  return global.__MUI_PAGE_CONTEXT__;
}
