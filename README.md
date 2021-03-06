# xconfig [![NPM version](https://badge.fury.io/js/xconfig.svg)](http://badge.fury.io/js/xconfig) [![Build Status](https://travis-ci.org/kaelzhang/node-xconfig.svg?branch=master)](https://travis-ci.org/kaelzhang/node-xconfig) [![Dependency Status](https://gemnasium.com/kaelzhang/node-xconfig.svg)](https://gemnasium.com/kaelzhang/node-xconfig)

X flexible configuration for node.js

### Why ?

I wanted a config module which is really flexibile, that

- _Zero config_: we could could use it even with no need to configure the config
- _Flexible_: Supporting multiple config file formats is not flexible. We need to provide a way to support any formats as we wish.
- _Clean_: Do things clean. No saving config data to `this`. Seperated configurations between projects, and you also could use one.
- _Load and Save_: Safely loading and saving with lock.


## Install

```sh
$ npm install xconfig --save
```

## Usage

```js
var config = require('xconfig')();
config.get('db.username');
```

### Your Custom Config Location

```js
var config = require('xconfig')({
  file: '~/.myproject/config.ini'
});
```


### Custom File Codec

```ini
; config.ini
; some comments
[user.name]
family=Swift
```

```js
var ini = require('ini');
var config = require('xconfig')({
  codec: {
    parse: ini.parse,
    stringify: ini.stringify
  },
  file: './config.ini'
});
console.log(config.get('user.name.family')); // Swift
```

The code above is equivalent to:

```js
var config = require('xconfig')({
  codec: 'ini',
  file: './config.ini'
});
console.log(config.get('user.name.family')); // Swift
```
for `'ini'` is a built codec.

And `xconfig` will try to guess the codec by extension name, so, you can just:
```js
var config = require('xconfig')({
  file: './config.ini'
});
console.log(config.get('user.name.family')); // Swift
```

### Set and Save Configurations

```js
config.set('user.name.first', 'Taylor');
config.save();
```

config.ini
```ini
[user.name]
first=Taylor
family=Swift
```

### Async Xconfig

```js
require('xconfig').async({
  file: './config.ini'
}, function(err){
  if (err){
    console.error(err);
    return;
  }

  this.get('user.name.family'); // 'Swift';
  this.set('user.name.first', 'Taylor');
  this.save(function(err){
    if (err){
      console.error('error saving', err);
    }
  });
});
```

## Programmatical API

### xconfig(options)

Option | Type    | Default Value | Description
------ | ------- | ------------- | ------------
file   | `path`  | '~/.xconfig/config.json' | 
codec  | `String|Object` | `'json'` | Format of config file, available value `'ini'` and `'json'`. Or an object contains both two methods of `parse(string)` and `stringify(object)`


## License

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/kaelzhang/node-xconfig/master/LICENSE-MIT).

Copyright (c) Kael Zhang and [other contributors](https://github.com/kaelzhang/node-xconfig/graphs/contributors).
