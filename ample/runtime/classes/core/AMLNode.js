/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
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
function fAMLNode_appendChild(oParent, oNode)
{
	// Remove element from previous location
	if (oNode.parentNode)
	    fAMLNode_removeChild(oNode.parentNode, oNode);

	// Set DOM properties
    oNode.parentNode	= oParent;

    if (oParent.lastChild)
    {
        oNode.previousSibling	= oParent.lastChild;
        oParent.lastChild.nextSibling	= oNode;
    }
    else
    	oParent.firstChild	= oNode;
    oParent.lastChild	= oNode;

    oParent.childNodes.$add(oNode);

	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeInserted", true, false, oParent, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	return oNode;
};

cAMLNode.prototype.appendChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "appendChild");

	return fAMLNode_appendChild(this, oNode);
};

function fAMLNode_insertBefore(oParent, oNode, oBefore)
{
	// Remove element from previous location
	if (oNode.parentNode)
	    fAMLNode_removeChild(oNode.parentNode, oNode);

	// Set DOM properties
    oNode.parentNode	= oParent;

	if (oBefore.previousSibling)
	{
		oNode.previousSibling	= oBefore.previousSibling;
		oBefore.previousSibling.nextSibling	= oNode;
	}
	else
		oParent.firstChild	= oNode;

	oNode.nextSibling	= oBefore;
	oBefore.previousSibling	= oNode;

	oParent.childNodes.$add(oNode, oParent.childNodes.$indexOf(oBefore));

	// Fire Mutation event
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeInserted", true, false, oParent, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	return oNode;
};

cAMLNode.prototype.insertBefore	= function(oNode, oBefore)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["before",	cAMLNode, false, true]
	], "insertBefore");

	if (oBefore) {
		if (this.childNodes.$indexOf(oBefore) !=-1)
			return fAMLNode_insertBefore(this, oNode, oBefore);
		else
			throw new cAMLException(cAMLException.NOT_FOUND_ERR);
	}
	else
		return fAMLNode_appendChild(this, oNode);
};

function fAMLNode_removeChild(oParent, oNode)
{
    var oEvent = new cAMLMutationEvent;
    oEvent.initMutationEvent("DOMNodeRemoved", true, false, oParent, null, null, null, null);
    fAMLNode_dispatchEvent(oNode, oEvent);

	if (oNode.nextSibling)
		oNode.nextSibling.previousSibling	= oNode.previousSibling;
	else
		oParent.lastChild	= oNode.previousSibling;

	if (oNode.previousSibling)
		oNode.previousSibling.nextSibling	= oNode.nextSibling;
	else
		oParent.firstChild	= oNode.nextSibling;

	// Reset DOM properties
    oNode.parentNode  		= null;
	oNode.previousSibling	= null;
	oNode.nextSibling		= null;

    return oParent.childNodes.$remove(oNode);
};

cAMLNode.prototype.removeChild	= function(oNode)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "removeChild");

    if (this.childNodes.$indexOf(oNode) !=-1)
    	return fAMLNode_removeChild(this, oNode);
    else
        throw new cAMLException(cAMLException.NOT_FOUND_ERR);
};

function fAMLNode_replaceChild(oParent, oNode, oOld)
{
	fAMLNode_insertBefore(oParent, oNode, oOld);
	return fAMLNode_removeChild(oParent, oOld);
};

cAMLNode.prototype.replaceChild	= function(oNode, oOld)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["old",		cAMLNode, false, true]
	], "replaceChild");

    if (this.childNodes.$indexOf(oOld) !=-1)
    	return fAMLNode_replaceChild(this, oNode, oOld);
    else
    	throw new cAMLException(cAMLException.NOT_FOUND_ERR);
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

function fAMLNode_lookupPrefix(oNode, sNameSpaceURI)
{
	for (var aPrefixes = {}, sPrefix; oNode && oNode.nodeType != cAMLNode.DOCUMENT_NODE; oNode = oNode.parentNode)
	{
		if (oNode.namespaceURI == sNameSpaceURI)
			return oNode.prefix;
		else
		if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
			for (var sAttribute in oNode.attributes)
				if (oNode.attributes.hasOwnProperty(sAttribute) && sAttribute.indexOf("xmlns" + ':') == 0)
				{
					sPrefix	= sAttribute.substr(6);
					if (oNode.attributes[sAttribute] == sNameSpaceURI)
						return sPrefix in aPrefixes ? '' : sPrefix;
					else
						aPrefixes[sPrefix]	= true;
				}
	}
	return null;
};

