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
var nAMLDocument_index	= 0,
	//oAMLDocument_shadow	= {},
	oAMLDocument_all	= {},
	oAMLDocument_ids	= {};

// Public Methods
cAMLDocument.prototype.createAttribute	= function(sName)
{
	// Validate arguments
	fGuard(arguments, [
		["name",	cString]
	]);

	return fAMLDocument_createAttributeNS(this, null, sName);
};

function fAMLDocument_createAttributeNS(oDocument, sNameSpaceURI, sQName)
{
//->Source
/*
	var oNode		= new cAMLAttr,
		aQName		= sQName.split(':'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null;

	oNode.ownerDocument	= this;
    oNode.localName		= sLocalName;
    oNode.prefix		= sPrefix;
    oNode.namespaceURI	= sNameSpaceURI;
    oNode.nodeName		= sQName;
	oNode.nodeValue		= '';
    oNode.name			= oNode.nodeName;
    oNode.value			= oNode.nodeValue;

	return oNode;
*/
//<-Source
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.createAttributeNS	= function(sNameSpaceURI, sQName)
{
	// Validate arguments
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["name",			cString]
	]);

	return fAMLDocument_createAttributeNS(this, sNameSpaceURI, sQName);
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
	fGuard(arguments, [
		["data",	cObject, true]
	]);

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
	fGuard(arguments, [
		["data",	cObject, true]
	]);

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
	fGuard(arguments, [
		["data",	cObject, true]
	]);

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
	fGuard(arguments, [
		["name",	cString]
	]);

	// Invoke actual implementation
	return fAMLDocument_createElementNS(this, this.documentElement.namespaceURI, sName);
};

function fAMLDocument_createElementNS(oDocument, sNameSpaceURI, sQName)
{
	var aQName		= sQName.split(':'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null,
		cElement	= oAMLImplementation_elements[sNameSpaceURI + '#' + sLocalName],
		oElement	= new (cElement || cAMLElement),
		sName;

	// DOM Properties
	oElement.attributes		= {};
    oElement.ownerDocument	= oDocument;
    oElement.prefix			= sPrefix;
    oElement.nodeName		= sQName;
    oElement.tagName		= sQName;
    oElement.childNodes		= new cAMLNodeList;

	// System properties
    oElement.uniqueID	= 'ele_' + nAMLDocument_index++;

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
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["name",			cString]
	]);

	// Invoke actual implementation
	return fAMLDocument_createElementNS(this, sNameSpaceURI, sQName);
};

cAMLDocument.prototype.createEntityReference	= function(sName)
{
	// Validate arguments
	fGuard(arguments, [
		["name",	cString]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.createEvent     = function(sName)
{
	// Validate arguments
	fGuard(arguments, [
		["eventType",	cString]
	]);

	var cEvent	= window["AML" + sName.replace(/s$/, '')];
	if (cEvent && (cEvent == cAMLEvent || cEvent.prototype instanceof cAMLEvent))
		return new cEvent;
	else
        throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLDocument.prototype.canDispatch	= function(sNameSpaceURI, sType)
{
	// Validate arguments
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["type",			cString]
	]);

	return true;
};

function fAMLDocument_createDocumentFragment(oDocument)
{
	var oNode	= new cAMLDocumentFragment;
	oNode.ownerDocument	= oDocument;
    oNode.childNodes	= new cAMLNodeList;

	return oNode;
};

cAMLDocument.prototype.createDocumentFragment	= function()
{
	return fAMLDocument_createDocumentFragment(this);
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
	fGuard(arguments, [
		["target",	cString],
		["data",	cString]
	]);

	// Invoke actual implementation
	return fAMLDocument_createProcessingInstruction(this, sTarget, sData);
};

cAMLDocument.prototype.getElementById	= function(sId)
{
	// Validate arguments
	fGuard(arguments, [
		['id',	cString]
	]);

    return oAMLDocument_ids[sId] || null;
};

cAMLDocument.prototype.getElementsByTagName	= function(sTagName)
{
	// Validate arguments
	fGuard(arguments, [
		["name",	cString]
	]);

	return fAMLElement_getElementsByTagName(this, sTagName);
};

cAMLDocument.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName)
{
	// Validate arguments
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	]);

	return fAMLElement_getElementsByTagNameNS(this, sNameSpaceURI, sLocalName);
};

