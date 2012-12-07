/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cNode	= function(){};

// nsIDOMNode

// Constants
cNode.ELEMENT_NODE				= 1;
cNode.ATTRIBUTE_NODE			= 2;
cNode.TEXT_NODE					= 3;
cNode.CDATA_SECTION_NODE		= 4;
cNode.ENTITY_REFERENCE_NODE		= 5;
cNode.ENTITY_NODE				= 6;
cNode.PROCESSING_INSTRUCTION_NODE	= 7;
cNode.COMMENT_NODE				= 8;
cNode.DOCUMENT_NODE				= 9;
cNode.DOCUMENT_TYPE_NODE		= 10;
cNode.DOCUMENT_FRAGMENT_NODE	= 11;
cNode.NOTATION_NODE				= 12;

// Public Properties
cNode.prototype.nodeType		= null;
cNode.prototype.nodeName		= null;
cNode.prototype.nodeValue		= null;
cNode.prototype.ownerDocument	= null;
cNode.prototype.localName		= null;
cNode.prototype.namespaceURI	= null;
cNode.prototype.prefix			= null;
cNode.prototype.attributes		= null;
cNode.prototype.childNodes		= null;
cNode.prototype.firstChild		= null;
cNode.prototype.lastChild		= null;
cNode.prototype.nextSibling		= null;
cNode.prototype.previousSibling	= null;
cNode.prototype.parentNode		= null;

// nsIDOM3Node
cNode.prototype.baseURI		= null;
cNode.prototype.textContent	= null;

// Constants
cNode.DOCUMENT_POSITION_DISCONNECTED	= 1;
cNode.DOCUMENT_POSITION_PRECEDING		= 2;
cNode.DOCUMENT_POSITION_FOLLOWING		= 4;
cNode.DOCUMENT_POSITION_CONTAINS		= 8;
cNode.DOCUMENT_POSITION_CONTAINED_BY	= 16;
cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC	= 32;

function fNode_getBaseURI(oNode) {
	var sBaseUri	= '';
	for (var oParent = oNode, sUri; oParent; oParent = oParent.parentNode)
		if (oParent.nodeType == 1 /* cNode.ELEMENT_NODE */ && (sUri = fElement_getAttribute(oParent, "xml:base")))
			sBaseUri	= fUtilities_resolveUri(sUri, sBaseUri);
	return sBaseUri;
};

function fNode_getTextContent(oNode) {
	for (var nIndex = 0, aText = [], oChild; oChild = oNode.childNodes[nIndex]; nIndex++)
		if (oChild.nodeType == 3 /* cNode.TEXT_NODE */ || oChild.nodeType == 4 /* cNode.CDATA_SECTION_NODE */)
			aText.push(oChild.data);
		else
		if (oChild.nodeType == 1 /* cNode.ELEMENT_NODE */ && oChild.firstChild)
			aText.push(fNode_getTextContent(oChild));
	return aText.join('');
};

// nsIDOMNode
function fNode_appendChild(oParent, oNode) {
	// Remove element from previous location
	if (oNode.parentNode) {
		// Fire Mutation event
		var oEvent	= new cMutationEvent;
		oEvent.initMutationEvent("DOMNodeRemoved", true, false, oNode.parentNode, null, null, null, null);
		fEventTarget_dispatchEvent(oNode, oEvent);

		//
		fNode_removeChild(oNode.parentNode, oNode);
	}

	// Set DOM properties
	oNode.parentNode	= oParent;

	var oLast	= oParent.lastChild;
	if (oLast) {
		oNode.previousSibling	= oLast;
		oLast.nextSibling	= oNode;
	}
	else
		oParent.firstChild	= oNode;
	oParent.lastChild	= oNode;

	oParent.childNodes.$add(oNode);

	// Fire Mutation event
	var oEvent	= new cMutationEvent;
	oEvent.initMutationEvent("DOMNodeInserted", true, false, oParent, null, null, null, null);
	fEventTarget_dispatchEvent(oNode, oEvent);

	return oNode;
};

