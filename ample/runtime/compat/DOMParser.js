/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (!cDOMParser) {
	cDOMParser	= function(){
		if (!(this instanceof cDOMParser))
			throw new cTypeError(cAmpleException.OBJECT_CONSTRUCTOR_ERR
//->Debug
					, cDOMParser.caller
					, ["DOMParser"]
//<-Debug
			);
	};
	cDOMParser.prototype.baseURI	= null;
	cDOMParser.prototype.parseFromString	= function(sXml, sType) {
//->Guard
		fGuard(arguments, [
			["string",		cString],
			["contentType",	cString]
		]);
//<-Guard

		var oDocument	= new cActiveXObject("Microsoft.XMLDOM");
		oDocument.async				= false;
		oDocument.validateOnParse	= false;
//		oDocument.preserveWhiteSpace= false;
		oDocument.resolveExternals	= false;
		oDocument.loadXML(sXml);
		return oDocument;
	};
	// Export object
	fExporter_export(cDOMParser,		"DOMParser",		window);
}
