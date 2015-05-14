'use strict';

describe('Service: mealService', function () {

  // load the service's module
  beforeEach(module('dinnerPlannerApp'));

  // instantiate service
  var mealService;
  beforeEach(inject(function (_mealService_) {
    mealService = _mealService_;
  }));

  it('should do something', function () {
    expect(!!mealService).toBe(true);
  });

});
