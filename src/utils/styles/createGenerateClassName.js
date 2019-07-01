import warning from 'warning';
// Returns a function which generates unique class names based on counters.
// When new generator function is created, rule counter is reset.
// We need to reset the rule counter for SSR for each request.
//
// It's inspired by
// https://github.com/cssinjs/jss/blob/4e6a05dd3f7b6572fdd3ab216861d9e446c20331/src/utils/createGenerateClassName.js
export default function createGenerateClassName(options = {}) {
  const { productionPrefix = 'jss', seed = '' } = options;
  const seedPrefix = seed === '' ? '' : `${seed}-`;
  let ruleCounter = 0;

  return (rule, styleSheet) => {
    ruleCounter += 1;
    warning(
      ruleCounter < 1e10,
      [
        'Material-UI: you might have a memory leak.',
        'The ruleCounter is not supposed to grow that much.',
      ].join(''),
    );

    if (process.env.NODE_ENV === 'production') {
      return `${seedPrefix}${productionPrefix}${ruleCounter}`;
    }

    const suffix = `${rule.key}-${ruleCounter}`;

    // Help with debuggability.
    if (styleSheet.options.classNamePrefix) {
      return `${seedPrefix}${styleSheet.options.classNamePrefix}-${suffix}`;
    }

    return `${seedPrefix}${suffix}`;
  };
}