cNode.prototype.appendChild	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	// Additional check: if document has documentElement already, no other element children can be added
	if (this.nodeType == 9 && this.documentElement && oNode.nodeType == 1)
		throw new cDOMException(cDOMException.HIERARCHY_REQUEST_ERR);

	fNode_appendChild(this, oNode);

	// Register Instance (special case for anonymous DocumentFragment)
	if (this.nodeType == 11 && this.parentNode && oDocument_all[this.parentNode.uniqueID])
		fDocument_register(this.ownerDocument, oNode);

	return oNode;
};

function fNode_insertBefore(oParent, oNode, oBefore) {
	// Remove element from previous location
	if (oNode.parentNode) {
		// Fire Mutation event
		var oEvent	= new cMutationEvent;
		oEvent.initMutationEvent("DOMNodeRemoved", true, false, oNode.parentNode, null, null, null, null);
		fEventTarget_dispatchEvent(oNode, oEvent);

		//
		fNode_removeChild(oNode.parentNode, oNode);
	}

	// Set DOM properties
	oNode.parentNode	= oParent;

	var oPrevious	= oBefore.previousSibling;
	if (oPrevious) {
		oNode.previousSibling	= oPrevious;
		oPrevious.nextSibling	= oNode;
	}
	else
		oParent.firstChild	= oNode;

	oNode.nextSibling	= oBefore;
	oBefore.previousSibling	= oNode;

	oParent.childNodes.$add(oNode, oParent.childNodes.$indexOf(oBefore));

	// Fire Mutation event
	var oEvent	= new cMutationEvent;
	oEvent.initMutationEvent("DOMNodeInserted", true, false, oParent, null, null, null, null);
	fEventTarget_dispatchEvent(oNode, oEvent);

	return oNode;
};

cNode.prototype.insertBefore	= function(oNode, oBefore) {
//->Guard
	fGuard(arguments, [
		["node",	cNode],
		["before",	cNode, false, true]
	]);
//<-Guard

	// Additional check: if document has documentElement already, no other children can be added
	if (this.nodeType == 9 && this.documentElement && oNode.nodeType == 1)
		throw new cDOMException(cDOMException.HIERARCHY_REQUEST_ERR);

	if (oBefore) {
		if (this.childNodes.$indexOf(oBefore) !=-1)
			fNode_insertBefore(this, oNode, oBefore);
		else
			throw new cDOMException(cDOMException.NOT_FOUND_ERR);
	}
	else
		fNode_appendChild(this, oNode);

	// Register Instance (special case for anonymous DocumentFragment)
	if (this.nodeType == 11 && this.parentNode && oDocument_all[this.parentNode.uniqueID])
		fDocument_register(this.ownerDocument, oNode);

	return oNode;
};

function fNode_removeChild(oParent, oNode) {
	var oNext		= oNode.nextSibling,
		oPrevious	= oNode.previousSibling;

	if (oNext)
		oNext.previousSibling	= oPrevious;
	else
		oParent.lastChild	= oPrevious;

	if (oPrevious)
		oPrevious.nextSibling	= oNext;
	else
		oParent.firstChild	= oNext;

	// Reset DOM properties
	oNode.parentNode		= null;
	oNode.previousSibling	= null;
	oNode.nextSibling		= null;

	return oParent.childNodes.$remove(oNode);
};

cNode.prototype.removeChild	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	if (this.childNodes.$indexOf(oNode) !=-1)
		fNode_removeChild(this, oNode);
	else
		throw new cDOMException(cDOMException.NOT_FOUND_ERR);

	// Unregister Instance (special case for anonymous DocumentFragment)
	if (this.nodeType == 11 && this.parentNode && oDocument_all[this.parentNode.uniqueID])
		fDocument_unregister(this.ownerDocument, oNode);

	return oNode;
};

function fNode_replaceChild(oParent, oNode, oOld) {
	var oBefore	= oOld.nextSibling;
	// First remove old child
	fNode_removeChild(oParent, oOld);
	// Next insert new child
	if (oBefore)
		fNode_insertBefore(oParent, oNode, oBefore);
	else
		fNode_appendChild(oParent, oNode);

	return oOld;
};

