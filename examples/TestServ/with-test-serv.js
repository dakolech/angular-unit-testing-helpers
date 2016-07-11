jasmine.pp = function(obj) {
  return JSON.stringify(obj, undefined, 2);
}

function someController(SomeService, Alerts, Some) {
  var that = this;

  this.create = function(argument) {
    SomeService.create(argument).then(function(response) {
      Alerts.success('Created succesfully' + response.name)
    }, function(error) {
      Alerts.error('Error: ' + error.message)
    });
  };

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
.module('controllerWithTestServ', [])
.controller('someController', someController);


describe('someController', function() {
  var
    someController, $controller, $rootScope, $scope,
    mockedSomeService = new TestServ(),
    mockedAlerts = new TestServ(),
    mockedSome = new TestServ()
    responseValue = 'someValue',
    withoutValue = 'someOtherValue',
    withPropertyValue = 'someProperty';

  beforeEach(module('controllerWithTestServ'));

  beforeEach(function() {
    //mocking a promise
    mockedSomeService.addPromise('create');
    mockedSomeService.addMethod('modify', function(input) {return input});
    mockedSomeService.addMethod('flower', 'rose');
    mockedAlerts.addMethod('success');
    mockedAlerts.addMethod('error');

    mockedSome.addMethod('very').addMethod('service').addPromise('with');
    mockedSome.addMethod('very').addMethod('service').addMethod('without', withoutValue);
    mockedSome.addMethod('short').addProperty('withProperty', withPropertyValue);
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
    expect(mockedSome.without).toHaveBeenCalledWith('promise');
  });

  describe('Some very long call', function() {
    it('should call very with "long"', function() {
      expect(mockedSome.very).toHaveBeenCalledWith('long');
    });

    it('should call service with "call"', function() {
      expect(mockedSome.service).toHaveBeenCalledWith('call');
    });

    it('should call with with "promise"', function() {
      expect(mockedSome.with).toHaveBeenCalledWith('promise');
    });

    it('should bind response from promise to this.value', function() {
      mockedSome.with.success(responseValue);
      expect(someController.value).toBe(responseValue);
    });
  });

  describe('Some short call', function() {
    it('should call very with "chain"', function() {
      expect(mockedSome.short).toHaveBeenCalledWith('chain');
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
