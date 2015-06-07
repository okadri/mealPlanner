'use strict';

var FIREBASE_URL = 'https://meal-planner.firebaseIO.com';

/**
 * @ngdoc overview
 * @name mealPlannerApp
 * @description
 * # mealPlannerApp
 *
 * Main module of the application.
 */
window.mealPlannerApp = angular
  .module('mealPlannerApp', [
    'ngAnimate',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ui.calendar',
    'firebase',
    'ui.bootstrap',
    'ngTagsInput'
  ]);

//Generates the $firebaseAuth instance
mealPlannerApp.factory('Auth', function ($firebaseAuth) {
  var ref = new Firebase(FIREBASE_URL);
  return $firebaseAuth(ref);
});

//redirects to homepage if $requireAuth rejects
mealPlannerApp.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/login");
    }
  });
}]);

mealPlannerApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
    		resolve: {
    			allPlans: MainCtrl.getAllPlans,
          allMeals: MainCtrl.getAllMeals,
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/meals', {
        templateUrl: 'views/meals.html',
        controller: 'MealsCtrl',
        resolve: {
    			allMeals: MealsCtrl.getAllMeals,
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/meals/:id', {
        templateUrl: 'views/editmeal.html',
        controller: 'EditmealCtrl',
        resolve: {
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/shoppingList', {
        templateUrl: 'views/shoppinglist.html',
        controller: 'ShoppinglistCtrl',
        resolve: {
          allMeals: ShoppinglistCtrl.getAllMeals,
    			allItems: ShoppinglistCtrl.getAllItems,
          currentAuth: function(Auth) {
            return Auth.$requireAuth();
          }
    		}
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        resolve: {
          currentAuth: function(Auth) {
            return Auth.$waitForAuth();
          }
        }
      })
      .otherwise({
        redirectTo: '/'
      });
  });

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MainCtrl',
  ['$scope', 'Auth', '$location', '$modal', 'planService', 'mealService', 'allPlans', 'allMeals',
  this.MainCtrl = function ($scope, Auth, $location, $modal, planService, mealService, allPlans, allMeals) {

    $scope.getSuggestions = function() {
      $scope.suggestions = planService.getSuggestions(allMeals);
    }
    $scope.getSuggestions();

    $scope.planSources = [
      {
        color: '#dff0d8',
        textColor: '#333',
        events: allPlans
      },{
        color: '#d9edf7',
        textColor: '#333',
        events: $scope.suggestions
      }
    ];

    $scope.startModal = function(date, plan) {
  		var modalInstance = $modal.open({
  			templateUrl: '/views/editplan.html',
        controller: EditplanCtrl,
  			resolve: {
          allMeals: EditplanCtrl.getAllMeals,
  				mealId: function () {
            if (!plan) return null;
  					return plan.mealId;
  				},
  				plan: function () {
            if (!plan) return null;
  					return plan;
  				}
  			}
  		});

  		modalInstance.result.then(function (meal) {
        var toBeSaved = planService.newPlan(meal, date, plan);

        planService.savePlan(toBeSaved);
  		});
  	};

    $scope.addIngredientsByDateRange = function (start, end) {
      var modalInstance = $modal.open({
  			templateUrl: '/views/addIngredients.html',
        controller: AddingredientsCtrl,
  			resolve: {
          ingredients: function() {
            return mealService.findIngredientsByDateRange(start,end);
          },
          shoppingItems: AddingredientsCtrl.getAllItems
  			}
  		});

  		modalInstance.result.then(function () {
        $location.path('/shoppingList');
  		});
    };

    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: false,
        selectable: true,
        timezone: 'local',
        header:{
          left: 'month agendaWeek',
          center: 'title',
          right: 'today prev,next'
        },
        dayClick: function(date, jsEvent, view){
          var plan = planService.findOneByDate(date);
          if (!plan) {
            $scope.startModal(date);
          }
        },
        select: function(startDate, endDate, allDay, jsEvent, view) {
          var plan = planService.findOneByDate(startDate);
          if (plan) {
            $scope.addIngredientsByDateRange(startDate, endDate);
          }
        },
        eventClick: function( event, jsEvent, view ) {
          var plan = planService.findOneByDate(event.start);
          if (plan) {
            // It's a plan, bring up the modal to edit
            $scope.startModal(event.start, event);
          } else {
            // It's a suggestion, confirm It
            var toBeSaved = planService.newPlan(event.meal, event.start, event);
            planService.savePlan(toBeSaved);
          }
        }
      }
    };
  }]);

