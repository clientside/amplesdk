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
var hXULDocument_overlayFragments	= {};

// Public methods
cXULDocument.prototype.loadOverlay	= function(sUrl, fObserver) {
	var oDocument	= this;
	ample.ajax({
			"url": 		sUrl,
			"async":	true,
			"dataType":	"xml",
			"success":	function(oResponse) {
				//oOverlay	= ample.importNode(oResponse.documentElement, true);
				oOverlay = oResponse.documentElement; //We can't import the overlay document 
									//because we still need to differentiate
									//between the ample Document and the Overlay
									//Document.
				// Kick off processing
				fXULDocument_applyOverlays(oDocument.documentElement, oOverlay);
				//Overlay applied, notify observer.
				//TODO: This is not really an observer in the XBL sense, but a callback function.
				if (fObserver instanceof Function) fObserver();
			}
	});
};

cXULDocument.prototype.applyOverlay	= function(oOverlayRoot) {
	var oDocument	= this;
	fXULDocument_applyOverlays(oDocument.documentElement, oOverlayRoot);
};

function fXULDocument_applyOverlays(oAmpleNode, oOverlayNode) {
	//For each child of the overlay node, if:
	//  - it does have an ID and:
	//	-- that ID matches an existing node in the ample document, then if
	//	   --- it has an attribute "removeelement" with a value of "true", remove the element and all children, 
	//		if it exists
	//	   --- otherwise, the attributes of the overlay node are merged with the ample node, 
	//		and the process repeats for all children.
	//	-- it doesn't match an existing ID in the ample document, then if
	//	   --- these are children of the root node, then
	//		it gets stored until that ID appears and applied later, possibly in another overlay or 
	//		javascript insert.
	//	   --- otherwise, it gets inserted into the ample node passed in by this function 
	//		and the process repeats for all children.	
	//  - it doesn't have an ID, then if
	//	   --- these are children of the root node, then
	//		it gets inserted into the root of the document, and the process repeats for all children.
	//	   --- otherwise, it gets inserted into the ample node passed in by this function 
	//		and the process repeats for all children.	
	//Action...
	for (var nIndex = 0; nIndex < oOverlayNode.childNodes.length; nIndex++) {
		var oChild = oOverlayNode.childNodes.item(nIndex);
		if (oChild.nodeType == ample.classes.Node.TEXT_NODE && oChild.nodeValue.trim() == '') continue;
		if (oChild.nodeType == ample.classes.Node.COMMENT_NODE) continue;
		if (oChild.nodeType == ample.classes.Node.ELEMENT_NODE) {
			var oNewDocEl = null;
			if (oChild.getAttribute('id')) {
				//Our overlay node child has an ID.
				var sID = oChild.getAttribute('id');
				oNewDocEl = ample.getElementById(sID);
				if (!oNewDocEl) {
					//Our id doesn't match an existing element, ...
					if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
						//...and it's a child of the overlay root, so store it for later, and
						//skip to the next child.
						hXULDocument_overlayFragments[oChild.getAttribute('id')] = oChild;
						continue;
					}
					else {
						//...and it's not a child of the overlay root, so add it to the current node.
						oNewDocEl = fXULDocument_importAndAdd(oAmpleNode,oChild);
					}
				}
				else {
					//Our id does match an existing element
					//Check to see if this is a remove instruction...
					if (oChild.getAttribute('removeelement') && oChild.getAttribute('removeelement') == 'true')	{
						//Remove it, and all children, and skip to the next child.
						oNewDocEl.parentNode.removeChild(oNewDocEl);
						continue;
					}
					//Otherwise, just allow it to merge.
				}
			}
			else { //(!oChild.getAttribute('id')
				//Our overlay node child doesn't have an ID.
				if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
					//...and it's a child of the overlay root, so insert it into the root.
					oNewDocEl = fXULDocument_importAndAdd(oAmpleNode.ownerDocument.documentElement,oChild);
				}
				else {
					//...and it's not a child of root, so add it to the current node.
					oNewDocEl = fXULDocument_importAndAdd(oAmpleNode,oChild); //We don't have an id, so insert.
				}
			}
			fXULDocument_mergeAttributes(oNewDocEl,oChild);
			fXULDocument_applyOverlays(oNewDocEl,oChild);
		}
		else
			alert('Non-XUL element in overlay.'+oChild); //We have a non-XUL element, alert.
	}
};

