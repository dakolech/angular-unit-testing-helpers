import { TestDummy } from '../../index.d';

const filter = TestDummy.filter;
const filteredNumber: number = filter(123);
const filteredString: string = filter('123');

const directive = TestDummy.directive;

const restrict: string = directive[0].restrict;
