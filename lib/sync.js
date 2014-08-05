'use strict';

module.exports = Sync;

var Base = require('./base');
var util = require('util');
var fs = require('fs');

function Sync (options, callback) {
  var file = this.file = options.file;
  

  Base.call(this, options);
  
  this._read();
}

util.inherits(Sync, Base);

Sync.prototype._read = function(callback) {
  var exists = fs.existsSync(this.file);
  if (!exists) {
    this.data = {};
    return callback(null);
  }

  var content = fs.readFileSync(this.file);
  this.data = this.codec
};


Sync.prototype.save = function(callback) {
  var content;

  try {
    content = this._stringify(this.data);
  } catch(e) {
    return callback(e);
  }

  fs.writeFile(this.file, content, callback);
};
