const affectedProps = require("./affected-props");
const { validateOptions } = require("./options");
const rtlcss = require("rtlcss");
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

      root.walkRules((rule) => {
        /* istanbul ignore start */
        //if (!rule.parent.source || !rule.parent.source.input.file || !rule.parent.source.input.file.endsWith("-rtl.css")) return;
        /* istanbul ignore end */

        rule.walkDecls((decl) => {
          if (!isAllowedProp(decl.prop)) return;

          if (affectedProps.indexOf(decl.prop) >= 0) {
            // if (!options.aliases) return false;
            // if (!options.aliases[decl.prop]) return false;
        
            const rtlResult = rtlcss.process(decl);
            if (rtlResult === decl.toString()) {
              return null;
            }
            let {prop, value} = decl;

            const cleanRtlResult = rtlResult.replace(/([^:]*)\s*\/\*.*?\*\/\s*/, '$1');
            [, prop, value] = cleanRtlResult.match(/([^:]*):\s*([\s\S]*)/) || [];
            value = value.replace(/\s*!important/, '');
            // Update the declaration with the new value.
            decl.prop = prop;
            decl.value = value;
          }
        });
      });
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
