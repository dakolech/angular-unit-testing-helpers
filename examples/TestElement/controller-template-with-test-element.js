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
.module('someAnotherApp', [])
.controller('templateController', templateController);


describe('templateController', function() {
  var
    element;

  beforeEach(module('someAnotherApp'));
  beforeEach(module('templates'));

  beforeEach(function() {
    element = new TestElement();
    element.createCtrl('templateController');
    element.addTemplate('examples/TestElement/template.html', 'vm');
  });

  it('should not be null', function() {
    expect(element).toBeTruthy();
  });

  it('should show 3 span elements', function() {
    expect(element.dom.find('span').length).toBe(3);
  });

  describe('Add new item', function() {
    var newVal = 'newName';

    beforeEach(function() {
      element.inputOn('.new-item', newVal).then(function() {
        element.clickOn('.button');
      });
    });

    it('should add new element to array', function() {
      expect(element.dom.find('span').length).toBe(4);
      expect(element.dom.text()).toContain(newVal);
      expect(element.ctrl.someArray[3].id).toBe(4);
    });
  });
});

