'use strict';

describe('Controller: EditmealCtrl', function () {

  // load the controller's module
  beforeEach(module('mealPlannerApp'));

  var EditmealCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EditmealCtrl = $controller('EditmealCtrl', {
      $scope: scope
    });
  }));

});
