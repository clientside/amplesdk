/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

cXULElement.prototype.doBroadcast		= function() {
	var oBroadcaster	= this,
		sObserves	= this.attributes.observes;
	// If element is not broadcaster and if it has observes attribute
	if (!(this instanceof cXULElement_broadcaster) && sObserves) {
		oBroadcaster	= this.ownerDocument.getElementById(sObserves);
		if (!(oBroadcaster instanceof cXULElement_broadcaster))
			oBroadcaster	= null;
	}

	// Fire Event on broadcast element
	if (oBroadcaster) {
		var oEvent	= this.ownerDocument.createEvent("CustomEvent");
		oEvent.initCustomEvent("broadcast", false, false, null);
		oBroadcaster.dispatchEvent(oEvent);
	}
};

var oXULBroadcastDispatcher	= (function () {
	// Broadcast attributes on element insertion
	ample.bind("DOMNodeInsertedIntoDocument", function(oEvent) {
		if (oEvent.target instanceof cXULElement) {
			var oElement, sName, sValue, sAttribute;
			if (oEvent.target.localName == "observes") {
				if ((sValue = oEvent.target.attributes["element"]) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_broadcaster) {
					sAttribute	= oEvent.target.attributes["attribute"];
					for (sName in oElement.attributes)
						if (oElement.attributes.hasOwnProperty(sName))
							if ((sName != "id" && sName != "persist") && (!sAttribute || sAttribute == "*" || sAttribute == sName))
								oEvent.target.parentNode.setAttribute(sName, oElement.attributes[sName]);
				}
			}
			else {
				if ((sValue = oEvent.target.attributes["observes"]) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_broadcaster)
					for (sName in oElement.attributes)
						if (oElement.attributes.hasOwnProperty(sName))
							if (sName != "id" && sName != "persist")
								oEvent.target.setAttribute(sName, oElement.attributes[sName]);
			}
		}
	}, true);

	// Public Object
	return {
		getControllerForBroadcast:	function(sBroadcast) {

		},
		updateBroadcasts:				function(sBroadcast) {

		}
	}
})();

// Register with ample object
ample.broadcastDispatcher	= oXULBroadcastDispatcher;
