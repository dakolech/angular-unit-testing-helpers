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
.module('ctrlTemplateWithTE', [])
.controller('templateController', templateController);


describe('templateController', function() {
  var
    element;

  beforeEach(module('ctrlTemplateWithTE'));
  beforeEach(module('templates'));

  beforeEach(function() {
    element = new TestElement();
    element.createCtrl('templateController');
    element.addTemplate('examples/TestElement/template.html');
  });

  it('should not be null', function() {
    expect(element).toBeTruthy();
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
      element.inputOn('.new-item', newVal).then(function() {
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

