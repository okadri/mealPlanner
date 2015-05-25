'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.meatTypeService
 * @description
 * # meatTypeService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('meatTypeService', function () {
    return {
      _pool: [
        { id: 0, name: 'vegetarien' },
        { id: 1, name: 'Fish' },
        { id: 2, name: 'Chicken' },
        { id: 3, name: 'Lamb' },
        { id: 4, name: 'Beef' }
      ],
      // Public API here
      getAll: function () {
        return this._pool;
      },
      getMeatName: function(id) {
        for (var i = 0; i < this._pool.length; i++) {
          if (this._pool.get(i).id == id) {
            return this._pool.get(i).name;
          }
        }
        return null;
      }
    };
  });
