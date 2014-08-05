'use strict';

module.exports = config;
config.sync = config;
config.async = async;

var Async = require('./lib/async');
var Sync = require('./lib/sync');
var home = require('home');


function config (options) {
  options = config.overload(options);
  return new Sync(options);
}


// Method to overload options
config.overload = function (options) {
  options || (options = {});
  options.file = home.resolve(options.file || '~/.xconfig/config.json');
  return options;
}


function async (options, callback) {
  options = config.overload(options);
  return new Async(options, callback);
}
