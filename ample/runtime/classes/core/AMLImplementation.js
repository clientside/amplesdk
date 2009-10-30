/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLImplementation	= function(){};

// nsIDOMImplementation Level 1
cAMLImplementation.prototype.hasFeature		= function(sFeature, sVersion)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

// nsIDOMImplementation Level 2
cAMLImplementation.prototype.createDocumentType	= function(sQName, sPublicId, sSystemId)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLImplementation.prototype.createDocument	= function(sNameSpaceURI, sQName, oDocType)
{
	// Validate arguments
	fAML_validate(arguments, [
		["namespaceURI",	cString, false, true],
		["qualifiedName",	cString, false, true],
		["doctype",			cObject, false, true]
	], "createDocument");

	// Disable mutation-events (since there cannot be any listeners yet)
	oAML_configuration.setParameter("ample-use-dom-events",		false);

	// Create docuemnt
	var oDocument	= new cAMLDocument;
	oDocument.namespaceURI	= sNameSpaceURI;
	oDocument.implementation= oAML_implementation;
	oDocument.domConfig		= oAML_configuration;
	oDocument.childNodes	= new cAMLNodeList;

	// Add processing instruction <?xml version="1.0"?>
	cAMLNode.prototype.appendChild.call(oDocument, oDocument.createProcessingInstruction("xml", "version" + '="' + "1.0" + '"'));

	// Add doc type, if passed
	if (oDocType)
		oDocument.appendChild(oDocType);

	// Add document element
	if (sQName)
	{
		oDocument.documentElement	= oDocument.createElementNS(sNameSpaceURI, sQName);
		if (sNameSpaceURI)
			oDocument.documentElement.attributes["xmlns" + (sQName.match(/^([^:]):/) ? ':' + cRegExp.$1 : '')]	= sNameSpaceURI;
		cAMLNode.prototype.appendChild.call(oDocument, oDocument.documentElement);
	    // Register
		fAML_register(oDocument.documentElement);
	}

	// Enable mutation-events
	oAML_configuration.setParameter("ample-use-dom-events",		true);

	return oDocument;
};

// nsIDOMImplementation Level 3
cAMLImplementation.prototype.getFeature	= function(sFeature, sVersion)
{
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};
