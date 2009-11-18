/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLNode	= function(){};

// nsIDOMNode

// Constants
cAMLNode.ELEMENT_NODE				= 1;
cAMLNode.ATTRIBUTE_NODE				= 2;
cAMLNode.TEXT_NODE					= 3;
cAMLNode.CDATA_SECTION_NODE			= 4;
cAMLNode.ENTITY_REFERENCE_NODE		= 5;
cAMLNode.ENTITY_NODE				= 6;
cAMLNode.PROCESSING_INSTRUCTION_NODE= 7;
cAMLNode.COMMENT_NODE				= 8;
cAMLNode.DOCUMENT_NODE				= 9;
cAMLNode.DOCUMENT_TYPE_NODE			= 10;
cAMLNode.DOCUMENT_FRAGMENT_NODE		= 11;
cAMLNode.NOTATION_NODE				= 12;

// Public Properties
cAMLNode.prototype.nodeType			= null;
cAMLNode.prototype.nodeName			= null;
cAMLNode.prototype.nodeValue		= null;
cAMLNode.prototype.ownerDocument	= null;
cAMLNode.prototype.localName		= null;
cAMLNode.prototype.namespaceURI		= null;
cAMLNode.prototype.prefix			= null;
cAMLNode.prototype.attributes		= null;
cAMLNode.prototype.childNodes		= null;
cAMLNode.prototype.firstChild		= null;
cAMLNode.prototype.lastChild		= null;
cAMLNode.prototype.nextSibling		= null;
cAMLNode.prototype.previousSibling	= null;
cAMLNode.prototype.parentNode		= null;

// nsIDOM3Node
cAMLNode.prototype.baseURI		= null;
cAMLNode.prototype.textContent	= null;

// Constants
cAMLNode.DOCUMENT_POSITION_DISCONNECTED	= 1;
cAMLNode.DOCUMENT_POSITION_PRECEDING	= 2;
cAMLNode.DOCUMENT_POSITION_FOLLOWING	= 4;
cAMLNode.DOCUMENT_POSITION_CONTAINS		= 8;
cAMLNode.DOCUMENT_POSITION_CONTAINED_BY	= 16;
cAMLNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC	= 32;

// Private Properties
cAMLNode.prototype.$listeners	= null;

// nsIDOMNode
cAMLNode.prototype.appendChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "appendChild");

	// Remove element from previous location
	if (oNode.parentNode) {
		// Fire Mutation event
	    if (oAML_configuration.getParameter("ample-use-dom-events")) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMNodeRemoved", true, false, oNode.parentNode, null, null, null, null);
		    oNode.dispatchEvent(oEvent);
	    }
		cAMLNode.prototype.removeChild.call(oNode.parentNode, oNode);
	}

	// Set DOM properties
    oNode.parentNode	= this;

    if (this.lastChild)
    {
        oNode.previousSibling	= this.lastChild;
        this.lastChild.nextSibling	= oNode;
    }
    else
        this.firstChild	= oNode;
    this.lastChild	= oNode;

    this.childNodes.$add(oNode);

	// Fire Mutation event
    if (oAML_configuration.getParameter("ample-use-dom-events")) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
	    oNode.dispatchEvent(oEvent);
	}

	return oNode;
};

cAMLNode.prototype.insertBefore	= function(oNode, oBefore)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["before",	cAMLNode, false, true]
	], "insertBefore");

	// if oBefore is ommited or null, use appendChild
	if (!oBefore)
		return this.appendChild(oNode);

   	var nIndex  = this.childNodes.$indexOf(oBefore);
    if (nIndex !=-1)
    {
		// Remove element from previous location
		if (oNode.parentNode) {
			// Fire Mutation event
		    if (oAML_configuration.getParameter("ample-use-dom-events")) {
			    var oEvent = new cAMLMutationEvent;
			    oEvent.initMutationEvent("DOMNodeRemoved", true, false, oNode.parentNode, null, null, null, null);
			    oNode.dispatchEvent(oEvent);
		    }
			cAMLNode.prototype.removeChild.call(oNode.parentNode, oNode);
			// update index (could have been changed if "node" was before "before")
			nIndex	= this.childNodes.$indexOf(oBefore);
		}

		// Set DOM properties
        oNode.parentNode	= this;

		if (oBefore.previousSibling)
		{
			oNode.previousSibling	= oBefore.previousSibling;
			oBefore.previousSibling.nextSibling	= oNode;
		}
		else
			this.firstChild	= oNode;

		oNode.nextSibling	= oBefore;
		oBefore.previousSibling	= oNode;

        this.childNodes.$add(oNode, nIndex);
    }
    else
        throw new cAMLException(cAMLException.NOT_FOUND_ERR);

	// Fire Mutation event
    if (oAML_configuration.getParameter("ample-use-dom-events")) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
	    oNode.dispatchEvent(oEvent);
    }

	return oNode;
};