cNode.prototype.replaceChild	= function(oNode, oOld) {
//->Guard
	fGuard(arguments, [
		["node",	cNode],
		["old",		cNode]
	]);
//<-Guard

	if (this.childNodes.$indexOf(oOld) !=-1)
		fNode_replaceChild(this, oNode, oOld);
	else
		throw new cDOMException(cDOMException.NOT_FOUND_ERR);

	// Unregister Instance (special case for anonymous DocumentFragment)
	if (this.nodeType == 11 && this.parentNode && oDocument_all[this.parentNode.uniqueID])
		fDocument_unregister(this.ownerDocument, oOld);

	// Register Instance (special case for anonymous DocumentFragment)
	if (this.nodeType == 11 && this.parentNode && oDocument_all[this.parentNode.uniqueID])
		fDocument_register(this.ownerDocument, oNode);

	return oOld;
};

function fNode_cloneNode(oNode, bDeep) {
	var oClone;
	switch (oNode.nodeType) {
		case 1:	// cNode.ELEMENT_NODE
			// Create Element
			oClone	= fDocument_createElementNS(oNode.ownerDocument, oNode.namespaceURI, oNode.nodeName);

			// Copy Attributes
			for (var nIndex = 0, nLength = oNode.attributes.length; nIndex < nLength; nIndex++)
				fElement_setAttributeNodeNS(oClone, fNode_cloneNode(oNode.attributes[nIndex]));

			// Append Children
			if (bDeep)
				for (var nIndex = 0; nIndex < oNode.childNodes.length; nIndex++)
					fNode_appendChild(oClone, fNode_cloneNode(oNode.childNodes[nIndex], bDeep));
			break;

		case 2:	// cNode.ATTRIBUTE_NODE
			oClone	= fDocument_createAttributeNS(oNode.ownerDocument, oNode.namespaceURI, oNode.nodeName);
			oClone.value	=
			oClone.nodeValue	= oNode.value;
			break;

		case 3:	// cNode.TEXT_NODE
			oClone	= fDocument_createTextNode(oNode.ownerDocument, oNode.data);
			break;

		case 4:	// cNode.CDATA_SECTION_NODE
			oClone	= fDocument_createCDATASection(oNode.ownerDocument, oNode.data);
			break;

		default:
			throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	}
	return oClone;
};

cNode.prototype.cloneNode	= function(bDeep) {
//->Guard
	fGuard(arguments, [
		["deep",	cBoolean]
	]);
//<-Guard

	return fNode_cloneNode(this, bDeep);
};

// nsIDOM3Node
cNode.prototype.getFeature		= function(sFeature, sVersion) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cNode.prototype.getUserData	= function(sKey) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cNode.prototype.setUserData	= function(sKey, sData, fHandler) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cNode.prototype.isEqualNode	= function(oNode) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cNode.prototype.isSameNode	= function(oNode) {
	return this == oNode;
};

function fNode_lookupPrefix(oNode, sNameSpaceURI) {
	// XML prefixes
	if (sNameSpaceURI == sNS_XML)
		return "xml";
	if (sNameSpaceURI == sNS_XMLNS)
		return "xmlns";
	// Custom prefixes
	for (var aPrefixes = {}, sPrefix; oNode && oNode.nodeType != 9; oNode = oNode.parentNode) {
		if (oNode.namespaceURI == sNameSpaceURI)
			return oNode.prefix;
		else
		if (oNode.nodeType == 1)	// cNode.ELEMENT_NODE
			for (var nIndex = 0, nLength = oNode.attributes.length, oAttribute; nIndex < nLength; nIndex++)
				if ((oAttribute = oNode.attributes[nIndex]).prefix == "xmlns") {
					sPrefix	= oAttribute.localName;
					if (oAttribute.value == sNameSpaceURI)
						return sPrefix in aPrefixes ? '' : sPrefix;
					else
						aPrefixes[sPrefix]	= true;
				}
	}
	return null;
};

