import { TestModule } from '../../index.d';

const customModule = new TestModule('moduleName');

const isTrue: boolean = customModule.hasModule('anotherModule');
