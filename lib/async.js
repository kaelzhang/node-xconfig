'use strict';

module.exports = Async;

var Base = require('./base');
var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var node_path = require('path');


function Async (options, callback) {
  var file = this.file = options.file;
  if (!options.codec) {
    options.codec = this._guess_file_codec(file);
  }

  Base.call(this, options);
  this._read(callback);
}
util.inherits(Async, Base);

Async.prototype._read = function(callback) {
  var self = this;
  fs.exists(this.file, function (exists) {
    if (!exists) {
      self.data = {};
      return callback(null);
    }

    fs.readFile(self.file, function (err, content) {
      if (err) {
        return callback(err);
      }

      try {
        self.data = self._parse(content.toString());
      } catch(e) {
        return callback(e);
      }

      callback(null);
    });
  });
};


Async.prototype.save = function(callback) {
  var content;

  try {
    content = this._stringify(this.data);
  } catch(e) {
    return callback(e);
  }

  var dir = node_path.dirname(this.file);
  mkdirp(dir, function (err) {
    if (err) {
      return callback(err);
    }

    fs.writeFile(self.file, content, callback);
  });
};
