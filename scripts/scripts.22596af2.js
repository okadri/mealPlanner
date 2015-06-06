"use strict";var FIREBASE_URL="https://meal-planner.firebaseIO.com";window.mealPlannerApp=angular.module("mealPlannerApp",["ngAnimate","ngResource","ngRoute","ngSanitize","ngTouch","ui.calendar","firebase","ui.bootstrap","ngTagsInput"]),mealPlannerApp.factory("Auth",["$firebaseAuth",function(a){var b=new Firebase(FIREBASE_URL);return a(b)}]),mealPlannerApp.run(["$rootScope","$location",function(a,b){a.$on("$routeChangeError",function(a,c,d,e){"AUTH_REQUIRED"===e&&b.path("/login")})}]),mealPlannerApp.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl",resolve:{allPlans:MainCtrl.getAllPlans,currentAuth:["Auth",function(a){return a.$requireAuth()}]}}).when("/meals",{templateUrl:"views/meals.html",controller:"MealsCtrl",resolve:{allMeals:MealsCtrl.getAllMeals,currentAuth:["Auth",function(a){return a.$requireAuth()}]}}).when("/meals/:id",{templateUrl:"views/editmeal.html",controller:"EditmealCtrl",resolve:{currentAuth:["Auth",function(a){return a.$requireAuth()}]}}).when("/shoppingList",{templateUrl:"views/shoppinglist.html",controller:"ShoppinglistCtrl",resolve:{allMeals:ShoppinglistCtrl.getAllMeals,allItems:ShoppinglistCtrl.getAllItems,currentAuth:["Auth",function(a){return a.$requireAuth()}]}}).when("/login",{templateUrl:"views/login.html",controller:"LoginCtrl",resolve:{currentAuth:["Auth",function(a){return a.$waitForAuth()}]}}).otherwise({redirectTo:"/"})}]),angular.module("mealPlannerApp").controller("MainCtrl",["$scope","Auth","$location","$modal","planService","mealService","allPlans",this.MainCtrl=function(a,b,c,d,e,f,g){a.planSources=[{color:"#dff0d8",textColor:"#333",events:g},{color:"#d9edf7",textColor:"#333",events:e.getSuggestions()}],a.startModal=function(a,b){var c=d.open({templateUrl:"/views/editplan.html",controller:EditplanCtrl,resolve:{allMeals:EditplanCtrl.getAllMeals,mealId:function(){return b?b.mealId:null},plan:function(){return b?b:null}}});c.result.then(function(c){var d=b?e.getOneById(b.$id):{};d.title=c.name,d.mealId=c.$id,d.meal=c,d.start=a.format(),e.savePlan(d)})},a.addIngredientsByDateRange=function(a,b){var e=d.open({templateUrl:"/views/addIngredients.html",controller:AddingredientsCtrl,resolve:{ingredients:function(){return f.findIngredientsByDateRange(a,b)},shoppingItems:AddingredientsCtrl.getAllItems}});e.result.then(function(){c.path("/shoppingList")})},a.uiConfig={calendar:{height:450,editable:!0,selectable:!0,timezone:"local",header:{left:"month agendaWeek",center:"title",right:"today prev,next"},dayClick:function(b,c,d){var f=e.findOneByDate(b);f||a.startModal(b)},select:function(b,c,d,f,g){var h=e.findOneByDate(b);h&&a.addIngredientsByDateRange(b,c)},eventClick:function(b,c,d){a.startModal(b.start,b)}}}}]),MainCtrl.getAllPlans=function(a){return a.getAll()},angular.module("mealPlannerApp").controller("AboutCtrl",["$scope",this.AboutCtrl=function(a){}]),angular.module("mealPlannerApp").factory("Plan",function(){function a(a){a&&this.setData(a)}return a.prototype={setData:function(a){angular.extend(this,a)}},a}).factory("planService",["$q","$firebaseArray","Plan",function(a,b,c){return{_pool:null,_findById:function(a,b){for(var c in a)if(a.hasOwnProperty(c)&&a[c].$id===b)return a[c];return void 0},getAll:function(){var c=a.defer(),d=new Firebase(FIREBASE_URL+"/plans"),e=d.orderByChild("start").limitToLast(80);return this._pool=b(e),c.resolve(this._pool),c.promise},getOneById:function(a){return this._findById(this._pool,a)},findOneByDate:function(a){for(var b in this._pool)if(this._pool.hasOwnProperty(b)&&this._pool[b].start===a.format())return this._pool[b];return void 0},savePlan:function(b){var c,d=a.defer();return b.stick=!0,c=b.$id?this._pool.$save(b):this._pool.$add(b),d.resolve(this._pool),d.promise},deletePlan:function(a){var b=this.getOneById(a.$id);this._pool.$remove(b)},getSuggestions:function(){return[]}}}]),angular.module("mealPlannerApp").factory("Meal",function(){function a(a){a&&this.setData(a)}return a.prototype={setData:function(a){angular.extend(this,a)}},a}).factory("mealService",["$q","$filter","$firebaseArray","$firebaseObject","Meal","planService",function(a,b,c,d,e,f){return{_pool:[],_allIngredients:[],_findById:function(a,b){for(var c in a)if(a.hasOwnProperty(c)&&a[c].$id===b)return a[c];return void 0},getAll:function(){var b=a.defer(),d=new Firebase(FIREBASE_URL+"/meals");return this._pool=c(d),b.resolve(this._pool),b.promise},getOneById:function(a){var b;if(this._pool.length>0)b=this._findById(this._pool,a);else{var c=new Firebase(FIREBASE_URL+"/meals/"+a);b=d(c)}return b},saveMeal:function(b){var c,d=a.defer();return b.seasonal||(delete b.startDate,delete b.endDate),c=b.$id?this._pool.$save(b):this._pool.$add(b),d.resolve(c),d.promise},deleteMeal:function(a){this._pool.$remove(a)},getAllIngredients:function(){var a=this;for(var b in a._pool)angular.forEach(a._pool[b].ingredients,function(b){a._allIngredients.indexOf(b.text)<0&&a._allIngredients.push(b.text)});return a._allIngredients},searchIngredients:function(c){var d=a.defer();this.getAllIngredients();var e=b("filter")(this._allIngredients,c);return d.resolve(e),d.promise},findIngredientsByDateRange:function(b,c){for(var d=a.defer(),e=[],g=b;b.isBefore(c);b.add(1,"day")){var h=f.findOneByDate(g);h&&h.meal&&angular.forEach(h.meal.ingredients,function(a){var b=e.map(function(a){return a.text});b.indexOf(a.text)<0&&e.push(a)})}return d.resolve(e),d.promise}}}]),angular.module("mealPlannerApp").controller("EditplanCtrl",["$scope","$modalInstance","mealService","planService","mealId","plan","allMeals",this.EditplanCtrl=function(a,b,c,d,e,f,g){a.allMeals=g,a.mealId=e,a.meal=c.getOneById(e),a.setMeal=function(){b.close(a.meal)},a.deletePlan=function(){a.meal=a.mealId=null,d.deletePlan(f)},a.cancel=function(){b.dismiss("cancel")}}]),EditplanCtrl.getAllMeals=function(a){return a.getAll()},angular.module("mealPlannerApp").controller("MealsCtrl",["$scope","$modal","mealService","allMeals",this.MealsCtrl=function(a,b,c,d){a.allMeals=d,a.editMeal=function(a){var d=b.open({templateUrl:"/views/editmeal.html",controller:EditmealCtrl,resolve:{meal:function(){return a},allIngredients:function(){return c.getAllIngredients()}}});d.result.then(function(a){c.saveMeal(a)})},a.deleteMeal=function(a){c.deleteMeal(a)}}]),MealsCtrl.getAllMeals=function(a){return a.getAll()},angular.module("mealPlannerApp").controller("EditmealCtrl",["$scope","$modalInstance","mealService","meal","meatTypeService","frequencyService",this.EditmealCtrl=function(a,b,c,d,e,f){a.meal=d||{},a.meatTypes=e.getAll(),a.frequencies=f.getAll(),a.months=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],a.saveMeal=function(){b.close(a.meal)},a.cancel=function(){b.dismiss("cancel")},a.queryIngredients=function(a){return c.searchIngredients(a)}}]),angular.module("mealPlannerApp").controller("NavCtrl",["$scope","$location",function(a,b){a.isActive=function(a){return a===b.path()}}]),angular.module("mealPlannerApp").factory("meatTypeService",function(){return{_pool:[{id:0,name:"vegetarien"},{id:1,name:"Fish"},{id:2,name:"Chicken"},{id:3,name:"Lamb"},{id:4,name:"Beef"}],getAll:function(){return this._pool},getMeatName:function(a){for(var b=0;b<this._pool.length;b++)if(this._pool.get(b).id==a)return this._pool.get(b).name;return null}}}),angular.module("mealPlannerApp").factory("frequencyService",function(){return{_pool:[{numOfWks:1,description:"1 Week"},{numOfWks:2,description:"2 Week"},{numOfWks:3,description:"3 Week"},{numOfWks:4,description:"1 Month"},{numOfWks:6,description:"6 Weeks"},{numOfWks:8,description:"2 Months"},{numOfWks:12,description:"3 Months"}],getAll:function(){return this._pool},getFrequencyDescription:function(a){for(var b=0;b<this._pool.length;b++)if(this._pool.get(b).numOfWks==a)return this._pool.get(b).description;return null}}}),angular.module("mealPlannerApp").directive("confirm",["$document",function(a){return{restrict:"A",scope:{confirmAction:"&confirm"},link:function(b,c,d){var e=Math.floor(1e10*Math.random()),f=d.message||"Are you sure?",g=d.yes||"Yes",h=d.no||"No",i=d.title||"Confirm",j=d.btnClass||"btn-danger",k=d.placement||"bottom",l='<div id="button-'+e+'" style="position: relative; width: 250px;"><p class="confirmbutton-msg">'+f+'</p><div align="center"><button class="confirmbutton-yes btn '+j+'">'+g+'</button> <button class="confirmbutton-no btn btn-default">'+h+"</button></div></div>";c.popover({content:l,html:!0,trigger:"manual",title:i,placement:k}),c.bind("click",function(d){var f=!0;d.stopPropagation(),c.popover("show");var g=$("#button-"+e);g.closest(".popover").click(function(a){f&&a.stopPropagation()}),g.find(".confirmbutton-yes").click(function(a){a.stopPropagation(),f=!1,b.$apply(b.confirmAction),c.popover("hide")}),g.find(".confirmbutton-no").click(function(b){b.stopPropagation(),f=!1,a.off("click.confirmbutton."+e),c.popover("hide")}),a.on("click.confirmbutton."+e,":not(.popover, .popover *)",function(){a.off("click.confirmbutton."+e),c.popover("hide")})})}}}]),angular.module("mealPlannerApp").controller("AddingredientsCtrl",["$scope","$modalInstance","shoppingListService","ingredients","shoppingItems",this.AddingredientsCtrl=function(a,b,c,d,e){a.ingredients=d,a.addItems=function(){c.addItems(a.ingredients).then(function(){b.close()})},a.cancel=function(){b.dismiss("cancel")},a.deleteIngredient=function(b){var c=a.ingredients.indexOf(b);a.ingredients.splice(c,1)}}]),AddingredientsCtrl.getAllItems=function(a){return a.getAll()},angular.module("mealPlannerApp").controller("ShoppinglistCtrl",["$scope","allItems","allMeals","mealService","shoppingListService",this.ShoppinglistCtrl=function(a,b,c,d,e){a.allItems=b,a.searchIngredients=function(a){return d.searchIngredients(a)},a.addItem=function(b){e.addItem(b),a.newItem=""},a.deleteItem=function(a){e.deleteItem(a)}}]),ShoppinglistCtrl.getAllItems=function(a){return a.getAll()},ShoppinglistCtrl.getAllMeals=function(a){return a.getAll()},angular.module("mealPlannerApp").factory("shoppingListService",["$q","$firebaseArray",this.shoppingListService=function(a,b){return{_pool:null,_findById:function(a,b){for(var c in a)if(a.hasOwnProperty(c)&&a[c].$id===b)return a[c];return void 0},getAll:function(){var c=a.defer(),d=new Firebase(FIREBASE_URL+"/shoppingItems");return this._pool=b(d),c.resolve(this._pool),c.promise},addItems:function(b){var c=a.defer();for(var d in b)this.addItem(b[d].text);return c.resolve(this._pool),c.promise},addItem:function(b){var c=a.defer(),d=this._pool.map(function(a){return a.$value});return d.indexOf(b)<0&&this._pool.$add(b),c.resolve(this._pool),c.promise},getOneById:function(a){return this._findById(this._pool,a)},deleteItem:function(a){var b=this.getOneById(a.$id);this._pool.$remove(b)}}}]),angular.module("mealPlannerApp").controller("LoginCtrl",["$scope","$location","currentAuth",function(a,b,c){var d=new Firebase(FIREBASE_URL);c&&(console.log("already logged in, redirecting to main"),b.path("/")),a.login=function(){d.authWithPassword({email:a.email,password:a.password},function(a,c){a?console.log("Login Failed!",a):b.path("/")})}}]);