'use strict';

module.exports = Base;

// var EE = require('events').EventEmitter;
var util = require('util');
var CODEC = require('./codec');
var mix = require('mix2');
var node_path = require('path');
var cobj = require('cobj');

function Base (options) {
  this.codec = this._get_codec(options.codec);
}

function is_object (subject) {
  return Object(subject) === subject;
}


Base.prototype.set = function(key, value) {
  cobj.set(this.data, key, value);
  return this;
};


Base.prototype.get = function(key) {
  return cobj.get(this.data, key);
};


Base.prototype.remove = function(key) {
  cobj.remove(this.data, key);
  return this;
};


// Get the file type
Base.prototype._guess_file_codec = function(file) {
  var ext = node_path.extname(file).slice(1);
  // use ext as codec, if codec is not supported, it will fallback to json
  return ext.toLowerCase();
};


// Default to `CODEC.json`
Base.prototype._get_codec = function(codec) {
  if (typeof codec === 'string') {
    // find presets
    codec = CODEC[codec];
  }

  if (typeof codec === 'function') {
    codec = codec();
  }

  if ( is_object(codec) ) {
    return codec;
  }

  return CODEC.json;
};


// Parse a string to an object according to the codec
Base.prototype._parse = function(string) {
  return this.codec.parse(string);
};


Base.prototype._stringify = function(object) {
  return this.codec.stringify(object);
};
