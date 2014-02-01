'use strict';
/**
 * Simple AngularJS factory for the creation of modal dialogs.
 * This factory returns a modal dialog factory, based on a config object passed on each creation.
 * The created factory just provides two simple functions:
 *  - turnMeOn: activates the modal
 *  - turnMeOff: deactivates the modal
 *
 *  There's also a simple less file included for basic styling of the dialog, which can be overridden.
 *  The config object also lets the user define custom CSS classes for the modal.
 *
 *  How to use:
 *
 *  1 - update the modalfactory.js to your AngularJS app name
 *  2 - register a new factory for your app
 *  Example:
 *
 *  angular.module('your-app-name').factory('desired-modal-factory-name', function(modalservice) {
        return modalservice ({
            // your config object goes here
        })
    })
 *
 * 3 - use the modal functions wherever you please, in the controller :)
 *
 * The config object has the following options:
 * {
 *      // one of these 2 need to be defined for the service to work, or else an error will be thrown
 *      template: [String] with the html content of the modal,
 *      templateUrl: [String] path to an external html file (for more complex content),
 *
 *      // the next ones are optional
 *      selector: [String] CSS selector for the container on which the dialog should be prepended,
 *      useOverlay: [boolean] whether the dialog should create an overlay over the rest of the page,
 *      baseClass: [String] dialog CSS class name,
 *      containerClass: [String] dialog container CSS class name,
 *      overlayDivClass : [String] overlay div CSS class name *
 * }
 *
 */
angular.module('appname').
    factory('modalservice', function ($compile, $http, $rootScope) {
    return function (config) {

        // check that there's a template provided
        if (typeof config.template === 'undefined' && typeof config.templateUrl === 'undefined') {
            throw new Error('The factory needs an html template or a template url to be passed with the config object');
        }

        // define auxiliary variables
        var template, html, scope,
            containerClass = config.containerClass || 'ng-modal-container',
            baseClass = config.baseClass|| 'ng-modal',
            overlayDivClass = config.overlayDivClass || 'ng-modal-overlay',
            useOverlay = typeof config.useOverlay === 'boolean' ? config.useOverlay : true,
            container = angular.element(config.selector || document.body),
            overlayDiv = '<div class="'+ overlayDivClass + '"></div>';

        if (config.templateUrl) {
            $http.get(config.templateUrl).then(function(response) {
                template = response.data;
                // the html var has to be set on the 2 options of the conditional since one of them has an async method
                html = '<div class="' + containerClass + '"><div class="' + baseClass + '"><a href="" class="' + baseClass + '-close" ng-click="turnMeOff()">&times;</a>' + template + '</div></div>';
            });
        } else {
            template= config.template
            html = '<div class="' + containerClass + '"><div class="' + baseClass + '"><a href="" class="' + baseClass +'-close" ng-click="turnMeOff()">&times;</a>' + template + '</div></div>';
        }

        /**
         * Activates the modal
         *
         * @param localVars - {Object} data passed from the caller controller
         */
        function turnMeOn (localVars) {
            var domElement, overlay;
            scope = $rootScope.$new();
            // assign the deactivation function to the created scope
            scope.turnMeOff = turnMeOff;

            // if there's a modal already on the DOM, remove it before adding another
            domElement = angular.element('.' + containerClass);
            domElement.remove();

            // if there's an overlay div already on the DOM, remove it before adding another
            overlay = angular.element('.' + overlayDivClass);
            overlay.remove();

            // if there's data passed along, copy it to the created scope
            if (localVars) {
                for (var prop in localVars) {
                    scope[prop] = localVars[prop];
                }
            }

            // create DOM elements
            domElement = angular.element(html);

            // the $compile() function compiles an HTML String/DOM into a template and produces a template function, which is then used
            // to link the template and a scope together
            $compile(domElement)(scope);

            // add elements do the dom
            if (useOverlay) {
                overlay = angular.element(overlayDiv);
                angular.element(document.body).append(overlay);
            }
            container.prepend(domElement);
        }

        /**
         * Deactivates the modal
         */
        function turnMeOff() {
            var domElement = angular.element('.' + containerClass),
                overlay = angular.element('.' + overlayDivClass);

            // Remove elements from the DOM
            if (domElement) {
                domElement.remove();
            }
            if (overlay) {
                overlay.remove();
            }
            scope.$destroy();
        }

        return {
            turnMeOn: turnMeOn,
            turnMeOff: turnMeOff
        };
    };
});