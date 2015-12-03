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
    - [createCtrl](#createctrl)
    - [addTemplate](#addtemplate)
    - [createDirective](#createdirective)
    - [get scope](#get-scope)
    - [get ctrl](#get-ctrl)
    - [get dom](#get-dom)
    - [clickOn](#clickon)
    - [inputOn](#inputon)
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

**[Back to top](#table-of-contents)**

## TestServ documentation

### TestServ contructor:

  Without an argument:

  ```javascript
  new TestServ()
  ```

  It will create an empty object;

  With an argument:

  ```javascript
  new TestServ('$q');
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

**[Back to top](#table-of-contents)**

### addMethod:

  ```javascript
  var someService = new TestServ();
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

### addPromise:

  ```javascript
  var someService = new TestServ();
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

**[Back to top](#table-of-contents)**

## TestServ examples

  [TestServ examples](examples/TestServ)

## TestElement documentation

### TestElement contructor:

  ```javascript
  new TestElement();
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

**[Back to top](#table-of-contents)**

### createCtrl:

  ```javascript
  var element, someController, services = {
    someSrevice: mockedSomeService
  };
  element = new TestElement();
  someController = element.createCtrl(name, services);
  ```

  `createCtrl` will create and return a controller with 'name' and services object. You don't need to inject `$scope` into `services` method, it's injected by default if services.$scope doesn't exists.

  Implementation:

  ```javascript
  createCtrl: function(name, services) {
    if (!services) {
      services = {};
    }
    if (!services.$scope) {
      services.$scope = this._$scope;
    }
    this._ctrl = this.$controller(name, services);
    return this._ctrl;
  }
  ```

**[Back to top](#table-of-contents)**

### addTemplate:

  ```javascript
  var element;
  element = new TestElement();
  element.createCtrl(name);
  element.addTemplate(path, ctrlAs);
  ```

  `addTemplate` will create and return an angular element with current $scope. `path` is a path to the template that is stored in $templateCache. ctrlAs is an optional argument. If you are using `controllerAs` syntax, then `ctrlAs` should be the value of `controllerAs` property.

  Implementation:

  ```javascript
  addTemplate: function(path, ctrlAs) {
    var template;
    template = this.$templateCache.get(path);
    this._el = angular.element(template);

    if (!!ctrlAs) {
      this._$scope[ctrlAs] = this._ctrl;
    }

    this.$compile(this._el)(this._$scope);
    this._$scope.$digest();

    try {
      this.$timeout.verifyNoPendingTasks();
    } catch (e) {
      this.$timeout.flush();
    }

    return this._el;
  }
  ```

**[Back to top](#table-of-contents)**

### createDirective:

  ```javascript
  var element;
  element = new TestElement();
  element.createDirective(html, scope);
  ```

  `createDirective` will create and return an angular element with with `html` and `scope`. `html` is a string and `scope` is an object, e. g.: `html = '<some-directive attribute="someValue"></some-directive>'; scope = { someValue: 123 };`.

  Implementation:

  ```javascript
  createDirective: function(html, scope) {
    var elem = angular.element(html);
    this._$scope = angular.extend(this.$originalScope, scope);
    this._el = this.$compile(elem)(this._$scope);
    this._$scope.$digest();

    try {
      this.$timeout.verifyNoPendingTasks();
    } catch (e) {
      this.$timeout.flush();
    }
    return this._el;
  }
  ```

**[Back to top](#table-of-contents)**

### get scope:

  ```javascript
  element.scope
  ```

  `scope` will return current scope of the element.

  Implementation:

  ```javascript
  get scope() {
    return this._$scope;
  }
  ```

**[Back to top](#table-of-contents)**

### get ctrl:

  ```javascript
  element.ctrl
  ```

  `ctrl` will return controller created with `createCtrl` method or controller created with `createDirective` method.

  Implementation:

  ```javascript
  get ctrl() {
    return this._ctrl ? this._ctrl : angular.element(this._el).controller(this.name);
  }
  ```

**[Back to top](#table-of-contents)**

### get dom:

  ```javascript
  element.dom
  ```

  `dom` will return current angular element of the template created with `addTemplate` or the directive created with `createDirective`.

  Implementation:

  ```javascript
  get dom() {
    return angular.element(this._el);
  }
  ```

**[Back to top](#table-of-contents)**


### get clickOn:

  ```javascript
  element.clickOn(selector);
  ```

  `clickOn` will click on element found with `selector`. It returns a promise.

  Implementation:

  ```javascript
  clickOn: function(selector) {

  ```

**[Back to top](#table-of-contents)**


### get dom:

  ```javascript
  element.inputOn(selector, value);
  ```

  `inputOn` will set value of the element found with `selector`. It returns a promise.

  Implementation:

  ```javascript
  inputOn: function(selector, value) {

  ```

**[Back to top](#table-of-contents)**


## TestServ examples

  [TestServ examples](examples/TestElement)
