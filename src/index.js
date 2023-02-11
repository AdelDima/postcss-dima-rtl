const rtlcss = require('rtlcss');
const postcss = require('postcss');
const {validateOptions} = require('./options');

const handleIgnores = (removeComments = false) => {
  let isIgnored = false;
  let continuousIgnore = false;

  return (node) => {
    if (node.type === 'comment') {
      const {text} = node;

      switch (true) {
        case /^(!\s)?rtl:ignore$/.test(text):
          isIgnored = true;
          continuousIgnore = continuousIgnore || false;
          if (removeComments) node.remove();
          break;
        case /^(!\s)?rtl:begin:ignore$/.test(text):
          isIgnored = true;
          continuousIgnore = true;
          if (removeComments) node.remove();
          break;
        case /^(!\s)?rtl:end:ignore$/.test(text):
          isIgnored = false;
          continuousIgnore = false;
          if (removeComments) node.remove();
          break;
        default:
      }
      return true;
    }
    if (!continuousIgnore && isIgnored) {
      isIgnored = false;
      return true;
    }
    return isIgnored;
  };
};

/**
 * @type {import('postcss').PluginCreator}
 */
const plugin = (options) => {
  // Work with options here
  options = validateOptions(options);

  return {
    postcssPlugin: 'postcss-dima-rtl',

    Once(root) {
      const isRuleIgnored = handleIgnores(options.removeComments);
      /* istanbul ignore start */
      if (!process.env.NODE_ENV === 'test') {
       if (!root.source.input.file.replace(/\.[^/.]+$/, '').endsWith('-rtl')) return;
      }
      /* istanbul ignore end */

      root.walk((node) => {
        if (isRuleIgnored(node)) return;

        if (node.type !== 'rule') {
          return;
        }

        const rule = node;
        const rtlResult = rtlcss.process(rule.toString(), options);
        // console.log('------>',rtlResult);
        const newRule = postcss.parse(rtlResult).first;
        rule.replaceWith(newRule);
      });
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
