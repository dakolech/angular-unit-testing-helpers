var component = {
  templateUrl: 'examples/TestElement/templateAs.html',
  bindings: {
    someArray: '='
  },
  controllerAs: 'vm',
  controller: function() {
    var _this = this;

    _this.addToArray = function(name) {
      var item = {};
      item.id = _this.someArray.length + 1;
      item.name = name;
      _this.someArray.push(item);
    };
  }
};

angular
.module('componentWithoutTE', [])
.component('someComponent', someComponent);


describe('someComponent', function() {
  var
    element, componentController, $compile, $rootScope, $scope,
    namesArray = [{
      id: 1,
      name: 'Name1'
    }, {
      id: 2,
      name: 'Name2'
    }, {
      id: 3,
      name: 'Name3'
    }];

  beforeEach(module('componentWithoutTE'));
  beforeEach(module('templates'));

  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope;
      $scope.namesArray = angular.copy(namesArray);
      element = angular.element('<some-component some-array="namesArray"></some-component>');
      $compile(element)($scope);
      angular.element(document.body).append(element);
      $scope.$apply();
      componentController = element.controller('someComponent');
    });
  });

  it('should not be null', function() {
    expect(element).toBeTruthy();
  });

  it('should show 3 span elements', function() {
    expect(element.find('span').length).toBe(3);
  });

  describe('button', function() {
    it('should have .button class', function() {
      expect(element.find('button').hasClass('button')).toBeTruthy();
    });
  });

  describe('Add new item', function() {
    var newVal = 'newName';

    beforeEach(function() {
      angular.element(element[0].querySelector('input')).val(newVal).triggerHandler('input');
      element[0].querySelector('button').click();
      $scope.$digest();
    });

    it('should add new element to array', function() {
      expect(element.find('span').length).toBe(4);
      expect(element.html()).toContain(newVal);
      expect(componentController.someArray[3].id).toBe(4);
    });
  });
});

