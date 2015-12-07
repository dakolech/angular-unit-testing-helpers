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
.module('directiveInlineWithTE', [])
.directive('specialChars', specialChars);


describe('Directive: specialChars', function() {
  var element;

  beforeEach(module('directiveInlineWithTE'));

  beforeEach(function() {
    element = new TestElement();
    element.createDirective('specialChars', '<input ng-model="someValue" special-chars>', {
      someValue: ''
    });
  });

  it('should compile', function() {
    expect(element.dom).toBeTruthy();
  });

  it('should not add ng-invalid-special-chars class when empty', function() {
    expect(element.dom.hasClass('ng-invalid-special-chars')).toBeFalsy();
  });

  it('should add ng-valid-special-chars class when value doesn\'t contain special chars', function() {
    element.inputOn('input', 'asd')
    expect(element.scope.someValue).toBe('asd');
    expect(element.dom.hasClass('ng-valid-special-chars')).toBeTruthy();
    expect(element.dom.hasClass('ng-invalid-special-chars')).toBeFalsy();
  });

  it('should add ng-invalid-special-chars class when value contains special chars', function() {
    element.inputOn('input', '@#');
    expect(element.scope.someValue).toBe('@#');
    expect(element.dom.hasClass('ng-invalid-special-chars')).toBeTruthy();
    expect(element.dom.hasClass('ng-valid-special-chars')).toBeFalsy();
  });
});
