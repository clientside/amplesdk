/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDocument	= function(){};

cDocument.prototype	= new cNode;
cDocument.prototype.nodeType	= 9;	// cNode.DOCUMENT_NODE
cDocument.prototype.nodeName	= "#document";

// nsIDOMDocument interface
cDocument.prototype.documentElement	= null;
cDocument.prototype.doctype			= null;
cDocument.prototype.implementation	= null;

// nsIDOM3Document interface
cDocument.prototype.documentURI		= null;
cDocument.prototype.domConfig		= null;
cDocument.prototype.inputEncoding	= null;
cDocument.prototype.strictErrorChecking	= null;
cDocument.prototype.xmlEncoding		= null;
cDocument.prototype.xmlStandalone	= null;
cDocument.prototype.xmlVersion		= null;

// Private Variables
var nDocument_index	= 0,
//	oDocument_shadow= {},
	oDocument_all	= {},
	oDocument_ids	= {};

// Public Methods
cDocument.prototype.createAttribute	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard

	return fDocument_createAttributeNS(this, null, sName);
};

function fDocument_createAttributeNS(oDocument, sNameSpaceURI, sQName) {
	var oNode		= new cAttr,
		aQName		= sQName.split(':'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null;

	oNode.ownerDocument	= oDocument;
	oNode.localName		= sLocalName;
	oNode.prefix		= sPrefix;
	oNode.namespaceURI	= sNameSpaceURI;
	oNode.nodeName		=
	oNode.name			= sQName;
	oNode.nodeValue		=
	oNode.value			= '';

	return oNode;
};

cDocument.prototype.createAttributeNS	= function(sNameSpaceURI, sQName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["name",			cString]
	]);
//<-Guard

	return fDocument_createAttributeNS(this, sNameSpaceURI, sQName);
};

function fDocument_createTextNode(oDocument, sData) {
	var oNode	= new cText;
	oNode.ownerDocument	= oDocument;
	oNode.nodeValue	=
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cDocument.prototype.createTextNode	= function(sData) {
//->Guard
	fGuard(arguments, [
		["data",	cObject, true]
	]);
//<-Guard
	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	return fDocument_createTextNode(this, cString(sData));
};

function fDocument_createCDATASection(oDocument, sData) {
	var oNode	= new cCDATASection;
	oNode.ownerDocument	= oDocument;
	oNode.nodeValue	=
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};

cDocument.prototype.createCDATASection	= function(sData) {
//->Guard
	fGuard(arguments, [
		["data",	cObject, true]
	]);
//<-Guard
	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	return fDocument_createCDATASection(this, cString(sData));
};

//->Source
/*
function fDocument_createComment(oDocument, sData) {
	var oNode	= new cComment;
	oNode.ownerDocument	= oDocument;
	oNode.nodeValue	=
	oNode.data		= sData;
	oNode.length	= sData.length;

	return oNode;
};
*/
//<-Source

cDocument.prototype.createComment	= function(sData) {
//->Guard
	fGuard(arguments, [
		["data",	cObject, true]
	]);
//<-Guard

//->Source
/*
	// if no argument was provided, use empty string
	if (!arguments.length)
		sData	= '';

	return fDocument_createComment(this, sData);
*/
//<-Source

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cDocument.prototype.createElement	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard

	return fDocument_createElementNS(this, this.documentElement.namespaceURI, sName);
};

function fDocument_createElementNS(oDocument, sNameSpaceURI, sQName) {
	var aQName		= sQName.split(':'),
		sLocalName	= aQName.pop(),
		sPrefix		= aQName.pop() || null,
		fConstructor= hClasses[sNameSpaceURI + '#' + sLocalName],
		oElement	= new (fConstructor || cElement),
		sName;

	// DOM Properties
	oElement.attributes		= new cNamedNodeMap;
	oElement.ownerDocument	= oDocument;
	oElement.prefix			= sPrefix;
	oElement.nodeName		=
	oElement.tagName		= sQName;
	oElement.childNodes		= new cNodeList;

	// System properties
	oElement.uniqueID	= 'ele_' + nDocument_index++;

	//
	if (fConstructor) {
		// Set default attributes, if defined
		for (sName in fConstructor.attributes)
			if (fConstructor.attributes.hasOwnProperty(sName))
				fElement_setAttribute(oElement, sName, fConstructor.attributes[sName]);
	}
	else {
		// Set namespaceURI for unknown elements manually
		oElement.namespaceURI	= sNameSpaceURI;
		oElement.localName		= sLocalName;
	}

	return oElement;
};

cDocument.prototype.createElementNS	= function(sNameSpaceURI, sQName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["name",			cString]
	]);
