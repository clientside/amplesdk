/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cElement	= function(){};

cElement.prototype	= new cNode;
cElement.prototype.nodeType	= 1;	// cNode.ELEMENT_NODE

// nsIDOMElement
cElement.prototype.tagName	= null;
cElement.prototype.uniqueID	= null;

// HTMLElement
cElement.prototype.style	= null;

//
cElement.prototype.$hoverable	= false;

//
cElement.prototype.contentFragment	= null;

// Private Variables
var nElement_prefix	= 0;

// Public Methods
function fElement_appendChild(oParent, oNode) {
	// Call parent class method
	fNode_appendChild(oParent, oNode);

	// Append DOM
	var oGateway, oChild;
	if (oParent.nodeType == 1)	// cNode.ELEMENT_NODE
		if (oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer()))
			if (oChild = (oNode.$getContainer() || fBrowser_render(oNode)))
					oGateway.appendChild(oChild);

	// Register Instance
	if (oDocument_all[oParent.uniqueID])
		fDocument_register(oParent.ownerDocument, oNode);

	//
	return oNode;
};

cElement.prototype.appendChild	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	], this);
//<-Guard

	if (oNode.nodeType == 11)	// cNode.DOCUMENT_FRAGMENT_NODE
		while (oNode.firstChild)
			fElement_appendChild(this, oNode.firstChild);
	else
		fElement_appendChild(this, oNode);
	//
	return oNode;
};

function fElement_insertBefore(oParent, oNode, oBefore) {
	// Call parent class method
	fNode_insertBefore(oParent, oNode, oBefore);
	// Insert DOM
	var oGateway, oChild;
	if (oParent.nodeType == 1)	// cNode.ELEMENT_NODE
		if (oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer()))
			if (oChild = (oNode.$getContainer() || fBrowser_render(oNode)))
				oGateway.insertBefore(oChild, function() {
					for (var oElement; oBefore; oBefore = oBefore.nextSibling)
						if (oElement = oBefore.$getContainer())
							for (; oElement; oElement = oElement.parentNode)
								if (oElement.parentNode == oGateway)
									return oElement;
					return null;
				}());
	// Register Instance
	if (oDocument_all[oParent.uniqueID])
		fDocument_register(oParent.ownerDocument, oNode);

	//
	return oNode;
};

cElement.prototype.insertBefore	= function(oNode, oBefore) {
//->Guard
	fGuard(arguments, [
		["node",	cNode],
		["before",	cNode, false, true]
	], this);
//<-Guard

	if (oBefore) {
		if (this.childNodes.$indexOf(oBefore) !=-1) {
			if (oNode.nodeType == 11)	// cNode.DOCUMENT_FRAGMENT_NODE
				while (oNode.firstChild)
					fElement_insertBefore(this, oNode.firstChild, oBefore);
			else
				fElement_insertBefore(this, oNode, oBefore);
		}
		else
			throw new cDOMException(cDOMException.NOT_FOUND_ERR);
	}
	else {
		if (oNode.nodeType == 11)	// cNode.DOCUMENT_FRAGMENT_NODE
			while (oNode.firstChild)
				fElement_appendChild(this, oNode.firstChild);
		else
			fElement_appendChild(this, oNode);
	}
	return oNode;
};

function fElement_removeChild(oParent, oNode) {
	// Fire Mutation event
	var oEvent	= new cMutationEvent;
	oEvent.initMutationEvent("DOMNodeRemoved", true, false, oParent, null, null, null, null);
	fEventTarget_dispatchEvent(oNode, oEvent);

	// Unregister Instance
	if (oDocument_all[oParent.uniqueID])
		fDocument_unregister(oParent.ownerDocument, oNode);

	// Remove from DOM
	var oGateway, oChild;
	if (oParent.nodeType == 1)	// cNode.ELEMENT_NODE
		if (oGateway = (oParent.$getContainer("gateway") || oParent.$getContainer()))
			if (oChild = oNode.$getContainer())
				if (oChild = (function() {
					for (; oChild; oChild = oChild.parentNode)
						if (oChild.parentNode == oGateway)
							return oChild;
				}()))
					oGateway.removeChild(oChild);

	// Call parent class method
	fNode_removeChild(oParent, oNode);

	return oNode;
};

cElement.prototype.removeChild	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	], this);
//<-Guard

	if (this.childNodes.$indexOf(oNode) !=-1)
		return fElement_removeChild(this, oNode);
	else
		throw new cDOMException(cDOMException.NOT_FOUND_ERR);
};

