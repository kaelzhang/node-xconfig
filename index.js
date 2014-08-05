'use strict';

var config = exports;

var async = require('./lib/async');
var sync = require('./lib/sync');
var home = require('home');


function async (options) {
  options || (options = {});
  options.file = home.resolve(options.file || '~/.xconfig/config.json');
}

