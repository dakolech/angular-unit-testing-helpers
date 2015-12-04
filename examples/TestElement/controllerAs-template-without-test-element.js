function templateController() {
  var _this = this;

  _this.someArray = [{
    id: 1,
    name: 'Name1'
  }, {
    id: 2,
    name: 'Name2'
  }, {
    id: 3,
    name: 'Name3'
  }];

  _this.addToArray = function(name) {
    var item = {};
    item.id = _this.someArray.length + 1;
    item.name = name;
    _this.someArray.push(item);
  };
}


angular
.module('ctrlAsTemplateWithoutTE', [])
.controller('templateController', templateController);


describe('templateController', function() {
  var
    templateController, template, element, $controller, $compile, $rootScope, $scope;

  beforeEach(module('ctrlAsTemplateWithoutTE'));
  beforeEach(module('templates'));

  beforeEach(function() {
    inject(function(_$rootScope_, _$controller_, $templateCache, _$compile_) {
      $rootScope = _$rootScope_;
      $controller = _$controller_;
      $compile = _$compile_;
      template = $templateCache.get('examples/TestElement/templateAs.html');
    });
    $scope = $rootScope.$new();
    templateController = $controller('templateController', {
      $scope: $scope,
    });
    $scope.vm = templateController;
    element = angular.element(template);
    $compile(element)($scope);
    $scope.$digest();
  });

  it('should not be null', function() {
    expect(templateController).toBeTruthy();
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
      expect(templateController.someArray[3].id).toBe(4);
    });
  });
});

