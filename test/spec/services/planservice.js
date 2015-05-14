'use strict';

describe('Service: planService', function () {

  // load the service's module
  beforeEach(module('dinnerPlannerApp'));

  // instantiate service
  var planService;
  beforeEach(inject(function (_planService_) {
    planService = _planService_;
  }));

  it('should do something', function () {
    expect(!!planService).toBe(true);
  });

});
