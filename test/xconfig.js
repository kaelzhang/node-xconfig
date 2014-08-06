'use strict';

var expect = require('chai').expect;
var _config = require('../');
var Base = require('../lib/base');
var fixture = require('test-fixture');
var fs = require('fs');

describe("base: _get", function(){
  var get = Base.prototype._get;
  it("normal get", function(){
    var data = {
      a: 1,
      b: 2
    };

    expect(get(data, ['a'])).to.equal(1);
    expect(get(data, ['b'])).to.equal(2);
  });

  it("namespaces", function(){
    var data = {
      a: {
        b: 1
      }
    };

    expect(get(data, ['a', 'b'])).to.equal(1);
  });

  it("invalid data", function(){
    [
      undefined, 
      null, 
      1, 
      "1", 
      function(){}

    ].forEach(function (data) {
      [
        ['a'],
        ['a', 'b']
      ].forEach(function (keys) {
        expect(get(data, keys)).to.equal(undefined);
      });
    });
  });
});


describe("base: .get(key)", function(){
  var base = new Base({});
  base.data = {
    a: 1,
    b: {
      c: 1
    }
  }
  it(".get() -> undefined", function(){
    expect(base.get()).to.equal();
  });

  it(".get(key)", function(){
    expect(base.get('a')).to.equal(1);
    expect(base.get('c')).to.equal();
  });

  it(".get(namespaces)", function(){
    expect(base.get('b.c')).to.equal(1);
    expect(base.get('b.b')).to.equal();
  });

  it("invalid namespaces", function(){
    expect(base.get('')).to.equal();
    expect(base.get('.')).to.equal();
  });
});


describe("base: .set(keys, value)", function(){
  var base = new Base({});
  base.data = {
    a: 1,
    b: {
      c: 1
    },
    d: 1
  }

  var data = {
    a: 1,
    b: {
      c: 1
    },
    d: 1
  }

  it(".set(null, value)", function(){
    base.set(null, 1)
    expect(base.data).to.deep.equal(data);
  });

  it("invalid keys", function(){
    base.set('', 1)
    expect(base.data).to.deep.equal(data);

    base.set('.', 1)
    expect(base.data).to.deep.equal(data);
  });

  it("normal", function(){
    base.set('a', 2);
    data.a = 2;
    expect(base.data).to.deep.equal(data);

    base.set('b.c', 2);
    data.b.c = 2;
    expect(base.data).to.deep.equal(data);

    base.set('b.b', 2);
    data.b.b = 2;
    expect(base.data).to.deep.equal(data);

    base.set('e.f', 2);
    data.e = {
      f: 2
    };
    expect(base.data).to.deep.equal(data);
  });

  it(".set(object)", function(){
    base.set({
      f: {
        a: 1
      },
      b: {
        e: 1
      }
    });

    data.f = {a: 1};
    data.b = {e: 1};
    expect(base.data).to.deep.equal(data);
  });
});


describe("base: _set", function(){
  var set = Base.prototype._set;
  it("normal", function(){
    var data = {};
    set(data, ['a'], 1);
    expect(data.a).to.equal(1);
  });

  it("namespaces", function(){
    var data = {};
    set(data, ['a', 'b'], 1);
    expect(data.a.b).to.equal(1);
  });

  it("override", function(){
    var data = {
      a: 1
    };

    set(data, ['a', 'b'], 1);
    expect(data.a.b).to.equal(1);
  });

  it("if a property is an object, not override", function(){
    var data = {
      a: {
        b: 1,
        c: 2
      }
    };

    set(data, ['a', 'b'], 2);
    expect(data.a.b).to.equal(2);
    expect(data.a.c).to.equal(2);
  });
});


