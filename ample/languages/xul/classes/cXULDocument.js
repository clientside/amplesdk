/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky
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
var hXULDocument_overlays	= {};

// Public methods
cXULDocument.prototype.loadOverlay	= function(sUrl, fObserver) {
	var oDocument	= this,
		oOverlay	= hXULDocument_overlays[sUrl];
	if (!oOverlay) {
		ample.ajax({
				"url": 		sUrl,
				"async":	true,
				"dataType":	"xml",
				"success":	function(oResponse) {
					oOverlay	= ample.importNode(oResponse.documentElement, true);
					// Cache document
					hXULDocument_overlays[sUrl]	= oOverlay;
					// Kick off processing
					fXULDocument_applyOverlays(oDocument, oOverlay);
				}
		});
	}
	else
		fXULDocument_applyOverlays(oDocument, oOverlay);
};

function fXULDocument_applyOverlays(oDocument, oOverlay) {
	console.log(oOverlay);
};

/*
cXULDocument.prototype.addBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};

cXULDocument.prototype.removeBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};
*/
// Register with Ample SDK
ample.extend(ample.classes.Document.prototype, cXULDocument.prototype);