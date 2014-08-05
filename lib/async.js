'use strict';

module.exports = Async;

var Base = require('./base');
var util = require('util');
var fs = require('fs');

function Async (options, callback) {
  Base.call(this, options);
  this.file = options.file;
  this._read(function (err, content) {
    if (err) {
      return callback(err);
    }

    try {
      this.data = this._parse(content);
    } catch(e) {
      return callback(e);
    }

    callback(null);

  }.bind(this));
}

util.inherits(Async, Base);

Async.prototype._read = function(callback) {
  fs.readFile(this.file, callback);
};


Async.prototype.save = function(callback) {
  var content;

  try {
    content = this._stringify(this.data);
  } catch(e) {
    return callback(e);
  }

  fs.writeFile(this.file, content, callback);
};
