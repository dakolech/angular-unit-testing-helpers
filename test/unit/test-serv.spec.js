describe('TestServ: ', function() {
  describe('inject real service', function() {
    var
      serviceName = 'someName',
      nameInInject,
      realService = {
        some: 'property'
      },
      someService;

    beforeEach(function() {
      spyOn(window, 'inject').and.callFake(function(array) {
        nameInInject = array[0];
        array[1](realService);
      });
      someService = new TestServ(serviceName);
    });

    it('should call inject method', function() {
      expect(window.inject).toHaveBeenCalledWith([serviceName, jasmine.any(Function)]);
    });

    it('should return real service from inject method', function() {
      expect(someService).toBe(realService);
    });
  });
});
