'use strict';

describe('Controller: EditplanCtrl', function () {

  // load the controller's module
  beforeEach(module('mealPlannerApp'));

  var EditplanCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditplanCtrl = $controller('EditplanCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
