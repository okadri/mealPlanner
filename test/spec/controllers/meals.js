'use strict';

describe('Controller: MealsCtrl', function () {

  // load the controller's module
  beforeEach(module('mealPlannerApp'));

  var MealsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MealsCtrl = $controller('MealsCtrl', {
      $scope: scope
    });
  }));

});