cAMLNode.prototype.lookupPrefix	= function(sNameSpaceURI)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true]
	], "lookupPrefix");

	return fAMLNode_lookupPrefix(this, sNameSpaceURI);
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

function fAMLNode_lookupNamespaceURI(oNode, sPrefix)
{
	for (; oNode && oNode.nodeType != cAMLNode.DOCUMENT_NODE; oNode = oNode.parentNode)
		if (oNode.prefix == sPrefix)
			return oNode.namespaceURI;
		else
		if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
			for (var sAttribute in oNode.attributes)
				if (oNode.attributes.hasOwnProperty(sAttribute) && sAttribute.indexOf("xmlns" + ':') == 0 && sAttribute.substr(6) == sPrefix)
					return oNode.attributes[sAttribute];
	return null;
};

cAMLNode.prototype.lookupNamespaceURI	= function(sPrefix)
{
	// Validate arguments
	fAML_validate(arguments, [
		["prefix",	cString, false, true]
	], "lookupNamespaceURI");

	// Invoke actual implementation
	return fAMLNode_lookupNamespaceURI(this, sPrefix);
};

function fAMLNode_compareDocumentPosition(oNode, oChild)
{
	if (oChild == oNode)
		return 0;

	var aChain1	= [], nLength1, oNode1,
		aChain2	= [], nLength2, oNode2,
		oElement, nIndex;
	//
	for (oElement = oNode; oElement; oElement = oElement.parentNode)
		aChain1.push(oElement);
	for (oElement = oChild; oElement; oElement = oElement.parentNode)
		aChain2.push(oElement);
	// If nodes are from different documents or if they do not have common top, they are disconnected
	if (((oNode.ownerDocument || oNode) != (oChild.ownerDocument || oChild)) || (aChain1[aChain1.length - 1] != aChain2[aChain2.length - 1]))
		return cAMLNode.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC | cAMLNode.DOCUMENT_POSITION_DISCONNECTED;
	//
	for (nIndex = cMath.min(nLength1 = aChain1.length, nLength2 = aChain2.length); nIndex; --nIndex)
		if ((oNode1 = aChain1[--nLength1]) != (oNode2 = aChain2[--nLength2])) {
			if (!oNode2.nextSibling)
				return cAMLNode.DOCUMENT_POSITION_FOLLOWING;
			if (!oNode1.nextSibling)
				return cAMLNode.DOCUMENT_POSITION_PRECEDING;
			for (oElement = oNode2.previousSibling; oElement; oElement = oElement.previousSibling)
				if (oElement == oNode1)
					return cAMLNode.DOCUMENT_POSITION_FOLLOWING;
			return cAMLNode.DOCUMENT_POSITION_PRECEDING;
		}
	//
	return nLength1 < nLength2 ? cAMLNode.DOCUMENT_POSITION_FOLLOWING | cAMLNode.DOCUMENT_POSITION_CONTAINED_BY : cAMLNode.DOCUMENT_POSITION_PRECEDING | cAMLNode.DOCUMENT_POSITION_CONTAINS;
};

cAMLNode.prototype.compareDocumentPosition	= function(oChild)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	], "compareDocumentPosition");

	return fAMLNode_compareDocumentPosition(this, oChild);
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
function fAMLEventTarget_addEventListener(oNode, sEventType, fListener, bUseCapture)
{
	if (!oNode.$listeners)
		oNode.$listeners	= {};
	if (!oNode.$listeners[sEventType])
		oNode.$listeners[sEventType]	= [];
	for (var nIndex = 0, aListeners = oNode.$listeners[sEventType], bCapture = bUseCapture == true; nIndex < aListeners.length; nIndex++)
		if (aListeners[nIndex][0] == fListener && aListeners[nIndex][1] == bCapture)
			return;
	oNode.$listeners[sEventType].push([fListener, bUseCapture == true]);
};

cAMLNode.prototype.addEventListener		= function(sEventType, fListener, bUseCapture)
{
	// Validate arguments
	fAML_validate(arguments, [
		["eventType",	cString],
		["listener",	cFunction],
		["useCapture",	cBoolean,	true]
	], "addEventListener");

	fAMLEventTarget_addEventListener(this, sEventType, fListener, bUseCapture);
};

