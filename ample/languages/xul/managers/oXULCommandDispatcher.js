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
		sCommand	= this.attributes.command;
	// If element is not command and if it has command attribute
	if (!(this instanceof cXULElement_command) && sCommand) {
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
			var oElement, sName, sValue;
			if ((sValue = oEvent.target.attributes["command"]) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_command)
				for (sName in oElement.attributes)
					if (oElement.attributes.hasOwnProperty(sName))
						if (sName != "id" && sName != "persist")
							oEvent.target.setAttribute(sName, oElement.attributes[sName]);
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