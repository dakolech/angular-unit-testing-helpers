function someController(SomeService, Alerts) {
  this.create = function(argument) {
    SomeService.create(argument).then(function(response) {
      Alerts.success('Created succesfully' + response.name)
    }, function(error) {
      Alerts.error('Error: ' + error.message)
    });
  };

  var someValue = 'Butterfly';
  this.butterfly = SomeService.modify(someValue);
}

someController.$inject = ['SomeService', 'Alerts'];

angular
.module('controllerWithTestServ', [])
.controller('someController', someController);


describe('someController', function() {
  var
    someController, $controller, $rootScope, $scope,
    mockedSomeService = new TestServ(),
    mockedAlerts = new TestServ();

  beforeEach(module('controllerWithTestServ'));

  beforeEach(function() {
    //mocking promise
    mockedSomeService.addPromise('create');
    mockedSomeService.addMethod('modify', function(input) {return input});
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

  it('should bind someValue to this.butterfly', function() {
    expect(someController.butterfly).toBe('Butterfly');
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
