angular.module('dependenciesWithoutTM', ['common', 'ui.router']);

describe('dependencies', function() {
  var deps, hasModule, module;

  hasModule = function(name) {
    return deps.indexOf(name) >= 0;
  };

  beforeEach(function() {
    module = angular.module('dependenciesWithoutTM');
    deps = module.value('dependenciesWithoutTM').requires;
  });

  it('should be registered', function() {
    expect(module).toBeTruthy();
  });

  it('should have ui.router as a dependency', function() {
    expect(hasModule('ui.router')).toEqual(true);
  });

  it('should have common as a dependency', function() {
    expect(hasModule('common')).toEqual(true);
  });

  it('should not have someModule as a dependency', function() {
    expect(hasModule('someModule')).toEqual(false);
  });
});
