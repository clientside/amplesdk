/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

cXULElement.prototype.doBroadcast		= function() {
	var oBroadcast	= this,
		sBroadcast	= this.attributes.element;
	// If element is not broadcast and if it has broadcast attribute
	if (!(this instanceof cXULElement_broadcaster) && sBroadcast) {
		oBroadcast	= this.ownerDocument.getElementById(sBroadcast);
		if (!(oBroadcast instanceof cXULElement_broadcaster))
			oBroadcast	= null;
	}

	// Fire Event on broadcast element
	if (oBroadcast) {
		var oEvent	= this.ownerDocument.createEvent("CustomEvent");
		oEvent.initCustomEvent("broadcast", true, true, null);
		oBroadcast.dispatchEvent(oEvent);
	}
};

var oXULBroadcastDispatcher	= (function () {
	//
	ample.bind("DOMNodeInsertedIntoDocument", function(oEvent) {
		if (oEvent.target instanceof cXULElement) {
			var oElement, sName, sValue;
			if ((sValue = oEvent.target.attributes["observes"]) && (oElement = this.getElementById(sValue)) && oElement instanceof cXULElement_broadcaster)
				for (sName in oElement.attributes)
					if (oElement.attributes.hasOwnProperty(sName))
						if (sName != "id" && sName != "persist")
							oEvent.target.setAttribute(sName, oElement.attributes[sName]);
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