MainCtrl.getAllPlans = function(planService) {
	return planService.getAll();
};
MainCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('AboutCtrl', ['$scope', this.AboutCtrl = function ($scope) {
  }]);

'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.planService
 * @description
 * # planService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('Plan', function() {
  	function Plan(planData) {
  		if (planData) {
  			this.setData(planData);
  		}
  	}
  	Plan.prototype = {
  			setData: function(planData) {
  				angular.extend(this, planData);
  			}
  	};
  	return Plan;
  })
  .factory('planService',
  ['$q', '$firebaseArray', 'Plan',
  function ($q, $firebaseArray, Plan) {
    return {
      _pool: null,
      _suggestions: [],
      _findById: function(arr, id) {
      	for(var el in arr) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(arr.hasOwnProperty(el)) {
      			if(arr[el].$id === id) {
              return arr[el];
            }
      		}
      	}

      	return undefined;
      },

      // Public methods
      getAll: function () {
        var deferred = $q.defer();
        var scope = this;

        var ref = new Firebase(FIREBASE_URL + '/plans');
        var query = ref.orderByChild("start").limitToLast(80);
        this._pool = $firebaseArray(query);
        this._pool.$loaded(function(plans){
          deferred.resolve(scope._pool);
        });

        return deferred.promise;
      },
      getOneById: function (id) {
        return this._findById(this._pool, id);
      },
      findOneByDate: function (date) {
        for(var el in this._pool) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(this._pool.hasOwnProperty(el)) {
      			if(this._pool[el].start === date.format('YYYY-MM-DD')) {
              return this._pool[el];
            }
      		}
      	}

      	return undefined;
      },
      savePlan: function (plan) {
        var deferred = $q.defer();
        var savedPlan;

        if (plan.$id) {
          savedPlan = this._pool.$save(plan);
        } else {
          savedPlan = this._pool.$add(plan);
        }

        this.deleteSuggestionByDate(moment(plan.start));

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      deletePlan: function (plan) {
        var instance = this.getOneById(plan.$id);
        this._pool.$remove(instance);
      },
      newPlan: function(meal,date, plan) {
        var toBeSaved = (plan && plan.$id) ? this.getOneById(plan.$id) : {};

        toBeSaved.title= meal.name;
        toBeSaved.mealId = meal.$id;
        toBeSaved.meal = meal;
        toBeSaved.start = date.format('YYYY-MM-DD');
        toBeSaved.stick = true

        return toBeSaved;
      },
      deleteSuggestionByDate: function (date) {
        for(var el in this._suggestions) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(this._suggestions.hasOwnProperty(el)) {
      			if(this._suggestions[el].start === date.format('YYYY-MM-DD')) {
              this._suggestions.splice(el,1);
            }
      		}
      	}

      	return undefined;
      },
      getSuggestions: function(allMeals) {
        var num = 10
        var rand, conflictingPlans;
        var today = moment();
        var dateWindow = moment();
        var scope = this;

        scope._suggestions.length = 0;
        while(allMeals.length > num && scope._suggestions.length < num) {
          rand = Math.floor(Math.random() * allMeals.length);
          dateWindow = moment();
          var foundConflict = false;

          angular.forEach(this._pool, function(p) {
            dateWindow = moment();
            dateWindow.add(
              scope._suggestions.length - allMeals[rand].frequency
              , 'week'
              ).format('YYYY-MM-DD');

            if (p.start > dateWindow.format('YYYY-MM-DD')
            && allMeals[rand].$id === p.mealId) {
              foundConflict = true;
            }
          });

          angular.forEach(scope._suggestions, function(p) {
            if (allMeals[rand].$id === p.mealId) {
              foundConflict = true;
            }
          });

          if ( (
            (scope._suggestions.length === 0 && this._pool[this._pool.length-1].meal.meatId !== allMeals[rand].meatId)
            ||
            (scope._suggestions.length > 0 && scope._suggestions[scope._suggestions.length-1].meal.meatId !== allMeals[rand].meatId)
          ) && !foundConflict ) {
            if (!scope.findOneByDate(today)) {
              scope._suggestions.push(
                scope.newPlan(
                  allMeals[rand],
                  today
                )
              );
            }
            today.add(1,'day');
          }
        }

        return scope._suggestions;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.mealService
 * @description
 * # mealService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('Meal', function() {
  	function Meal(mealData) {
  		if (mealData) {
  			this.setData(mealData);
  		}
  	}
  	Meal.prototype = {
  			setData: function(mealData) {
  				angular.extend(this, mealData);
  			}
  	};
  	return Meal;
  })
  .factory('mealService',
  ['$q', '$filter', '$firebaseArray', '$firebaseObject', 'Meal', 'planService',
  function ($q, $filter, $firebaseArray, $firebaseObject, Meal, planService) {
    return {
      _pool: [],
      _allIngredients: [],
      _findById: function(arr, id) {
      	for(var el in arr) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(arr.hasOwnProperty(el)) {
      			if(arr[el].$id === id) {
              return arr[el];
            }
      		}
      	}

      	return undefined;
      },

      // Public methods
      getAll: function () {
        var deferred = $q.defer();
        var scope = this;

        var ref = new Firebase(FIREBASE_URL + '/meals');
        this._pool = $firebaseArray(ref);
        this._pool.$loaded(function(meals){
          deferred.resolve(scope._pool);
        });

        return deferred.promise;
      },
      getOneById: function (id) {
        var meal;

        if (this._pool.length > 0) {
          meal = this._findById(this._pool, id);
        } else {
          var mealRef = new Firebase(FIREBASE_URL + '/meals/' + id);
          meal = $firebaseObject(mealRef);
        }

        return meal;
      },
      saveMeal: function (meal) {
        var deferred = $q.defer();
        var savedMeal;

        if (!meal.seasonal) {
          delete meal.startDate;
          delete meal.endDate;
        }

        if (meal.$id) {
          savedMeal = this._pool.$save(meal);
        } else {
          savedMeal = this._pool.$add(meal);
        }

        deferred.resolve(savedMeal);
        return deferred.promise;
      },
      deleteMeal: function (meal) {
        this._pool.$remove(meal);
      },
      getAllIngredients: function() {
        var scope = this;

        for(var i in scope._pool) {
          angular.forEach(scope._pool[i].ingredients, function(ingredient) {
            if (scope._allIngredients.indexOf(ingredient.text) < 0) {
              scope._allIngredients.push(ingredient.text);
            }
          });
        }

        return scope._allIngredients;
      },
      searchIngredients: function(q) {
        var deferred = $q.defer();

        // Update allIngredients
        this.getAllIngredients();

        var matchingIngredients = $filter('filter')(this._allIngredients, q);

        deferred.resolve(matchingIngredients);
        return deferred.promise;
      },
      findIngredientsByDateRange: function(start, end) {
        var deferred = $q.defer();
        var ingredients = [];

        for(var i=start; start.isBefore(end); start.add(1,'day')) {
          var plan = planService.findOneByDate(i);
          if (plan && plan.meal) {
            angular.forEach(plan.meal.ingredients, function(ingredient) {
              var ingredientsText = ingredients.map(function(e) { return e.text; });
              if (ingredientsText.indexOf(ingredient.text) < 0) {
                ingredients.push(ingredient);
              }
            });
          }
        }

        deferred.resolve(ingredients);
        return deferred.promise;
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditplanCtrl
 * @description
 * # EditplanCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditplanCtrl',
  ['$scope', '$modalInstance', 'mealService', 'planService', 'mealId', 'plan', 'allMeals',
  this.EditplanCtrl = function ($scope, $modalInstance, mealService, planService, mealId, plan, allMeals, meatTypeService) {
    $scope.allMeals = allMeals;
    $scope.mealId = mealId;
    $scope.meatTypes = meatTypeService.getAll();

    $scope.meal = mealService.getOneById(mealId)

    $scope.filterMeatType = function(meatId) {
      meatId = meatId.toString();
      if ($scope.selectedMeatType.meatId === meatId) {
        $scope.selectedMeatType = {};
      } else {
        $scope.selectedMeatType.meatId = meatId;
      }
    };

    $scope.setMeal = function() {
      $modalInstance.close($scope.meal);
    };

    $scope.deletePlan = function() {
      $scope.meal = $scope.mealId = null;
      planService.deletePlan(plan);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

  }]);

EditplanCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('MealsCtrl',
  ['$scope', '$modal', 'mealService', 'allMeals',
  this.MealsCtrl = function ($scope, $modal, mealService, allMeals) {
    $scope.allMeals = allMeals;

    $scope.editMeal = function(meal) {
      var modalInstance = $modal.open({
        templateUrl: '/views/editmeal.html',
        controller: EditmealCtrl,
        resolve: {
          meal: function () {
            return meal;
          },
          allIngredients: function() {
            return mealService.getAllIngredients();
          }
        }
      });

      modalInstance.result.then(function (meal) {
        mealService.saveMeal(meal);
      });
    };

    $scope.deleteMeal = function(meal) {
      mealService.deleteMeal(meal);
    };
  }]);

MealsCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:EditmealCtrl
 * @description
 * # EditmealCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('EditmealCtrl',
  ['$scope', '$modalInstance', 'mealService', 'meal', 'meatTypeService', 'frequencyService',
  this.EditmealCtrl = function ($scope, $modalInstance, mealService, meal, meatTypeService, frequencyService) {
    $scope.meal = meal || {};
    $scope.meatTypes = meatTypeService.getAll();
    $scope.frequencies = frequencyService.getAll();
    $scope.months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    $scope.saveMeal = function() {
      $modalInstance.close($scope.meal);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.queryIngredients = function(q) {
      return mealService.searchIngredients(q);
    }
  }]);

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:NavCtrl
 * @description
 * # NavCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('NavCtrl', ['$scope', '$location', function ($scope, $location) {
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
  }]);

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

'use strict';

/**
 * @ngdoc directive
 * @name mealPlannerApp.directive:confirm
 * @description
 * # confirm
 */
angular.module('mealPlannerApp')
  .directive('confirm', ['$document', function ($document) {
    return {
      restrict: 'A',
  		scope: {
  			confirmAction: '&confirm',
  		},
  		link: function (scope, element, attrs) {
  			var buttonId = Math.floor(Math.random() * 10000000000),
  			message = attrs.message || "Are you sure?",
  			yep = attrs.yes || "Yes",
  			nope = attrs.no || "No",
  			title = attrs.title || "Confirm",
  			btnClass = attrs.btnClass || "btn-danger",
  			placement = attrs.placement || "bottom";

  			var html = "<div id=\"button-" + buttonId + "\" style=\"position: relative; width: 250px;\">" +
  				"<p class=\"confirmbutton-msg\">" + message + "</p>" +
  				"<div align=\"center\">" +
  					"<button class=\"confirmbutton-yes btn " + btnClass + "\">" + yep + "</button> " +
  					"<button class=\"confirmbutton-no btn btn-default\">" + nope + "</button>" +
  				"</div>" +
  			"</div>";

  			element.popover({
  				content: html,
  				html: true,
  				trigger: "manual",
  				title: title,
  				placement: placement
  			});

  			element.bind('click', function(e) {
  				var dontBubble = true;
  				e.stopPropagation();

  				element.popover('show');

  				var pop = $("#button-" + buttonId);

  				pop.closest(".popover").click(function(e) {
  					if (dontBubble) {
  						e.stopPropagation();
  					}
  				});

  				pop.find('.confirmbutton-yes').click(function(e) {
  					e.stopPropagation();
  					dontBubble = false;
  					scope.$apply(scope.confirmAction);
  					element.popover('hide');
  				});

  				pop.find('.confirmbutton-no').click(function(e) {
  					e.stopPropagation();
  					dontBubble = false;
  					$document.off('click.confirmbutton.' + buttonId);
  					element.popover('hide');
  				});

  				$document.on('click.confirmbutton.' + buttonId, ":not(.popover, .popover *)", function() {
  					$document.off('click.confirmbutton.' + buttonId);
  					element.popover('hide');
  				});
  			});
  		}
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:AddingredientsCtrl
 * @description
 * # AddingredientsCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('AddingredientsCtrl',
  ['$scope', '$modalInstance', 'shoppingListService', 'ingredients', 'shoppingItems',
  this.AddingredientsCtrl = function ($scope, $modalInstance, shoppingListService, ingredients, shoppingItems) {
    $scope.ingredients = ingredients;

    $scope.addItems = function() {
      shoppingListService.addItems($scope.ingredients).then(function(){
        $modalInstance.close();
      });
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    $scope.deleteIngredient = function(ingredient) {
      var index = $scope.ingredients.indexOf(ingredient);
      $scope.ingredients.splice(index, 1);
    };
  }]);
AddingredientsCtrl.getAllItems = function(shoppingListService) {
  return shoppingListService.getAll();
};

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:ShoppinglistCtrl
 * @description
 * # ShoppinglistCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('ShoppinglistCtrl',
  ['$scope', 'allItems', 'allMeals', 'mealService', 'shoppingListService',
  this.ShoppinglistCtrl = function ($scope, allItems, allMeals, mealService, shoppingListService) {
    $scope.allItems = allItems;

    $scope.searchIngredients = function(q) {
      return mealService.searchIngredients(q);
    };

    $scope.addItem = function(item) {
      shoppingListService.addItem(item);
      $scope.newItem = '';
    };

    $scope.deleteItem = function(item) {
      shoppingListService.deleteItem(item);
    };
  }]);

ShoppinglistCtrl.getAllItems = function(shoppingListService) {
  return shoppingListService.getAll();
};
ShoppinglistCtrl.getAllMeals = function(mealService) {
	return mealService.getAll();
};

'use strict';

/**
 * @ngdoc service
 * @name mealPlannerApp.shoppingListService
 * @description
 * # shoppingListService
 * Factory in the mealPlannerApp.
 */
angular.module('mealPlannerApp')
  .factory('shoppingListService',
  ['$q', '$firebaseArray',
  this.shoppingListService = function ($q, $firebaseArray) {
    return {
      _pool: null,
      _findById: function(arr, id) {
      	for(var el in arr) {
      		// hasOwnProperty ensures prototypes aren't considered
      		if(arr.hasOwnProperty(el)) {
      			if(arr[el].$id === id) {
              return arr[el];
            }
      		}
      	}

      	return undefined;
      },

      // Public methods
      getAll: function () {
        var deferred = $q.defer();

        var ref = new Firebase(FIREBASE_URL + '/shoppingItems');
        this._pool = $firebaseArray(ref);

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      addItems: function (items) {
        var deferred = $q.defer();

        for (var i in items) {
          this.addItem(items[i].text);
        }

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      addItem: function (item) {
        var deferred = $q.defer();

        var ingredientsText = this._pool.map(function(e) { return e.$value; });
        if (ingredientsText.indexOf(item) < 0) {
          this._pool.$add(item);
        }

        deferred.resolve(this._pool);
        return deferred.promise;
      },
      getOneById: function (id) {
        return this._findById(this._pool, id);
      },
      deleteItem: function (item) {
        var instance = this.getOneById(item.$id);
        this._pool.$remove(instance);
      }
    };
  }]);

'use strict';

/**
 * @ngdoc function
 * @name mealPlannerApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the mealPlannerApp
 */
angular.module('mealPlannerApp')
  .controller('LoginCtrl',
  ['$scope', '$location', 'currentAuth',
  function ($scope, $location, currentAuth) {
    var ref = new Firebase(FIREBASE_URL);

    if (currentAuth) {
      console.log("already logged in, redirecting to main");
      $location.path("/");
    }

    $scope.login = function() {
      ref.authWithPassword({
        email    : $scope.email,
        password : $scope.password
      }, function(error, authData) {
        if (error) {
          console.log("Login Failed!", error);
        } else {
          $location.path("/");
        }
      });
    };
  }]);
