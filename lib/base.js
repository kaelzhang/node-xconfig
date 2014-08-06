'use strict';

module.exports = Base;

// var EE = require('events').EventEmitter;
var util = require('util');
var CODEC = require('./codec');
var mix = require('mix2');
var node_path = require('path');


function Base (options) {
  this.codec = this._get_codec(options.codec);
}


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


function is_object (subject) {
  return Object(subject) === subject;
}


// .get() -> undefined
// .get('a')
// .get('a.b')
Base.prototype.get = function(key) {
  var keys = this._keys(key);
  return keys && this._get(this.data, keys);
};


Base.prototype._keys = function(key) {
  if (typeof key !== 'string') {
    return;
  }
  
  var keys = this._split(key);
  if (!keys.length) {
    return;
  }

  return keys;
};


Base.prototype._split = function(key) {
  return key.split('.').filter(Boolean);
};


Base.prototype._get = function(data, keys) {
  var result = data;
  keys.forEach(function (key) {
    result = Object(result) === result
      ? result[key]
      : undefined;
  });

  return result;
};


// .set('a', 1);
// .set('a.b', 1);
Base.prototype.set = function(key, value) {
  if (Object(key) === key) {
    mix(this.data, key);
    return;
  }

  var keys = this._keys(key);
  keys && this._set(this.data, keys, value);
  return this;
};


// For better testing
Base.prototype._set = function(data, keys, value) {
  var i = 0;
  var prop;
  var length = keys.length;
  for(; i < length; i ++){
    prop = keys[i];
    if (i === length - 1) {
      // if the last key, set value
      data[prop] = value;
      return;
    }

    if (
      !(prop in data)

      // If the current value is not an object, we will override it.
      // The logic who invoke `.set()` method should make sure `data[prop]` is an object,
      // which `.set()` doesn't concern
      || !is_object(data[prop])
    ) {
      data[prop] = {};
    }

    data = data[prop];
  }
};


Base.prototype.remove = function(key) {
  var keys = this._keys(key);
  keys && this._remove(this.data, keys);
  return this;
};


Base.prototype._remove = function(data, keys) {
  var length = keys.length;
  var i = 0;
  var key;

  for (; i < length; i ++){
    if (!is_object(data)) {
      break;
    }
    
    key = keys[i];
    if (i === length - 1) {
      delete data[key];
    } else {
      data = data[key];
    }
  }
};


// Parse a string to an object according to the codec
Base.prototype._parse = function(string) {
  return this.codec.parse(string);
};


Base.prototype._stringify = function(object) {
  return this.codec.stringify(object);
};
