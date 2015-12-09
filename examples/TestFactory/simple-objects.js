var defaultProperties = {
  name: 'someName',
  id: 123,
  pet: {
    type: 'cat',
    name: 'Tom'
  },
  friends: ['Neo', 'Trinity', 'Morfeus']
};

TestFactory.define('user', defaultProperties);

describe('TestFactory', function() {
  describe('single object with default properties', function() {
    var user;
    beforeEach(function() {
      user = TestFactory.create('user');
    });

    it('should create user with default properties', function() {
      expect(user).toEqual(defaultProperties);
    });

    it('should be copy', function() {
      expect(user).not.toBe(defaultProperties);
    });
  });

  describe('single object without default properties', function() {
    var user, newProperties = {
      name: 'John',
      pet: {
        name: 'Jerry',
        type: 'mouse'
      }
    };
    beforeEach(function() {
      user = TestFactory.create('user', newProperties);
    });

    it('should create user with new properties', function() {
      expect(user.name).toEqual(newProperties.name);
      expect(user.pet).toEqual(newProperties.pet);
      expect(user.id).toEqual(defaultProperties.id);
      expect(user.friends).toEqual(defaultProperties.friends);
    });

    it('should be copy', function() {
      expect(user).not.toBe(defaultProperties);
      expect(user).not.toBe(newProperties);
    });
  });

  describe('collection with default properties', function() {
    var users;
    beforeEach(function() {
      users = TestFactory.createList('user', 3);
    });

    it('should create users collection with default properties', function() {
      expect(users.length).toBe(3);
      expect(users[0]).toEqual(defaultProperties);
      expect(users[1]).toEqual(defaultProperties);
      expect(users[2]).toEqual(defaultProperties);
    });

    it('should be copy', function() {
      expect(users[0]).not.toBe(defaultProperties);
      expect(users[1]).not.toBe(defaultProperties);
      expect(users[2]).not.toBe(defaultProperties);
    });
  });

  describe('collection without default properties', function() {
    var users, newProperties = {
      name: 'John',
      pet: {
        name: 'Jerry',
        type: 'mouse'
      }
    };
    beforeEach(function() {
      users = TestFactory.createList('user', 3, newProperties);
    });

    it('should create users collection with new properties', function() {
      expect(users.length).toBe(3);
      expect(users[0].name).toEqual(newProperties.name);
      expect(users[0].pet).toEqual(newProperties.pet);
      expect(users[0].id).toEqual(defaultProperties.id);
      expect(users[0].friends).toEqual(defaultProperties.friends);
    });

    it('should be copy', function() {
      expect(users[0]).not.toBe(defaultProperties);
      expect(users[0]).not.toBe(newProperties);
    });
  });
});

