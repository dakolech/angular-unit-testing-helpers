function someDirective() {
  var directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'examples/TestElement/template.html',
    scope: {
      someArray: '='
    },
    link: function(scope) {
      scope.addToArray = function(name) {
        var item = {};
        item.id = scope.someArray.length + 1;
        item.name = name;
        scope.someArray.push(item);
      };
    }
  };
  return directive;
}

angular
.module('directiveLinkWithoutTE', [])
.directive('someDirective', someDirective);


describe('someDirective', function() {
  var
    element, directiveController, $compile, $rootScope, $scope,
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

  beforeEach(module('directiveLinkWithoutTE'));
  beforeEach(module('templates'));

  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope;
      $scope.namesArray = angular.copy(namesArray);
      element = angular.element('<some-directive some-array="namesArray"></some-directive>');
      $compile(element)($scope);
      angular.element(document.body).append(element);
      $scope.$apply();
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
      angular.element(element[0].querySelectorAll('input')[1]).val(newVal).triggerHandler('input');
      element[0].querySelector('button').click();
      $scope.$digest();
    });

    it('should add new element to array', function() {
      expect(element.find('span').length).toBe(4);
      expect(element.html()).toContain(newVal);
      expect($scope.namesArray[3].id).toBe(4);
    });
  });
});

