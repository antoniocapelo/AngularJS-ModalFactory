AngularJS-ModalFactory
======================

#### Simple AngularJS factory for the creation of modal dialogs.

## Description
This factory returns a modal dialog factory, based on a configuration object passed on each creation. 

It allows the developer to show/hide notification dialogs to the user. See the [Future Work](#future-work) for soon to be implemented features.

The created factory just provides two simple functions:

* turnMeOn: activates the modal
* turnMeOff: deactivates the modal

There's also a simple less file included for basic styling of the dialog, which can be overridden.
The config object also lets the user define custom CSS classes for the modal.

##How to use:

1. update the modalfactory.js to your AngularJS app name, in case you use other than "app"
2. inject it as a controller dependency
3. instantiate the service as a new scope variable
4. use the modal functions wherever you please, in the controller :)


\- Example:
 	
 	app.controller('MainCtrl',['$scope','modalFactory', function ($scope, modalFactory) {
        // instantiate modal service
        $scope.statusModal = new modalFactory({
            // your config options go here
        });
    
        $scope.turnMeOn = $scope.statusModal.turnMeOn;    
    })


The config object has the following options:


	{
	  // one of these 2 need to be defined for the factory to work, or else an error will be thrown
	  template: [String] with the html content of the modal,
	  templateUrl: [String] path to an external html file (for more complex content),

	  // the next ones are optional
	  selector: [String] CSS selector for the container on which the dialog should be prepended,
	  useOverlay: [boolean] whether the dialog should create an overlay over the rest of the page,
	  baseClass: [String] dialog CSS class name,
	  containerClass: [String] dialog container CSS class name,
	  overlayDivClass : [String] overlay div CSS class name *
	}
	
## Example
Check the [Codepen demo](http://codepen.io/capelo/pen/wKeEA "click here to see the Codepen demo") I made to see this service in use.
In the future I'll put demo files in this repo as well.

## Future Work
I decided to implement this as a factory, not a directive since I didn't want to polute the markup with more elements, so I'm yet to figure a way to share the main controller's function with the scope of the modal. Probably I'll just add a cancel/confirm feature, and will use the angular's broadcast system for the controller to figure out which option was selected.