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
var hXULDocument_overlayFragments	= {};

cXULDocument.prototype.handlers = {
	"DOMNodeInsertedIntoDocument":	function() {
		if (oEvent.getAttribute("id") == hXULDocument_overlayFragments[oEvent.newValue]) {                
            cXULDocument.applyOverlays(this,hXULDocument_overlayFragments[oEvent.newValue]);
		}
	}    
}

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
					//oOverlay	= ample.importNode(oResponse.documentElement, true);
                    oOverlay = oResponse.documentElement;  //We can't import the overlay document because we still need to differentiate between the ample Document and the Overlay Document.
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

cXULDocument.prototype.applyOverlay	= function(oOverlayRoot) {
	var oDocument	= this;
    fXULDocument_applyOverlays(oDocument.documentElement, oOverlayRoot);
};

function fXULDocument_applyOverlays(oAmpleNode, oOverlayNode) {
    //For each child of the overlay node, if:
    //  - it does have an ID and:
    //    -- that ID matches an existing node in the ample document, then 
    //       the attributes of the overlay node are merged with the ample node, and the process repeats for all children.
    //    -- it doesn't match an existing ID in the ample document, then if
    //       --- these are children of the root node, then
    //           it gets stored until that ID appears and applied later, possibly in another overlay or javascript insert.
    //       --- otherwise, it gets inserted into the ample node passed in by this function 
    //                      and the process repeats for all children.    
    //  - it doesn't have an ID, then if
    //       --- these are children of the root node, then
    //           it gets inserted into the root of the document, and the process repeats for all children.
    //       --- otherwise, it gets inserted into the ample node passed in by this function 
    //                      and the process repeats for all children.    
    //Action...
    for (var iIndex = 0; iIndex < oOverlayNode.childNodes.length; iIndex++) {
        var oChild = oOverlayNode.childNodes.item(iIndex);
        if (oChild instanceof Text && oChild.nodeValue.trim() == '') continue;
        if (oChild instanceof Comment) continue;
        if (oChild instanceof cXULElement || oChild instanceof Element) {
            var oNewDocEl = null;
            if (oChild.hasAttribute('id')) {
                //Our overlay node child has an ID.
                var sID = oChild.getAttribute('id');
                oNewDocEl = ample.getElementById(sID);
                if (!oNewDocEl) {
                    //Our id doesn't match an existing element, ...
                    if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
                        //...and it's a child of the overlay root, so store it for later.
                        hXULDocument_overlayFragments[oChild.getAttribute('id')] = oChild;
                        continue;
                    } else {
                        //...and it's not a child of the overlay root, so add it to the current node.
                        oNewDocEl = fXULDocument_importAndAdd(oAmpleNode,oChild);
                    }
                }
            } else {
                //Our overlay node child doesn't have an ID.
                if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
                    //...and it's a child of the overlay root, so insert it into the root.
                    oNewDocEl = fXULDocument_importAndAdd(oAmpleNode.getOwnerDocument().documentElement,oChild);
                } else {
                    //...and it's not a child of root, so add it to the current node.
                    oNewDocEl = fXULDocument_importAndAdd(oAmpleNode,oChild); //We don't have an id, so insert.
                }
            }
            fXULDocument_mergeAttributes(oNewDocEl,oChild);
            fXULDocument_applyOverlays(oNewDocEl,oChild);
        } else alert('Non-XUL element in overlay.'+oChild); //We have a non-XUL element, alert.
    }
/*
    var oMatchRootEl = null;
    if (oOverlayNode.hasAttribute('id')) {
        oMatchRootEl = ample.query('//[id='+oOverlayNode.getAttribute('id')+']');
    }
    if (oMatchRootEl) fXULDocument_applyOverlaysRecurse(oOverlayNode,oMatchRootEl);
    else {
        for (var iIndex = 0; iIndex < oOverlayNode.childNodes.length; iIndex++) {
            var oChild = oOverlayNode.childNodes.item(iIndex);
            var oNewDocEl = ample.getElementById(oChild.getAttribute('id'));
            if (oNewDocEl) fXULDocument_applyOverlaysRecurse(oOverlayNode,oNewDocEl);  //Our id matches an existing element.
        }
    }
*/
};

function fXULDocument_importAndAdd(oParent,oNodeToAdd) {
    var oNewNode = ample.importNode(oNodeToAdd,false);
    //Remove insertafter,insertbefore, and position attributes from node to be inserted.
    for (var sAttr in {insertafter:0,insertbefore:0,position:0}) {
        if (oNewNode.hasAttribute(sAttr))
            oNewNode.removeAttribute(sAttr);
    }
    if (oNodeToAdd.hasAttribute('insertafter')) {
        var aInsertAfter = oNodeToAdd.getAttribute('insertafter').split(',');
        for (var iIndex = 0; iIndex < aInsertAfter.length; iIndex++) {
            oInsertAfterEl = ample.query("#"+aInsertAfter[iIndex].trim());
            if (oInsertAfterEl.size() > 0) {
                oInsertAfterEl.after(oNewNode);
                return(oNewNode);
            }
        }
    }
    if (oNodeToAdd.hasAttribute('insertbefore')) {
       var aInsertBefore = oNodeToAdd.getAttribute('insertbefore').split(',');
        for (var iIndex = 0; iIndex < aInsertBefore.length; iIndex++) {
            oInsertBeforeEl = ample.query("#"+aInsertBefore[iIndex].trim());
            if (oInsertBeforeEl.size() > 0) {
                oInsertBeforeEl.before(oNewNode);
                return(oNewNode);
            }
        }
    }
    if (oNodeToAdd.hasAttribute('position')) {
        var iPosition = parseInt(oNodeToAdd.getAttribute('position'));
        if (iPosition >= 1 && iPosition < oParent.childNodes.length) { 
            //If the position is out of range, simply let it fall through to be appended.
            oParent.insertBefore(oNewNode,oParent.childNodes.item(iPosition-1));  
                //The position is "one-based", whereas childNodes are 0-based.  So -1.
            return(oNewNode);
        }
    }
    oParent.appendChild(oNewNode);
    return(oNewNode);
}

function fXULDocument_mergeAttributes(oAmpleNode,oOverlayNode) {
    if (oOverlayNode.attributes instanceof NamedNodeMap) {
        for (var sAttr in oOverlayNode.attributes) {
            if (oOverlayNode.attributes[sAttr] instanceof Attr) {
                if (['insertbefore','insertafter','position'].indexOf(oOverlayNode.attributes[sAttr].name) < 0)
                    oAmpleNode.setAttribute(oOverlayNode.attributes[sAttr].name,oOverlayNode.attributes[sAttr].value);
            }
        }
        return;
    }
    //else
    for (var sAttr in oOverlayNode.attributes) {
        if (!(oOverlayNode.attributes[sAttr] instanceof Function)
            && !(oOverlayNode.attributes[sAttr] instanceof Object)
            && ['insertbefore','insertafter','position'].indexOf(sAttr) < 0
           ) {
            oAmpleNode.setAttribute(sAttr,oOverlayNode.attributes[sAttr]);
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
