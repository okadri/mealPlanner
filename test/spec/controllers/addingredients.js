'use strict';

describe('Controller: AddingredientsCtrl', function () {

  // load the controller's module
  beforeEach(module('mealPlannerApp'));

  var AddingredientsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AddingredientsCtrl = $controller('AddingredientsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