cNode.prototype.lookupPrefix	= function(sNameSpaceURI) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true]
	]);
//<-Guard

	return fNode_lookupPrefix(this, sNameSpaceURI);
};

function fNode_isDefaultNamespace(oNode, sNameSpaceURI) {
	switch (oNode.nodeType) {
		case 9:		// cNode.DOCUMENT_NODE
			return fNode_isDefaultNamespace(oNode.documentElement, sNameSpaceURI);

		case 2:		// cNode.ATTRIBUTE_NODE
			return oNode.ownerElement ? fNode_isDefaultNamespace(oNode.ownerElement, sNameSpaceURI) : false;

		case 6:		// cNode.ENTITY_NODE
		case 12:	// cNode.NOTATION_NODE
		case 10:	// cNode.DOCUMENT_TYPE_NODE
		case 11:	// cNode.DOCUMENT_FRAGMENT_NODE
			return false;

		case 1:		// cNode.ELEMENT_NODE
			for (var oAttribute; oNode && oNode.nodeType != 9 /* cNode.DOCUMENT_NODE */ ; oNode = oNode.parentNode)
				if (!oNode.prefix)
					return oNode.namespaceURI == sNameSpaceURI;
				else
				if (oAttribute = fNamedNodeMap_getNamedItem(oNode.attributes, "xmlns"))
					return oAttribute.value == sNameSpaceURI;
			return false;

		default:
			return oNode.parentNode ? fNode_isDefaultNamespace(oNode.parentNode, sNameSpaceURI) : false;
	}
};

cNode.prototype.isDefaultNamespace	= function(sNameSpaceURI) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true]
	]);
//<-Guard

	return fNode_isDefaultNamespace(this, sNameSpaceURI);
};

function fNode_lookupNamespaceURI(oNode, sPrefix) {
	// XML namespaces
	if (sPrefix == "xml")
		return sNS_XML;
	if (sPrefix == "xmlns")
		return sNS_XMLNS;
	// Custom namespaces
	for (var oAttribute; oNode && oNode.nodeType != 9 /* cNode.DOCUMENT_NODE */ ; oNode = oNode.parentNode)
		if (oNode.prefix == sPrefix)
			return oNode.namespaceURI;
		else
		if (oNode.nodeType == 1)	// cNode.ELEMENT_NODE
			if (oAttribute = fNamedNodeMap_getNamedItem(oNode.attributes, "xmlns" + ':' + sPrefix))
				return oAttribute.value;
	return null;
};

cNode.prototype.lookupNamespaceURI	= function(sPrefix) {
//->Guard
	fGuard(arguments, [
		["prefix",	cString, false, true]
	]);
//<-Guard

	return fNode_lookupNamespaceURI(this, sPrefix);
};

