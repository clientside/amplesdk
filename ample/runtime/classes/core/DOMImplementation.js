/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDOMImplementation	= function(){};

// nsIDOMImplementation Level 1
cDOMImplementation.prototype.hasFeature		= function(sFeature, sVersion) {
	return false;	// Return false
};

// nsIDOMImplementation Level 2
cDOMImplementation.prototype.createDocumentType	= function(sQName, sPublicId, sSystemId) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

function fDOMImplementation_createDocument(oImplementation, sNameSpaceURI, sQName, oDocType) {
	// Create docuemnt
	var oDocument	= new cDocument;
	oDocument.implementation= oImplementation;
	oDocument.domConfig		= new cDOMConfiguration;
	oDocument.childNodes	= new cNodeList;

	// Add processing instruction <?xml version="1.0"?>
	fNode_appendChild(oDocument, fDocument_createProcessingInstruction(oDocument, "xml", "version" + '="' + "1.0" + '"'));

	// Add doc type, if passed
	if (oDocType)
		fNode_appendChild(oDocument, oDocType);

	// Add document element
	if (sQName) {
		oDocument.documentElement	= fDocument_createElementNS(oDocument, sNameSpaceURI, sQName);
		if (sNameSpaceURI)
			fElement_setAttributeNS(oDocument.documentElement, sNS_XMLNS, "xmlns" + (sQName.match(/^([^:]+):/) ? ':' + cRegExp.$1 : ''), sNameSpaceURI);
		fNode_appendChild(oDocument, oDocument.documentElement);
		// Register
		fDocument_register(oDocument, oDocument.documentElement);
	}

	return oDocument;
};

cDOMImplementation.prototype.createDocument	= function(sNameSpaceURI, sQName, oDocType) {
//->Guard
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["name",			cString, false, true],
		["doctype",			cObject, false, true]
	]);
//<-Guard

	return fDOMImplementation_createDocument(this, sNameSpaceURI, sQName, oDocType);
};

// nsIDOMImplementation Level 3
cDOMImplementation.prototype.getFeature	= function(sFeature, sVersion) {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};