function fElement_replaceChild(oParent, oNode, oOld) {
	// Call parent class method
	fNode_replaceChild(oParent, oNode, oOld);

	// Unregister Instance
	fDocument_unregister(oParent.ownerDocument, oOld);

	// Replace in from DOM
	var oGateway, oChild, oElement;
	if (oParent.nodeType == 1)	// cNode.ELEMENT_NODE
		if (oElement = oOld.$getContainer())
			if (oGateway =(oParent.$getContainer("gateway") || oParent.$getContainer()))
				if (oChild = (oNode.$getContainer() || fBrowser_render(oNode)))
					oGateway.replaceChild(oChild, oElement);

	// Register Instance
	if (oDocument_all[oParent.uniqueID])
		fDocument_register(oParent.ownerDocument, oNode);

	return oOld;
};

cElement.prototype.replaceChild	= function(oNode, oOld) {
//->Guard
	fGuard(arguments, [
		["node",	cNode],
		["old",		cNode]
	], this);
//<-Guard

	if (this.childNodes.$indexOf(oOld) !=-1) {
		var oBefore	= oOld.nextSibling;
		// First remove node
		fElement_removeChild(this, oOld);
		//
		if (oNode.nodeType == 11) {	// cNode.DOCUMENT_FRAGMENT_NODE
			while (oNode.firstChild)
				if (oBefore)
					fElement_insertBefore(this, oNode.firstChild, oBefore);
				else
					fElement_appendChild(this, oNode.firstChild);
		}
		else
		if (oBefore)
			fElement_insertBefore(this, oNode, oBefore);
		else
			fElement_appendChild(this, oNode);
	}
	else
		throw new cDOMException(cDOMException.NOT_FOUND_ERR);

	//
	return oOld;
};

function fElement_hazAttribute(oElement, sQName) {
	return !!fNamedNodeMap_getNamedItem(oElement.attributes, sQName);
};

cElement.prototype.hasAttribute	= function(sQName) {
//->Guard
	fGuard(arguments, [
		["name",		cString]
	], this);
//<-Guard

	return fElement_hazAttribute(this, sQName);
};

function fElement_hazAttributeNS(oElement, sNameSpaceURI, sLocalName) {
	return !!fNamedNodeMap_getNamedItemNS(oElement.attributes, sNameSpaceURI, sLocalName);
};

cElement.prototype.hasAttributeNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], this);
//<-Guard

	return fElement_hazAttributeNS(this, sNameSpaceURI, sLocalName);
};

function fElement_mapAttribute(oElement, sName, sValue, sValueOld) {
	if (sName == 'id') {
		if (sValue) {
//->Debug
			if (oDocument_ids[sValue])
				fUtilities_warn(sGUARD_NOT_UNIQUE_ID_WRN, [sValue]);
//<-Debug
			oDocument_ids[sValue]	= oElement;
		}
		if (sValueOld)
			delete oDocument_ids[sValueOld];
	}
	// Update view
	var oElementDOM	= oElement.$getContainer();
	if (oElementDOM) {
		if (sName == "class") {
			var sClass	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName + (sValue ? ' ' + sValue : '');
			if (bTrident && nVersion < 8)
				oElementDOM.className	= sClass;
			else
				oElementDOM.setAttribute("class", sClass);
		}
		else
		if (sName == "style")
			oElementDOM.style.cssText	= sValue;
		else
			oElementDOM.id	= sValue ? sValue : oElement.uniqueID;
	}
};

function fElement_setAttribute(oElement, sName, sValue) {
	var oAttribute	= fNamedNodeMap_getNamedItem(oElement.attributes, sName);
	if (!oAttribute || oAttribute.value != sValue) {
		if (oAttribute) {
			var bRegistered	= oDocument_all[oElement.uniqueID],
				bCoreAttr	= sName == 'id' || sName == "class" || sName == "style",
				sValueOld	= oAttribute.value;
			//
			oAttribute.value	=
			oAttribute.nodeValue= sValue;

			if (bRegistered && bCoreAttr)
				fElement_mapAttribute(oElement, sName, sValue, sValueOld);

			// Fire Mutation event
			var oEvent	= new cMutationEvent;
			oEvent.initMutationEvent("DOMAttrModified", true, false, null, sValueOld, sValue, sName, 1 /* cMutationEvent.MODIFICATION */);
			fEventTarget_dispatchEvent(oElement, oEvent);

			// Run mapper
			if (bRegistered && !bCoreAttr && (sName == "xlink:href" || !oAttribute.prefix))
				oElement.$mapAttribute(sName, sValue);
		}
		else {
			oAttribute	= fDocument_createAttributeNS(oElement.ownerDocument, null, sName);
			//
			oAttribute.value	=
			oAttribute.nodeValue= sValue;
			//
			fElement_setAttributeNode(oElement, oAttribute);
		}
	}
};

cElement.prototype.setAttribute	= function(sName, sValue) {
//->Guard
	fGuard(arguments, [
		["name",		cString],
		["value",		cObject]
	], this);
//<-Guard

	fElement_setAttribute(this, sName, cString(sValue));
};

