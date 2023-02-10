const affectedProps = require("./affected-props");
const {validateOptions} = require('./options');
/**
 * @type {import('postcss').PluginCreator}
 */
const plugin = (options) =>  {
  // Work with options here
  options = validateOptions(options);
  const whitelist = new Set(options.whitelist);
  const blacklist = new Set(options.blacklist);


  return {
    postcssPlugin: "postcss-dima-rtl",
    Once(root) {
      root.walkRules((rule) => {
        rule.walkDecls((decl) => {
          if (rule.parent.source.input.file.endsWith("-rtl.css")) {
            if (affectedProps.indexOf(decl.prop) >= 0) {
              dirDecls.push(decl);

              if (decl.prop === "text-align") {
                decl.prop = "text-align";
                decl.value = "right";
              }
            }
          }
        });
      });
    },
  };
};


plugin.postcss = true;

module.exports = plugin;
