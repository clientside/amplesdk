/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Private members
function fAmple_transform(vXml, vXsl, fCallback, aParameters) {
	var oXSLTProcessor	= new XSLTProcessor,
		fOnXmlReady	= function(oXml) {
			var fOnXslReady	= function(oXsl) {
				// 3: Transform
				oXSLTProcessor.importStylesheet(oXsl);
				var oDocument	= oXSLTProcessor.transformToDocument(oXml);
				if (fCallback)
					fCallback.call(ample, oDocument);
			};
			// 2: Process XSL
			if (vXsl.nodeType)
				fOnXslReady(vXsl);
			else {
				vXsl	= String(vXsl);
				if (vXsl.substr(0,1) == '<')
					fOnXslReady(new DOMParser().parseFromString(vXsl));
				else
					ample.ajax({url:vXsl,success:fOnXslReady});
			}
		};

	// 0: Set parameters
	if (aParameters)
		for (var nIndex = 0, nLength = aParameters.length; nIndex < nLength; nIndex++)
			oXSLTProcessor.setParameter(aParameters[nIndex][0], aParameters[nIndex][1], aParameters[nIndex][2]);

	// 1: Process XML
	if (vXml.nodeType)
		fOnXmlReady(vXml);
	else {
		vXml	= String(vXml);
		if (vXml.substr(0,1) == '<')
			fOnXmlReady(new DOMParser().parseFromString(vXml));
		else
			ample.ajax({url:vXml,success:fOnXmlReady});
	}

	return oXSLTProcessor;
};

// Extend ample object
ample.extend({
	xslt:	function(vXml, vXsl, fCallback, aParameters) {
		// validate API
		ample.guard(arguments, [
			["xml",			Object],
			["xsl",			Object],
			["callback",	Function,	true],
			["parameters",	Array,		true,	true]
		]);

		// Invoke Implementation
		return fAmple_transform(vXml, vXsl, fCallback, aParameters);
	}
});

// Extend collection object
ample.extend(ample.classes.Query.prototype, {
	xslt:	function(vXml, vXsl, fCallback, aParameters) {
		// validate API
		ample.guard(arguments, [
			["xml",			Object],
			["xsl",			Object],
			["callback",	Function,	true],
			["parameters",	Array,		true,	true]
		]);

		// Invoke Implementation
		var oQuery	= this;
		fAmple_transform(vXml, vXsl, function(oDocument) {
			var oElement	= ample.importNode(oDocument.documentElement, true);
			oQuery.each(function() {
				// Remove nodes
				while (this.lastChild)
					this.removeChild(this.lastChild);
				// Append new
				this.appendChild(oElement.cloneNode(true));
				// Execute callback
				if (fCallback)
					fCallback.call(this, oDocument);
			});
		}, aParameters);
		//
		return this;
	}
});