//<-Guard

	return fDocument_createElementNS(this, sNameSpaceURI, sQName);
};

cDocument.prototype.createEntityReference	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

function fDocument_createDocumentFragment(oDocument) {
	var oNode	= new cDocumentFragment;
	oNode.ownerDocument	= oDocument;
	oNode.childNodes	= new cNodeList;

	return oNode;
};

cDocument.prototype.createDocumentFragment	= function() {
	return fDocument_createDocumentFragment(this);
};

function fDocument_createProcessingInstruction(oDocument, sTarget, sData) {
	var oNode	= new (hClasses['?' + sTarget] || cProcessingInstruction);
	oNode.ownerDocument	= oDocument;
	oNode.nodeName	=
	oNode.target	= sTarget;
	oNode.nodeValue	=
	oNode.data		= sData;

	return oNode;
};

cDocument.prototype.createProcessingInstruction	= function(sTarget, sData) {
//->Guard
	fGuard(arguments, [
		["target",	cString],
		["data",	cString]
	]);
//<-Guard

	return fDocument_createProcessingInstruction(this, sTarget, sData);
};

cDocument.prototype.getElementById	= function(sId) {
//->Guard
	fGuard(arguments, [
		['id',	cString]
	]);
//<-Guard

	return oDocument_ids[sId] || null;
};

cDocument.prototype.getElementsByTagName	= function(sTagName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard

	return fElement_getElementsByTagName(this, sTagName);
};

cDocument.prototype.getElementsByTagNameNS	= function(sNameSpaceURI, sLocalName) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["localName",		cString]
	]);
//<-Guard

	return fElement_getElementsByTagNameNS(this, sNameSpaceURI, sLocalName);
};

function fDocument_importNode(oDocument, oElementDOM, bDeep, oParent) {
	var oNode	= null;
	switch (oElementDOM.nodeType) {
		case 1:	// cNode.ELEMENT_NODE
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
							if (oNode.nodeType == 5)	// cNode.ENTITY_REFERENCE_NODE
								break;
						// Lookup default namespace URI (IE doesn't allow prefixed elements in entity references)
						if (oNode && oNode.parentNode)
							return oNode.parentNode.namespaceURI;
/*
						// Lookup namespace URI used in element
						for (; oNode && oNode.nodeType != 9; oNode = oNode.parentNode)
							if (oNode.prefix == sPrefix)
								return oNode.namespaceURI;
							else
							if (oNode.nodeType == 1)	// cNode.ELEMENT_NODE
								for (var nIndex = 0, nLength = oNode.attributes.length, sAttribute; nIndex < nLength; nIndex++)
									if ((sAttribute = oNode.attributes[nIndex].nodeName) && sAttribute.indexOf("xmlns" + ':') == 0 && sAttribute.substr(6) == sPrefix)
										return oNode.attributes[nIndex].value;
*/
						return null;
					})(oElementDOM/*, oElementDOM.prefix*/);
			// XInclude 1.0
			if (sNameSpaceURI == sNS_XINCLUDE) {
				if (sLocalName == "include") {
					var sHref	= fUtilities_resolveUri(oElementDOM.getAttribute("href"), fNode_getBaseURI(oParent)),
						oRequest= fBrowser_load(sHref, "text/xml"),
						oResponse;
					if (oResponse = fBrowser_getResponseDocument(oRequest)) {
						oElementDOM	= oResponse.documentElement;
						// set xml:base according to spec
						if (!oElementDOM.getAttribute("xml:base"))
							oElementDOM.setAttribute("xml:base", sHref);
						oNode	= fDocument_importNode(oDocument, oElementDOM, bDeep, oParent);
					}
					else {
						// lookup if there is fallback
						oElementDOM	= oElementDOM.getElementsByTagName('*')[0];
						if (oElementDOM) {
							if ((oElementDOM.localName || oElementDOM.baseName).toLowerCase() == "fallback" && oElementDOM.namespaceURI == sNameSpaceURI) {
								if (oElementDOM.firstChild)
									oNode	= fDocument_importNode(oDocument, oElementDOM.getElementsByTagName('*')[0] || oElementDOM.childNodes[0], bDeep, oParent);
							}
//->Debug
							else
								fUtilities_warn(sGUARD_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.nodeName, oElementDOM.namespaceURI]);
//<-Debug
						}
					}
				}
//->Debug
				else
					fUtilities_warn(sGUARD_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.nodeName, sNameSpaceURI]);
