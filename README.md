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

### Enable configurations on ENV

app.js:

```js
var config = require('xconfig')({
  enableEnv: true,
  envPrefix: 'BLAH_'
});
var username = config.get('username');
console.log(username);
```

Command-line:

```
$ node app.js
> foo
$ export BLAH_USERNAME=bar
$ node app.js
> bar
```

### Custom file formats

config.ini:

```
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

## License

May be freely distributed under the [MIT license](https://raw.githubusercontent.com/kaelzhang/node-xconfig/master/LICENSE-MIT).

Copyright (c) Kael Zhang and [other contributors](https://github.com/kaelzhang/node-xconfig/graphs/contributors).
