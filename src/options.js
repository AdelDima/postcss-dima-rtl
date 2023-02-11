const defaultOptions = {
  removeComments: true, // remove comments after process them
  blacklist: undefined, // blacklist for css properties
  whitelist: undefined // whitelist for css properties
};
  
  /* eslint-disable no-console */
  const validateOptions = (options = {}) => {
    const {
      removeComments,
      blacklist,
      whitelist,
    } = options;
    const fixedOptions = {};  
  
    if (removeComments && typeof removeComments !== 'boolean') {
      fixedOptions.removeComments = defaultOptions.removeComments;
      console.warn('Incorrect removeComments option. Must be a boolean');
    }
  
    if (blacklist && (!Array.isArray(blacklist) || blacklist.some((prop) => typeof prop !== 'string'))) {
      fixedOptions.blacklist = defaultOptions.blacklist;
      console.warn('Incorrect blacklist option. Must be an array of strings');
    }
  
    if (whitelist && (!Array.isArray(whitelist) || whitelist.some((prop) => typeof prop !== 'string'))) {
      fixedOptions.whitelist = defaultOptions.whitelist;
      console.warn('Incorrect whitelist option. Must be an array of strings');
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
  