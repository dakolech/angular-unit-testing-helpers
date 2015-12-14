angular.module('dependenciesWithTM', ['common', 'ui.router']);

describe('dependencies', function() {
  var dependenciesModule;

  beforeEach(function() {
    dependenciesModule = new TestModule('dependenciesWithTM');
  });

  it('should be registered', function() {
    expect(dependenciesModule).toBeTruthy();
  });

  it('should have ui.router as a dependency', function() {
    expect(dependenciesModule.hasModule('ui.router')).toEqual(true);
  });

  it('should have common as a dependency', function() {
    expect(dependenciesModule.hasModule('common')).toEqual(true);
  });

  it('should not have someModule as a dependency', function() {
    expect(dependenciesModule.hasModule('someModule')).toEqual(false);
  });
});
