/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (!cDOMParser)
{
	cDOMParser = function(){};
	cDOMParser.prototype.baseURI = null;
	cDOMParser.prototype.parseFromString = function(sXml, sMime) {
		// Validate arguments
		fAML_validate(arguments, [
			["string",		cString],
			["contentType",	cString]
		], "parseFromString");

		var oDocument   = new fActiveXObject("Microsoft" + '.' + "XMLDOM");
		oDocument.async				= false;
		oDocument.validateOnParse	= false;
//		oDocument.preserveWhiteSpace= false;
//		oDocument.resolveExternals	= true;
		oDocument.loadXML(sXml);
		return oDocument;
	};
};
