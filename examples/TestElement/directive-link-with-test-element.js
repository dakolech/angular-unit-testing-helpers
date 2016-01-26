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
.module('directiveLinkWithTE', [])
.directive('someDirective', someDirective);


describe('someDirective', function() {
  var
    element, $compile, $rootScope, $scope,
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

  beforeEach(module('directiveLinkWithTE'));
  beforeEach(module('templates'));

  beforeEach(function() {
    element = new TestElement();
    element.createDirective('someDirective', '<some-directive some-array="namesArray"></some-directive>', {
      namesArray: namesArray
    });
  });

  it('should not be null', function() {
    expect(element.dom).toBeTruthy();
  });

  it('should show 3 span elements', function() {
    expect(element.findAll('span').length).toBe(3);
  });

  describe('button', function() {
    it('should have .button class', function() {
      expect(element.find('button').hasClass('button')).toBeTruthy();
    });
  });

  describe('Add new item', function() {
    var newVal = 'newName';

    beforeEach(function() {
      element.inputOn('.new-item', newVal, 1).then(function() {
        element.clickOn('.button');
      });
    });

    it('should add new element to array', function() {
      expect(element.findAll('span').length).toBe(4);
      expect(element.dom.text()).toContain(newVal);
      expect(element.scope.someArray[3].id).toBe(4);
    });
  });
});

