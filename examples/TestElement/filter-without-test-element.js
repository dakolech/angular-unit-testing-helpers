function percentageFilter() {
  return function(dividend, divider) {
    if (!divider || isNaN(dividend) || isNaN(divider)) {
      return '- %'
    } else {
      var returnedValue = dividend / divider * 100;
      return returnedValue.toFixed(2) + '%';
    }
  };
}

angular.module('filterWithoutTE', [])
.filter('percentage', percentageFilter);

describe('Filters: percentage', function() {
  var $filter, percentageFilter;

  beforeEach(function() {
    module('filterWithoutTE');
  });

  beforeEach(function() {
    inject(function(_$filter_) {
      $filter = _$filter_;
      percentageFilter = $filter('percentage')
    });
  });

 it('should return "- %" when there is no divider', function() {
    expect(percentageFilter(23)).toEqual('- %');
  });

  it('should return "- %" when dividend isNaN', function() {
    expect(percentageFilter('Not a Number', 1)).toEqual('- %');
  });

  it('should return "- %" when diver isNaN', function() {
    expect(percentageFilter(3, 'Not a Number')).toEqual('- %');
  });

  it('should return "66.6 %" when dividend = 2 and divider = 3', function() {
    expect(percentageFilter(2, 3)).toEqual('66.67%');
  });
});
