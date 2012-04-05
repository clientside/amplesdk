/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (!cXSLTProcessor) {
	cXSLTProcessor	= function() {
		this._template	= new cActiveXObject("MSXML2" + '.' + "XSLTemplate");
		this.reset();
	};
	cXSLTProcessor.prototype.importStylesheet	= function(oNode) {
//->Guard
		fGuard(arguments, [
			["stylesheet",	cXMLNode]
		]);
//<-Guard

		var oStylesheet	= new cActiveXObject("MSXML2" + '.' + "FreeThreadedDOMDocument");
//		oStylesheet.resolveExternals	= true;
		oStylesheet.loadXML(new cXMLSerializer().serializeToString(oNode));
		oStylesheet.setProperty("SelectionNamespaces", "xmlns" + ':' + "xsl" + '="' + sNS_XSLT + '"');
		var oMethod	= oStylesheet.selectSingleNode('/' + '/' + "xsl" + ':' + "output");

		this._template.stylesheet	= oStylesheet;
		this._processor	= this._template.createProcessor();
		this._parameters= {};
		this._method	= oMethod ? oMethod.getAttribute("method") : "xml";
	};
	cXSLTProcessor.prototype.clearParameters	= function() {
		var sNameSpaceURI, sLocalName;
		for (sNameSpaceURI in this._parameters)
			if (this._parameters.hasOwnProperty(sNameSpaceURI))
				for (sLocalName in this._parameters[sNameSpaceURI])
					if (this._parameters[sNameSpaceURI].hasOwnProperty(sLocalName))
						this.removeParameter(sNameSpaceURI, sLocalName);
		this._parameters	= {};
	};
	cXSLTProcessor.prototype.getParameter		= function(sNameSpaceURI, sLocalName) {
//->Guard
		fGuard(arguments, [
			["namespaceURI",	cString, false, true],
			["localName",		cString]
		]);
//<-Guard

		if (sNameSpaceURI == null)
			sNameSpaceURI	=	'';
		var oNameSpace	= this._parameters[sNameSpaceURI];
		if (oNameSpace && oNameSpace[sLocalName])
			return oNameSpace[sLocalName];
		return null;
	};
	cXSLTProcessor.prototype.removeParameter	= function(sNameSpaceURI, sLocalName) {
//->Guard
		fGuard(arguments, [
			["namespaceURI",	cString, false, true],
			["localName",		cString]
		]);
//<-Guard

		if (sNameSpaceURI == null)
			sNameSpaceURI	=	'';
		if (sNameSpaceURI)
			this._processor.addParameter(sLocalName, '', sNameSpaceURI);
		else
			this._processor.addParameter(sLocalName, '');
		var oNameSpace	= this._parameters[sNameSpaceURI];
		if (oNameSpace)
			delete oNameSpace[sLocalName];
	};
	cXSLTProcessor.prototype.setParameter		= function(sNameSpaceURI, sLocalName, sValue) {
//->Guard
		fGuard(arguments, [
			["namespaceURI",	cString, false, true],
			["localName",		cString],
			["value",			cObject]
		]);
//<-Guard

		if (sNameSpaceURI == null)
			sNameSpaceURI	=	'';
		if (sNameSpaceURI)
			this._processor.addParameter(sLocalName, sValue, sNameSpaceURI);
		else
			this._processor.addParameter(sLocalName, sValue);

		if (!this._parameters[sNameSpaceURI])
			this._parameters[sNameSpaceURI]	= {};
		this._parameters[sNameSpaceURI][sLocalName]	= sValue;
	};
	cXSLTProcessor.prototype.reset	= function() {
		this._processor	= null;
		this._parameters= {};
		this._method	= "xml";
	};
	cXSLTProcessor.prototype.transformToDocument	= function(oNode) {
//->Guard
		fGuard(arguments, [
			["source",	cXMLNode]
		]);
//<-Guard

		var oProcessor	= this._processor,
			oOutput		= new cActiveXObject("Microsoft.XMLDOM");

		// check if importStylesheet initialized processor
		if (!oProcessor)
			throw new cAmpleException(cAmpleException.NOT_INITIALIZED_ERR, null, ["XSLTProcessor"]);

		// Execute transformation
		oProcessor.input	= oNode;
		oProcessor.output	= oOutput;
		oProcessor.transform();

		return oOutput;
	};
	cXSLTProcessor.prototype.transformToFragment	= function(oNode, oDocument) {
//->Guard
		fGuard(arguments, [
			["source",	cXMLNode],
			["output",	cXMLDocument]
		]);
//<-Guard

		var oProcessor	= this._processor,
			oOutput		= new cActiveXObject("Microsoft.XMLDOM"),
			oFragment	= oDocument.createDocumentFragment();

		// check if importStylesheet initialized processor
		if (!oProcessor)
			throw new cAmpleException(cAmpleException.NOT_INITIALIZED_ERR, null, ["XSLTProcessor"]);

		// Execute transformation
		oProcessor.input	= oNode;
		oProcessor.output	= oOutput;
		oProcessor.transform();
		// Move result nodes to fragment
		while (oOutput.hasChildNodes())
			oFragment.appendChild(oOutput.firstChild);

		return oFragment;
	};

	// Export
	fExporter_export(cXSLTProcessor,	"XSLTProcessor",	window);
};
