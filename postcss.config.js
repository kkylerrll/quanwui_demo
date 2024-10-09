// const postcssImport = require('postcss-import');
// const postcssNesting = require('postcss-nesting');
// const tailwindcss = require('tailwindcss');
// const autoprefixer = require('autoprefixer');

// module.exports = {
//   plugins: [
//     postcssImport,
//     postcssNesting,
//     tailwindcss,
//     autoprefixer,
//   ],
// };

import postcssImport from 'postcss-import';
import postcssNesting from 'postcss-nesting';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [postcssImport, postcssNesting, tailwindcss, autoprefixer],
};
