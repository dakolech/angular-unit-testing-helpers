import './typings/globals/angular/index.d.ts';

interface TestServInterface {
  new(serviceName: string): TestServInstance;
  new(): any;
}

interface TestServInstance {
  addPromise(name: string): TestServInstance;
  addMethod(name: string): TestServInstance;
  addProperty(name: string): TestServInstance;
}

export var TestServ: TestServInterface;


interface ControllerInstance {}

interface createDirComp {
    (name: string, html: string, scope: any): JQuery;
}

interface TestElementInterface {
  new(): TestElementInstance;
}

export interface DummyPromiseInterface {
    then(fn: Function): void;
}

interface TestElementInstance {
  $originalScope: ng.IScope;
  $compile: ng.ICompileService;
  $timeout: ng.ITimeoutService;
  $controller: ng.IControllerService;
  $templateCache: ng.ITemplateCacheService;
  $filter: ng.IFilterService;

  name: string;
  createCtrl(name: string, services?: any): ControllerInstance;
  addTemplate(path: string, ctrlAs?: string): ng.IAugmentedJQuery;
  createDirective: createDirComp;
  createComponent: createDirComp;
  createFilter(name: string): ng.IFilterService;

  scope: ng.IScope;
  ctrl: any;
  dom: ng.IAugmentedJQuery;
  find(selector: string): ng.IAugmentedJQuery;
  findAll(selector: string): ng.IAugmentedJQuery[];
  destroy(): void;
  clickOn(selector: string): DummyPromiseInterface;
  inputOn(selector: string, value: any, which?: number): DummyPromiseInterface;
  _getFlushedThenable(): DummyPromiseInterface;
}

export var TestElement: TestElementInterface;

interface DummyFilter {
  <T>(input: T): T;
}

interface DummyDirective {
    restrict: string;
}

interface TestDummyInterface {
  filter: DummyFilter;
  directive: DummyDirective[]
}

export var TestDummy: TestDummyInterface;

interface TestModuleInterface {
  new(name: string): ng.IModule;
  hasModule(name: string): boolean;
}

export var TestModule: TestModuleInterface;

interface SequenceInterface {
    (): any;
    clear(): void;
}

interface TestFactoryInterface {
  define(name: string, attributes: any): void;
  create(name: string, attributes: any): any;
  createList(name: string, number: number, attributes: any): any[];
  defineSequence(name: string, argOne: any, argTwo: any): void;
  sequence(name: string): SequenceInterface;
}

export var TestFactory: TestFactoryInterface;