cAMLNode.prototype.removeChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "removeChild");

    // remove item from the collection of childNodes
    var nIndex  = this.childNodes.$indexOf(oNode);
    if (nIndex !=-1)
    {
		if (oNode.nextSibling)
			oNode.nextSibling.previousSibling	= oNode.previousSibling;
		else
			this.lastChild	= oNode.previousSibling;

		if (oNode.previousSibling)
			oNode.previousSibling.nextSibling	= oNode.nextSibling;
		else
			this.firstChild	= oNode.nextSibling;

		// Reset DOM properties
        oNode.parentNode  		= null;
		oNode.previousSibling	= null;
		oNode.nextSibling		= null;

        return this.childNodes.$remove(oNode);
    }
    else
        throw new cAMLException(cAMLException.NOT_FOUND_ERR);
};

cAMLNode.prototype.replaceChild	= function(oNode, oOld)
{
	this.insertBefore(oNode, oOld);
	return this.removeChild(oOld);
};

cAMLNode.prototype.cloneNode	= function(bDeep)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// nsIDOM3Node
cAMLNode.prototype.getFeature		= function(sFeature, sVersion)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.getUserData	= function(sKey)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.setUserData	= function(sKey, sData, fHandler)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.isEqualNode 	= function(oNode)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.isSameNode 	= function(oNode)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.lookupPrefix	= function(sNameSpaceURI)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true]
	], "lookupPrefix");

	var aPrefixes	= {};
	for (var oNode = this, sPrefix; oNode && oNode.nodeType != cAMLNode.DOCUMENT_NODE; oNode = oNode.parentNode)
	{
		if (oNode.namespaceURI == sNameSpaceURI)
			return oNode.prefix;
		else
		if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
		{
			for (var sAttribute in oNode.attributes)
				if (sAttribute.indexOf("xmlns" + ':') == 0)
				{
					sPrefix	= sAttribute.substr(6);
					if (oNode.attributes[sAttribute] == sNameSpaceURI)
						return sPrefix in aPrefixes ? '' : sPrefix;
					else
						aPrefixes[sPrefix]	= true;
				}
		}
	}
	return null;
};

cAMLNode.prototype.isDefaultNamespace	= function(sNameSpaceURI)
{
/*
	if (!oElement.prefix)
		return oElement.namespaceURI == sNameSpaceURI;
	else
		return oElement.parentNode ? oElement.parentNode.isDefaultNamespace(sNameSpaceURI) : false;
*/
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.lookupNamespaceURI	= function(sPrefix)
{
	// Validate arguments
	fAML_validate(arguments, [
		["prefix",	cString, false, true]
	], "lookupNamespaceURI");

	for (var oNode = this; oNode && oNode.nodeType != cAMLNode.DOCUMENT_NODE; oNode = oNode.parentNode)
		if (oNode.prefix == sPrefix)
			return oNode.namespaceURI;
		else
		if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
			for (var sAttribute in oNode.attributes)
				if (sAttribute.indexOf("xmlns" + ':') == 0 && sAttribute.substr(6) == sPrefix)
					return oNode.attributes[sAttribute];
	return null;
};

/*
cAMLNode.prototype.compareDocumentPosition	= function(oChild)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "compareDocumentPosition");

	return oAML_all[oChild.uniqueID] ? 0 : cAMLNode.DOCUMENT_POSITION_DISCONNECTED;
};
*/

cAMLNode.prototype.compareDocumentPosition	= function(oChild)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "compareDocumentPosition");

	if (oChild == this)
		return 0;

	var nPosition	= 0,
		oNode,
		oDocument	= this.nodeType == cAMLNode.DOCUMENT_NODE ? this : this.ownerDocument;

	for (oNode	= oChild; oNode; oNode = oNode.parentNode)
		if (oNode == this)
			nPosition	|= cAMLNode.DOCUMENT_POSITION_CONTAINED_BY | cAMLNode.DOCUMENT_POSITION_FOLLOWING;
		else
		if (oNode == oDocument && oChild != oDocument)
			nPosition	|= cAMLNode.DOCUMENT_POSITION_DISCONNECTED;

	if (nPosition ^ cAMLNode.DOCUMENT_POSITION_CONTAINED_BY) {
		for (oNode	= this; oNode; oNode = oNode.parentNode)
			if (oNode == oChild)
				nPosition	|= cAMLNode.DOCUMENT_POSITION_CONTAINS | cAMLNode.DOCUMENT_POSITION_PRECEDING;
			else
			if (oNode == oDocument && this != oDocument)
				nPosition	|= cAMLNode.DOCUMENT_POSITION_DISCONNECTED;
	}

	return nPosition;
};

