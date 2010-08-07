/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLImplementation	= function(){};

var oAMLImplementation_elements		= {},
	oAMLImplementation_attributes	= {};

// nsIDOMImplementation Level 1
cAMLImplementation.prototype.hasFeature		= function(sFeature, sVersion)
{
	return false;	// Return false
};

// nsIDOMImplementation Level 2
cAMLImplementation.prototype.createDocumentType	= function(sQName, sPublicId, sSystemId)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

function fAMLImplementation_createDocument(oImplementation, sNameSpaceURI, sQName, oDocType)
{
	// Create docuemnt
	var oDocument	= new cAMLDocument;
	oDocument.implementation= oImplementation;
	oDocument.domConfig		= new cAMLConfiguration;
	oDocument.childNodes	= new cAMLNodeList;

	// Add processing instruction <?xml version="1.0"?>
	fAMLNode_appendChild(oDocument, fAMLDocument_createProcessingInstruction(oDocument, "xml", "version" + '="' + "1.0" + '"'));

	// Add doc type, if passed
	if (oDocType)
		fAMLNode_appendChild(oDocument, oDocType);

	// Add document element
	if (sQName)
	{
		oDocument.documentElement	= fAMLDocument_createElementNS(oDocument, sNameSpaceURI, sQName);
		if (sNameSpaceURI)
			oDocument.documentElement.attributes["xmlns" + (sQName.match(/^([^:]+):/) ? ':' + cRegExp.$1 : '')]	= sNameSpaceURI;
		fAMLNode_appendChild(oDocument, oDocument.documentElement);
	    // Register
		fAMLDocument_register(oDocument, oDocument.documentElement);
	}

	return oDocument;
};

cAMLImplementation.prototype.createDocument	= function(sNameSpaceURI, sQName, oDocType)
{
	// Validate arguments
	fGuard(arguments, [
		["namespaceURI",	cString, false, true],
		["qualifiedName",	cString, false, true],
		["doctype",			cObject, false, true]
	]);

	// Invoke actual implementation
	return fAMLImplementation_createDocument(this, sNameSpaceURI, sQName, oDocType);
};

// nsIDOMImplementation Level 3
cAMLImplementation.prototype.getFeature	= function(sFeature, sVersion)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};
