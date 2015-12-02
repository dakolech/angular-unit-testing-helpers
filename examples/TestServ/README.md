## TestServ examples

  - [Injecting a real service](#injecting-a-real-service)
  - [Mocking a service](#mocking-a-service)

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

      spyOn(mockedAlerts, 'success');
      spyOn(mockedAlerts, 'error');
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
            //calling second function in promise
            failCallback(error);
          });

          it('should call error method on Alerts with proper message', function() {
            expect(mockedAlerts.error).toHaveBeenCalledWith('Error: ' + error.message);
          });
        });
      });
    });
  });
  ```

  But with TestServ you can do the same with this:

  ```javascript
  describe('someController', function() {
    var
      someController, $controller, $rootScope, $scope,
      mockedSomeService = new TestServ(),
      mockedAlerts = new TestServ();

    beforeEach(module('someApp'));

    beforeEach(function() {
      //mocking promise
      mockedSomeService.addPromise('create');
      mockedAlerts.addMethod('success');
      mockedAlerts.addMethod('error');
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
            mockedSomeService.create.success(response);
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
            //calling second function in promise
            mockedSomeService.create.fail(error);
          });

          it('should call error method on Alerts with proper message', function() {
            expect(mockedAlerts.error).toHaveBeenCalledWith('Error: ' + error.message);
          });
        });
      });
    });
  });
  ```

**[Back to top](#testserv-examples)**