function fElement_setAttributeNS(oElement, sNameSpaceURI, sQName, sValue) {
	if (sNameSpaceURI == null)
		return fElement_setAttribute(oElement, sQName, sValue);

	var aQName		= sQName.split(':'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null;

	var oAttribute	= fElement_getAttributeNS(oElement, sNameSpaceURI, sLocalName);
	if (!oAttribute || oAttribute.value != sValue) {
		// Create new attribute if there is no old
		if (oAttribute) {
			// Global attributes module
			var fConstructor	= hClasses[oAttribute.namespaceURI + '#' + '@' + oAttribute.localName];
			if (fConstructor) {
				var oEvent;

				// Fire Mutation event (pseudo)
				oEvent	= new cMutationEvent;
				oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
				oEvent.target	=
				oEvent.currentTarget	= oAttribute;
				oEvent.eventPhase		= 2 /*cEvent.AT_TARGET*/;
				//
				fEventTarget_handleEvent(oAttribute, oEvent);

				// Fire Mutation event (pseudo)
				oEvent	= new cMutationEvent;
				oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
				oEvent.target	=
				oEvent.currentTarget	= oAttribute;
				oEvent.eventPhase		= 2 /* cEvent.AT_TARGET */;
				//
				fEventTarget_handleEvent(oAttribute, oEvent);
			}
		}
		else {
			// Add prefix declaration for non-system namespaces
			if (sNameSpaceURI != sNS_XMLNS && sNameSpaceURI != sNS_XML) {
				var sElementPrefix	= fNode_lookupPrefix(oElement, sNameSpaceURI);
				if (sPrefix) {
					if (!sElementPrefix || (sPrefix != sElementPrefix))
						// Put namespace declaration
						fElement_setAttributeNS(oElement, sNS_XMLNS, "xmlns" + ':' + sPrefix, sNameSpaceURI);
				}
				else {
					if (sElementPrefix)
						sPrefix	= sElementPrefix;
					else {
						// Create new prefix
						sPrefix	= '_' + 'p' + nElement_prefix++;
						// Put namespace declaration
						fElement_setAttributeNS(oElement, sNS_XMLNS, "xmlns" + ':' + sPrefix, sNameSpaceURI);
					}
					//
					sQName	= sPrefix + ':' + sLocalName;
				}
			}
			oAttribute	= fDocument_createAttributeNS(oElement.ownerDocument, sNameSpaceURI, sQName);
			// New attribute values
			oAttribute.value		=
			oAttribute.nodeValue	= sValue;
			//
			fElement_setAttributeNodeNS(oElement, oAttribute);
		}
	}
};

cElement.prototype.setAttributeNS	= function(sNameSpaceURI, sQName, sValue) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["name",			cString],
		["value",			cObject]
	], this);
//<-Guard

	fElement_setAttributeNS(this, sNameSpaceURI, sQName, cString(sValue));
};

cElement.prototype.setAttributeNode	= function(oAttribute) {
//->Guard
	fGuard(arguments, [
		["node",		cAttr]
	]);
//<-Guard

	// TODO: consider removing if it was attached somewhere else before

	fElement_setAttributeNode(this, oAttribute);
};

function fElement_setAttributeNode(oElement, oAttribute) {
	var oOldAttribute	= fNamedNodeMap_setNamedItem(oElement.attributes, oAttribute);
	// TODO
	//
	oAttribute.ownerElement	= oElement;
	//
	var sName	= oAttribute.name,
		sValue	= oAttribute.value;
	//
	var bRegistered	= oDocument_all[oElement.uniqueID],
		bCoreAttr	= sName == 'id' || sName == "class" || sName == "style";

	if (bRegistered && bCoreAttr)
		fElement_mapAttribute(oElement, sName, sValue, '');

	// Fire Mutation event
	var oEvent	= new cMutationEvent;
	oEvent.initMutationEvent("DOMAttrModified", true, false, null, '', sValue, sName, 2 /* cMutationEvent.ADDITION */);
	fEventTarget_dispatchEvent(oElement, oEvent);

	// Run mapper
	if (bRegistered && !bCoreAttr && (sName == "xlink:href" || !oAttribute.prefix))
		oElement.$mapAttribute(sName, sValue);
};

function fElement_setAttributeNodeNS(oElement, oAttribute) {
	var oOldAttribute	= fNamedNodeMap_setNamedItemNS(oElement.attributes, oAttribute);
	//
	oAttribute.ownerElement	= oElement;

	// Global attributes module
	var fConstructor	= hClasses[oAttribute.namespaceURI + '#' + '@' + oAttribute.localName];
	if (fConstructor) {
		var oEvent;

		if (oOldAttribute) {
			// Fire Mutation event (pseudo)
			oEvent	= new cMutationEvent;
			oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
			oEvent.target	=
			oEvent.currentTarget	= oOldAttribute;
			oEvent.eventPhase		= 2 /*cEvent.AT_TARGET*/;
			//
			fEventTarget_handleEvent(oOldAttribute, oEvent);
		}

		// Fire Mutation event (pseudo)
		oEvent	= new cMutationEvent;
		oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
		oEvent.target	=
		oEvent.currentTarget	= oAttribute;
		oEvent.eventPhase		= 2 /* cEvent.AT_TARGET */;
		//
		fEventTarget_handleEvent(oAttribute, oEvent);
	}
};

