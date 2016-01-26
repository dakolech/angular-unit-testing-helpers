function someDirective() {
  var directive = {
    restrict: 'E',
    replace: true,
    templateUrl: 'examples/TestElement/templateAs.html',
    scope: true,
    bindToController: {
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
  return directive;
}

angular
.module('directiveCtrlAsWithTE', [])
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

  beforeEach(module('directiveCtrlAsWithTE'));
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

  it('second span should have class1 class', function() {
    expect(element.findAll('span')[1].hasClass('class1')).toBeTruthy();
  });

  describe('button', function() {
    it('should have .button class', function() {
      expect(element.find('button').hasClass('button')).toBeTruthy();
    });
  });

  describe('Add new item', function() {
    var newVal = 'newName';

    beforeEach(function() {
      element.inputOn('.new-item', newVal).then(function() {
        element.clickOn('.button');
      });
    });

    it('should add new element to array', function() {
      expect(element.findAll('span').length).toBe(4);
      expect(element.dom.text()).toContain(newVal);
      expect(element.ctrl.someArray[3].id).toBe(4);
    });
  });
});