function fNode_compareDocumentPosition(oNode, oChild) {
	if (oChild == oNode)
		return 0;

	//
	var oAttr1	= null,
		oAttr2	= null,
		oAttr, oElement, nIndex;
	if (oNode.nodeType == 2 /* cNode.ATTRIBUTE_NODE */) {
		oAttr1	= oNode;
		oNode	= oAttr1.ownerElement;
	}
	if (oChild.nodeType == 2 /* cNode.ATTRIBUTE_NODE */) {
		oAttr2	= oChild;
		oChild	= oAttr2.ownerElement;
	}

	// Compare attributes from same element
	if (oAttr1 && oAttr2 && oNode && oNode == oChild) {
		for (nIndex = 0; nIndex < oNode.attributes.length; nIndex++) {
			oAttr	= oNode.attributes[nIndex];
			if (oAttr == oAttr1)
				return 32 /* cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC */ | 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			if (oAttr == oAttr2)
				return 32 /* cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC */ | 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
		}
	}

	//
	var aChain1	= [], nLength1, oNode1,
		aChain2	= [], nLength2, oNode2;
	//
	if (oAttr1)
		aChain1.push(oAttr1);
	for (oElement = oNode; oElement; oElement = oElement.parentNode)
		aChain1.push(oElement);
	if (oAttr2)
		aChain2.push(oAttr2);
	for (oElement = oChild; oElement; oElement = oElement.parentNode)
		aChain2.push(oElement);
	// If nodes are from different documents or if they do not have common top, they are disconnected
	if (((oNode.ownerDocument || oNode) != (oChild.ownerDocument || oChild)) || (aChain1[aChain1.length - 1] != aChain2[aChain2.length - 1]))
		return 32 /* cNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC */ | 1 /* cNode.DOCUMENT_POSITION_DISCONNECTED */;
	//
	for (nIndex = cMath.min(nLength1 = aChain1.length, nLength2 = aChain2.length); nIndex; --nIndex)
		if ((oNode1 = aChain1[--nLength1]) != (oNode2 = aChain2[--nLength2])) {
			//
			if (oNode1.nodeType == 2 /* cNode.ATTRIBUTE_NODE */)
				return 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			if (oNode2.nodeType == 2 /* cNode.ATTRIBUTE_NODE */)
				return 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
			//
			if (!oNode2.nextSibling)
				return 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			if (!oNode1.nextSibling)
				return 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
			for (oElement = oNode2.previousSibling; oElement; oElement = oElement.previousSibling)
				if (oElement == oNode1)
					return 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */;
			return 2 /* cNode.DOCUMENT_POSITION_PRECEDING */;
		}
	//
	return nLength1 < nLength2 ? 4 /* cNode.DOCUMENT_POSITION_FOLLOWING */ | 16 /* cNode.DOCUMENT_POSITION_CONTAINED_BY */ : 2 /* cNode.DOCUMENT_POSITION_PRECEDING */ | 8 /* cNode.DOCUMENT_POSITION_CONTAINS */;
};

cNode.prototype.compareDocumentPosition	= function(oChild) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	return fNode_compareDocumentPosition(this, oChild);
};

/*
cNode.prototype.lookupPrefix	= function(sNameSpaceURI) {
	if (!sNameSpaceURI)
		return null;

	switch (this.nodeType) {
		case 1:		// cNode.ELEMENT_NODE
			return this.lookupNamespacePrefix(sNameSpaceURI);

		case 9:		// cNode.DOCUMENT_NODE
			return this.documentElement.lookupNamespacePrefix(sNameSpaceURI);

		case 6:		// cNode.ENTITY_NODE
		case 12:	// cNode.NOTATION_NODE
		case 11:	// cNode.DOCUMENT_FRAGMENT_NODE
		case 10:	// cNode.DOCUMENT_TYPE_NODE
			return null;	// type is unknown

		case 2:		// cNode.ATTRIBUTE_NODE
			if (this.ownerElement)
				return this.ownerElement.lookupNamespacePrefix(sNameSpaceURI);
			return null;

		default:
			if (this.parentNode)
				// EntityReferences may have to be skipped to get to it
				return this.parentNode.lookupNamespacePrefix(sNameSpaceURI);
			return null;
	}
};

cNode.prototype.lookupNamespacePrefix	= function(sNameSpaceURI) {
	if (this.namespaceURI && this.namespaceURI == sNameSpaceURI && this.prefix && this.lookupNamespaceURI(this.prefix) == sNameSpaceURI)
		return this.prefix;

	for (var i = 0, iLength = this.attributes.length; i < iLength; i++)
		if (this.attributes[i].prefix == "xmlns" && this.attributes[i].nodeValue == sNameSpaceURI && this.lookupNamespaceURI(this.attributes[i].localName) == sNameSpaceURI)
			return this.attributes[i].localName;

	if (this.parentNode && this.parentNode.nodeType == 1)	// cNode.ELEMENT_NODE
		// EntityReferences may have to be skipped to get to it
		return this.parentNode.lookupNamespacePrefix(sNameSpaceURI);
	return null;
};

cNode.prototype.lookupNamespaceURI	= function(sPrefix) {
	switch (this.nodeType) {
		case 1:		// cNode.ELEMENT_NODE
			if (this.namespaceURI && this.prefix == sPrefix)
				return this.namespaceURI;

			for (var i = 0, iLength = this.attributes.length; i < iLength; i++)
				if (this.attributes[i].prefix == "xmlns" && this.attributes[i].localName == sPrefix)
					// non default namespace
					return this.attributes[i].nodeValue || null;
				else
				if (this.attributes[i].localName == "xmlns" && sPrefix == null)
					// default namespace
					return this.attributes[i].nodeValue || null;

			if (this.parentNode && this.parentNode.nodeType == 1)	// cNode.ELEMENT_NODE
				// EntityReferences may have to be skipped to get to it
				return this.parentNode.lookupNamespaceURI(sPrefix);
			return null;

		case 9:		// cNode.DOCUMENT_NODE
			return this.documentElement.lookupNamespaceURI(sPrefix);

		case 6:		// cNode.ENTITY_NODE
		case 12:	// cNode.NOTATION_NODE
		case 10:	// cNode.DOCUMENT_TYPE_NODE
		case 11:	// cNode.DOCUMENT_FRAGMENT_NODE
			return null;

		case 2:		// cNode.ATTRIBUTE_NODE
			if (this.ownerElement)
				return this.ownerElement.lookupNamespaceURI(sPrefix);
			else
				return null;

		default:
			if (this.parentNode && this.parentNode.nodeType == 1)	// cNode.ELEMENT_NODE
				// EntityReferences may have to be skipped to get to it
				return this.parentNode.lookupNamespaceURI(sPrefix);
			else
				return null;
	}
}
*/

