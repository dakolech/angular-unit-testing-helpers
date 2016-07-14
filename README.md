[![Build Status](https://travis-ci.org/dakolech/angular-unit-testing-helpers.svg?branch=master)](https://travis-ci.org/dakolech/angular-unit-testing-helpers)
[![devDependency Status](https://david-dm.org/dakolech/angular-unit-testing-helpers/dev-status.svg)](https://david-dm.org/dakolech/angular-unit-testing-helpers#info=devDependencies)

# Angular Unit Testing Helpers

## Table of Contents

  - [Why?](#why)
  - [Features](#features)
  - [Installation](#installation)
  - [TypeScript](#typescript)
  - [TestServ documentation](#testserv-documentation)
    - [TestServ contructor](#testserv-contructor)
    - [addMethod](#addmethod)
    - [addPromise](#addpromise)
    - [addProperty](#addproperty)
  - [TestServ examples](#testserv-examples)
  - [TestElement documentation](#testelement-documentation)
    - [TestElement contructor](#testelement-contructor)
    - [createCtrl](#createctrl)
    - [addTemplate](#addtemplate)
    - [createDirective](#createdirective)
    - [createComponent](#createcomponent)
    - [createFilter](#createfilter)
    - [get scope](#get-scope)
    - [get ctrl](#get-ctrl)
    - [get dom](#get-dom)
    - [find](#find)
    - [findAll](#findall)
    - [destroy](#destroy)
    - [clickOn](#clickon)
    - [inputOn](#inputon)
  - [TestElement examples](#testelement-examples)
  - [TestModule documentation](#testmodule-documentation)
    - [hasModule](#hasmodule)
  - [TestModule examples](#testmodule-examples)
  - [TestFactory documentation](#testfactory-documentation)
    - [define](#define)
    - [create](#create)
    - [createList](#createlist)
    - [defineSequence](#definesequence)
    - [sequence](#sequence)
  - [TestFactory examples](#testfactory-examples)
  - [TestDummy documentation](#testdummy-documentation)
    - [filter](#filter)
    - [directive](#directive)
  - [Dummy examples](#dummy-examples)

## Why?
I've created this package to simplify unit testing in AngularJS apps. I had enough of writing repeated code. For every spec (controller, directive, service) I had to write the same injector and compile blocks of code, for every mocked service I had to write the same lines. With this package, everything becomes easier and faster.

## Features
All selectors are using native Javascript `querySelector` or `querySelectorAll`, so `jQuery` is not requierd.

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

## TypeScript:

  You can use this library with TypeScript. All you need to do:

  1. Have typings installed (1.x):

  ```
  npm install typings
  ```

  1. Have installed typings in angular-unit-testing-helpers

  ```
  typings install npm:angular-unit-testing-helpers
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
  someService.addMethod(name, returnedValue);
  ```

  `addMethod` will add an empty function to the someService at `name` value and also create spyOn on this created method. spyOn will return `returnedValue`.
  `returnedValue` can be undefined, a value, an object or a function.
  You can also construct chaining methods calls, for example:

  ```javascript
  var someService = new TestServ();
  someService.addMethod('firstMethod').addMethod('secondMethod').addMethod('thirdMethod');
  ```

  More in examples.

  Implementation:

  ```javascript
  addMethod: function(name, returnedValue) {
    if (typeof returnedValue === "function" ) {
      this[name] = returnedValue;
      spyOn(this, name).and.callThrough();
    } else {
      this[name] = angular.noop;
      spyOn(this, name).and.returnValue(returnedValue !== undefined ? returnedValue : this);
    }
    return this;
  }
  ```

**[Back to top](#table-of-contents)**

### addPromise:

  ```javascript
  var someService = new TestServ();
  someService.addPromise(name);
  ```

  `addPromise` will add an empty function to the someService at `name` value and also create spyOn on this created method. Same as `addMethod`.
  But spyOn will return object with `then` property, which will become a function. aThis function will bind two arguments to `success` and `error` property of `someService[name]`. So to call success promise you will simply call `someService[name].success()` and for failure promise `someService[name].fail`. You can also call this function with arguments (`someService[name].success('someString')`), so when you call this `someService[name].then(function(response) { console.log(response)}), response will become `'someString'`.
  You can also construct chaining methods calls, for example:

  ```javascript
  var someService = new TestServ();
  someService.addMethod('firstMethod').addMethod('secondMethod').addPromise('promise');
  ```

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
    return this;
  }
  ```

### addProperty:

  ```javascript
  var someService = new TestServ();
  someService.addProperty(name, returnedValue);
  ```

  `addProperty` will add a property to the someService with returnedValue as a value.
  You can also construct chaining methods calls, for example:

  ```javascript
  var someService = new TestServ();
  someService.addProperty('someProperty', propertyValue).addProperty('someOtherProperty', otherPropertyValue);
  ```

  More in examples.

  Implementation:

  ```javascript
  addProperty: function(name, returnedValue) {
    this[name] = returnedValue;
    return this;
  }
  ```

### get:

  ```javascript
  var someService = new TestServ();
  someService.get(name);
  ```

  `get` will return property from a created service. You can use direct propery call (someService.name), this method is useful with typescript. More in typescript chapter.

  ```javascript
  someService.get(name) === someService.name;
  ```

  Implementation:

  ```javascript
  get: function(name) {
    return this[name];
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
  window.TestElement = function() {
    var _this = this;
    inject(function($rootScope, $compile, $timeout, $controller, $templateCache, $filter) {
      _this._$scope = $rootScope.$new();
      _this.$originalScope = $rootScope.$new();
      _this.$compile = $compile;
      _this.$timeout = $timeout;
      _this.$controller = $controller;
      _this.$templateCache = $templateCache;
      _this.$filter = $filter;
    });
    this.name = '';
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
  element.createDirective(name, html, scope);
  ```

  `createDirective` will create and return an angular element with with `html` and `scope`. `name` is a name of the directive, `html` is a string and `scope` is an object, e. g.: `name = 'someDirective', html = '<some-directive attribute="someValue"></some-directive>'; scope = { someValue: 123 };`.

  Implementation:

  ```javascript
  createDirective: function(name, html, scope) {
    this.name = name;
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

### createComponent:

  ```javascript
  var element;
  element = new TestElement();
  element.createComponent(name, html, scope);
  ```

  `createComponent` is an alias to createDirective method.

  Implementation:

  ```javascript
  createComponent: function(name, html, scope) {
    this.createDirective(name, html, scope);
    return this._el;
  }
  ```

**[Back to top](#table-of-contents)**

### createFilter:

  ```javascript
  var filter;
  filter = new TestElement().createFilter(name);
  ```

  `createFilter` will return filter with given name.

  Implementation:

  ```javascript
  createFilter: function(name) {
    return this.$filter(name);
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
    return this._ctrl ?
      this._$scope : Object.keys(this.dom.children()).length ?
        this.dom.children().scope() : this.dom.scope();
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

### find:

  ```javascript
  element.find(selector)
  ```

  `find` will return found angular element with `selector`.

  Implementation:

  ```javascript
  find: function (selector) {
    return angular.element(this.dom[0].querySelector(selector));
  }
  ```

**[Back to top](#table-of-contents)**

### findAll:

  ```javascript
  element.findAll()
  ```

  `findAll` will return all found angular elements with `selector` as an array.

  Implementation:

  ```javascript
  findAll: function (selector) {
    var htmlObject = this.dom[0].querySelectorAll(selector);
    var returnedArray = [];
    for (var property in htmlObject) {
      if (htmlObject.hasOwnProperty(property) && typeof htmlObject[property] !== 'number') {
        returnedArray.push(angular.element(htmlObject[property]));
      }
    }
    return returnedArray;
  }
  ```

**[Back to top](#table-of-contents)**

### destroy:

  ```javascript
  element.destroy()
  ```

  `destroy` will destroy current element.

  Implementation:

  ```javascript
  destroy: function() {
    this._$scope.$destroy();
    this._el = null;
    this._ctrl = null;
  }
  ```

**[Back to top](#table-of-contents)**


### clickOn:

  ```javascript
  element.clickOn(selector);
  ```

  `clickOn` will click on element found with `selector` and make a `$scope.$digest()`. It returns a promise.

  Implementation:

  ```javascript
  clickOn: function(selector) {
    if (this.dom[0].querySelector(selector)) {
      this.dom[0].querySelector(selector).click();
    } else {
      this.dom[0].click();
    }
    this._$scope.$digest();
    return this._getFlushedThenable();
  }
  ```

**[Back to top](#table-of-contents)**


### inputOn:

  ```javascript
  element.inputOn(selector, value, which);
  ```

  `inputOn` will set value of the element found with `selector`, trigger a `input` handler and make `$scope.$digest()`. It returns a promise.
  If you have many inputs with the same selector, then you can pass which input you want to react with by adding number as a third argument (0 is a first input). `which` is an optional argument.

  Implementation:

  ```javascript
  inputOn: function(selector, value, which) {
    if (!which) {
      if (this.dom[0].querySelector(selector)) {
        angular.element(this.dom[0].querySelector(selector)).val(value).triggerHandler('input');
      } else if (this.dom[0].tagName == 'INPUT') {
        this._el.val(value).triggerHandler('input');
      }
    } else {
      if (this.dom[0].querySelectorAll(selector)[which]) {
        angular.element(this.dom[0].querySelectorAll(selector)[which]).val(value).triggerHandler('input');
      } else if (this.dom[0].tagName == 'INPUT') {
        this._el.val(value).triggerHandler('input');
      }
    }
    this._$scope.$digest();
    return this._getFlushedThenable();
  }
  ```

**[Back to top](#table-of-contents)**


## TestElement examples

  [TestElement examples](examples/TestElement)

**[Back to top](#table-of-contents)**

## TestModule documentation

### TestModule contructor:

  ```javascript
  new TestModule(name);
  ```

  It will create an module object with given `name`;

  Implementation:

  ```javascript
  window.TestModule = function(name) {
    this.module = angular.module(name);
    this.deps = this.module.value(name).requires;
  };
  ```

**[Back to top](#table-of-contents)**

### hasModule:

  ```javascript
  var someModule = new TestModule(moduleName);
  someModule.hasModule(dependencyModule);
  ```

  `hasModule` will return `boolean` value: `true` if `moduleName` has  dependencyModule as a dependency and `false` if not.

  Implementation:

  ```javascript
  hasModule: function(name) {
    return this.deps.indexOf(name) >= 0;
  }
  ```

**[Back to top](#table-of-contents)**


## TestModule examples

  [TestModule examples](examples/TestModule)

**[Back to top](#table-of-contents)**

## TestFactory documentation

### define:

  ```javascript
  TestFactory.define(name, attributes);
  ```

  `define` will define a model with `attributes` for creating factories (it can be also a `sequence`). `name` should be unique. It should be called before any create action. The best solution is to define models in seperate folder and inject it at the beginning of the `karma.config` file (but after `test-helpers`).

  Example:

  ```javascript
  TestFactory.define('user', {
    name: 'someName',
    id: 123,
    pet: {
      type: 'cat',
      name: 'Tom'
    },
    friends: ['Neo', 'Trinity', 'Morfeus']
  });
  ```

**[Back to top](#table-of-contents)**

### create:

  ```javascript
  TestFactory.create(name, attributes)
  ```

  `create` will create an object with model named `name`. `attributes` are an optional argument, it overwrites default attributes defined with `define` method.

  Example:
  ```javascript
  user = TestFactory.create('user', {
    name: 'John',
    pet: {
      name: 'Jerry',
      type: 'mouse'
  });
  ```

**[Back to top](#table-of-contents)**

### createList:

  ```javascript
  TestFactory.createList(name, number, attributes)
  ```

  `createList` will create an collection of object with model named `name`. `number` defines how many objects in collections should be added. `attributes` are an optional argument, it overwrites default attributes defined with `define` method.

  Example:
  ```javascript
  users = TestFactory.createList('user', 3, {
    name: 'John',
    pet: {
      name: 'Jerry',
      type: 'mouse'
  });
  ```

**[Back to top](#table-of-contents)**

### defineSequence:

  ```javascript
  TestFactory.defineSequence(name, argOne, argTwo)
  ```

  `defineSequence` will define a model with `attributes` for creating factories. `name` should be unique. It should be called before any sequence call. `argOne` can be iterator or function.

  Example:
  ```javascript
  TestFactory.defineSequence('simpleSeq'); // => 1,2,3...
  TestFactory.defineSequence('seqWithIterator', 4); // => 4,8,12...
  TestFactory.defineSequence('seqWithFunction', function(value) {
    return 'Name ' + value;
  }); // => 'Name 1', 'Name 2', 'Name 3'...
  TestFactory.defineSequence('seqWithFunctionAndIterator', function(value) {
    return 'Age ' + value;
  }, 5); // => 'Age 5', 'Age 10', 'Age 15'...
  ```

**[Back to top](#table-of-contents)**

### sequence:

  ```javascript
  TestFactory.sequence(name);
  TestFactory.sequence(name);
  ```

  `sequence` returns a function. When you call it, then sequnce will increment. When you call `clear` method on it, then sequnce will be cleared to default value;

  Example:
  ```javascript
  TestFactory.defineSequence('simpleSeq');
  TestFactory.sequence('simpleSeq')(); // => 1
  TestFactory.sequence('simpleSeq')(); // => 2
  TestFactory.sequence('simpleSeq').clear();
  TestFactory.sequence('simpleSeq')(); // => 1
  TestFactory.sequence('simpleSeq')(); // => 2
  ```

**[Back to top](#table-of-contents)**

## TestFactory examples

  [TestFactory examples](examples/TestFactory)

## TestDummy documentation

### filter:

  ```javascript
  TestDummy.filter;
  ```

  `filter` will return the simpliest filter. It's useful when filter is in another module.

  Implementation:

  ```javascript
  get filter() {
    return function(input) {
      return input;
    };
  }
  ```

**[Back to top](#table-of-contents)**

### directive:

  ```javascript
  TestDummy.directive
  ```

  `directive` will return the simpliest directive. It's useful when directive is in another module.

  Implementation:
  ```javascript
  get directive() {
    return [{ restrict: 'AE' }];
  }
  ```

**[Back to top](#table-of-contents)**

## TestDummy examples

  [TestDummy examples](examples/TestDummy)