cElement.prototype.setAttributeNodeNS	= function(oAttribute) {
//->Guard
	fGuard(arguments, [
		["node",		cAttr]
	]);
//<-Guard

	// TODO: consider removing if it was attached somewhere else before

	fElement_setAttributeNodeNS(this, oAttribute);
};

function fElement_getAttribute(oElement, sQName) {
	var oAttribute	= fElement_getAttributeNode(oElement, sQName);
	return oAttribute ? oAttribute.value : null;
};

cElement.prototype.getAttribute	= function(sQName) {
//->Guard
	fGuard(arguments, [
		["name",		cString]
	], this);
//<-Guard

	return fElement_getAttribute(this, sQName);
};

function fElement_getAttributeNS(oElement, sNameSpaceURI, sLocalName) {
	var oAttribute	= fElement_getAttributeNodeNS(oElement, sNameSpaceURI, sLocalName);
	return oAttribute ? oAttribute.value : null;
};

cElement.prototype.getAttributeNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], this);
//<-Guard

	return fElement_getAttributeNS(this, sNameSpaceURI, sLocalName);
};

function fElement_getAttributeNode(oElement, sName) {
	return fNamedNodeMap_getNamedItem(oElement.attributes, sName);
};

cElement.prototype.getAttributeNode	= function(sQName) {
//->Guard
	fGuard(arguments, [
		["name",		cString]
	], this);
//<-Guard

	return fElement_getAttributeNode(this, sQName);
};

function fElement_getAttributeNodeNS(oElement, sNameSpaceURI, sLocalName) {
	return fNamedNodeMap_getNamedItemNS(oElement.attributes, sNameSpaceURI, sLocalName);
};

cElement.prototype.getAttributeNodeNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], this);
//<-Guard

	return fElement_getAttributeNodeNS(this, sNameSpaceURI, sLocalName);
};

function fElement_removeAttribute(oElement, sName) {
	var oAttribute	= fNamedNodeMap_getNamedItem(oElement.attributes, sName);
	if (oAttribute)
		fElement_removeAttributeNode(oElement, oAttribute);
};

cElement.prototype.removeAttribute	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	], this);
//<-Guard

	fElement_removeAttribute(this, sName);
};

function fElement_removeAttributeNS(oElement, sNameSpaceURI, sLocalName) {
//	if (sNameSpaceURI != null && sLocalName != "xmlns" || sNameSpaceURI == sNS_XMLNS || sNameSpaceURI == sNS_XML) {
		var oAttribute	= fNamedNodeMap_getNamedItemNS(oElement.attributes, sNameSpaceURI, sLocalName);
		if (oAttribute)
			fElement_removeAttributeNode(oElement, oAttribute);
//	}
};

cElement.prototype.removeAttributeNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], this);
//<-Guard

	fElement_removeAttributeNS(this, sNameSpaceURI, sLocalName);
};

cElement.prototype.removeAttributeNode	= function(oAttribute) {
//->Guard
	fGuard(arguments, [
		["node",	cAttr]
	], this);
//<-Guard

	if (oAttribute.ownerElement != this)
		throw new cDOMException(cDOMException.HIERARCHY_REQUEST_ERR);
	//
	fElement_removeAttributeNode(this, oAttribute);
};

function fElement_removeAttributeNode(oElement, oAttribute) {
	// Global attributes module
	if (oAttribute.namespaceURI) {
		var fConstructor= hClasses[oAttribute.namespaceURI + '#' + '@' + oAttribute.localName];
		if (fConstructor) {
			// Fire Mutation event (pseudo)
			var oEvent	= new cMutationEvent;
			oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
			oEvent.target	=
			oEvent.currentTarget	= oAttribute;
			oEvent.eventPhase		= 2 /* cEvent.AT_TARGET */;
			//
			fEventTarget_handleEvent(oAttribute, oEvent);
		}
	}
	else {
		var sName	= oAttribute.name,
			sValue	= oAttribute.value,
			bRegistered	= oDocument_all[oElement.uniqueID],
			bCoreAttr	= sName == 'id' || sName == "class" || sName == "style";

		if (bRegistered && bCoreAttr)
			fElement_mapAttribute(oElement, sName, '', sValue);

		// Fire Mutation event
		var oEvent	= new cMutationEvent;
		oEvent.initMutationEvent("DOMAttrModified", true, false, null, sValue, null, sName, 3 /* cMutationEvent.REMOVAL */);
		fEventTarget_dispatchEvent(oElement, oEvent);

		// Run mapper
		if (bRegistered && !bCoreAttr && (sName == "xlink:href" || sName.indexOf(':') ==-1))
			oElement.$mapAttribute(sName, null);
	}
	//
	fNamedNodeMap_removeNamedItemNS(oElement.attributes, oAttribute.namespaceURI, oAttribute.namespaceURI ? oAttribute.localName : oAttribute.nodeName);
	//
	oAttribute.ownerElement	= null;
};

