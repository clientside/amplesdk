/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLDocument	= function(){};

cAMLDocument.prototype  = new cAMLNode;
cAMLDocument.prototype.nodeType	= cAMLNode.DOCUMENT_NODE;
cAMLDocument.prototype.nodeName	= "#document";

// Public Properties and Collections
cAMLDocument.prototype.activeElement	= null;

// nsIDOMDocument interface
cAMLDocument.prototype.documentElement	= null;
cAMLDocument.prototype.doctype			= null;
cAMLDocument.prototype.implementation	= null;

// nsIDOM3Document interface
cAMLDocument.prototype.documentURI		= null;
cAMLDocument.prototype.domConfig 		= null;
cAMLDocument.prototype.inputEncoding 	= null;
cAMLDocument.prototype.strictErrorChecking 	= null;
cAMLDocument.prototype.xmlEncoding 		= null;
cAMLDocument.prototype.xmlStandalone 	= null;
cAMLDocument.prototype.xmlVersion 		= null;

// Private Variables
var nAMLDocument_index	= 0;

// Public Methods
cAMLDocument.prototype.createAttribute	= function(sName)
{
	return this.createAttributeNS(null, sName);
};

//->Source
/*
function fAMLDocument_createAttributeNS(oDocument, sNameSpaceURI, sQName)
{
	var oNode		= new cAMLAttr,
		aQName		= sQName.split(':'),
		sLocalName	= aQName.length > 1 ? aQName[1] : aQName[0],
		sPrefix		= aQName.length > 1 ? aQName[0] : null;

	oNode.ownerDocument	= this;
    oNode.localName		= sLocalName;
    oNode.prefix		= sPrefix;
    oNode.namespaceURI	= sNameSpaceURI;
    oNode.nodeName		= sQName;
	oNode.nodeValue		= '';
    oNode.name			= oNode.nodeName;
    oNode.value			= oNode.nodeValue;

	return oNode;
};
*/
//<-Source

cAMLDocument.prototype.createAttributeNS	= function(sNameSpaceURI, sQName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["QName",			cString]
	], "createAttributeNS");
//->Source
/*
	return fAMLDocument_createAttributeNS(this, sNameSpaceURI, sQName);
*/
//<-Source

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

function fAMLDocument_createTextNode(oDocument, sData)
{
	var oNode	= new cAMLText;
	oNode.ownerDocument	= oDocument;
	oNode.nodeValue	= sData;
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cAMLDocument.prototype.createTextNode	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cObject, true]
	], "createTextNode");

	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	// Invoke actual implementation
	return fAMLDocument_createTextNode(this, cString(sData));
};

function fAMLDocument_createCDATASection(oDocument, sData)
{
	var oNode	= new cAMLCDATASection;
	oNode.ownerDocument	= oDocument;
	oNode.nodeValue	= sData;
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cAMLDocument.prototype.createCDATASection	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cObject, true]
	], "createCDATASection");

	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	// Invoke actual implementation
	return fAMLDocument_createCDATASection(this, cString(sData));
};

//->Source
/*
function fAMLDocument_createComment(oDocument, sData)
{
	var oNode	= new cAMLComment;
	oNode.ownerDocument	= oDocument;
	oNode.nodeValue	= sData;
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};
*/
//<-Source

cAMLDocument.prototype.createComment	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cObject, true]
	], "createComment");

//->Source
/*
	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	return fAMLDocument_createComment(this, sData);
*/
//<-Source

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.createElement	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "createElement");

	// Invoke actual implementation
	return fAMLDocument_createElementNS(this, this.namespaceURI, sName);
};

function fAMLDocument_createElementNS(oDocument, sNameSpaceURI, sQName)
{
	var aQName		= sQName.split(':'),
		sLocalName	= aQName.length > 1 ? aQName[1] : aQName[0],
		sPrefix		= aQName.length > 1 ? aQName[0] : null,
		oNamespace	= oAML_namespaces[sNameSpaceURI],
		cElement	= oNamespace ? oNamespace.elements[sLocalName] : null,
		oElement	= new (cElement || cAMLElement),
		sName;

	// DOM Properties
	oElement.attributes		= {};
    oElement.ownerDocument	= oDocument;
    oElement.prefix			= sPrefix;
    oElement.nodeName		= sQName;
    oElement.tagName		= sQName;
    oElement.childNodes		= new cAMLNodeList;
    oElement.$childNodesAnonymous	= new cAMLNodeList;

	// System properties
    oElement.uniqueID	= "ele_" + nAMLDocument_index++;

    //
	if (cElement) {
	    // Set default attributes, if defined
		for (sName in cElement.attributes)
			if (cElement.attributes.hasOwnProperty(sName))
				oElement.attributes[sName]	= cElement.attributes[sName];
	}
	else {
		// Set namespaceURI for unknown elements manually
		oElement.namespaceURI	= sNameSpaceURI;
    	oElement.localName		= sLocalName;
	}

    return oElement;
};

cAMLDocument.prototype.createElementNS	= function(sNameSpaceURI, sQName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["QName",			cString]
	], "createElementNS");

	// Invoke actual implementation
	return fAMLDocument_createElementNS(this, sNameSpaceURI, sQName);
};

cAMLDocument.prototype.createEntityReference	= function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "createEntityReference");

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.createEvent     = function(sName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["eventType",	cString]
	], "createEvent");

	var cEvent	= window["AML" + sName.replace(/s$/, '')];
	if (cEvent && (cEvent == cAMLEvent || cEvent.prototype instanceof cAMLEvent))
		return new cEvent;
	else
        throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.canDispatch	= function(sNameSpaceURI, sType)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["type",			cString]
	], "canDispatch");

	return true;
};

