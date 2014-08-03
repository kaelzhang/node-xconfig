'use strict';

module.exports = config;

function config (options) {
  return new Config(options || {});
}


var EE = require('events').EventEmitter;
var util = require('util');


function Config (options) {
  this.codec = this._get_codec(options.codec);
  this.options = options;
}

util.inherits(Config, EE);


var CODEC = {
  json: {
    parse: function (string) {
      return JSON.parse(string);
    },
    stringify: function (object) {
      return JSON.stringify(object, null, 2);
    }
  },

  ini: function () {
    var ini = require('ini');
    return {
      parse: function (string) {
        return ini.parse(string);
      },
      stringify: function (object) {
        var obj = {};
        var key;
        // #13
        // `ini` will save undefined value into the config file
        // so clean the object before saving.
        for (key in object) {
          if (object[key] !== undefined) {
            obj[key] = object[key];
          }
        }
        return ini.stringify(obj);
      }
    }
  }
};

config.CODEC = CODEC;


// Default to `CODEC.json`
Config.prototype._get_codec = function(codec) {
  if (typeof codec === 'string') {
    codec = config.CODEC[codec];
  }

  if ( is_object(codec) ) {
    return codec;
  }

  return config.CODEC.json;
};


function is_object (subject) {
  return Object(subject) === subject;
}


// .get() -> undefined
// .get('a')
// .get('a.b')
Config.prototype.get = function(key) {
  if (typeof key !== 'string') {
    return;
  }
  
  var keys = this._split(key);
  if (!keys.length) {
    return;
  }

  return this._get(this.data, keys);
};


Config.prototype._split = function(key) {
  return key.split('.').filter(Boolean);
};


Config.prototype._get = function(data, keys) {
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
Config.prototype.set = function(key, value) {
  if (typeof key !== 'string') {
    return;
  }

  var keys = this._split(key);
  if (!keys.length) {
    return;
  }

  this._set(this.data, keys, value);  
};


// For better testing
Config.prototype._set = function(data, keys, value) {
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


// Parse a string to an object according to the codec
Config.prototype._parse = function(string) {
  return this.codec.parse(string);
};


Config.prototype._stringify = function(object) {
  return ths.codec.stringify(object);
};