//<-Debug
			}
			// Other namespaces
			else {
				// Create element
				oNode	= fDocument_createElementNS(oDocument, sNameSpaceURI, oElementDOM.nodeName);

				var aAttributes	= oElementDOM.attributes,
					oAttribute, sName, sValue;

				for (var nIndex = 0, nLength = aAttributes.length; nIndex < nLength; nIndex++) {
					// oAttribute used to cache object
					oAttribute	= aAttributes[nIndex];
					sName	= oAttribute.nodeName;
					sValue	= oAttribute.nodeValue;
					// Bugfix FF4 (remote XUL)
					if (bGecko && sValue == sNS_XUL + '#')
						sValue	= sNS_XUL;

					// Inline event handler (only from null namespace)
					if (!oAttribute.namespaceURI && sName.indexOf('on') == 0) {
						try {
							oNode[sName]	= new cFunction(sNameSpaceURI == sNS_SVG ? "evt" : "event", sValue);
						} catch (oException) {
//->Debug
							fUtilities_warn(sGUARD_JAVASCRIPT_SYNTAX_WRN, [oException.message]);
//<-Debug
						}
					}
					else {
						fElement_setAttributeNS(oNode, oAttribute.namespaceURI || null, sName, sValue);
//->Debug
						if (oAttribute.namespaceURI &&!sName.match(/^xml(:|ns(:|$))/) &&!(hClasses[oAttribute.namespaceURI + '#' + '@' + (oAttribute.localName || oAttribute.baseName)]))
							fUtilities_warn(sGUARD_UNKNOWN_ATTRIBUTE_NS_WRN, [(oAttribute.localName || oAttribute.baseName), oAttribute.namespaceURI]);
//<-Debug
					}
				}

//->Debug
				if (!hClasses[sNameSpaceURI + '#' + sLocalName] && !(sNameSpaceURI == sNS_XHTML && sLocalName == "div"))
					fUtilities_warn(sGUARD_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.nodeName, sNameSpaceURI]);
//<-Debug

				// and append it to parent (if there is one)
				if (oParent)
					fNode_appendChild(oParent, oNode);

				// Render Children
				if (bDeep)
					for (var nIndex = 0, aElements = oElementDOM.childNodes, nLength = aElements.length; nIndex < nLength; nIndex++)
						fDocument_importNode(oDocument, aElements[nIndex], bDeep, oNode);
				//
				return oNode;
			}
			break;

		case 5:	// cNode.ENTITY_REFERENCE_NODE
			// This is normally  executed only in IE
			for (var nIndex = 0, aElements = oElementDOM.childNodes, nLength = aElements.length; nIndex < nLength; nIndex++)
				fDocument_importNode(oDocument, aElements[nIndex], bDeep, oParent);
			break;

		case 3:	// cNode.TEXT_NODE
			var sValue	= oElementDOM.nodeValue;
			if (sValue.trim() != '') {
				//
				if (oParent.lastChild instanceof cCharacterData)
					oNode	= fCharacterData_appendData(oParent.lastChild, sValue);
				else
					oNode	= fNode_appendChild(oParent, fDocument_createTextNode(oDocument, sValue));
			}
			break;

		case 4:	// cNode.CDATA_SECTION_NODE
			oNode	= fNode_appendChild(oParent, fDocument_createCDATASection(oDocument, oElementDOM.nodeValue));
			break;

		case 8:	// cNode.COMMENT_NODE
//->Source
/*
			fNode_appendChild(oElement, oElement.ownerDocument.createComment(oElementDOM.nodeValue));
*/
//<-Source
			break;

		case 7:	// cNode.PROCESSING_INSTRUCTION_NODE
			oNode	= fNode_appendChild(oParent, fDocument_createProcessingInstruction(oDocument, oElementDOM.nodeName, oElementDOM.nodeValue));
			break;

		case 9:	// cNode.DOCUMENT_NODE
//			break;

		case 10:	// cNode.DOCUMENT_TYPE_NODE
//			break;

		default:
			throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	}
	return oNode;
};

