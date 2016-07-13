import { TestFactory } from '../../index.d';

TestFactory.define('users', {
    attr1: true,
    attr2: false
});

interface UserInterface {
    name: string;
}

let newUser: UserInterface = TestFactory.create<UserInterface>('users');
newUser = TestFactory.create<UserInterface>('users', {
    name: 'string'
});
const userName: string = newUser.name;

let newUsers: UserInterface[] = TestFactory.createList<UserInterface>('users', 2);
newUsers = TestFactory.createList<UserInterface>('users', 3, {
    name: 'string'
});
const secondUserName: string = newUsers[1].name;

TestFactory.defineSequence('simpleSeq');
TestFactory.defineSequence('seqWithIterator', 4);
TestFactory.defineSequence('seqWithFunction', function(value) {
    return 'Name ' + value;
});
TestFactory.defineSequence('seqWithFunctionAndIterator', function(value) {
    const copyValue: number = value;
    return 'Age ' + copyValue;
}, 5);
TestFactory.defineSequence('seqWithFunctionAndIterator', function(value) {
    const copyValue: string = value;
    return 'Age ' + copyValue;
}, '123');

TestFactory.sequence('simpleSeq')();
TestFactory.sequence('simpleSeq')();
TestFactory.sequence('simpleSeq').clear();
