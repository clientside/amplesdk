/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (!cXSLTProcessor) {
	cXSLTProcessor	= function() {
		this._template	= new fActiveXObject("MSXML2" + '.' + "XSLTemplate");
		this.reset();
	};
	cXSLTProcessor.prototype.importStylesheet	= function(oNode) {
		// Validate arguments
		fAML_validate(arguments, [
			["stylesheet",	cXMLNode]
		], "importStylesheet");

		var oStylesheet	= new fActiveXObject("MSXML2" + '.' + "FreeThreadedDOMDocument");
//		oStylesheet.resolveExternals	= true;
		oStylesheet.loadXML(oNode.xml);
		oStylesheet.setProperty("SelectionNamespaces", "xmlns" + ':' + "xsl" + '="' + "http://www.w3.org/1999/XSL/Transform" + '"');
		var oMethod	= oStylesheet.selectSingleNode('/' + '/' + "xsl" + ':' + "output");

		this._template.stylesheet	= oStylesheet;
		this._processor	= this._template.createProcessor();
		this._parameters= {};
		this._method	= oMethod ? oMethod.getAttribute("method") : "xml";
	};
	cXSLTProcessor.prototype.clearParameters	= function() {
		var sNameSpaceURI, oNameSpace, sLocalName;
		for (sNameSpaceURI in this._parameters) {
			oNameSpace	= this._parameters[sNameSpaceURI];
			for (sLocalName in oNameSpace)
				this.removeParameter(sNameSpaceURI, sLocalName);
		}
		this._parameters	= {};
	};
	cXSLTProcessor.prototype.getParameter		= function(sNameSpaceURI, sLocalName) {
		// Validate arguments
		fAML_validate(arguments, [
			["namespaceURI",	cString, false, true],
			["localName",		cString]
		], "getParameter");

		if (sNameSpaceURI == null)
			sNameSpaceURI	=  '';
		var oNameSpace	= this._parameters[sNameSpaceURI];
		if (oNameSpace && oNameSpace[sLocalName])
			return oNameSpace[sLocalName];
		return null;
	};
	cXSLTProcessor.prototype.removeParameter	= function(sNameSpaceURI, sLocalName) {
		// Validate arguments
		fAML_validate(arguments, [
			["namespaceURI",	cString, false, true],
			["localName",		cString]
		], "removeParameter");

		if (sNameSpaceURI == null)
			sNameSpaceURI	=  '';
		if (sNameSpaceURI)
			this._processor.addParameter(sLocalName, '', sNameSpaceURI);
		else
			this._processor.addParameter(sLocalName, '');
		var oNameSpace	= this._parameters[sNameSpaceURI];
		if (oNameSpace)
			delete oNameSpace[sLocalName];
	};
	cXSLTProcessor.prototype.setParameter		= function(sNameSpaceURI, sLocalName, sValue) {
		// Validate arguments
		fAML_validate(arguments, [
			["namespaceURI",	cString, false, true],
			["localName",		cString],
			["value",			cObject]
		], "setParameter");

		if (sNameSpaceURI == null)
			sNameSpaceURI	=  '';
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
		// Validate arguments
		fAML_validate(arguments, [
			["source",	cXMLNode]
		], "transformToDocument");

		var oProcessor	= this._processor,
			oOutput		= new fActiveXObject("Microsoft" + '.' + "XMLDOM");

		// check if importStylesheet initialized processor
		if (!oProcessor)
			throw new cAMLException(cAMLException.AML_NOT_INITIALIZED_ERR, null, ["XSLTProcessor"]);

		// Execute transformation
		oProcessor.input	= oNode;
		oProcessor.output	= oOutput;
		oProcessor.transform();

		return oOutput;
	};
	cXSLTProcessor.prototype.transformToFragment	= function(oNode, oDocument) {
		// Validate arguments
		fAML_validate(arguments, [
			["source",	cXMLNode],
			["output",	cXMLDocument]
		], "transformToFragment");

		var oProcessor	= this._processor,
			oOutput		= new fActiveXObject("Microsoft" + '.' + "XMLDOM"),
			oFragment	= oDocument.createDocumentFragment();

		// check if importStylesheet initialized processor
		if (!oProcessor)
			throw new cAMLException(cAMLException.AML_NOT_INITIALIZED_ERR, null, ["XSLTProcessor"]);

		// Execute transformation
		oProcessor.input	= oNode;
		oProcessor.output	= oOutput;
		oProcessor.transform();
		// Move result nodes to fragment
		while (oOutput.hasChildNodes())
			oFragment.appendChild(oOutput.firstChild);

		return oFragment;
	};
};
