const TestHelpers = require('./test-helpers');

module.exports = {
    TestServ: TestHelpers.TestServ,
    TestElement: TestHelpers.TestElement,
    TestDummy: TestHelpers.TestDummy,
    TestFactory: TestHelpers.TestFactory,
    TestModule: TestHelpers.TestModule
};

if (typeof exports === 'object') {
  exports.TestServ = TestHelpers.TestServ;
  exports.TestElement = TestHelpers.TestElement;
  exports.TestDummy = TestHelpers.TestDummy;
  exports.TestFactory = TestHelpers.TestFactory;
  exports.TestModule = TestHelpers.TestModule;
}
