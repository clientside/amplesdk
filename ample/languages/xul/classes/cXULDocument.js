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
				// oOverlay	= ample.importNode(oResponse.documentElement, true);
				oOverlayDocumentElement = oResponse.documentElement; // We can't import the overlay document 
									// because we still need to differentiate
									// between the ample Document and the Overlay
									// Document.
				// Kick off processing
				fXULElement_applyOverlays(oDocument.documentElement, oOverlayDocumentElement);
				// Overlay applied, notify observer.
				// TODO: This is not really an observer in the XBL sense, but a callback function.
				if (fObserver instanceof Function)
					fObserver();
			}
	});
};

cXULDocument.prototype.applyOverlay	= function(oOverlayDocumentElement) {
	fXULElement_applyOverlays(this.documentElement, oOverlayDocumentElement);
};

function fXULElement_applyOverlays(oAmpleNode, oOverlayNode) {
/*
	For each child of the overlay node, if:
	  - it does have an ID and:
		-- that ID matches an existing node in the ample document, then if
		   --- it has an attribute "removeelement" with a value of "true", remove the element and all children, 
			if it exists
		   --- otherwise, the attributes of the overlay node are merged with the ample node, 
			and the process repeats for all children.
		-- it doesn't match an existing ID in the ample document, then if
		   --- these are children of the root node, then
			it gets stored until that ID appears and applied later, possibly in another overlay or 
			javascript insert.
		   --- otherwise, it gets inserted into the ample node passed in by this function 
			and the process repeats for all children.	
	  - it doesn't have an ID, then if
		   --- these are children of the root node, then
			it gets inserted into the root of the document, and the process repeats for all children.
		   --- otherwise, it gets inserted into the ample node passed in by this function 
			and the process repeats for all children.	
*/
	// Action...
	for (var nIndex = 0; nIndex < oOverlayNode.childNodes.length; nIndex++) {
		var oOverlayChild = oOverlayNode.childNodes[nIndex];
		if (oOverlayChild.nodeType == ample.classes.Node.TEXT_NODE && oOverlayChild.nodeValue.trim() == '')
			continue;
		if (oOverlayChild.nodeType == ample.classes.Node.COMMENT_NODE)
			continue;
		if (oOverlayChild.nodeType == ample.classes.Node.ELEMENT_NODE) {
			var oAmpleMatchingElement = null;
			if (oOverlayChild.getAttribute('id')) {
				// Our overlay node child has an ID.
				var sID = oOverlayChild.getAttribute('id');
				oAmpleMatchingElement = ample.getElementById(sID);
				if (!oAmpleMatchingElement) {
					// Our id doesn't match an existing element, ...
					if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
						// ...and it's a child of the overlay root, so store it for later, and
						// skip to the next child.
						hXULDocument_overlayFragments[sID] = oOverlayChild;
						continue;
					}
					else {
						//...and it's not a child of the overlay root, so add it to the current node.
						oAmpleMatchingElement = fXULElement_importAndAdd(oAmpleNode, oOverlayChild);
					}
				}
				else {
					// Our id does match an existing element
					// Check to see if this is a remove instruction...
					if (oOverlayChild.getAttribute('removeelement') && oOverlayChild.getAttribute('removeelement') == 'true')	{
						// Remove it, and all children, and skip to the next child.
						oAmpleMatchingElement.parentNode.removeChild(oAmpleMatchingElement);
						continue;
					}
					// Otherwise, just allow it to merge.
				}
			}
			else {
				// Our overlay node child doesn't have an ID.
				if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
					// ...and it's a child of the overlay root, so insert it into the root.
					oAmpleMatchingElement = fXULElement_importAndAdd(oAmpleNode.ownerDocument.documentElement, oOverlayChild);
				}
				else {
					// ...and it's not a child of root, so add it to the current node.
					oAmpleMatchingElement = fXULElement_importAndAdd(oAmpleNode, oOverlayChild); // We don't have an id, so insert.
				}
			}
			fXULElement_mergeAttributes(oAmpleMatchingElement, oOverlayChild);
			fXULElement_applyOverlays(oAmpleMatchingElement, oOverlayChild);
		}
		else
			alert('Non-XUL element in overlay.'+oOverlayChild); // We have a non-XUL element, alert.
	}
};