function fAMLDocument_importNode(oDocument, oElementDOM, bDeep, oNode, bCollapse) {
	switch (oElementDOM.nodeType) {
		case cAMLNode.ELEMENT_NODE:
			var sNameSpaceURI	= oElementDOM.namespaceURI,
				sLocalName		= oElementDOM.localName || oElementDOM.baseName;
			// Bugfix FF4 (remote XUL)
			if (bGecko && sNameSpaceURI == sNS_XUL + '#')
				sNameSpaceURI	= sNS_XUL;
			if (bTrident && !sNameSpaceURI)
				sNameSpaceURI	=
					(function (oNode/*, sPrefix*/) {
						// Lookup entity reference node
						while (oNode = oNode.parentNode)
							if (oNode.nodeType == cAMLNode.ENTITY_REFERENCE_NODE)
								break;
						// Lookup default namespace URI (IE doesn't allow prefixed elements in entity references)
						if (oNode && oNode.parentNode)
							return oNode.parentNode.namespaceURI;
/*
						// Lookup namespace URI used in element
						for (; oNode && oNode.nodeType != cAMLNode.DOCUMENT_NODE; oNode = oNode.parentNode)
							if (oNode.prefix == sPrefix)
								return oNode.namespaceURI;
							else
							if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
								for (var nIndex = 0, nLength = oNode.attributes.length, sAttribute; nIndex < nLength; nIndex++)
									if ((sAttribute = oNode.attributes[nIndex].nodeName) && sAttribute.indexOf("xmlns" + ':') == 0 && sAttribute.substr(6) == sPrefix)
										return oNode.attributes[nIndex].value;
*/
						return null;
					})(oElementDOM/*, oElementDOM.prefix*/);
			// XInclude 1.0
			if (sNameSpaceURI == sNS_XINCLUDE) {
				if (sLocalName == "include") {
					var oRequest	= new cXMLHttpRequest,
						oResponse,
						sHref	= oElementDOM.getAttribute("href");
					//
					sHref	= fUtilities_resolveUri(sHref, fAMLNode_getBaseURI(oNode));
					//
					oRequest.open("GET", sHref, false);
					oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
					oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
					oRequest.send(null);
					if (oResponse = fBrowser_getResponseDocument(oRequest)) {
						// set xml:base according to spec
						if (!oResponse.documentElement.getAttribute("xml:base"))
							oResponse.documentElement.setAttribute("xml:base", sHref);
						fAMLDocument_importNode(oDocument, oResponse, bDeep, oNode, bCollapse);
					}
					else {
						// lookup if there is fallback
						oElementDOM	= oElementDOM.getElementsByTagName('*')[0];
						if (oElementDOM) {
							if ((oElementDOM.localName || oElementDOM.baseName).toLowerCase() == "fallback" && oElementDOM.namespaceURI == sNameSpaceURI) {
								if (oElementDOM.firstChild)
									fAMLDocument_importNode(oDocument, oElementDOM.getElementsByTagName('*')[0] || oElementDOM.childNodes[0], bDeep, oNode, bCollapse);
							}
//->Debug
							else
								fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.nodeName, oElementDOM.namespaceURI]);
//<-Debug
						}
					}
				}
//->Debug
				else
					fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.nodeName, sNameSpaceURI]);
//<-Debug
			}
			// Other namespaces
			else {
				// Create element (note: in IE, namespaceURI is empty string if not specified, hence "oElementDOM.namespaceURI || null")
				var oElement	= fAMLDocument_createElementNS(oDocument, sNameSpaceURI, oElementDOM.nodeName),
					oAttributes	= oElement.attributes,
					aAttributes = oElementDOM.attributes,
					oAttribute, sName, sValue;

				for (var nIndex = 0, nLength = aAttributes.length; nIndex < nLength; nIndex++) {
					// oAttribute used to cache object
					oAttribute	= aAttributes[nIndex];
					sName	= oAttribute.nodeName;
					sValue	= oAttribute.nodeValue;

					// Inline event handler
					if (sName.indexOf('on') == 0)
						oElement[sName]	= new cFunction(sNameSpaceURI == sNS_SVG ? "evt" : "event", bCollapse ? fUtilities_decodeEntities(sValue) : sValue);
					else
						oAttributes[sName]	= bCollapse ? sValue : fUtilities_encodeEntities(sValue);
				}

				// Copy default attributes values if not specified
				var cElement	= oAMLImplementation_elements[sNameSpaceURI + '#' + sLocalName];
				if (cElement) {
					for (sName in cElement.attributes)
						if (cElement.attributes.hasOwnProperty(sName) && !(sName in oAttributes))
							oAttributes[sName]	= cElement.attributes[sName];
				}
//->Debug
				else
				if (!(sNameSpaceURI == sNS_XHTML && sLocalName == "div" && oAttributes["type"] == "application/ample+xml"))
					fUtilities_warn(sAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.nodeName, sNameSpaceURI]);
