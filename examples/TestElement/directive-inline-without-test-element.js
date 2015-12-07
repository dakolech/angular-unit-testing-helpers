function specialChars() {
  var directive = {
    restrict: 'A',
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
      var specialCharsRegex = new RegExp('[!@#$%^&*()_+]+');

      ngModel.$parsers.unshift(function(viewValue) {
        ngModel.$setValidity('specialChars', !specialCharsRegex.test(viewValue));
        return viewValue;
      });
    }
  };
  return directive;
}

angular
.module('directiveInlineWithoutTE', [])
.directive('specialChars', specialChars);


describe('Directive: specialChars', function() {
  var $compile, element, $rootScope, $scope;

  beforeEach(module('directiveInlineWithoutTE'));

  $compile = {};
  $rootScope = {};
  element = {};
  $scope = {};

  beforeEach(function() {
    inject(function(_$compile_, _$rootScope_) {
      $compile = _$compile_;
      $rootScope = _$rootScope_;
      $scope = $rootScope;
      $scope.someValue = '';
      element = angular.element('<input ng-model="someValue" special-chars>');
      $compile(element)($scope);
      angular.element(document.body).append(element);
      $scope.$apply();
    });
  });

  it('should compile', function() {
    expect(element).toBeTruthy();
  });

  it('should not add ng-invalid-special-chars class when empty', function() {
    expect(element.hasClass('ng-invalid-special-chars')).toBeFalsy();
  });

  it('should add ng-valid-special-chars class when value doesn\'t contain special chars', function() {
    angular.element(element[0]).val('asd').triggerHandler('input');
    expect(element.hasClass('ng-valid-special-chars')).toBeTruthy();
    expect(element.hasClass('ng-invalid-special-chars')).toBeFalsy();
  });

  it('should add ng-invalid-special-chars class when value contains special chars', function() {
    angular.element(element[0]).val('@#').triggerHandler('input');
    expect(element.hasClass('ng-invalid-special-chars')).toBeTruthy();
    expect(element.hasClass('ng-valid-special-chars')).toBeFalsy();
  });
});