describe("base: _remove(data, keys)", function(){
  var remove = Base.prototype._remove;
  it("normal", function(){
    var data = {
      a: 1
    };
    remove(data, ['a']);
    expect(data.a).to.equal();
  });

  it("namespaces", function(){
    var data = {
      a: {
        b: 1,
        c: 2
      }
    };

    remove(data, ['a', 'b']);
    expect(data.a.b).to.equal();
    expect(data.a.c).to.equal(2);
  });

  it("if a property is not defined", function(){
    var data = {
      a: {
        b: 2,
        c: {
          d: 3
        }
      }
    };

    // not found
    remove(data, ['a', 'b', 'c']);
    remove(data, ['a', 'd']);
    remove(data, ['a', 'c', 'd', 'e']);
    expect(data).to.deep.equal({
      a: {
        b: 2,
        c: {
          d: 3
        }
      }
    });
  });
});


describe("config(): sync", function(){
  var config = _config;
  it("config.json", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('config.json');
      var c = config({
        file: file
      });
      expect(c.get('a')).to.equal(1);
      c.set('a', 2);
      expect(c.get('a')).to.equal(2);
      c.save();
      expect(require(file).a).to.equal(2);
      done();
    });
  });

  it("config.ini, with guess", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('config.ini');
      var c = config({
        file: file
      });
      expect(c.get('a')).to.equal('1');
      c.set('a', 2);
      expect(c.get('a')).to.equal(2);
      c.save();
      expect(fs.readFileSync(file).toString().replace(/\n/g, '')).to.equal('a=2');
      done();
    });
  });

  it("wrong-type", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('wrong-type.json');
      var c;

      try {
        c = config({
          file: file
        });
      } catch(e) {
        return done();
      }
      
      expect('should be errors').to.equal(false);
      done();
    });
  });

  it("wrong type by guess", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('force-type.json');
      var c;

      try {
        c = config({
          file: file
        });
      } catch(e) {
        return done();
      }
      
      expect('should be errors').to.equal(false);
      done();
    });
  });

  it("force type", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('force-type.json');
      var c = config({
        file: file,
        codec: 'ini'
      });
      expect(c.get('a')).to.equal('1');
      c.set('a', 2);
      expect(c.get('a')).to.equal(2);
      c.save();
      expect(fs.readFileSync(file).toString().replace(/\n/g, '')).to.equal('a=2');
      done();
    });
  });
});


describe("config.async", function(){
  var config = _config.async;
  it("config.json", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('config.json');
      var c = config({
        file: file
      }, function (err) {
        expect(err).to.equal(null);
        expect(c.get('a')).to.equal(1);
        c.set('a', 2);
        expect(c.get('a')).to.equal(2);
        c.save(function (err) {
          expect(err).to.equal(null);
          expect(require(file).a).to.equal(2);
          done();
        });
      });
    });
  });

  it("config.ini, with guess", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('config.ini');
      var c = config({
        file: file
      }, function (err) {
        expect(err).to.equal(null);
        expect(c.get('a')).to.equal('1');
        c.set('a', 2);
        expect(c.get('a')).to.equal(2);
        c.save(function (err) {
          expect(err).to.equal(null);
          expect(fs.readFileSync(file).toString().replace(/\n/g, '')).to.equal('a=2');
          done();
        });
      });
    });
  });

  it("wrong-type", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('wrong-type.json');
      var c = config({
        file: file
      }, function (err) {
        expect(err).not.to.equal(null);
        done();
      });
    });
  });

  it("wrong type by guess", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('force-type.json');
      var c = config({
        file: file
      }, function (err) {
        expect(err).not.to.equal(null);
        done();
      });
    });
  });

  it("force type", function(done){
    var f = fixture();
    f.copy(function (err, dir) {
      expect(err).to.equal(null);
      var file = f.resolve('force-type.json');
      var c = config({
        file: file,
        codec: 'ini'
      }, function (err) {
        expect(err).to.equal(null);
        expect(c.get('a')).to.equal('1');
        c.set('a', 2);
        expect(c.get('a')).to.equal(2);
        c.save(function (err) {
          expect(err).to.equal(null);
          expect(fs.readFileSync(file).toString().replace(/\n/g, '')).to.equal('a=2');
          done();
        });
      });
    });
  });
});
