import { TestElement } from '../../index.d';

const element = new TestElement();

element.$originalScope.$apply();
element.$originalScope.$destroy();
element.$originalScope.$emit('someEvent');

element.scope.$apply();
element.scope.$destroy();
element.scope.$emit('someEvent');

element.$compile.$inject;
element.$compile('someElement')(element.scope);

element.$timeout(123, true).then(() => {}, () => {});
element.$timeout(() => {}, 456, false).then(() => {});
element.$timeout.cancel();
element.$timeout.flush();
element.$timeout.verifyNoPendingTasks();

element.$controller.$inject;
element.$controller('name', {});

element.$templateCache.get('template');
element.$templateCache.put('newTemplate', 'ass');

element.$filter('filter');
element.$filter.$inject;

element.name;

interface SomeController {
    property: string;
    method(arg: string): void;
}

let controller: SomeController = element.createCtrl<SomeController>('name', 'ctrlAs');
controller = element.createCtrl<SomeController>('name');
controller.property;
controller.method('argument');

controller = element.ctrl;
controller.property;
controller.method('argument');

let template = element.addTemplate('path');
template = element.addTemplate('path', 'ctrlAs');
template.children('selector');
template.find('selector');

let directive = element.createDirective('name', '<html string>', {
    scope: null
});
directive.children('selector');
directive.find('selector');

let component = element.createComponent('name', '<html string>', {
    scope: null
});
component.children('selector');
component.find('selector');

interface SomeFilter {
    (arg1: string, arg2: number): string;
}

let filter: SomeFilter = element.createFilter<SomeFilter>('filter');
const filterValue: string = filter('arg1', 2);

element.dom.children('selector');
element.dom.find('selector');

element.find('selector').children('selector2');
element.findAll('selector')[0].children('selector2');

element.destroy();

element.clickOn('selector').then(() => {});

element.inputOn('selector', 1234).then(() => {});
element.inputOn('selector', 1234, 1).then(() => {});

element._getFlushedThenable().then(() => {});
