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
    //If this an empty overlay node, add it to the parent and return.
    if (!oOverlay.childNodes.length) { fXULDocument_importAndAdd(oOverlay,oDocument); return; }
    //Action...
    for (var iIndex = 0; iIndex < oOverlay.childNodes.length; iIndex++) {
        var oChild = oOverlay.childNodes.item(iIndex);
        if (oChild.hasAttribute('id')) {
            //We have an id
            var oNewDocEl = ample.getElementById(oChild.getAttribute('id'));
            if (oNewDocEl) fXULDocument_applyOverlays(oNewDocEl,oChild);  //Our id matches an existing element.
            else fXULDocument_importAndAdd(oChild,oDocument); //Our id doesn't insert it at the current location with the id.
        }
        else fXULDocument_importAndAdd(oChild,oDocument); //We don't have an id, so insert.
    }
/*
    var oMatchRootEl = null;
    if (oOverlay.hasAttribute('id')) {
        oMatchRootEl = ample.query('//[id='+oOverlay.getAttribute('id')+']');
    }
    if (oMatchRootEl) fXULDocument_applyOverlaysRecurse(oOverlay,oMatchRootEl);
    else {
        for (var iIndex = 0; iIndex < oOverlay.childNodes.length; iIndex++) {
            var oChild = oOverlay.childNodes.item(iIndex);
            var oNewDocEl = ample.getElementById(oChild.getAttribute('id'));
            if (oNewDocEl) fXULDocument_applyOverlaysRecurse(oOverlay,oNewDocEl);  //Our id matches an existing element.
        }
    }
*/
};

function fXULDocument_importAndAdd(oNodeToAdd,oParent) {
    var newNode = ample.importNode(oNodeToAdd,false);
    if (oNodeToAdd.hasAttribute('position')) {
        var position = oNodeToAdd.getAttribute('position');
        oParent.insertBefore(oNodeToAdd,oParent.childNodes.item(position));
    } else
        oParent.appendChild(oNodeToAdd);
}


function fXULDocument_applyOverlaysRecurse(oOverlayEl,oDocEl) {
    //Action...
    for (var iIndex = 0; iIndex < oOverlayEl.childNodes.length; iIndex++) {
        var oChild = oOverlayEl.childNodes.item(iIndex);
        if (oChild.hasAttribute('id')) {
            //We have an id
            var oNewDocEl = ample.query(oChild.getAttribute('id'),oDocEl);
            if (oNewDocEl) fXULDocument_applyOverlaysRecurse(oChild,oNewDocEl);  //Our id matches an existing element.
            else fXULDocument_importAndAdd(oChild,oDocEl); //Our id doesn't insert it at the current location with the id.
        }
        else fXULDocument_importAndAdd(oChild,oDocEl); //We don't have an id, so insert.
    }
}

/*
cXULDocument.prototype.addBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};

cXULDocument.prototype.removeBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};
*/
// Register with Ample SDK
ample.extend(ample.classes.Document.prototype, cXULDocument.prototype);
