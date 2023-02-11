const defaultOptions = {
  autoRename: false,
  autoRenameStrict: false,
  blacklist: {},
  clean: true,
  greedy: false,
  processUrls: false,
  stringMap: [],
  useCalc: false,
  aliases: {},
  processEnv: true,
  // spicial options.
  removeComments: true, // remove comments after process them
  fromRTL: false, // assume styles are written in rtl initially

}


/* eslint-disable no-console */
const validateOptions = (options = {}) => {
  const {
    autoRename,
    autoRenameStrict,
    blacklist,
    clean ,
    greedy ,
    processUrls ,
    stringMap,
    useCalc,
    aliases,
    processEnv,
    removeComments,
    fromRTL,
  } = options;
  const fixedOptions = {};

  if (blacklist && (!Array.isArray(blacklist) || blacklist.some((prop) => typeof prop !== 'string'))) {
    fixedOptions.blacklist = defaultOptions.blacklist;
    console.warn('Incorrect blacklist option. Must be an array of strings');
  }

  if (removeComments && typeof removeComments !== 'boolean') {
    fixedOptions.removeComments = defaultOptions.removeComments;
    console.warn('Incorrect removeComments option. Must be a boolean');
  }

  if (fromRTL && typeof fromRTL !== 'boolean') {
    fixedOptions.removeComments = defaultOptions.removeComments;
    console.warn('Incorrect fromRTL option. Must be a boolean');
  }
  
  return {
    ...defaultOptions,
    ...options,
    ...fixedOptions,
  };
};
  /* eslint-enable no-console */

module.exports = {
  validateOptions,
};
