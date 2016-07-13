import { TestServ, TestServPromise } from '../../index.d';

const scope = new TestServ();
scope.$digest();
scope.$apply();

interface someInterface {
    attr: boolean;
}

const someObject: someInterface = {
    attr: true
};

const mockedService = new TestServ('mockedService');

mockedService.addMethod('addString', 'string');
mockedService.addMethod('addNumer', 123);
mockedService.addMethod('addFunction', (val) => val);

mockedService.addPromise('somePromise');

mockedService.addProperty('addString', 'string');
mockedService.addProperty('addNumer', 123);
mockedService.addProperty('addObject', someObject);
mockedService.addProperty('addFunction', (val) => val);

mockedService.addProperty('addNumer', 123).addMethod('addFunction', (val) => val).addPromise('somePromise');

mockedService['addString'].toHaveBeenCalled();

mockedService.get<TestServPromise>('somePromise').success(123);
mockedService.get<TestServPromise>('somePromise').fail('string');

mockedService.get<someInterface>('addObject').attr;
