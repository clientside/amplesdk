/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

cXULElement.prototype.doCommand		= function() {
	var oCommand	= this,
		sCommand	= this.getAttribute("command");
	// If element is not command and if it has command attribute
	if (sCommand &&!(this instanceof cXULElement_command)) {
		oCommand	= this.ownerDocument.getElementById(sCommand);
		if (!(oCommand instanceof cXULElement_command))
			oCommand	= null;
	}

	// Fire Event on command element
	if (oCommand) {
		var oEvent	= this.ownerDocument.createEvent("CustomEvent");
		oEvent.initCustomEvent("command", true, true, null);
		oCommand.dispatchEvent(oEvent);
	}
};

var oXULCommandDispatcher	= (function () {
	//
	ample.bind("DOMNodeInsertedIntoDocument", function(oEvent) {
		if (oEvent.target instanceof cXULElement) {
			var oElement, sValue;
			if ((sValue = oEvent.target.getAttribute("command")) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_command)
				for (var nIndex = 0, oAttribute; nIndex < oElement.attributes.length; nIndex++)
					if ((oAttribute = oElement.attributes[nIndex]).name != "id" && oAttribute.name != "persist")
						oEvent.target.setAttribute(oAttribute.name, oAttribute.value);
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

// Register with ample object
ample.commandDispatcher	= oXULCommandDispatcher;