/*
cAMLNode.prototype.lookupPrefix	= function(sNameSpaceURI)
{
	if (!sNameSpaceURI)
		return null;

	switch (this.nodeType)
	{
		case cAMLNode.ELEMENT_NODE:
			return this.lookupNamespacePrefix(sNameSpaceURI);

		case cAMLNode.DOCUMENT_NODE:
			return this.documentElement.lookupNamespacePrefix(sNameSpaceURI);

		case cAMLNode.ENTITY_NODE:
		case cAMLNode.NOTATION_NODE:
		case cAMLNode.DOCUMENT_FRAGMENT_NODE:
		case cAMLNode.DOCUMENT_TYPE_NODE:
			return null;  // type is unknown

		case cAMLNode.ATTRIBUTE_NODE:
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

cAMLNode.prototype.lookupNamespacePrefix	= function(sNameSpaceURI)
{
	if (this.namespaceURI && this.namespaceURI == sNameSpaceURI && this.prefix && this.lookupNamespaceURI(this.prefix) == sNameSpaceURI)
		return this.prefix;

	for (var i = 0, iLength = this.attributes.length; i < iLength; i++)
		if (this.attributes[i].prefix == "xmlns" && this.attributes[i].nodeValue == sNameSpaceURI && this.lookupNamespaceURI(this.attributes[i].localName) == sNameSpaceURI)
			return this.attributes[i].localName;

	if (this.parentNode && this.parentNode.nodeType == cAMLNode.ELEMENT_NODE)
		// EntityReferences may have to be skipped to get to it
		return this.parentNode.lookupNamespacePrefix(sNameSpaceURI);
	return null;
};

cAMLNode.prototype.lookupNamespaceURI	= function(sPrefix)
{
	switch (this.nodeType)
	{
		case cAMLNode.ELEMENT_NODE:
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

			if (this.parentNode && this.parentNode.nodeType == cAMLNode.ELEMENT_NODE)
				// EntityReferences may have to be skipped to get to it
				return this.parentNode.lookupNamespaceURI(sPrefix);
			return null;

		case cAMLNode.DOCUMENT_NODE:
			return this.documentElement.lookupNamespaceURI(sPrefix);

		case cAMLNode.ENTITY_NODE:
		case cAMLNode.NOTATION_NODE:
		case cAMLNode.DOCUMENT_TYPE_NODE:
		case cAMLNode.DOCUMENT_FRAGMENT_NODE:
			return null;

		case cAMLNode.ATTRIBUTE_NODE:
			if (this.ownerElement)
				return this.ownerElement.lookupNamespaceURI(sPrefix);
			else
				return null;

		default:
			if (this.parentNode && this.parentNode.nodeType == cAMLNode.ELEMENT_NODE)
				// EntityReferences may have to be skipped to get to it
				return this.parentNode.lookupNamespaceURI(sPrefix);
			else
				return null;
	}
}
*/

// nsIDOMEventTarget
cAMLNode.prototype.addEventListener		= function(sEventType, fListener, bUseCapture)
{
	// Validate arguments
	fAML_validate(arguments, [
		["eventType",	cString],
		["listener",	cFunction],
		["useCapture",	cBoolean,	true]
	], "addEventListener");

	if (!this.$listeners)
		this.$listeners	= {};
	if (!this.$listeners[sEventType])
		this.$listeners[sEventType]	= [];
	for (var nIndex = 0, aListeners = this.$listeners[sEventType], bCapture = bUseCapture == true; nIndex < aListeners.length; nIndex++)
		if (aListeners[nIndex][0] == fListener && aListeners[nIndex][1] == bCapture)
			return;
	this.$listeners[sEventType].push([fListener, bUseCapture == true]);
};

