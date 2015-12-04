function templateController($scope) {
  $scope.someArray = [{
    id: 1,
    name: 'Name1'
  }, {
    id: 2,
    name: 'Name2'
  }, {
    id: 3,
    name: 'Name3'
  }];

  $scope.addToArray = function(name) {
    var item = {};
    item.id = $scope.someArray.length + 1;
    item.name = name;
    $scope.someArray.push(item);
  };
}

templateController.$inject = ['$scope'];

angular
.module('ctrlTemplateWithoutTE', [])
.controller('templateController', templateController);


describe('templateController', function() {
  var
    templateController, template, element, $controller, $compile, $rootScope, $scope;

  beforeEach(module('ctrlTemplateWithoutTE'));
  beforeEach(module('templates'));

  beforeEach(function() {
    inject(function(_$rootScope_, _$controller_, $templateCache, _$compile_) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $compile = _$compile_;
      template = $templateCache.get('examples/TestElement/template.html');
    });
    $scope = $rootScope.$new();
    templateController = $controller('templateController', {
      $scope: $scope,
    });
    element = angular.element(template);
    $compile(element)($scope);
    $scope.$digest();
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
      expect($scope.someArray[3].id).toBe(4);
    });
  });
});

