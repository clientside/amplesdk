/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULDocument	= function(){};

// Public properties
cXULDocument.prototype.popupNode	= null;
cXULDocument.prototype.tooltipNode	= null;

cXULDocument.prototype.commandDispatcher	= null;

// Private properties
var hXULDocument_overlayFragments	= {};

// Public methods
cXULDocument.prototype.loadOverlay	= function(sUrl, fObserver) {
	var oDocument	= this;
	ample.ajax({
			"url":		sUrl,
			"async":	true,
			"dataType":	"xml",
			"success":	function(oResponse) {
				// oOverlay	= ample.importNode(oResponse.documentElement, true);
				oOverlayDocumentElement	= oResponse.documentElement; // We can't import the overlay document
									// because we still need to differentiate
									// between the ample Document and the Overlay
									// Document.
				// Kick off processing
				fXULElement_overlay_applyOverlays(oDocument.documentElement, oOverlayDocumentElement);
				// Overlay applied, notify observer.
				// TODO: This is not really an observer in the XBL sense, but a callback function.
				if (fObserver instanceof Function)
					fObserver();
			}
	});
};

/*
cXULDocument.prototype.addBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};

cXULDocument.prototype.removeBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};
*/
// Register with Ample SDK
ample.extend(ample.classes.Document.prototype, cXULDocument.prototype);

// Add cXULDocument-wide events
ample.addEventListener("DOMNodeInsertedIntoDocument", function(oEvent) {
	if (oEvent.target instanceof cXULElement && oEvent.target.hasAttribute("id")) {
		var sId	= oEvent.target.getAttribute("id");
		if (hXULDocument_overlayFragments[sId]) {
			fXULElement_overlay_applyOverlays(oEvent.target, hXULDocument_overlayFragments[sId]);
			//
			delete hXULDocument_overlayFragments[sId];
		}
	}
}, true);

ample.addEventListener("DOMAttrModified", function(oEvent) {
	if (oEvent.target instanceof cXULElement && oEvent.attrName == "id") {
		var sId	= oEvent.newValue;
		if (hXULDocument_overlayFragments[sId]) {
			fXULElement_overlay_applyOverlays(oEvent.target, hXULDocument_overlayFragments[sId]);
			//
			delete hXULDocument_overlayFragments[sId];
		}
	}
}, true);