cDocument.prototype.importNode	= function(oNode, bDeep) {
//->Guard
	fGuard(arguments, [
		["node",	cXMLNode],
		["deep",	cBoolean]
	]);
//<-Guard

	if (oNode.nodeType == 1)	// cNode.ELEMENT_NODE
		return fDocument_importNode(this, oNode, bDeep);
	else
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

//->Source
cDocument.prototype.createRange		= function() {
	var oRange	= new cRange;
	fRange_setStart(oRange, this, 0);
	fRange_setEnd(oRange, this, 0);
	oRange.commonAncestorContainer	= this;
	oRange.collapsed	= true;
	return oRange;
};
//<-Source

// nsIDOM3Document
cDocument.prototype.adoptNode		= function(oNode) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cDocument.prototype.normalizeDocument	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cDocument.prototype.renameNode	= function(oNode, sNameSpaceURI, sQName) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

/*
cDocument.prototype.$getAnonymousElement	= function(oElement, sPseudoName) {

};

cDocument.prototype.$getElementByAnonymousElement	= function(oElementDOM) {

};
*/

function fDocument_register(oDocument, oElement) {
	//
	if (oElement.nodeType == 1 /* cNode.ELEMENT_NODE */ && !oDocument_all[oElement.uniqueID]) {
		// Register Instance
		oDocument_all[oElement.uniqueID]	= oElement;

		// Cache for shadow links
//		oDocument_shadow[oElement.uniqueID]	= {};

		// Register "identified" Instance
		var sId	= fElement_getAttribute(oElement, 'id');
		if (sId) {
//->Debug
			if (oDocument_ids[sId])
				fUtilities_warn(sGUARD_NOT_UNIQUE_ID_WRN, [sId]);
//<-Debug
			oDocument_ids[sId]	= oElement;
		}

		// Set style property
		if (oDOMConfiguration_values["ample-enable-style"]) {
			var oElementDOM	= oElement.$getContainer();
			if (oElementDOM)
				oElement.style	= oElementDOM.style;
		}

		// Global attributes module
		for (var nIndex = 0, nLength = oElement.attributes.length, oAttribute; nIndex < nLength; nIndex++) {
			if ((oAttribute = oElement.attributes[nIndex]).namespaceURI && oAttribute.namespaceURI != sNS_XML && oAttribute.namespaceURI != sNS_XMLNS) {
				var fConstructor	= hClasses[oAttribute.namespaceURI + '#' + '@' + oAttribute.localName];
				if (fConstructor)	{
					// Fire Mutation event (pseudo)
					oEvent	= new cMutationEvent;
					oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
					oEvent.target	=
					oEvent.currentTarget	= oAttribute;
					oEvent.eventPhase		= 2 /* cEvent.AT_TARGET */;
					fEventTarget_handleEvent(oAttribute, oEvent);
				}
			}
		}

		var oFragment	= oElement.contentFragment,
			nIndex,
			oNode;

		// Process anonymous content
		if (oFragment) {
			oFragment.parentNode	= oElement;
			for (nIndex = 0; oNode = oFragment.childNodes[nIndex]; nIndex++)
				fDocument_register(oDocument, oNode);
		}

		// Fire Mutation event on Element
		var oEvent	= new cMutationEvent;
		oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
		fEventTarget_dispatchEvent(oElement, oEvent);

		// Process children
		for (nIndex = 0; oNode = oElement.childNodes[nIndex]; nIndex++)
			fDocument_register(oDocument, oNode);
	}
};

function fDocument_unregister(oDocument, oElement) {
	//
	if (oElement.nodeType == 1 /* cNode.ELEMENT_NODE */ && oDocument_all[oElement.uniqueID]) {
		// Fire Mutation event
		var oEvent	= new cMutationEvent;
		oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
		fEventTarget_dispatchEvent(oElement, oEvent);

		// Unset style property
		if (oDOMConfiguration_values["ample-enable-style"])
			delete oElement.style;

		// Unregister Instance
		delete oDocument_all[oElement.uniqueID];

		// Cache for shadow links
//		var oCache	= oDocument_shadow[oElement.uniqueID];
//		if (oCache)
//			for (var sPseudo in oCache)
//				delete oCache[sPseudo];
//		delete oDocument_shadow[oElement.uniqueID];

		// Unregister "identified" Instance
		var sId	= fElement_getAttribute(oElement, 'id');
		if (sId)
			delete oDocument_ids[sId];

		var oFragment	= oElement.contentFragment,
			nIndex,
			oNode;

		// Process children
		for (nIndex = 0; oNode = oElement.childNodes[nIndex]; nIndex++)
			fDocument_unregister(oDocument, oNode);

		// Process anonymous content
		if (oFragment) {
			for (nIndex = 0; oNode = oFragment.childNodes[nIndex]; nIndex++)
				fDocument_unregister(oDocument, oNode);
			oFragment.parentNode	= null;
		}
	}
};

// DocumentEvent
cDocument.prototype.createEvent	= cDocumentEvent.prototype.createEvent;
