[![Build Status](https://travis-ci.org/dakolech/angular-unit-testing-helpers.svg?branch=master)](https://travis-ci.org/dakolech/angular-unit-testing-helpers)

# Angular Unit Testing Helpers

## Table of Contents

  - [Why?](#why)
  - [Installation](#installation)
  - [Services](#services)
    - [TestServ documentation](#testserv-documentation)
    - [TestServ examples](#testserv-examples)
      - [Injecting a real service](#injecting-a-real-service)
      - [Mocking a service](#mocking-a-service)
  - [Controllers](#controllers)
  - [Directives](#directivs)

## Why?
I've created this package to simplify unit testing in AngularJS apps. I had enough of writing repeated code. For every spec (controller, directive, service) I had to write the same injector and compile blocks of code, for every mocked service I had to write the same lines. With this package everything becomes a easier and faster.

## Installation:

  1. Download package:

  ```
  npm install angular-unit-testing-helpers
  ```

  1. Inject it to `karma.conf.js`

  ```javascript
  files: [
    'node_modules/angular-unit-testing-helpers/test-helpers.js',
    ...
  ],
  ```


# Services

## TestServ documentation

## TestServ examples

### Injecting a real service

  Instead of injecting $injector, like this:

  ```javascript
    beforeEach(inject(function($injector) {
      someService = $injector.get('someService');
    }));
  ```

  You can do the same with `TestServ`:

  ```javascript
    beforeEach(function() {
      someService = new TestServ('someService');
    });
  ```

  Of course you have to inject module where service is defined.

### Mocking a service

  Let's assume that you have to test this controller:

  ```javascript
    function someController(SomeService, Alerts) {
      this.create = function(argument) {
        SomeService.create(argument).then(function(response) {
          Alerts.success('Created succesfully' + response.name)
        }, function(error) {
          Alerts.error('Error: ' + error.message)
        });
      }
    }

    someController.$inject = ['SomeService', 'Alerts'];

    angular
    .module('someApp')
    .controller('someController', someController);
  ```

  Normally you should write something like this:

  ```javascript
  describe('someController', function() {
    var
      someController, $controller, $rootScope, $scope,
      mockedSomeService = {
        create: angular.noop
      },
      mockedAlerts = {
        success: angular.noop,
        error: angular.noop
      },
      successCallback,
      failCallback;

    beforeEach(module('someApp'));

    beforeEach(function() {
      //mocking promise
      spyOn(mockedSomeService, 'create').and.returnValue({
        then: function(success, fail) {
          successCallback = success;
          failCallback = fail;
        }
      });
    });

    beforeEach(function() {
      inject(function(_$rootScope_, _$controller_) {
        $rootScope = _$rootScope_;
        $controller = _$controller_;
      });
      $scope = $rootScope.$new();
      someController = $controller('someController', {
        $scope: $scope,
        SomeService: mockedSomeService,
        Alerts: mockedAlerts
      });
    });

    it('should not be null', function() {
      expect(someController).toBeTruthy();
    });

    describe('create method', function() {
      var someObject = {
        some: 'property'
      };

      beforeEach(function() {
        someController.create(someObject);
      });

      describe('create method', function() {
        it('should call create method on SomeService with someObject', function() {
          expect(mockedSomeService.create).toHaveBeenCalledWith(someObject);
        });

        describe('success', function() {
          var response = {
            name: 'response'
          };

          beforeEach(function() {
            //calling first function in promise
            successCallback(response);
          });

          it('should call success method on Alerts with proper message', function() {
            expect(mockedAlerts.success).toHaveBeenCalledWith('Created succesfully' + response.name);
          });
        });

        describe('failure', function() {
          var error = {
            message: 'error message'
          };

          beforeEach(function() {
            //calling first function in promise
            failCallback(response);
          });

          it('should call error method on Alerts with proper message', function() {
            expect(mockedAlerts.error).toHaveBeenCalledWith('Error: ' + error.message);
          });
        });
      });
    });
  });
  ```

**[Back to top](#table-of-contents)**
