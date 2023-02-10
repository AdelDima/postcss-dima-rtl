/**
 * @type {import('postcss').PluginCreator}
 */
module.exports = (opts = {}) => {
  // Work with options here

  return {
    postcssPlugin: 'postcss-dima-rtl',
    Once(root) {
      root.walkRules((rule) => {
        rule.walkDecls((decl) => {
          if (decl.prop === 'text-align-start') {
            // Check if the file name ends with "-rtl"
            if (rule.parent.source.input.file.endsWith('-rtl.css')) {
              decl.prop = 'text-align';
              decl.value = 'right';
            } else {
              decl.prop = 'text-align';
              decl.value = 'left';
            }
          }
        });
      });  
    }
  }
}

module.exports.postcss = true
