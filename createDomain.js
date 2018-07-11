/**
 * hot-reload entry prepare,
 * modified from webpack-dev-server
 */

'use strict';

const url = require('url');
const internalIp = require('internal-ip');

module.exports = function createDomain(options) {
  const protocol = options.https ? 'https' : 'http';
  const port = options.port;
  const hostname = options.host;

  // the formatted domain (url without path) of the webpack server
  return url.format({
    protocol,
    hostname,
    port
  });
};
