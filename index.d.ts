/// <reference path="typings/globals/jquery/index.d.ts" />
/// <reference path="typings/globals/angular/index.d.ts" />
/// <reference path="typings/globals/angular-mocks/index.d.ts" />

interface TestServInterface {
  new(serviceName: string): TestServInstance;
  new(): any;
}

export interface TestServPromise {
    success(arg?: any): any;
    fail(arg?: any): any;
}

interface TestServInstance {
  addPromise(name: string): TestServInstance;
  addMethod(name: string, returnedValue: any): TestServInstance;
  addMethod<T>(name: string, fn: (...args: any[]) => T): TestServInstance;
  addProperty(name: string, returnedValue: any): TestServInstance;
  get<T>(name: string): T;
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
  createCtrl<T>(name: string, services?: any): T;
  addTemplate(path: string, ctrlAs?: string): ng.IAugmentedJQuery;
  createDirective: createDirComp;
  createComponent: createDirComp;
  createFilter<T>(name: string): T;

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

interface TestModuleInstance {
  hasModule(name: string): boolean;
}

interface TestModuleInterface {
  new(name: string): TestModuleInstance;
}

export var TestModule: TestModuleInterface;

interface SequenceInterface {
    (): any;
    clear(): void;
}

interface TestFactoryInterface {
  define(name: string, attributes: any): void;
  create<T>(name: string, attributes?: T): T;
  createList<T>(name: string, number: number, attributes?: any): T[];
  defineSequence(name: string): void;
  defineSequence(name: string, argOne: number): void;
  defineSequence(name: string, argOne: Function): void;
  defineSequence<T>(name: string, argOne: (arg: T) => any, argTwo: T): void;
  sequence(name: string): SequenceInterface;
}

export var TestFactory: TestFactoryInterface;