cElement.prototype.hasChildNodes	= function() {
//->Guard
	fGuard(arguments, [
	], this);
//<-Guard

	return this.childNodes.length > 0;
};

function fElement_getElementsByTagName(oElement, sTagName) {
	var aElements	= new cNodeList,
		bTagName	= '*' == sTagName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == 1) {	// cNode.ELEMENT_NODE
				if (bTagName || sTagName == oNode.tagName)
					aElements.$add(oNode);
				if (oNode.firstChild)
					arguments.callee(oNode);
			}
		}
	})(oElement);
	return aElements;
};

cElement.prototype.getElementsByTagName	= function(sTagName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	], this);
//<-Guard

	return fElement_getElementsByTagName(this, sTagName);
};

function fElement_getElementsByTagNameNS(oElement, sNameSpaceURI, sLocalName) {
	var aElements	= new cNodeList,
		bNameSpaceURI	= '*' == sNameSpaceURI,
		bLocalName		= '*' == sLocalName;
	(function(oElement) {
		for (var nIndex = 0, oNode; oNode = oElement.childNodes[nIndex]; nIndex++) {
			if (oNode.nodeType == 1) {	// cNode.ELEMENT_NODE
				if ((bLocalName || sLocalName == oNode.localName) && (bNameSpaceURI || sNameSpaceURI == oNode.namespaceURI))
					aElements.$add(oNode);
				if (oNode.firstChild)
					arguments.callee(oNode);
			}
		}
	})(oElement);
	return aElements;
};

cElement.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString],
		["localName",		cString]
	], this);
//<-Guard

	return fElement_getElementsByTagNameNS(this, sNameSpaceURI, sLocalName);
};
/*
cElement.prototype.focus	= function() {

};

cElement.prototype.blur	= function() {

};
*/

cElement.prototype.$activate	= function() {
	var oEvent	= new cUIEvent;
	oEvent.initUIEvent("DOMActivate", true, true, window, null);
	fEventTarget_dispatchEvent(this, oEvent);
};

cElement.prototype.$getTag		= function() {
	var aHtml	= [this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(fElement_getAttribute(this, 'id') || this.uniqueID)+ '"')];
	for (var nIndex = 0, oNode; oNode = this.childNodes[nIndex]; nIndex++)
		aHtml[aHtml.length]	= oNode.$getTag();
	return aHtml.join('') + this.$getTagClose();
};

cElement.prototype.$getTagOpen	= function() {
	return '';
};

cElement.prototype.$getTagClose	= function() {
	return '';
};

/*
cElement.prototype.$getContainer	= function(sName) {
	var sId	= this.uniqueID + (sName ? '_' + sName : '');
	if (!this.$cache)
		this.$cache	= {};
	return this.$cache[sId] ||(this.$cache[sId] = oUADocument.getElementById(sId));
};
*/
/*
cElement.prototype.$getContainer	= function(sName) {
		return oUADocument.getElementById(this.uniqueID + (sName ? '_' + sName : ''));
};
*/

function fElement_getBoundingClientRect(oElement, sPseudo) {
	var oElementDOM	= oElement.$getContainer(sPseudo),
		oRectangle	= {},
		oNode,
		nLeft	= 0,
		nTop	= 0,
		nRight	= 0,
		nBottom	= 0;

	if (oElementDOM) {
		// if 'getBoundingClientRect' is supported in the given browser
		if (oElementDOM.getBoundingClientRect) {
			var oClientRect	= oElementDOM.getBoundingClientRect();
			nLeft	= oClientRect.left;
			nTop	= oClientRect.top;
			nRight	= oClientRect.right;
			nBottom	= oClientRect.bottom;
		}
		else {
			// Calculate offsets
			for (oNode = oElementDOM; oNode; oNode = oNode.offsetParent) {
				nLeft	+= oNode.offsetLeft;
				nTop	+= oNode.offsetTop;
			}
			for (oNode = oElementDOM; oNode.nodeType == 1; oNode = oNode.parentNode) {
				nLeft	-= oNode.scrollLeft;
				nTop	-= oNode.scrollTop;
			}
			//
			nRight	= nLeft + oElementDOM.offsetWidth;
			nBottom	= nTop + oElementDOM.offsetHeight;
		}
	}
	oRectangle.left		= nLeft;
	oRectangle.top		= nTop;
	oRectangle.right	= nRight;
	oRectangle.bottom	= nBottom;

	return oRectangle;
};

