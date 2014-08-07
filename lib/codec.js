'use strict';

module.exports = {
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

        // in ini:
        // ```ini
        // abc=undefined
        // ```
        // Will be parsed into `{abc: "undefined"}`

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