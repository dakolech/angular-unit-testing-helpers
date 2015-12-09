TestFactory.defineSequence('userId');
TestFactory.defineSequence('userAge', 2);
TestFactory.defineSequence('userName', function(value) {
  return 'Name ' + value;
});

var defaultProperties = {
  name: TestFactory.sequence('userName'),
  id: TestFactory.sequence('userId'),
  age: TestFactory.sequence('userAge'),
};

TestFactory.define('userSeq', defaultProperties);

describe('TestFactory sequences', function() {
  describe('objects', function() {
    var users = [
      TestFactory.create('userSeq', { name: 'someName' }),
      TestFactory.create('userSeq', { id: 123 }),
      TestFactory.create('userSeq', { age: 99 })
    ];

    it('should create proper first user', function() {
      expect(users[0]).toEqual({
        name: 'someName',
        id: 1,
        age: 2
      });
    });

    it('should create proper second user', function() {
      expect(users[1]).toEqual({
        name: 'Name 1',
        id: 123,
        age: 4
      });
    });

    it('should create proper third user', function() {
      expect(users[2]).toEqual({
        name: 'Name 2',
        id: 2,
        age: 99
      });
    });
  });

  describe('collections', function() {
    var users;

    beforeEach(function() {
      users = TestFactory.createList('userSeq', 3);
    });

    it('should create users collection with proper ids', function() {
      expect(users[0].id).toEqual(1);
      expect(users[1].id).toEqual(2);
      expect(users[2].id).toEqual(3);
    });

    it('should create users collection with proper ages', function() {
      expect(users[0].age).toEqual(2);
      expect(users[1].age).toEqual(4);
      expect(users[2].age).toEqual(6);
    });

    it('should create users collection with proper ids', function() {
      expect(users[0].name).toEqual('Name ' + 1);
      expect(users[1].name).toEqual('Name ' + 2);
      expect(users[2].name).toEqual('Name ' + 3);
    });
  });
});

