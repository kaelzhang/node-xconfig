'use strict';

module.exports = Sync;

var Base = require('./base');
var util = require('util');
var fs = require('fs');
var mkdirp = require('mkdirp');
var node_path = require('path');


function Sync (options, callback) {
  var file = this.file = options.file;
  if (!options.codec) {
    options.codec = this._guess_file_codec(file);
  }

  Base.call(this, options);
  this._read();
}

util.inherits(Sync, Base);

Sync.prototype._read = function() {
  var exists = fs.existsSync(this.file);
  if (!exists) {
    this.data = {};
    return;
  }

  var content = fs.readFileSync(this.file);
  this.data = this._parse(content.toString());
};


Sync.prototype.save = function(data) {
  if (arguments.length === 0) {
    data = this.data;
  }

  var content = this._stringify(data);
  var dir = node_path.dirname(this.file);
  mkdirp.sync(dir);
  fs.writeFileSync(this.file, content);
};
