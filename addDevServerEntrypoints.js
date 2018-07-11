/**
 * hot-reload entry prepare,
 * modified from webpack-dev-server
 */
'use strict';

/* eslint no-param-reassign: 'off' */

const createDomain = require('./createDomain');

module.exports = function addDevServerEntrypoints(webpackOptions) {
  const devServerOptions = webpackOptions.devServer

  if (devServerOptions.inline !== false) {
    const domain = createDomain(devServerOptions);
    const devClient = [`${require.resolve('webpack-dev-server/client/')}?${domain}`];

    if (devServerOptions.hotOnly) { devClient.push('webpack/hot/only-dev-server'); } else if (devServerOptions.hot) { devClient.push('webpack/hot/dev-server'); }

    console.log(webpackOptions);
    [].concat(webpackOptions).forEach((wpOpt) => {
      if (typeof wpOpt.entry === 'object' && !Array.isArray(wpOpt.entry)) {
        Object.keys(wpOpt.entry).forEach((key) => {
          console.log('entry key : ' + key);
          wpOpt.entry[key] = devClient.concat(wpOpt.entry[key]);
        });
      } else if (typeof wpOpt.entry === 'function') {
        wpOpt.entry = wpOpt.entry(devClient);
      } else {
        wpOpt.entry = devClient.concat(wpOpt.entry);
      }
    });
  }
};