cAMLNode.prototype.removeEventListener	= function(sEventType, fListener, bUseCapture)
{
	// Validate arguments
	fAML_validate(arguments, [
		["eventType",	cString],
		["listener",	cFunction],
		["useCapture",	cBoolean,	true]
	], "removeEventListener");

	if (this.$listeners && this.$listeners[sEventType])
		for (var nIndex = 0, aListeners = this.$listeners[sEventType], bCapture = bUseCapture == true; nIndex < aListeners.length; nIndex++)
			if (aListeners[nIndex][0] == fListener && aListeners[nIndex][1] == bCapture)
			{
				this.$listeners[sEventType]	= aListeners.slice(0, nIndex).concat(aListeners.slice(nIndex + 1));
				if (!this.$listeners[sEventType].length)
					delete this.$listeners[sEventType];
				return;
			}
};

function fAMLNode_executeHandler(oNode, fHandler, oEvent) {
	try {
		fHandler.call(oNode, oEvent);
	}
	catch (oException) {
		if (oException instanceof cAMLException) {
			var	oErrorHandler	= oAML_configuration.getParameter("error-handler");
			if (oErrorHandler)
				oErrorHandler.handleError(new cAMLError(oException.message, cAMLError.SEVERITY_ERROR, oException));
		}
		throw oException;
	}
};

cAMLNode.prototype.$handleEvent	= function(oEvent)
{
	// Process inline handler
    if (oEvent.eventPhase != cAMLEvent.CAPTURING_PHASE && this["on" + oEvent.type])
    	fAMLNode_executeHandler(this, this["on" + oEvent.type], oEvent);

	// Notify listeners
    if (this.$listeners && this.$listeners[oEvent.type])
    	for (var nIndex = 0, aListeners = this.$listeners[oEvent.type]; nIndex < aListeners.length && !oEvent._stoppedImmediately; nIndex++)
    		if (oEvent.eventPhase == cAMLEvent.AT_TARGET || aListeners[nIndex][1] == (oEvent.eventPhase == cAMLEvent.CAPTURING_PHASE))
    			fAMLNode_executeHandler(this, aListeners[nIndex][0], oEvent);
};

cAMLNode.prototype.hasAttributes	= function()
{
	if (this.attributes)
		for (var sKey in this.attributes)
			return true;
	return false;
};

cAMLNode.prototype.normalize		= function()
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.isSupported	= function()
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLNode.prototype.dispatchEvent	= function(oEvent)
{
	// Validate arguments
	fAML_validate(arguments, [
		["event",	cAMLEvent]
	], "dispatchEvent");

	// Set event target and currentTarget
	oEvent.target	= this;

	// Start event flow
	fAMLDocument_routeEvent(oEvent);

	return !oEvent.defaultPrevented;
};
//->Source
/*
cAMLNode.prototype.selectNodes	= function(sXPath)
{
	var oDocument	= this.nodeType == cAMLNode.DOCUMENT_NODE ? this : this.ownerDocument,
		oXMLDocument= new cDOMParser().parseFromString(new cAMLSerializer().serializeToString(oDocument), "text/xml"),
		aNodeList	= new cAMLNodeList,
		aXMLNodeList= [],
		oNode,
		oXMLNode;

	// Run XPath on XMLDocument
	if (oXMLDocument.evaluate)
	{
		// Find Context node
		var oResult;
		if (this.nodeType == cAMLNode.DOCUMENT_NODE)
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
		if (this.nodeType == cAMLNode.DOCUMENT_NODE)
			oXMLNode	= oXMLDocument;
		else
			oXMLNode	= oXMLDocument.selectSingleNode('/' + '/' + '*[@_="' + this.uniqueID + '"]');

		// Run query
		aXMLNodeList	= oXMLNode.selectNodes(sXPath);
	}

	// Convert results to AML nodes
	for (var nIndex = 0, nLength = aXMLNodeList.length; nIndex < nLength; nIndex++)
	{
		oNode	= aXMLNodeList[nIndex];
		switch (oNode.nodeType)
		{
			case cAMLNode.ELEMENT_NODE:
				aNodeList.$add(oAML_all[oNode.getAttribute('_')]);
				break;

			case cAMLNode.ATTRIBUTE_NODE:
				aNodeList.$add(oNode.nodeValue);
				break;

			case cAMLNode.TEXT_NODE:
			case cAMLNode.CDATA_NODE:
				aNodeList.$add(oNode.nodeValue);
				break;

			case cAMLNode.DOCUMENT_NODE:
				aNodeList.$add(oDocument);
				break;
		}
	}
	return aNodeList;
};

cAMLNode.prototype.selectSingleNode	= function(sXPath)
{
	var aNodeList	= this.selectNodes(sXPath);
	return aNodeList.length ? aNodeList[0] : null;
};
*/
//<-Source
cAMLNode.prototype.$getContainer	= function(sName)
{
    return null;
};

cAMLNode.prototype.$getTag	= function()
{
	return '';
};
