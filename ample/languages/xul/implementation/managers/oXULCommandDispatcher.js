/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULCommandDispatcher	= (function () {
	//
	ample.addEventListener("DOMNodeInsertedIntoDocument", function(oEvent) {
		if (oEvent.target instanceof cXULElement) {
			var oElement, sValue;
			if (sValue = oEvent.target.attributes["command"]) {
				if (oElement = this.getElementById(sValue)) {
					for (sName in oElement.attributes)
						if (oElement.attributes.hasOwnProperty(sName))
							if (sName != "id" && sName != "persist")
								oEvent.target.setAttribute(sName, oElement.attributes[sName]);
				}
			}
			if (sValue = oEvent.target.attributes["observes"]) {
				if (oElement = this.getElementById(sValue)) {
					for (sName in oElement.attributes)
						if (oElement.attributes.hasOwnProperty(sName))
							if (sName != "id" && sName != "persist")
								oEvent.target.setAttribute(sName, oElement.attributes[sName]);
				}
			}
		}
	}, true);

	// Public Object
	return {
		getControllerForCommand:	function(sCommand) {

		},
		updateCommands:				function(sCommand) {

		}
	}
})();

// Register with DOM
ample.commandDispatcher	= oXULCommandDispatcher;