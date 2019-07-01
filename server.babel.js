//  enable runtime transpilation to use ES6/7 in node
require('core-js/stable');
require('regenerator-runtime/runtime');

const fs = require('fs');

const babelrc = fs.readFileSync('./.babelrc', 'utf8');
let config;

try {
  config = JSON.parse(babelrc);
  config.plugins.push('dynamic-import-node');
  delete config.presets[1][1].targets.browsers;
  delete config.env.development.presets[0][1].targets.browsers;
} catch (err) {
  console.error('==>     ERROR: Error parsing your .babelrc.');
  console.error(err);
}

// require('babel-node-modules')([
//   'react-icons', // add an array of module names here
//   'date-fns', // add an array of module names here
// ]);
require('@babel/register')(config);