cElement.prototype.getBoundingClientRect	= function(sPseudo) {
	return fElement_getBoundingClientRect(this, sPseudo || null);
};

cElement.prototype.$isAccessible	= function() {
	return true;
};

/*
cElement.prototype.$getContainer	= function(sName) {
	var sShadow	= '#' +(sName || ''),
		oCache	= oDocument_shadow[this.uniqueID] ||(oDocument_shadow[this.uniqueID] = {});

	if (sShadow in oCache)
		return oCache[sShadow];
	else {
		var oNode	= oUADocument.getElementById(fElement_getAttribute(this, 'id') || this.uniqueID);
		if (sName && oNode) {
			var rClass	= new cRegExp('--' + sName + '(\\s|$)');
			oNode	= (function (oContext, oNode) {
				for (var nIndex = 0, aNodes = oNode.childNodes, oElement, sClass; oNode = aNodes[nIndex]; nIndex++)
					if (oNode.nodeType == 1 && !oNode.id) {
						// If pseudo-element
						if ((sClass = oNode.className) && sClass.match(rClass))
							return oNode;
						// Check children
						if (oElement = arguments.callee(oContext, oNode))
							return oElement;
					}
				return null;
			})(this, oNode);
		}
		return oCache[sShadow]	= oNode;
	}
};
*/
function fElement_getContainerTraverse(oNode, rClass) {
	for (var nIndex = 0, aChildNodes = oNode.childNodes, sClass; oNode = aChildNodes[nIndex]; nIndex++)
		if (oNode.nodeType == 1) {
			// If pseudo-element
			if ((sClass =(bTrident && nVersion < 8 ? oNode.className : oNode.getAttribute("class"))) && sClass.match(rClass))
				return oNode;
			// Check children
			if (!oNode.id &&(oNode = fElement_getContainerTraverse(oNode, rClass)))
				return oNode;
		}
	return null;
};

cElement.prototype.$getContainer	= function(sName) {
	var oElement	= oUADocument.getElementById(fElement_getAttribute(this, 'id') || this.uniqueID);
	if (sName && oElement)
		oElement	= fElement_getContainerTraverse(oElement, new cRegExp('--' + sName + '(\\s|$)'));
	return oElement;
};
/*
cElement.prototype.$getContainer	= function(sName) {
	if (!oDocument_all[this.uniqueID])
		return null;
	var oCache	= oDocument_shadow[this.uniqueID],
		sPseudo	= '--' + (sName || '');
	if (sPseudo in oCache)
		return oCache[sPseudo];
	else {
		var oElement	= oUADocument.getElementById(fElement_getAttribute(this, 'id') || this.uniqueID);
		if (sName && oElement)
			oElement	= fElement_getContainerTraverse(oElement, new cRegExp(sPseudo + '(\\s|$)'));
		return oCache[sPseudo] = oElement;
	}
};
*/
/*
function fElement_setPseudoClass(oElement, sName, bValue, sContainer) {
	var oElementDOM	= oElement.$getContainer(sContainer);
	oElementDOM.className	= oElementDOM.className.replace(/(\w+-[a-z\-]+)?_(\w+)?/ig, '$1_' + (bValue ? sName : ''));
};
*/
/*
function fElement_addClass(oElement, sClass) {
	if (!fElement_hasClass(oElement, sClass))
		oElement.className += ' ' + sClass;
};

function fElement_hasClass(oElement, sClass) {
	return oElement.className.match(fElement_getRegExp(sClass));
};

function fElement_removeClass(oElement, sClass) {
	if (fElement_hasClass(oElement, sClass))
		oElement.className	= oElement.className.replace(fElement_getRegExp(sClass), ' ');
};
*/

var oElement_cache	= {};
function fElement_getRegExp(sName, sContainer) {
	return	oElement_cache[sName + sContainer]
		?	oElement_cache[sName + sContainer]
		:	oElement_cache[sName + sContainer] = new cRegExp('(^|\\s)[-\\w]*' + sContainer + '(_\\w+)?' + '_' + sName + '(_\\w+)?' + '(|$)', 'g');
};

var	aCSSTransition	= [
			"opacity", "color"
			,"backgroundColor", "backgroundPosition"
			,"borderTopColor", "borderLeftColor", "borderRightColor", "borderBottomColor"
			,"borderTopWidth", "borderLeftWidth", "borderRightWidth", "borderBottomWidth"
			,"top", "left", "right", "bottom"
			,"width", "height"
			,"fontSize", "fontWeight", "lineHeight"
			,"marginTop", "marginLeft", "marginRight", "marginBottom"
			,"paddingTop", "paddingLeft", "paddingRight", "paddingBottom"
			,"outlineColor", "outlineWidth"
	];

