'use strict';

describe('Service: frequencyService', function () {

  // load the service's module
  beforeEach(module('mealPlannerApp'));

  // instantiate service
  var frequencyService;
  beforeEach(inject(function (_frequencyService_) {
    frequencyService = _frequencyService_;
  }));

  it('should do something', function () {
    expect(!!frequencyService).toBe(true);
  });

});
