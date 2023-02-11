const affectedProps = require("./affected-props");
const { validateOptions } = require("./options");
const rtlcss = require("rtlcss");
const postcss = require('postcss');


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
  const whitelist = new Set(options.whitelist);
  const blacklist = new Set(options.blacklist);

  /**
   * Description: Check if the property is allowed by the whitelist and blacklist options.
   * @param {*} prop
   * @returns
   */
  const isAllowedProp = (prop) => {
    const isAllowedByWhitelist = !options.whitelist || whitelist.has(prop);
    const isAllowedByBlacklist = !options.blacklist || !blacklist.has(prop);
    return isAllowedByWhitelist && isAllowedByBlacklist;
  };

  return {
    postcssPlugin: "postcss-dima-rtl",

    Once(root) {
      const isRuleIgnored = handleIgnores(options.removeComments);
      /* istanbul ignore start */
      if( !process.env.NODE_ENV === 'test') {
        if (!root.source.input.file.endsWith("-rtl.css"))  return;
      }
      /* istanbul ignore end */

      root.walk((node) => {
        if (isRuleIgnored(node)) return;

        if (node.type !== "rule") {
          return;
        }

        const rule = node;
        const rtlResult = rtlcss.process(rule, options);
        const newRule = postcss.parse(rtlResult).first;
        rule.replaceWith(newRule);

        // rule.walkDecls((decl) => {
        //   if (!isAllowedProp(decl.prop)) return;

        //   if (affectedProps.indexOf(decl.prop) >= 0) {
        //     let { prop, value } = decl;
        //     const cleanRtlResult = decl.toString().replace(
        //       /([^:]*)\s*\/\*.*?\*\/\s*/,
        //       "$1"
        //     );
        //     [, prop, value] =
        //       cleanRtlResult.match(/([^:]*):\s*([\s\S]*)/) || [];
        //     value = value.replace(/\s*!important/, "");
        //     // Update the declaration with the new value.
        //     decl.prop = prop;
        //     decl.value = value;
        //   }
        // });
      });
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