function fElement_setPseudoClass(oElement, sName, bValue, sContainer) {
	var oElementDOM	= oElement.$getContainer(sContainer);
//->Source
//console.warn("processing: " + oElement.tagName + ' ' + sName + '(' + (bValue ? 'true' : 'false') + ')');
//console.log("before: ", oElementDOM.className);
//<-Source
	if (oElementDOM) {
		var sOldName	= bTrident && nVersion < 8 ? oElementDOM.className : oElementDOM.getAttribute("class") || '',
			sNewName	= fElement_getPseudoClass(oElement, sName, bValue, sContainer, oElementDOM);

		if (sOldName != sNewName) {
			// Apply new class to get transition CSS properties
			if (bTrident && nVersion < 8)
				oElementDOM.className	= sNewName;
			else
				oElementDOM.setAttribute("class", sNewName);

			// Transition effects in IE10-
			if (bTrident && nVersion < 10 && oDOMConfiguration_values["ample-fix-ie-css-transitions"] &&!(nResizeManager_resizeState || nDragAndDropManager_dragState)) {
				//
				var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
					sTransition	= oComputedStyle["transition"],
					aTransitions= [],
					sKey, nIndex, nLength;
				if (sTransition) {
					var aValue	= sTransition.trim().split(','),
						oTransition;
					for (nIndex = 0, nLength = aValue.length; nIndex < nLength; nIndex++) {
						oTransition	= aValue[nIndex].trim().split(/\s+/);
						sKey	= fUtilities_toCssPropertyName(oTransition[0]);
						if (sKey != "none" && aCSSTransition.indexOf(sKey) !=-1)
							aTransitions[aTransitions.length]	= [
										sKey,
										fSMILTimeElement_parseDuration(oTransition[1]),
										oTransition[2],
										fSMILTimeElement_parseDuration(oTransition[3])
								];
					}
				}
				else
				if (sKey = oComputedStyle["transition-property"]) {
					sKey	= fUtilities_toCssPropertyName(sKey);
					if (sKey != "none" && aCSSTransition.indexOf(sKey) !=-1)
						aTransitions	= [[
									sKey,
									fSMILTimeElement_parseDuration(oComputedStyle["transition-duration"]),
									oComputedStyle["transition-timing-function"],
									fSMILTimeElement_parseDuration(oComputedStyle["transition-delay"])
							]];
				}

				//
				if (aTransitions.length) {
/*
					if (oElement.$transition) {
						fNodeAnimation_clear(oElement.$transition);
						delete oElement.$transition;
					}
*/
					// Apply old class to get initial CSS values
					if (nVersion < 8)
						oElementDOM.className	= sOldName;
					else
						oElementDOM.setAttribute("class", sOldName);

					// Read initial CSS values
					for (var nIndex = 0, nLength = aTransitions.length; nIndex < nLength; nIndex++)
						aTransitions[nIndex][4]	= fBrowser_getStyle(oElementDOM, aTransitions[nIndex][0], oComputedStyle);

					// Re-apply new class
					if (nVersion < 8)
						oElementDOM.className	= sNewName;
					else
						oElementDOM.setAttribute("class", sNewName);

					// FIXME: transition-delay property not implemented
					var oTransition,
						oProperties,
						nIndex, nLength, sKey, sValue;
					for (nIndex = 0, nLength = aTransitions.length; nIndex < nLength; nIndex++) {
						oTransition	= aTransitions[nIndex];
						sKey	= oTransition[0];
						sValue	= fBrowser_getStyle(oElementDOM, sKey, oComputedStyle);
						if (oTransition[4] != sValue) {
							//
							fBrowser_setStyle(oElementDOM, sKey, oTransition[4]);
							oProperties	= {};
							oProperties[sKey]	= sValue;
							//
							fNodeAnimation_play(oElement, oProperties, oTransition[1], oTransition[2], (function(sKey) {
								return function() {fBrowser_setStyle(oElementDOM, sKey, '')};
							})(sKey), sContainer);
						}
					}
				}
/*
				fEventTarget_addEventListener(oElement, "effectend", function() {
					fEventTarget_removeEventListener(oElement, "effectend", arguments.callee);
					delete oElement.$transition;
				});
*/
			}
		}
	}
//->Debug
	else
		fUtilities_warn(sGUARD_NOT_FOUND_SHADOW_WRN, [oElement.tagName, sContainer || '']);
//<-Debug

//->Source
//console.log("after: ", oElementDOM.className);
//<-Source
};

