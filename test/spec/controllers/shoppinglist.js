'use strict';

describe('Controller: ShoppinglistCtrl', function () {

  // load the controller's module
  beforeEach(module('mealPlannerApp'));

  var ShoppinglistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ShoppinglistCtrl = $controller('ShoppinglistCtrl', {
      $scope: scope
    });
  }));

});
