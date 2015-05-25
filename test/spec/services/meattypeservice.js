'use strict';

describe('Service: meatTypeService', function () {

  // load the service's module
  beforeEach(module('mealPlannerApp'));

  // instantiate service
  var meatTypeService;
  beforeEach(inject(function (_meatTypeService_) {
    meatTypeService = _meatTypeService_;
  }));

  it('should do something', function () {
    expect(!!meatTypeService).toBe(true);
  });

});