function fXULElement_importAndAdd(oParent, oOverlayNodeToAdd) {
	var oAmpleNewNode = ample.importNode(oOverlayNodeToAdd, false);
	// Remove insertafter, insertbefore, and position attributes from node to be inserted.
	for (var sAttributeName in {insertafter:0, insertbefore:0, position:0}) {
		if (oAmpleNewNode.hasAttribute(sAttributeName))
			oAmpleNewNode.removeAttribute(sAttributeName);
	}
	if (oOverlayNodeToAdd.getAttribute('insertafter')) {
		var aInsertAfter = oOverlayNodeToAdd.getAttribute('insertafter').split(',');
		for (var nIndex = 0; nIndex < aInsertAfter.length; nIndex++) {
			oInsertAfterElement = ample.getElementById(aInsertAfter[nIndex].trim());
			// Find the index
			for (var nAfterIndex = 0; nAfterIndex < oParent.childNodes.length; nAfterIndex++) {
				if (oParent.childNodes[nAfterIndex] == oInsertAfterElement) {
					if (nAfterIndex == oParent.childNodes.length-1)
						oParent.appendChild(oAmpleNewNode);
					else
						oParent.insertBefore(oAmpleNewNode, oParent.childNodes[nAfterIndex+1]);
					return oAmpleNewNode;
				}
			}
		}
	}
	if (oOverlayNodeToAdd.getAttribute('insertbefore')) {
		var aInsertBefore = oOverlayNodeToAdd.getAttribute('insertbefore').split(',');
		for (var nIndex = 0; nIndex < aInsertBefore.length; nIndex++) {
			oInsertBeforeElement = ample.getElementById(aInsertBefore[nIndex].trim());
			if (oInsertBeforeElement) {
				oParent.insertBefore(oAmpleNewNode, oInsertBeforeElement);
				return oAmpleNewNode;
			}
		}
	}
	if (oOverlayNodeToAdd.getAttribute('position')) {
		var nPosition = parseInt(oOverlayNodeToAdd.getAttribute('position'));
		if (nPosition >= 1 && nPosition <= oParent.childNodes.length) {
			// If the position is out of range, simply let it fall through to be appended.
			oParent.insertBefore(oAmpleNewNode, oParent.childNodes[nPosition-1]);
			// The position is "one-based", whereas childNodes are 0-based.  So -1.
			return oAmpleNewNode;
		}
	}
	oParent.appendChild(oAmpleNewNode);
	return oAmpleNewNode;
}

function fXULElement_mergeAttributes(oAmpleNode, oOverlayNode) {
	var aFilterAttributeNames = ['insertbefore', 'insertafter', 'position'];
	if (oOverlayNode.attributes) {
		for (var nCounter = 0; nCounter < oOverlayNode.attributes.length; nCounter++) {
			var oAttr = oOverlayNode.attributes[nCounter];
			if (aFilterAttributeNames.indexOf(oAttr.name) < 0)
				oAmpleNode.setAttribute(oAttr.name, oAttr.value);
		}
		return;
	}
	// else
	for (var nCounter = 0; nCounter < oOverlayNode.attributes.length; nCounter++) {
		var oAttr = oOverlayNode.attributes[nCounter];
		if (!(oAttr.value instanceof Function) && !(oAttr.value instanceof Object) && aFilterAttributeNames.indexOf(oAttr.name) < 0) {
			oAmpleNode.setAttribute(oAttr.name, oAttr.value);
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
		if (oEvent.target.hasAttribute("id")) {
			if (hXULDocument_overlayFragments[oEvent.target.getAttribute("id")]) {
				fXULElement_applyOverlays(oEvent.target, hXULDocument_overlayFragments[oEvent.target.getAttribute("id")]);
				delete hXULDocument_overlayFragments[oEvent.target.getAttribute("id")];
			}
		}
	},
	true);

ample.addEventListener(
	"DOMAttrModified",	
	function(oEvent) {
		if (oEvent.attrName = "id" && hXULDocument_overlayFragments[oEvent.newValue]) {
			var sFragmentIDs = "";
			for (var sFragmentID in hXULDocument_overlayFragments) {
				if (hXULDocument_overlayFragments.hasOwnProperty(sFragmentID))
					sFragmentIDs += sFragmentID + " ";
			}
			fXULElement_applyOverlays(oEvent.target, hXULDocument_overlayFragments[oEvent.newValue]);
			delete hXULDocument_overlayFragments[oEvent.newValue];
		}
	},
	true);
