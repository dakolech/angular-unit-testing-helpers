window.TestServ = function(name) {
  var _this = this;

  if (!!name) {
    inject([name, function(service) {
      _this = service;
    }]);
    return _this;
  }
};

window.TestServ.prototype = {
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
  },

  addMethod: function(name, returnedValue) {
    if (typeof returnedValue === "function" ) {
      this[name] = returnedValue;
      spyOn(this, name).and.callThrough();
    } else {
      this[name] = angular.noop;
      spyOn(this, name).and.returnValue(returnedValue !== undefined ? returnedValue : this);
    }
    return this;
  },

  addProperty: function(name, returnedValue) {
    this[name] = returnedValue;
    return this;
  }
};



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

window.TestElement.prototype = {
  createCtrl: function(name, services) {
    if (!services) {
      services = {};
    }
    if (!services.$scope) {
      services.$scope = this._$scope;
    }
    this._ctrl = this.$controller(name, services);
    return this._ctrl;
  },

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
  },

  createDirective: function(name, html, scope) {
    this.name = name;
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
  },

  createComponent: function(name, html, scope) {
    this.createDirective(name, html, scope);
    return this._el;
  },

  createFilter: function(name) {
    return this.$filter(name);
  },

  get scope() {
    return this._ctrl ?
      this._$scope : Object.keys(this.dom.children()).length ?
        this.dom.children().scope() : this.dom.scope();
  },

  get ctrl() {
    return this._ctrl ? this._ctrl : angular.element(this._el).controller(this.name);
  },

  get dom() {
    return angular.element(this._el);
  },

  find: function (selector) {
    return angular.element(this.dom[0].querySelector(selector));
  },

  findAll: function (selector) {
    var htmlObject = this.dom[0].querySelectorAll(selector);
    var returnedArray = [];
    for (var property in htmlObject) {
      if (htmlObject.hasOwnProperty(property) && typeof htmlObject[property] !== 'number') {
        returnedArray.push(angular.element(htmlObject[property]));
      }
    }
    return returnedArray;
  },

  destroy: function() {
    this._$scope.$destroy();
    this._el = null;
    this._ctrl = null;
  },

  clickOn: function(selector) {
    if (this.dom[0].querySelector(selector)) {
      this.dom[0].querySelector(selector).click();
    } else {
      this.dom[0].click();
    }
    this._$scope.$digest();
    return this._getFlushedThenable();
  },

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
  },

  _getFlushedThenable: function() {
    try {
      this.$timeout.verifyNoPendingTasks();
    } catch (e) {
      this.$timeout.flush();
    }
    return {
      then: function(fn) {
        fn();
      }
    };
  }
};


window.TestDummy = {
  get filter() {
    return function(input) {
      return input;
    };
  },

  get directive() {
    return [{ restrict: 'AE' }];
  }
};


window.TestFactory = {
  define: function(name, attributes) {
    if (!this.models) {
      this.models = {};
    }
    this.models[name] = attributes;
  },

  create: function(name, attributes) {
    var
      model = angular.copy(this.models[name]),
      property;
    if (model) {
      if (typeof model === 'function') {
        model = model();
      } else {
        if (attributes) {
          for (property in attributes) {
            if (attributes.hasOwnProperty(property)) {
              model[property] = attributes[property];
            }
          }
        }

        for (property in model) {
          if (model.hasOwnProperty(property) && typeof model[property] === 'function') {
            model[property] = model[property]();
          }
        }
      }
    }
    return model;
  },

  createList: function(name, number, attributes) {
    var
      model = angular.copy(this.models[name]),
      list = [],
      i = 0,
      property;

    if (model) {
      if (attributes) {
        for (property in attributes) {
          if (attributes.hasOwnProperty(property)) {
            model[property] = attributes[property];
          }
        }
      }
    }

    for (property in model) {
      if (model.hasOwnProperty(property) && typeof model !== 'function' && typeof model[property] === 'function') {
        model[property].clear();
      }
    }

    for (i; i < number; i++) {
      if (typeof model === 'function') {
        list.push(angular.copy(model()));
      } else {
        list.push(angular.copy(model));
      }
    }

    list = list.map(function(item) {
      for (var property in item) {
        if (item.hasOwnProperty(property) && typeof item[property] === 'function') {
          item[property] = item[property]();
        }
      }
      return item;
    });

    return list;
  },

  defineSequence: function(name, argOne, argTwo) {
    var callback, iterator;
    if (!this.seq) {
      this.seq = {};
    }
    if (typeof argOne == 'function') {
      callback = argOne;
      iterator = argTwo ? argTwo : 1;
    } else {
      iterator = argOne ? argOne : 1;
      callback = function(value) {
        return value;
      };
    }

    this.seq[name] = {
      value: 0,
      callback: callback,
      iterator: iterator
    };
  },

  sequence: function(name) {
    var _this = this;
    if (!!this.seq[name]) {
      var returnedObject = function() {
        _this.seq[name].value += _this.seq[name].iterator;
        return _this.seq[name].callback(_this.seq[name].value);
      };

      returnedObject.clear = function() {
        _this.seq[name].value = 0;
      };

      return returnedObject;
    }
  }
};

window.TestModule = function(name) {
  this.module = angular.module(name);
  this.deps = this.module.value(name).requires;
};

window.TestModule.prototype = {
  hasModule: function(name) {
    return this.deps.indexOf(name) >= 0;
  }
};

if (typeof module === 'object') {
  module.exports = {
    TestServ: window.TestServ,
    TestElement: window.TestElement,
    TestDummy: window.TestDummy,
    TestFactory: window.TestFactory,
    TestModule: window.TestModule
  };
}

if (typeof exports === 'object') {
  exports.TestServ = window.TestServ;
  exports.TestElement = window.TestElement;
  exports.TestDummy = window.TestDummy;
  exports.TestFactory = window.TestFactory;
  exports.TestModule = window.TestModule;
}