cNode.prototype.hasAttributes	= function() {
//->Guard
	fGuard(arguments, [
	], this);
//<-Guard

	return !!this.attributes && !!this.attributes.length;
};

cNode.prototype.normalize		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cNode.prototype.isSupported	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

//->Source
/*
cNode.prototype.selectNodes	= function(sXPath) {
	var oDocument	= this.nodeType == 9 ? this : this.ownerDocument,
		oXMLDocument= fBrowser_parseXML(oDocument.toXML()),
		aNodeList	= new cNodeList,
		aXMLNodeList= [],
		oNode,
		oXMLNode;

	// Run XPath on XMLDocument
	if (oXMLDocument.evaluate) {
		// Find Context node
		var oResult;
		if (this.nodeType == 9)	// cNode.DOCUMENT_NODE
			oXMLNode	= oXMLDocument;
		else
		{
			oResult	= oXMLDocument.evaluate('/' + '/' + '*[@_="' + this.uniqueID + '"]', oXMLDocument, null, 0, null);
			oXMLNode	= oResult.iterateNext();
		}

		// Run query
		oResult		= oXMLDocument.evaluate(sXPath, oXMLNode, oXMLDocument.createNSResolver(oXMLNode), 0, null);
		while (oNode = oResult.iterateNext())
			aXMLNodeList[aXMLNodeList.length]	= oNode;
	}
	else
	{
		// Find Context node
		if (this.nodeType == 9)	// cNode.DOCUMENT_NODE
			oXMLNode	= oXMLDocument;
		else
			oXMLNode	= oXMLDocument.selectSingleNode('/' + '/' + '*[@_="' + this.uniqueID + '"]');

		// Run query
		aXMLNodeList	= oXMLNode.selectNodes(sXPath);
	}

	// Convert results to Ample SDK nodes
	for (var nIndex = 0, nLength = aXMLNodeList.length; nIndex < nLength; nIndex++) {
		oNode	= aXMLNodeList[nIndex];
		switch (oNode.nodeType) {
			case 1:	// cNode.ELEMENT_NODE
				aNodeList.$add(oDocument_all[oNode.getAttribute('_')]);
				break;

			case 2:	// cNode.ATTRIBUTE_NODE
				aNodeList.$add(oNode.nodeValue);
				break;

			case 3:	// cNode.TEXT_NODE
			case cNode.CDATA_NODE:
				aNodeList.$add(oNode.nodeValue);
				break;

			case 9:	// cNode.DOCUMENT_NODE
				aNodeList.$add(oDocument);
				break;
		}
	}
	return aNodeList;
};

cNode.prototype.selectSingleNode	= function(sXPath) {
	var aNodeList	= this.selectNodes(sXPath);
	return aNodeList.length ? aNodeList[0] : null;
};
*/
//<-Source
cNode.prototype.$getContainer	= function(sName) {
	return null;
};

