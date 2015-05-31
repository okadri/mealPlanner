'use strict';

describe('Service: shoppingListService', function () {

  // load the service's module
  beforeEach(module('mealPlannerApp'));

  // instantiate service
  var shoppingListService;
  beforeEach(inject(function (_shoppingListService_) {
    shoppingListService = _shoppingListService_;
  }));

  it('should do something', function () {
    expect(!!shoppingListService).toBe(true);
  });

});
