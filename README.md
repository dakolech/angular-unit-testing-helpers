[![Build Status](https://travis-ci.org/dakolech/angular-unit-testing-helpers.svg?branch=master)](https://travis-ci.org/dakolech/angular-unit-testing-helpers)

# Angular Unit Testing Helpers

## Table of Contents

  - [Why?](#why)
  - [Installation](#installation)
  - [TestServ documentation](#testserv-documentation)
    - [TestServ contructor](#testserv-contructor)
    - [addMethod](#addmethod)
    - [addPromise](#addpromise)
  - [TestServ examples](#testserv-examples)
  - [TestElement documentation](#testelement-documentation)
    - [TestElement contructor](#testelement-contructor)
    - [createDirective](#createdirective)
    - [createCtrl](#createctrl)
    - [addTemplate](#addtemplate)
  - [TestElement examples](#testelement-examples)

## Why?
I've created this package to simplify unit testing in AngularJS apps. I had enough of writing repeated code. For every spec (controller, directive, service) I had to write the same injector and compile blocks of code, for every mocked service I had to write the same lines. With this package everything becomes a easier and faster.

## Installation:

  1. Download package:

  ```
  npm install angular-unit-testing-helpers
  ```

  or

  ```
  bower install angular-unit-testing-helpers
  ```

  1. Inject it to `karma.conf.js`

  ```javascript
  files: [
    'node_modules/angular-unit-testing-helpers/test-helpers.js',
    ...
  ],
  ```

  or
  ```javascript
  files: [
    'bower_components/angular-unit-testing-helpers/test-helpers.js',
    ...
  ],
  ```

## TestServ documentation

### TestServ contructor:

  Without an argument:

  ```javascript
  new TestServ()
  ```

  It will create an empty object;

  With an argument:

  ```javascript
  new TestServ('$q')
  ```

  It will return real `$q` service;

  Implementation:

  ```javascript
  window.TestServ = function(name) {
    var _this = this;
    if (!!name) {
      inject([name, function(service) {
        _this = service;
      }]);
      return _this;
    }
  };
  ```

### addMethod:

  ```javascript
  var someService = new TestServ()
  TestServ.addMethod(name, returnedValue);
  ```

  `addMethod` will add an empty function to the someService at `name` value and also create spyOn on this created method. spyOn will return `returnedValue`.
  `returnedValue` can be undefined or a value or an object or a function.

  Implementation:

  ```javascript
  addMethod: function(name, returnedValue) {
    this[name] = function() {};

    spyOn(this, name).and.returnValue(
      typeof returnedValue === "function" ? returnedValue() : returnedValue);
  }
  ```

### addPromise:

  ```javascript
  var someService = new TestServ()
  TestServ.addPromise(name);
  ```

  `addPromise` will add an empty function to the someService at `name` value and also create spyOn on this created method. Same as `addMethod`.
  But spyOn will return object with `then` property, which will become a function. aThis function will bind two arguments to `success` and `error` property of `someService[name]`. So to call success promise you will simply call `someService[name].success()` and for failure promise `someService[name].fail`. You can also call this function with arguments (`someService[name].success('someString')`), so when you call this `someService[name].then(function(response) { console.log(response)}), response will become `'someString'`.

  Implementation:
  ```javascript
  addPromise: function(name) {
    var _this = this;
    _this[name] = function() {};
    spyOn(_this, name).and.returnValue({
      then: function(success, fail) {
        _this[name].success = success;
        _this[name].fail = fail;
      }
    });
  }
  ```

## TestServ examples

  [TestServ examples](test/examples/TestServ)

## TestElement documentation

### TestElement contructor:

  ```javascript
  new TestElement()
  ```

  It will create an object, which will contain some angular services: `$rootScope`, `$compile`, `$timeout`, `$controller`, `$templateCache`;

  Implementation:

  ```javascript
  window.TestElement = function(name) {
    var _this = this;
    inject(function($rootScope, $compile, $timeout, $controller, $templateCache) {
      _this._$scope = $rootScope.$new();
      _this.$originalScope = $rootScope.$new();
      _this.$compile = $compile;
      _this.$timeout = $timeout;
      _this.$controller = $controller;
      _this.$templateCache = $templateCache;
    });
    _this.name = name;
  };
  ```

### addMethod:

  ```javascript
  var someService = new TestServ()
  TestServ.addMethod(name, returnedValue);
  ```

  `addMethod` will add an empty function to the someService at `name` value and also create spyOn on this created method. spyOn will return `returnedValue`.
  `returnedValue` can be undefined or a value or an object or a function.

  Implementation:

  ```javascript
  addMethod: function(name, returnedValue) {
    this[name] = function() {};

    spyOn(this, name).and.returnValue(
      typeof returnedValue === "function" ? returnedValue() : returnedValue);
  }
  ```

**[Back to top](#table-of-contents)**
