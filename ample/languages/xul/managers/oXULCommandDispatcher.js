/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

cXULElement.prototype.doCommand		= function() {
	var sCommand	= this.attributes.command;
	if (sCommand) {
		var oCommand = this.ownerDocument.getElementById(sCommand);
		if (oCommand && oCommand instanceof cXULElement_command) {
		    // Fire Event on command element
		    var oEvent = this.ownerDocument.createEvent("CustomEvent");
		    oEvent.initCustomEvent("command", true, true, null);
		    oCommand.dispatchEvent(oEvent);
		}
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
			if ((sValue = oEvent.target.attributes["observes"]) && (Element = this.getElementById(sValue)) && oElement instanceof cXULElement_broadcaster)
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