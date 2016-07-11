function someController(SomeService, Alerts, Some) {
  var that = this;

  this.create = function(argument) {
    SomeService.create(argument).then(function(response) {
      Alerts.success('Created succesfully' + response.name)
    }, function(error) {
      Alerts.error('Error: ' + error.message)
    });
  }

  var someValue = 'Butterfly';
  this.butterfly = SomeService.modify(someValue);
  this.flower = SomeService.flower();

  Some.very('long').service('call').with('promise').then(function(response) {
    that.value = response;
  });

  this.without = Some.very('long').service('call').without('promise');

  this.property = Some.short('chain').withProperty;
}

someController.$inject = ['SomeService', 'Alerts', 'Some'];

angular
.module('controllerWithoutTestServ', [])
.controller('someController', someController);


describe('someController', function() {
  var
    someController, $controller, $rootScope, $scope,
    mockedSomeService = {
      create: angular.noop,
      flower: angular.noop,
      modify: function(input) {
        return input
      }
    },
    mockedAlerts = {
      success: angular.noop,
      error: angular.noop
    },
    successCallback,
    failCallback,
    responseValue = 'someValue',
    withoutValue = 'someOtherValue',
    withPropertyValue = 'someProperty',
    veryArgument, serviceArgument, withArgument, withoutArgument, successCallbackSome,
    shortArgument,
    mockedSome = {
      very: function(veryArg) {
        veryArgument = veryArg;
        return {
          service: function(serviceArg) {
            serviceArgument = serviceArg;
            return {
              with: function(withArg) {
                withArgument = withArg;
                return {
                  then: function(success) {
                    successCallbackSome = success;
                  }
                }
              },
              without: function(withoutArg) {
                withoutArgument = withoutArg;
                return withoutValue;
              }
            }
          }
        }
      },
      short: function(shortArg) {
        shortArgument = shortArg
        return {
          withProperty: withPropertyValue
        }
      }
    };

  beforeEach(module('controllerWithoutTestServ'));

  beforeEach(function() {
    //mocking promise
    spyOn(mockedSomeService, 'create').and.returnValue({
      then: function(success, fail) {
        successCallback = success;
        failCallback = fail;
      }
    });
    spyOn(mockedSomeService, 'modify').and.callThrough();
    spyOn(mockedSomeService, 'flower').and.returnValue('rose');

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
      Alerts: mockedAlerts,
      Some: mockedSome
    });
  });

  it('should not be null', function() {
    expect(someController).toBeTruthy();
  });

  it('should bind someValue to this.butterfly', function() {
    expect(someController.butterfly).toBe('Butterfly');
  });

  it('should bind "rose" to this.flower', function() {
    expect(someController.flower).toBe('rose');
  });

  it('should bind withoutValue to this.without', function() {
    expect(someController.without).toBe(withoutValue);
  });

  it('should call without with "promise"', function() {
    expect(withoutArgument).toBe('promise');
  });

  describe('Some very long call', function() {
    it('should call very with "long"', function() {
      expect(veryArgument).toBe('long');
    });

    it('should call service with "call"', function() {
      expect(serviceArgument).toBe('call');
    });

    it('should call with with "promise"', function() {
      expect(withArgument).toBe('promise');
    });

    it('should bind response from promise to this.value', function() {
      successCallbackSome(responseValue);
      expect(someController.value).toBe(responseValue);
    });
  });

  describe('Some short call', function() {
    it('should call very with "chain"', function() {
      expect(shortArgument).toBe('chain');
    });

    it('should set withProperty to the property', function() {
      expect(someController.property).toBe(withPropertyValue);
    });
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