function fAMLEventTarget_removeEventListener(oNode, sEventType, fListener, bUseCapture)
{
	if (oNode.$listeners && oNode.$listeners[sEventType])
		for (var nIndex = 0, aListeners = oNode.$listeners[sEventType], bCapture = bUseCapture == true; nIndex < aListeners.length; nIndex++)
			if (aListeners[nIndex][0] == fListener && aListeners[nIndex][1] == bCapture)
			{
				oNode.$listeners[sEventType]	= aListeners.slice(0, nIndex).concat(aListeners.slice(nIndex + 1));
				if (!oNode.$listeners[sEventType].length)
					delete oNode.$listeners[sEventType];
				return;
			}
};

cAMLNode.prototype.removeEventListener	= function(sEventType, fListener, bUseCapture)
{
	// Validate arguments
	fAML_validate(arguments, [
		["eventType",	cString],
		["listener",	cFunction],
		["useCapture",	cBoolean,	true]
	], "removeEventListener");

	// Invoke actual implementation
	fAMLEventTarget_removeEventListener(this, sEventType, fListener, bUseCapture);
};

function fAMLNode_executeHandler(oNode, fHandler, oEvent) {
	try {
		fHandler.call(oNode, oEvent);
	}
	catch (oException) {
		if (oException instanceof cAMLException) {
			var	oErrorHandler	= oAMLConfiguration_values["error-handler"];
			if (oErrorHandler)
				oErrorHandler.handleError(new cAMLError(oException.message, cAMLError.SEVERITY_ERROR, oException));
		}
		throw oException;
	}
};

function fAMLNode_handleEvent(oNode, oEvent) {
	// Process inline handler
    if (oEvent.eventPhase != cAMLEvent.CAPTURING_PHASE && oNode['on' + oEvent.type])
    	fAMLNode_executeHandler(oNode, oNode['on' + oEvent.type], oEvent);

	// Notify listeners
    if (oNode.$listeners && oNode.$listeners[oEvent.type])
    	for (var nIndex = 0, aListeners = oNode.$listeners[oEvent.type]; nIndex < aListeners.length && !oEvent._stoppedImmediately; nIndex++)
    		if (oEvent.eventPhase == cAMLEvent.AT_TARGET || aListeners[nIndex][1] == (oEvent.eventPhase == cAMLEvent.CAPTURING_PHASE))
    			fAMLNode_executeHandler(oNode, aListeners[nIndex][0], oEvent);

	var oNamespace,
		cElement,
		cAttribute;

	// Event default actions implementation
	if (oEvent.eventPhase != cAMLEvent.CAPTURING_PHASE && !oEvent.defaultPrevented) {
		if (oNode.nodeType == 1) {
			if ((oNamespace = oAML_namespaces[oNode.namespaceURI]) && (cElement = oNamespace.elements[oNode.localName]))
				if (cElement.handlers && cElement.handlers[oEvent.type])
					cElement.handlers[oEvent.type].call(oNode, oEvent);
		}
		else
		if (oNode.nodeType == 2) {
			if ((oNamespace = oAML_namespaces[oNode.namespaceURI]) && (cAttribute = oNamespace.attributes[oNode.localName]))
				if (cAttribute.handlers && cAttribute.handlers[oEvent.type])
					cAttribute.handlers[oEvent.type].call(oNode, oEvent);
		}
	}
};

