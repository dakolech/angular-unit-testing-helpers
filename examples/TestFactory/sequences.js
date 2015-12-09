TestFactory.defineSequence('simpleSeq');
TestFactory.defineSequence('seqWithIterator', 4);
TestFactory.defineSequence('seqWithFunction', function(value) {
  return 'Name ' + value;
});
TestFactory.defineSequence('seqWithFunctionAndIterator', function(value) {
  return 'Age ' + value;
}, 5);
TestFactory.defineSequence('clearingSeq');

describe('Simple sequence', function() {
  it('should be 1 at the beginning', function() {
    expect(TestFactory.sequence('simpleSeq')()).toBe(1);
  });

  it('should be 2 at second call', function() {
    expect(TestFactory.sequence('simpleSeq')()).toBe(2);
  });

  describe('call sequence 5 more times', function() {
    var seqValue;
    beforeEach(function() {
      for (var i = 0; i < 5; i++) {
        seqValue = TestFactory.sequence('simpleSeq')();
      };
    });

    it('should be 7', function() {
      expect(seqValue).toBe(7);
    });
  });
});

describe('Sequence with Iterator', function() {
  it('should be 4 at the beginning', function() {
    expect(TestFactory.sequence('seqWithIterator')()).toBe(4);
  });

  it('should be 8 at second call', function() {
    expect(TestFactory.sequence('seqWithIterator')()).toBe(8);
  });

  describe('call sequence 5 more times', function() {
    var seqValue;
    beforeEach(function() {
      for (var i = 0; i < 5; i++) {
        seqValue = TestFactory.sequence('seqWithIterator')();
      };
    });

    it('should be 28', function() {
      expect(seqValue).toBe(28);
    });
  });
});

describe('Sequence with Function', function() {
  it('should be 1 at the beginning', function() {
    expect(TestFactory.sequence('seqWithFunction')()).toBe('Name ' + 1);
  });

  it('should be 2 at second call', function() {
    expect(TestFactory.sequence('seqWithFunction')()).toBe('Name ' + 2);
  });

  describe('call sequence 5 more times', function() {
    var seqValue;
    beforeEach(function() {
      for (var i = 0; i < 5; i++) {
        seqValue = TestFactory.sequence('seqWithFunction')();
      };
    });

    it('should be 7', function() {
      expect(seqValue).toBe('Name ' + 7);
    });
  });
});

describe('Sequence with Function and Iterator', function() {
  it('should be 5 at the beginning', function() {
    expect(TestFactory.sequence('seqWithFunctionAndIterator')()).toBe('Age ' + 5);
  });

  it('should be 10 at second call', function() {
    expect(TestFactory.sequence('seqWithFunctionAndIterator')()).toBe('Age ' + 10);
  });

  describe('call sequence 5 more times', function() {
    var seqValue;
    beforeEach(function() {
      for (var i = 0; i < 5; i++) {
        seqValue = TestFactory.sequence('seqWithFunctionAndIterator')();
      };
    });

    it('should be 35', function() {
      expect(seqValue).toBe('Age ' + 35);
    });
  });
});

describe('Clearing sequences', function() {
  var seqValue;
  beforeEach(function() {
    for (var i = 0; i < 5; i++) {
      seqValue = TestFactory.sequence('clearingSeq')();
    };
  });

  it('should be 5 after 5 calls', function() {
    expect(seqValue).toBe(5);
  });

  describe('clear sequence', function() {
    beforeEach(function() {
      TestFactory.sequence('clearingSeq').clear();
    });

    it('should be 1', function() {
      expect(TestFactory.sequence('clearingSeq')()).toBe(1);
    });
  });
});
