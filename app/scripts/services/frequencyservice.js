'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.frequencyService
 * @description
 * # frequencyService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('frequencyService', function () {
    return {
      _pool: [
        { numOfWks: 1, description: '1 Week' },
        { numOfWks: 2, description: '2 Week' },
        { numOfWks: 3, description: '3 Week' },
        { numOfWks: 4, description: '1 Month' },
        { numOfWks: 6, description: '6 Weeks' },
        { numOfWks: 8, description: '2 Months' },
        { numOfWks: 12, description: '3 Months' }
      ],
      // Public API here
      getAll: function () {
        return this._pool;
      },
      getFrequencyDescription: function(numOfWks) {
        for (var i = 0; i < this._pool.length; i++) {
          if (this._pool.get(i).numOfWks == numOfWks) {
            return this._pool.get(i).description;
          }
        }
        return null;
      }
    };
  });