function fElement_getPseudoClass(oElement, sName, bValue, sContainer, oElementDOM) {
	var sValue		= fElement_getAttribute(oElement, "class"),
		sClass		= sValue ? sValue.trim() : '',
		aClass		= sClass.length ? sClass.split(/\s+/g) : null,
		sPseudoName	= sContainer ? '--' + sContainer : '',
		sTagName	=(oElement.prefix ? oElement.prefix + '-' : '') + oElement.localName,
		sOldName	= bTrident && nVersion < 8 ? oElementDOM.className : oElementDOM.getAttribute("class") || '',
		bMatch		= sOldName.match(fElement_getRegExp(sName, sPseudoName)),
		sNewName	= '',
		sPseudo;

	if (bValue) {
		// Add class
		if (!bMatch) {
			var aPseudo	= sOldName.replace(/_\w+_\w+/g, '').match(/_\w+/g),
				aNewName= [];
			// create pair combinations :hover:focus, :focus:hover
			if (aPseudo)
				for (var nIndex = 0, nLength = aPseudo.length, oCache = {}; nIndex < nLength; nIndex++) {
					sPseudo	= aPseudo[nIndex];
					if (!oCache[sPseudo]) {
						if (aClass)
							for (var nClass = 0; nClass < aClass.length; nClass++) {
								sClass	= aClass[nClass];
								aNewName.push(	// ns|element.class(::pseudo-element)?:pseudo-class:pseudo-class2
												' ' + sTagName + '-' + sClass + sPseudoName + '_' + sName + sPseudo +
												// ns|element.class(::pseudo-element)?:pseudo-class2:pseudo-class
												' ' + sTagName + '-' + sClass + sPseudoName + sPseudo + '_' + sName +
												// .class(::pseudo-element)?:pseudo-class:pseudo-class2
												' ' + sClass + sPseudoName + '_' + sName + sPseudo +
												// .class(::pseudo-element)?:pseudo-class2:pseudo-class
												' ' + sClass + sPseudoName + sPseudo + '_' + sName);
							}
						// ns|element(::pseudo-element)?:pseudo-class:pseudo-class2
						aNewName.push(	' ' + sTagName + sPseudoName + '_' + sName + sPseudo);
						// ns|element(::pseudo-element)?:pseudo-class2:pseudo-class
						aNewName.push(	' ' + sTagName + sPseudoName + sPseudo + '_' + sName);
						// indicate class name processed
						oCache[sPseudo]	= true;
					}
				}
			if (aClass)
				for (var nClass = 0; nClass < aClass.length; nClass++) {
					sClass	= aClass[nClass];
					aNewName.push(	// ns|element.class(::pseudo-element)?:pseudo-class
									' ' + sTagName + '-' + sClass + sPseudoName + '_' + sName +
									// .class(::pseudo-element)?:pseudo-class
									' ' + sClass + sPseudoName + '_' + sName);
				}
			// ns|element(::pseudo-element)?:pseudo-class
			aNewName.push(	' ' + sTagName + sPseudoName + '_' + sName);
			sNewName	= sOldName + aNewName.join('');
		}
	}
	else {
		// Remove class
		if (bMatch) {
			// remove all classes having :pseudo-class
			sNewName	= sOldName.replace(fElement_getRegExp(sName, sPseudoName), '');	// TODO: Remove space?
		}
	}
	return sNewName || sOldName;
};

// Attaching to implementation
cElement.prototype.$setPseudoClass	= function(sName, bState, sContainer) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["state",	cBoolean],
		["pseudoElement",	cString, true]
	]);
//<-Guard

	fElement_setPseudoClass(this, sName, bState, sContainer);
};

cElement.prototype.$getStyle	= function(sName) {
	var oElementDOM	= this.$getContainer();
	return oElementDOM ? fBrowser_getStyle(oElementDOM, fUtilities_toCssPropertyName(sName), oElementDOM.style) : '';
};

cElement.prototype.$setStyle	= function(sName, sValue) {
	var oElementDOM	= this.$getContainer();
	if (oElementDOM)
		fBrowser_setStyle(oElementDOM, fUtilities_toCssPropertyName(sName), sValue);
};

cElement.prototype.$getStyleComputed	= function(sName) {
	var oElementDOM	= this.$getContainer();
	return oElementDOM ? fBrowser_getStyle(oElementDOM, fUtilities_toCssPropertyName(sName)) : '';
};

cElement.prototype.$mapAttribute	= function(sName, sValue) {
	// Should be implemented in elements
};

cElement.prototype.scrollIntoView	= function(bTop) {
//->Guard
	fGuard(arguments, [
		["top",	cBoolean, true, false]	// Optional, null is not allowed
	]);
//<-Guard

	var oElementDOM	= this.$getContainer();
	if (oElementDOM) {
		if (oElementDOM.scrollIntoView)
			oElementDOM.scrollIntoView(bTop || false);
		else {
			// TODO: Implement. FF for example doesn't support it on SVG elements
		}
	}
};

/*
cElement.prototype.$getPseudoElement	= function(sName) {
		return this.$getContainer(sName);
};
*/