function fXULDocument_importAndAdd(oParent,oNodeToAdd) {
	var oNewNode = ample.importNode(oNodeToAdd,false);
	//Remove insertafter,insertbefore, and position attributes from node to be inserted.
	for (var sAttr in {insertafter:0,insertbefore:0,position:0}) {
		if (oNewNode.getAttribute(sAttr))
			oNewNode.removeAttribute(sAttr);
	}
	if (oNodeToAdd.getAttribute('insertafter')) {
		var aInsertAfter = oNodeToAdd.getAttribute('insertafter').split(',');
		for (var nIndex = 0; nIndex < aInsertAfter.length; nIndex++) {
			oInsertAfterEl = ample.query("#"+aInsertAfter[nIndex].trim());
			if (oInsertAfterEl.size() > 0) {
				oInsertAfterEl.after(oNewNode);
				return oNewNode;
			}
		}
	}
	if (oNodeToAdd.getAttribute('insertbefore')) {
		var aInsertBefore = oNodeToAdd.getAttribute('insertbefore').split(',');
		for (var nIndex = 0; nIndex < aInsertBefore.length; nIndex++) {
			oInsertBeforeEl = ample.query("#"+aInsertBefore[nIndex].trim());
			if (oInsertBeforeEl.size() > 0) {
				oInsertBeforeEl.before(oNewNode);
				return oNewNode;
			}
		}
	}
	if (oNodeToAdd.getAttribute('position')) {
		var iPosition = parseInt(oNodeToAdd.getAttribute('position'));
		if (iPosition >= 1 && iPosition <= oParent.childNodes.length) {
			//If the position is out of range, simply let it fall through to be appended.
			oParent.insertBefore(oNewNode,oParent.childNodes.item(iPosition-1));
			//The position is "one-based", whereas childNodes are 0-based.  So -1.
			return oNewNode;
		}
	}
	oParent.appendChild(oNewNode);
	return oNewNode;
}

function fXULDocument_mergeAttributes(oAmpleNode,oOverlayNode) {
	if (oOverlayNode.attributes) {
		for (var nCounter = 0; nCounter < oOverlayNode.attributes.length; nCounter++) {
			var oAttr = oOverlayNode.attributes.item(nCounter);
			if (['insertbefore','insertafter','position'].indexOf(oAttr.name) < 0)
				oAmpleNode.setAttribute(oAttr.name,oAttr.value);
		}
		return;
	}
	//else
	for (var nCounter = 0; nCounter < oOverlayNode.attributes.length; nCounter++) {
		var oAttr = oOverlayNode.attributes.item(nCounter);
		if (!(oAttr.value instanceof Function)
			&& !(oAttr.value instanceof Object)
			&& ['insertbefore','insertafter','position'].indexOf(oAttr.name) < 0
		) {
			oAmpleNode.setAttribute(oAttr.name,oAttr.value);
		}
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

// Add cXULDocument-wide events
ample.addEventListener(
	"DOMNodeInsertedIntoDocument",	
	function(oEvent) {
		if (oEvent.target.getAttribute("id")) {
			if (hXULDocument_overlayFragments[oEvent.target.getAttribute("id")]) {
				fXULDocument_applyOverlays(oEvent.target,hXULDocument_overlayFragments[oEvent.target.getAttribute("id")]);
				delete hXULDocument_overlayFragments[oEvent.target.getAttribute("id")];
			}
		}
	},
	true);

ample.addEventListener(
	"DOMAttrModified",	
	function(oEvent) {
		if (oEvent.attrName = "id"
			&& hXULDocument_overlayFragments[oEvent.newValue]) {
			var sFragmentIDs = "";
			for (var sFragmentID in hXULDocument_overlayFragments) {
				sFragmentIDs += sFragmentID + " ";
			}
			fXULDocument_applyOverlays(oEvent.target,hXULDocument_overlayFragments[oEvent.newValue]);
			delete hXULDocument_overlayFragments[oEvent.newValue];
		}
	},
	true);
