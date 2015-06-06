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