cAMLDocument.prototype.createDocumentFragment	= function()
{
	var oNode	= new cAMLDocumentFragment;
	oNode.ownerDocument	= this;
    oNode.childNodes	= new cAMLNodeList;

	return oNode;
};

function fAMLDocument_createProcessingInstruction(oDocument, sTarget, sData)
{
	var oNode	= new cAMLProcessingInstruction;
	oNode.ownerDocument	= oDocument;
	oNode.nodeName	= oNode.target	= sTarget;
	oNode.nodeValue	= oNode.data	= sData;

	return oNode;
};

cAMLDocument.prototype.createProcessingInstruction	= function(sTarget, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["target",	cString],
		["data",	cString]
	], "createProcessingInstruction");

	// Invoke actual implementation
	return fAMLDocument_createProcessingInstruction(this, sTarget, sData);
};

cAMLDocument.prototype.getElementById	= function(sId)
{
	// Validate arguments
	fAML_validate(arguments, [
		["id",	cString]
	], "getElementById");

    return oAML_ids[sId] || null;
};

function fAMLDocument_getElementsByTagName(oDocument, sTagName)
{
    var aElements   = new cAMLNodeList,
		bTagName	= '*' == sTagName;
	for (var sKey in oAML_all)
		if (oAML_all.hasOwnProperty(sKey))
			if (bTagName || sTagName == oAML_all[sKey].tagName)
				aElements.$add(oAML_all[sKey]);
	return aElements;
};

cAMLDocument.prototype.getElementsByTagName	= function(sTagName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	], "getElementsByTagName");

	return fAMLDocument_getElementsByTagName(this, sTagName);
};

function fAMLDocument_getElementsByTagNameNS(oDocument, sNameSpaceURI, sLocalName)
{
    var aElements   = new cAMLNodeList,
		bLocalName		= '*' == sLocalName,
		bNameSpaceURI	= '*' == sNameSpaceURI;
	for (var sKey in oAML_all)
		if (oAML_all.hasOwnProperty(sKey) && oAML_all.hasOwnProperty(sKey))
	        if (bNameSpaceURI || sNameSpaceURI == oAML_all[sKey].namespaceURI)
	        	if (bLocalName || sLocalName == oAML_all[sKey].localName)
	            	aElements.$add(oAML_all[sKey]);
	return aElements;
};

cAMLDocument.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	], "getElementsByTagNameNS");

	return fAMLDocument_getElementsByTagNameNS(this, sNameSpaceURI, sLocalName);
};

cAMLDocument.prototype.importNode	= function(oNode, bDeep)
{
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cXMLElement],
		["deep",	cBoolean]
	], "importNode");

	if (oNode && oNode.nodeType == cAMLNode.ELEMENT_NODE)
		return fAML_import(oNode);
	else
		throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// nsIDOM3Document
cAMLDocument.prototype.adoptNode		= function(oNode)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.normalizeDocument	= function()
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.renameNode	= function(oNode, sNameSpaceURI, sQName)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.getElementsByAttribute	= function(sName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cString, true]
	], "getElementsByAttribute");

    var aElements   = new cAMLNodeList,
    	bValue		= '*' == sValue;
    for (var sKey in oAML_all)
        if (oAML_all.hasOwnProperty(sKey) && oAML_all[sKey].hasAttribute(sName))
        	if (bValue || sValue == oAML_all[sKey].getAttribute(sName))
            	aElements.$add(oAML_all[sKey]);
    return aElements;
};

cAMLDocument.prototype.getElementsByAttributeNS	= function(sNameSpaceURI, sLocalName, sValue)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString],
		["value",			cString, true]
	], "getElementsByAttributeNS");

    var aElements   = new cAMLNodeList,
    	bValue		= '*' == sValue;
    for (var sKey in oAML_all)
        if (oAML_all.hasOwnProperty(sKey) && oAML_all[sKey].hasAttributeNS(sNameSpaceURI, sLocalName))
        	if (bValue || sValue == oAML_all[sKey].getAttributeNS(sNameSpaceURI, sLocalName))
            	aElements.$add(oAML_all[sKey]);
    return aElements;
};

// Private methods
function fAMLDocument_routeEvent(oEvent)
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
	while (true) {
		switch (oEvent.eventPhase) {
			case cAMLEvent.CAPTURING_PHASE:
				if (--nCurrent > 0)
					oEvent.currentTarget	= aTargets[nCurrent];
				else {
					// Do not propagate either target or bubbling for disabled elements
					if (oEvent instanceof cAMLUIEvent && oEvent.target instanceof cAMLElement && !oEvent.target.$isAccessible())
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
					if (oEvent instanceof cAMLUIEvent && oEvent.target instanceof cAMLElement && !oEvent.target.$isAccessible())
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

		// Break loop if propagation stopped
		if (oEvent._stopped)
			return;
	}
};

cAMLDocument.prototype.open	= function() {
	var aElements	= oUADocument.getElementsByTagName("script"),
		oElement	= aElements[aElements.length - 1];
	oElement.parentNode.removeChild(oElement);
	oUADocument.write('<' + "script" + ' ' + "type" + '="' + "application/ample+xml" + '"' + '>');
};

cAMLDocument.prototype.close	= function() {
	oUADocument.write('</' + "script" + '>');
};

/*
cAMLDocument.prototype.$getAnonymousElement	= function(oElement, sPseudoName) {

};

cAMLDocument.prototype.$getElementByAnonymousElement	= function(oElementDOM) {

};
*/
//->Source
/*
// nsIDOMDocumentTraversal
cAMLDocument.prototype.createTreeWalker	= function(oNode, nWhatToShow, oFilter, bEntityReferenceExpansion)
{
	return new cAMLTreeWalker(oNode, nWhatToShow, oFilter, bEntityReferenceExpansion);
};
*/
//<-Source
