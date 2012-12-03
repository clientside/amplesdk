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
		sObserves	= this.getAttribute("observes");
	// If element is not broadcaster and if it has observes attribute
	if (sObserves &&!(this instanceof cXULElement_broadcaster)) {
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
			var oElement, sValue, sAttribute;
			if (oEvent.target.localName == "observes") {
				if ((sValue = oEvent.target.getAttribute("element")) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_broadcaster) {
					sAttribute	= oEvent.target.getAttribute("attribute");
					for (var nIndex = 0, oAttribute; nIndex < oElement.attributes.length; nIndex++)
						if (((oAttribute = oElement.attributes[nIndex]).name != "id" && oAttribute.name != "persist") && (!sAttribute || sAttribute == "*" || sAttribute == oAttribute.name))
							oEvent.target.parentNode.setAttribute(oAttribute.name, oAttribute.value);
				}
			}
			else {
				if ((sValue = oEvent.target.getAttribute("observes")) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_broadcaster)
					for (var nIndex = 0, oAttribute; nIndex < oElement.attributes.length; nIndex++)
						if ((oAttribute = oElement.attributes[nIndex]).name != "id" && oAttribute.name != "persist")
							oEvent.target.setAttribute(oAttribute.name, oAttribute.value);
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
