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
  },

  addMethod: function(name, returnedValue) {
    this[name] = function() {};

    spyOn(this, name).and.returnValue(
      typeof returnedValue === "function" ? returnedValue() : returnedValue);
  }
}



window.TestElement = function() {
  var _this = this;
  inject(function($rootScope, $compile, $timeout, $controller, $templateCache) {
    _this._$scope = $rootScope.$new();
    _this.$originalScope = $rootScope.$new();
    _this.$compile = $compile;
    _this.$timeout = $timeout;
    _this.$controller = $controller;
    _this.$templateCache = $templateCache;
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
    return angular.element(this.dom[0].querySelectorAll(selector));
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

  inputOn: function(selector, value) {
    if (this.dom[0].querySelector(selector)) {
      angular.element(this.dom[0].querySelector(selector)).val(value).triggerHandler('input');
    } else if (this.dom[0].tagName == 'INPUT') {
      this._el.val(value).triggerHandler('input');
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
  },
}


window.Dummy = {
  get filter() {
    return function(input) {
      return input;
    };
  },

  get directive() {
    return [{ restrict: 'AE' }];
  }
}


window.Factory = {
  define: function(name, attributes) {
    if (!this.models) {
      this.models = {}
    };
    this.models[name] = attributes;
  },

  create: function(name, attributes) {
    var model = angular.copy(this.models[name]);
    if (model) {
      if (attributes) {
        for (var property in attributes) {
          if (attributes.hasOwnProperty(property)) {
            model[property] = attributes[property];
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
      i = 0;

    if (model) {
      if (attributes) {
        for (var property in attributes) {
          if (attributes.hasOwnProperty(property)) {
            model[property] = attributes[property];
          }
        }
      }
    };

    for (i; i <= number; i++) {
      list.push(model);
    };

    return list;
  },
}

// Factory.define('user', {
//   name: 'asd',
//   id: 123
// });

// console.log(Factory.create('user', {id: 1, name: 'xvc'}))

// console.log(Factory.createList('user', 2))