//<-Debug

				// and append it to parent (if there is one)
				if (oNode)
					fAMLNode_appendChild(oNode, oElement);

				// Render Children
				if (bDeep)
					for (var nIndex = 0, nLength = oElementDOM.childNodes.length; nIndex < nLength; nIndex++)
						fAMLDocument_importNode(oDocument, oElementDOM.childNodes[nIndex], bDeep, oElement, bCollapse);
			}
			break;

		case cAMLNode.ENTITY_REFERENCE_NODE:
			// This is normally  executed only in IE
			for (var nIndex = 0, nLength = oElementDOM.childNodes.length; nIndex < nLength; nIndex++)
				fAMLDocument_importNode(oDocument, oElementDOM.childNodes[nIndex], bDeep, oNode, bCollapse);
			break;

		case cAMLNode.TEXT_NODE:
			var sValue	= oElementDOM.nodeValue;
			if (!bCollapse)
				sValue	= fUtilities_encodeEntities(sValue);

			if (sValue.trim() != '') {
				if (oNode.lastChild instanceof cAMLCharacterData)
					fAMLCharacterData_appendData(oNode.lastChild, sValue);
				else
					fAMLNode_appendChild(oNode, fAMLDocument_createTextNode(oDocument, sValue));
			}
			break;

		case cAMLNode.CDATA_SECTION_NODE:
			fAMLNode_appendChild(oNode, fAMLDocument_createCDATASection(oDocument, oElementDOM.nodeValue));
			break;

		case cAMLNode.COMMENT_NODE:
//->Source
/*
			fAMLNode_appendChild(oElement, oElement.ownerDocument.createComment(oElementDOM.nodeValue));
*/
//<-Source
			break;

		case cAMLNode.PROCESSING_INSTRUCTION_NODE:
			switch (oElementDOM.target)	{
				case "xml":
					break;

				case "xml-stylesheet":
					if (oElementDOM.nodeValue.match(/href=["']([^"']+)["']/)) {
						var sHref	= cRegExp.$1;
						if (oElementDOM.nodeValue.match(/type=["']([^"']+)["']/))
							if (cRegExp.$1 == "text/css" || cRegExp.$1 == "text/ample+css") {
								var sCSS	= fBrowser_loadStyleSheet(sHref);
								if (sCSS)
									oBrowser_head.appendChild(fBrowser_createStyleSheet(sCSS, sHref));
							}
					}
					// no break is left intentionally
				default:
					fAMLNode_appendChild(oNode, fAMLDocument_createProcessingInstruction(oDocument, oElementDOM.nodeName, oElementDOM.nodeValue));
			}
			break;

		case cAMLNode.DOCUMENT_NODE:
			if (bDeep)
				for (var nIndex = 0, nLength = oElementDOM.childNodes.length; nIndex < nLength; nIndex++)
					fAMLDocument_importNode(oDocument, oElementDOM.childNodes[nIndex], bDeep, oNode, bCollapse);
			break;

		case cAMLNode.DOCUMENT_TYPE_NODE:
			break;

		default:
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
	}
	return oElement;
};

