const affectedProps = require("./affected-props");
const { validateOptions } = require("./options");
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
      const dirDecls = [];

      root.walkRules((rule) => {
        if (!rule.parent.source.input.file.endsWith("-rtl.css")) return;

        rule.walkDecls((decl) => {
          if (!isAllowedProp(decl.prop)) return;

          if (affectedProps.indexOf(decl.prop) >= 0) {
            dirDecls.push(decl);

            if (decl.prop === "text-align") {
              decl.prop = "text-align";
              decl.value = "right";
            }
          }
        });

        if (dirDecls.length) {
          getDirRule(rule, 'dir', options).append(dirDecls);
        }
      });
    },
  };
};

plugin.postcss = true;

module.exports = plugin;