cAMLNode.prototype.hasAttributes	= function()
{
	if (this.attributes)
		for (var sAttribute in this.attributes)
			if (this.attributes.hasOwnProperty(sAttribute))
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

function fAMLNode_routeEvent(oEvent)
{
	var aTargets	= [],
		nLength		= 0,
		nCurrent	= 0;
	// Populate stack targets (...document-fragment, document, #document)
	for (var oNode = oEvent.target; oNode; oNode = oNode.parentNode)
		aTargets[nLength++]	= oNode;

//->Source
//console.info(oEvent.type, oEvent.target);
//<-Source

	// Propagate event
	while (!oEvent._stopped) {
		switch (oEvent.eventPhase) {
			case cAMLEvent.CAPTURING_PHASE:
				if (--nCurrent > 0)
					oEvent.currentTarget	= aTargets[nCurrent];
				else {
					// Do not propagate either target or bubbling for disabled elements
					if (oEvent instanceof cAMLUIEvent && oEvent.target.nodeType == cAMLNode.ELEMENT_NODE && !oEvent.target.$isAccessible())
						return;

					oEvent.eventPhase		= cAMLEvent.AT_TARGET;
					oEvent.currentTarget	= oEvent.target;
				}
				break;

			case cAMLEvent.AT_TARGET:
				// if event does not bubble, return
				if (!oEvent.bubbles)
					return;
				// if event current target doesn't have a parent
				if (nCurrent < 0)
					return;
				oEvent.eventPhase	= cAMLEvent.BUBBLING_PHASE;
				// No break left intentionally
			case cAMLEvent.BUBBLING_PHASE:
				if (++nCurrent < nLength)
					oEvent.currentTarget	= aTargets[nCurrent];
				else
					return;
				break;

			default:
				// Set current target
				if (nLength > 1) {
					nCurrent	= nLength - 1;
					oEvent.eventPhase	= cAMLEvent.CAPTURING_PHASE;
					oEvent.currentTarget= aTargets[nCurrent];
				}
				else {
					// Do not propagate either target or bubbling for disabled elements
					if (oEvent instanceof cAMLUIEvent && oEvent.target.nodeType == cAMLNode.ELEMENT_NODE && !oEvent.target.$isAccessible())
						return;

					nCurrent	= 0;
					oEvent.eventPhase	= cAMLEvent.AT_TARGET;
					oEvent.currentTarget= oEvent.target;
				}
		}

//->Source
//console.log(oEvent.currentTarget);
//<-Source

		// Handle event
		fAMLNode_handleEvent(oEvent.currentTarget, oEvent);
	}
};

function fAMLNode_dispatchEvent(oNode, oEvent)
{
	// Set event target and currentTarget
	oEvent.target	= oNode;

	// Start event flow
	fAMLNode_routeEvent(oEvent);

	return !oEvent.defaultPrevented;
};

cAMLNode.prototype.dispatchEvent	= function(oEvent)
{
	// Validate arguments
	fAML_validate(arguments, [
		["event",	cAMLEvent]
	], "dispatchEvent");

	// Invoke actual implementation
	return fAMLNode_dispatchEvent(this, oEvent);
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

function fAMLNode_toXML(oNode)
{
	var aHtml	= [],
		nIndex	= 0;
//->Source
	var nDepth	= arguments.length > 1 ? arguments[1] : 1;
	aHtml.push(new cArray(nDepth).join('\t'));
//<-Source
	switch (oNode.nodeType) {
		case cAMLNode.ELEMENT_NODE:
			var sName, oAttributes;
			aHtml.push('<' + oNode.nodeName);
			oAttributes	= oNode.attributes;
			for (sName in oAttributes)
				if (oAttributes.hasOwnProperty(sName))
					aHtml.push(' ' + sName + '=' + '"' + fAML_encodeEntities(oAttributes[sName]) + '"');
//			aHtml.push(' ' + '_' + '=' + '"' + oNode.uniqueID + '"');
			if (oNode.hasChildNodes()) {
				aHtml.push('>');
//->Source
				aHtml.push('\n');
				nDepth++;
//<-Source
				while (nIndex < oNode.childNodes.length)
					aHtml.push(fAMLNode_toXML(oNode.childNodes[nIndex++]
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

		case cAMLNode.TEXT_NODE:
			aHtml.push(oNode.nodeValue);
			break;

		case cAMLNode.CDATA_SECTION_NODE:
			aHtml.push('<![CDATA[' + oNode.nodeValue + ']]>');
			break;

		case cAMLNode.PROCESSING_INSTRUCTION_NODE:
			aHtml.push('<?' + oNode.nodeName + ' ' + oNode.nodeValue + '?>');
			break;

		case cAMLNode.COMMENT_NODE:
			aHtml.push('<!--' + oNode.nodeValue + '-->');
			break;

		case cAMLNode.DOCUMENT_FRAGMENT_NODE:
		case cAMLNode.DOCUMENT_NODE:
			while (nIndex < oNode.childNodes.length)
				aHtml.push(fAMLNode_toXML(oNode.childNodes[nIndex++]
//->Source
					, nDepth
//<-Source
				));
			break;
/*
		case cAMLNode.NOTATION_NODE:
		case cAMLNode.DOCUMENT_TYPE_NODE:
		case cAMLNode.ENTITY_REFERENCE_NODE:
		case cAMLNode.ENTITY_NODE:
		case cAMLNode.ATTRIBUTE_NODE:
*/
		default:
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
	}
//->Source
	if (oNode.nextSibling)
		aHtml.push('\n');
//<-Source
	return aHtml.join('');
};

cAMLNode.prototype.toXML	= function()
{
	return fAMLNode_toXML(this);
};