cAMLDocument.prototype.importNode	= function(oNode, bDeep)
{
	// Validate arguments
	fGuard(arguments, [
		["node",	cXMLNode],
		["deep",	cBoolean]
	]);

	if (oNode.nodeType == cAMLNode.ELEMENT_NODE)
		return fAMLDocument_importNode(this, oNode, bDeep);
	else
		throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

//->Source
cAMLDocument.prototype.createRange		= function() {
	var oRange	= new cAMLRange;
	fAMLRange_setStart(oRange, this, 0);
	fAMLRange_setEnd(oRange, this, 0);
	oRange.commonAncestorContainer	= this;
	oRange.collapsed	= true;
	return oRange;
};
//<-Source

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


function fAMLDocument_register(oDocument, oElement) {
	//
	if (oElement.nodeType == cAMLNode.ELEMENT_NODE && !oAMLDocument_all[oElement.uniqueID]) {
		// Register Instance
		oAMLDocument_all[oElement.uniqueID]	= oElement;

		// Cache for shadow links
//		oAMLDocument_shadow[oElement.uniqueID]	= {};

		// Register "identified" Instance
		var sId	= oElement.attributes.id;
		if (sId) {
//->Debug
			if (oAMLDocument_ids[sId])
				fUtilities_warn(sAML_NOT_UNIQUE_ID_WRN, [sId]);
//<-Debug
			oAMLDocument_ids[sId]	= oElement;
		}

		// Set style property
		if (oAMLConfiguration_values["ample-use-style-property"]) {
			var oElementDOM	= oElement.$getContainer();
			if (oElementDOM)
				oElement.style	= oElementDOM.style;
		}

		// Global attributes module
		for (var sName in oElement.attributes) {
			if (oElement.attributes.hasOwnProperty(sName)) {
				var aQName		= sName.split(':'),
					sLocalName	= aQName.pop(),
					sPrefix		= aQName.pop() || null,
					sNameSpaceURI;

				if (sName != "xmlns" && sPrefix && sPrefix != "xmlns" && (sNameSpaceURI = fAMLNode_lookupNamespaceURI(oElement, sPrefix))) {
					var cAttribute	= oAMLImplementation_attributes[sNameSpaceURI + '#' + sLocalName];
					if (cAttribute)	{
						// oAttribute used to create fake object
						var oAttribute	= new cAttribute;
						oAttribute.ownerDocument= oDocument;
						oAttribute.ownerElement	= oElement;
						oAttribute.name			=
						oAttribute.nodeName		= sName;
						oAttribute.value		=
						oAttribute.nodeValue	= oElement.attributes[sName];
						oAttribute.localName	= sLocalName;
						oAttribute.prefix		= sPrefix;
						oAttribute.namespaceURI	= sNameSpaceURI;

						// Fire Mutation event (pseudo)
						oEvent = new cAMLMutationEvent;
						oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
						oEvent.target	=
						oEvent.currentTarget	= oAttribute;
						oEvent.eventPhase		= cAMLEvent.AT_TARGET;
						fAMLNode_handleEvent(oAttribute, oEvent);
					}
//->Debug
					else
						fUtilities_warn(sAML_UNKNOWN_ATTRIBUTE_NS_WRN, [sLocalName, sNameSpaceURI]);
//<-Debug
				}
			}
		}

		var nIndex,
			oNode;

		// Process anonymous content
		if (oElement.contentFragment)
			for (nIndex = 0; oNode = oElement.contentFragment.childNodes[nIndex]; nIndex++) {
				// Tweak DOM
				oNode.parentNode	= oElement;
				//
				fAMLDocument_register(oDocument, oNode);
			}

		// Fire Mutation event on Element
		var oEvent = new cAMLMutationEvent;
		oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
		fAMLNode_dispatchEvent(oElement, oEvent);

		// Process children
		for (nIndex = 0; oNode = oElement.childNodes[nIndex]; nIndex++)
			fAMLDocument_register(oDocument, oNode);
	}
};

function fAMLDocument_unregister(oDocument, oElement) {
	//
	if (oElement.nodeType == cAMLNode.ELEMENT_NODE && oAMLDocument_all[oElement.uniqueID]) {
		// Fire Mutation event
		var oEvent = new cAMLMutationEvent;
		oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
		fAMLNode_dispatchEvent(oElement, oEvent);

		// Unset style property
		if (oAMLConfiguration_values["ample-use-style-property"])
			delete oElement.style;

		// Unregister Instance
		delete oAMLDocument_all[oElement.uniqueID];

		// Cache for shadow links
//		delete oAMLDocument_shadow[oElement.uniqueID];

		// Unregister "identified" Instance
		if (oElement.attributes.id)
			delete oAMLDocument_ids[oElement.attributes.id];

		var nIndex,
			oNode;

		// Process children
		for (nIndex = 0; oNode = oElement.childNodes[nIndex]; nIndex++)
			fAMLDocument_unregister(oDocument, oNode);

		// Process anonymous content
		if (oElement.contentFragment)
			for (nIndex = 0; oNode = oElement.contentFragment.childNodes[nIndex]; nIndex++) {
				fAMLDocument_unregister(oDocument, oNode);
				// Un-tweak DOM
				oNode.parentNode	= oElement.contentFragment;
			}
	}
};