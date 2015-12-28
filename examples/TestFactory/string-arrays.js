TestFactory.defineSequence('nameOfTheUser', function(value) {
  return 'Name ' + value;
});

TestFactory.define('userString', TestFactory.sequence('nameOfTheUser'));

describe('TestFactory sequences', function() {
  describe('create one', function() {
    it('should return "Name 1"', function() {
      expect(TestFactory.create('userString')).toBe('Name 1');
    });
  });

  describe('create list', function() {
    beforeEach(function() {
      TestFactory.sequence('nameOfTheUser').clear();
    });

    it('should return array with 3 correct names', function() {
      expect(TestFactory.createList('userString', 3)).toEqual([
        'Name 1',
        'Name 2',
        'Name 3'
      ]);
    });
  });
});