cNode.prototype.$getTag	= function() {
	return '';
};

function fNode_toXML(oNode) {
	var aHtml	= [];
//->Source
	var nDepth	= arguments.length > 1 ? arguments[1] : 1;
	aHtml.push(new cArray(nDepth).join('\t'));
//<-Source
	switch (oNode.nodeType) {
		case 1:	// cNode.ELEMENT_NODE
			aHtml.push('<' + oNode.nodeName);
			for (var nIndex = 0, nLength = oNode.attributes.length; nIndex < nLength; nIndex++)
				aHtml.push(' ' + oNode.attributes[nIndex].nodeName + '=' + '"' + fUtilities_encodeXMLCharacters(oNode.attributes[nIndex].nodeValue) + '"');

			if (oNode.hasChildNodes()) {
				aHtml.push('>');
//->Source
				aHtml.push('\n');
				nDepth++;
//<-Source
				var nIndex	= 0;
				while (nIndex < oNode.childNodes.length)
					aHtml.push(fNode_toXML(oNode.childNodes[nIndex++]
//->Source
						, nDepth
//<-Source
					));
//->Source
				nDepth--;
				aHtml.push('\n');
				aHtml.push(new cArray(nDepth).join('\t'));
//<-Source
				aHtml.push('</' + oNode.nodeName + '>');
			}
			else
				aHtml.push('/>');
			break;

		case 3:	// cNode.TEXT_NODE
			aHtml.push(fUtilities_encodeXMLCharacters(oNode.nodeValue));
			break;

		case 4:	// cNode.CDATA_SECTION_NODE
			aHtml.push('<![CDATA[' + oNode.nodeValue + ']]>');
			break;
/*
		case 6:		// cNode.ENTITY_NODE
			aHtml.push('<!ENTITY' + ' ' + oNode.nodeName + ' ' + '"' + oNode.nodeValue + '"' + '>');
			break;
*/
		case 7:	// cNode.PROCESSING_INSTRUCTION_NODE
			aHtml.push('<?' + oNode.nodeName + ' ' + oNode.nodeValue + '?>');
			break;

		case 8:	// cNode.COMMENT_NODE
			aHtml.push('<!--' + oNode.nodeValue + '-->');
			break;
/*
		case 10:	// cNode.DOCUMENT_TYPE_NODE
			aHtml.push('<!DOCTYPE' + ' ' + oNode.name + ' ' + "SYSTEM" + ' ');
			if (oNode.internalSubset)
				aHtml.push('[' + oNode.internalSubset + ']');
			aHtml.push('>');
			break;
*/
		case 11:	// cNode.DOCUMENT_FRAGMENT_NODE
		case 9:		// cNode.DOCUMENT_NODE
			var nIndex	= 0;
			while (nIndex < oNode.childNodes.length)
				aHtml.push(fNode_toXML(oNode.childNodes[nIndex++]
//->Source
					, nDepth
//<-Source
				));
			break;
/*
		case 12:	// cNode.NOTATION_NODE
		case 5:		// cNode.ENTITY_REFERENCE_NODE
		case 2:		// cNode.ATTRIBUTE_NODE
*/

		default:
			throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	}
//->Source
	if (oNode.nextSibling)
		aHtml.push('\n');
//<-Source
	return aHtml.join('');
};

cNode.prototype.toXML	= function() {
	return fNode_toXML(this);
};

// EventTarget
cNode.prototype.$listeners	= null;
cNode.prototype.canDispatch	= cEventTarget.prototype.canDispatch;
cNode.prototype.dispatchEvent	= cEventTarget.prototype.dispatchEvent;
cNode.prototype.addEventListener	= cEventTarget.prototype.addEventListener;
cNode.prototype.removeEventListener	= cEventTarget.prototype.removeEventListener;
