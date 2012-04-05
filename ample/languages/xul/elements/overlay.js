/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_overlay	= function(){};
cXULElement_overlay.prototype	= new cXULElement("overlay");

// Functions for merging overlay DOM into Ample DOM
function fXULElement_overlay_applyOverlays(oAmpleNode, oOverlayNode) {
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
		var oOverlayChild	= oOverlayNode.childNodes[nIndex];
		if (oOverlayChild.nodeType == ample.classes.Node.TEXT_NODE && oOverlayChild.nodeValue.trim() == '')
			continue;
		if (oOverlayChild.nodeType == ample.classes.Node.COMMENT_NODE)
			continue;
		if (oOverlayChild.nodeType == ample.classes.Node.ELEMENT_NODE) {
			var oAmpleMatchingElement	= null;
			if (oOverlayChild.getAttribute('id')) {
				// Our overlay node child has an ID.
				var sId	= oOverlayChild.getAttribute('id');
				oAmpleMatchingElement	= ample.getElementById(sId);
				if (!oAmpleMatchingElement) {
					// Our id doesn't match an existing element, ...
					if (oOverlayNode == oOverlayNode.ownerDocument.documentElement) {
						// ...and it's a child of the overlay root, so store it for later, and
						// skip to the next child.
						hXULDocument_overlayFragments[sId]	= oOverlayChild;
						continue;
					}
					else {
						//...and it's not a child of the overlay root, so add it to the current node.
						oAmpleMatchingElement	= fXULElement_overlay_importAndAdd(oAmpleNode, oOverlayChild);
					}
				}
				else {
					// Our id does match an existing element
					// Check to see if this is a remove instruction...
					if (oOverlayChild.getAttribute('removeelement') == 'true')	{
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
					oAmpleMatchingElement	= fXULElement_overlay_importAndAdd(oAmpleNode.ownerDocument.documentElement, oOverlayChild);
				}
				else {
					// ...and it's not a child of root, so add it to the current node.
					oAmpleMatchingElement	= fXULElement_overlay_importAndAdd(oAmpleNode, oOverlayChild); // We don't have an id, so insert.
				}
			}
			fXULElement_overlay_mergeAttributes(oAmpleMatchingElement, oOverlayChild);
			fXULElement_overlay_applyOverlays(oAmpleMatchingElement, oOverlayChild);
		}
		else
			alert('Non-XUL element in overlay.'+oOverlayChild); // We have a non-XUL element, alert.
	}
};

function fXULElement_overlay_importAndAdd(oParent, oOverlayNodeToAdd) {
	var oAmpleNewNode	= ample.importNode(oOverlayNodeToAdd, false);
	// Remove insertafter, insertbefore, and position attributes from node to be inserted.
	var hAttributeFilter	= {insertafter:1, insertbefore:1, position:1};
	for (var sAttributeName in hAttributeFilter) {
		if (hAttributeFilter.hasOwnProperty(sAttributeName))
			if (oAmpleNewNode.hasAttribute(sAttributeName))
				oAmpleNewNode.removeAttribute(sAttributeName);
	}
	if (oOverlayNodeToAdd.getAttribute('insertafter')) {
		var aInsertAfter	= oOverlayNodeToAdd.getAttribute('insertafter').split(',');
		for (var nIndex = 0; nIndex < aInsertAfter.length; nIndex++) {
			oInsertAfterElement	= ample.getElementById(aInsertAfter[nIndex].trim());
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
		var aInsertBefore	= oOverlayNodeToAdd.getAttribute('insertbefore').split(',');
		for (var nIndex = 0; nIndex < aInsertBefore.length; nIndex++) {
			oInsertBeforeElement	= ample.getElementById(aInsertBefore[nIndex].trim());
			if (oInsertBeforeElement) {
				oParent.insertBefore(oAmpleNewNode, oInsertBeforeElement);
				return oAmpleNewNode;
			}
		}
	}
	if (oOverlayNodeToAdd.getAttribute('position')) {
		var nPosition	= oOverlayNodeToAdd.getAttribute('position') * 1;
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

function fXULElement_overlay_mergeAttributes(oAmpleNode, oOverlayNode) {
	var hAttributeFilter	= {insertafter:1, insertbefore:1, position:1};
	if (oOverlayNode.attributes) {
		for (var nCounter = 0; nCounter < oOverlayNode.attributes.length; nCounter++) {
			var oAttr	= oOverlayNode.attributes[nCounter];
			if (!hAttributeFilter.hasOwnProperty(oAttr.name) || !hAttributeFilter[oAttr.name])
				oAmpleNode.setAttribute(oAttr.name, oAttr.value);
		}
		return;
	}
	// else
	for (var nCounter = 0; nCounter < oOverlayNode.attributes.length; nCounter++) {
		var oAttr	= oOverlayNode.attributes[nCounter];
		if (!(oAttr.value instanceof Function) && !(oAttr.value instanceof Object) && (!hAttributeFilter.hasOwnProperty(oAttr.name) || !hAttributeFilter[oAttr.name])) {
			oAmpleNode.setAttribute(oAttr.name, oAttr.value);
		}
	}
}


// Element Render: open
cXULElement_overlay.prototype.$getTagOpen	= function() {
	return '';
};

// Register Element
ample.extend(cXULElement_overlay);
