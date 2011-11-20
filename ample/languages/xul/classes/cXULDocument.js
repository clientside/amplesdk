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
					fXULDocument_applyOverlays(oDocument.documentElement, oOverlay);
				}
		});
	}
	else
		fXULDocument_applyOverlays(oDocument, oOverlay);
};

cXULDocument.prototype.applyOverlay	= function(oOverlay) {
	var oDocument	= this;
    fXULDocument_applyOverlays(oDocument.documentElement, oOverlay);
};

function fXULDocument_applyOverlays(oDocument, oOverlay) {
    //If this an empty overlay node, add it to the parent and return.
    /*
    if (!oOverlay.childNodes.length) { 
        fXULDocument_importAndAdd(oDocument,oOverlay); 
        fXULDocument_mergeAttributes(oChild,oNewDocEl);
        return; 
    }
    */
    //Action...
    for (var iIndex = 0; iIndex < oOverlay.childNodes.length; iIndex++) {
        var oChild = oOverlay.childNodes.item(iIndex);
        if (oChild instanceof cXULElement || oChild instanceof Node) {
            var oNewDocEl = null;
            if (oChild.hasAttribute('id')) {
                //We have an id
                oNewDocEl = ample.getElementById(oChild.getAttribute('id'));
                if (!oNewDocEl) { //Our id doesn't match an existing element, so create the element.
                    oNewDocEl = fXULDocument_importAndAdd(oDocument,oChild);
                }
                fXULDocument_mergeAttributes(oNewDocEl,oChild);
            }
            else {
                oNewDocEl = fXULDocument_importAndAdd(oDocument,oChild); //We don't have an id, so insert.
                fXULDocument_mergeAttributes(oNewDocEl,oChild);
            }
            fXULDocument_applyOverlays(oNewDocEl,oChild);
        } else alert('Non-XUL element in overlay.'+oChild); //We have a non-XUL element, alert.
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

function fXULDocument_importAndAdd(oParent,oNodeToAdd) {
    var oNewNode = ample.importNode(oNodeToAdd,false);
    if (oNodeToAdd.hasAttribute('position')) {
        var iPosition = oNodeToAdd.getAttribute('position');
        oParent.insertBefore(oNewNode,oParent.childNodes.item(iPosition));
    } else {
        oParent.appendChild(oNewNode);
    }
    return(oNewNode);
}

function fXULDocument_mergeAttributes(oDocNode,oOverlayNode) {
    for (var attr in oOverlayNode.attributes) {
        if (!(oOverlayNode.attributes[attr] instanceof Function)) {
            oDocNode.setAttribute(attr,oOverlayNode.attributes[attr]);
        }
    }    
}

/*
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
*/

/*
cXULDocument.prototype.addBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};

cXULDocument.prototype.removeBroadcastListenerFor	= function(oBroadcaster, oObserver, sAttr) {

};
*/
// Register with Ample SDK
ample.extend(ample.classes.Document.prototype, cXULDocument.prototype);
