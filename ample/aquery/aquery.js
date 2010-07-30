/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var aQuery	= (function() {
	// Query function
	function fQuery(vArgument1, vArgument2, vArgument3) {
		if (typeof vArgument1 == "string") {
			if (vArgument1.substr(0,1) == "<") {
				// XML string
				var oDocument	= new DOMParser().parseFromString('<aml:document xmlns:aml="http://www.amplesdk.com/ns/aml"><aml:document-fragment ' + sNameSpaces + '>' + vArgument1 + '</aml:document-fragment></aml:document>', "text/xml");
				if (!oDocument || ((document.namespaces && oDocument.parseError != 0) || !oDocument.documentElement || (oDocument.documentElement && oDocument.documentElement.tagName == "parsererror"))) {
					// TODO: Report warning
				}
				else {
					var oDocumentElement	= ample.importNode(oDocument.documentElement.firstChild, true);
					for (var nIndex = 0, aElements = oDocumentElement.childNodes; nIndex < aElements.length; nIndex++)
						this[nIndex]	= aElements[nIndex];
					this.length	= nIndex;
				}
			}
			else {
				// CSS selector
				var aResult	= (vArgument2 || ample).querySelectorAll(vArgument1, vArgument3 || fResolver);
				for (var nIndex = 0; nIndex < aResult.length; nIndex++)
					this[nIndex]	= aResult[nIndex];
				this.length	= nIndex;
				this.selector	= vArgument1;
			}
		}
	};
	fQuery.prototype.length	= 0;
	fQuery.prototype.selector	= "";
	fQuery.prototype.toString	= function() {
		return '[object aQuery]';
	};

	//
	var aQuery;
	(aQuery	= function(vArgument1, vArgument2, vArgument3) {
		return new fQuery(vArgument1, vArgument2, vArgument3);
	}).toString	= function() {
		return 'function aQuery() {\n\t[ample code]\n}';
	};
	// Magic
	aQuery.prototype	= fQuery.prototype;

	// Extension Mechanism
	(aQuery.extend	= function(sName, fFunction) {
		if (!fQuery.prototype.hasOwnProperty(sName)) {
			fQuery.prototype[sName]	= fFunction;
			// Wrap nicely
			fFunction.toString	= function() {
				return 'function ' + sName + '() {\n\t[ample code]\n}';
			};
		}
		else
			throw 'ample already has an extension with "' + sName + '" name';
	}).toString	= function() {
		return 'function extend() {\n\t[ample code]\n}';
	};

	// Ready event
	(aQuery.ready	= function(fFunction) {
		ample.addEventListener("load", fFunction, false);
	}).toString	= function() {
		return 'function ready() {\n\t[ample code]\n}';
	};

	// Collection
	aQuery.extend("get", function(nIndex) {
		return this[nIndex] || null;
	});

	aQuery.extend("first",	function() {
		var aQuery	= new fQuery;
		if (this.length)
			aQuery[aQuery.length++]	= this[0];
		return aQuery;
	});

	aQuery.extend("last",	function() {
		var aQuery	= new fQuery;
		if (this.length)
			aQuery[aQuery.length++]	= this[this.length - 1];
		return aQuery;
	});

	aQuery.extend("slice",	function(nFirst, nLast) {
		var aQuery	= new fQuery;
		// TODO: negative values, optional last
		if (nFirst >-1 && nLast < this.length)
			for (var nIndex = nFirst; nIndex < nLast; nIndex++)
				aQuery[aQuery.length++]	= this[nIndex];
		return aQuery;
	});

	aQuery.extend("each",	function(fCallback, aArguments) {
		for (var nIndex = 0; nIndex < this.length; nIndex++)
			fCallback.apply(this[nIndex], aArguments || [nIndex, this[nIndex]]);
	});

	// Lookup namespaces
	aQuery.namespaces	= {};
	if (document.namespaces)
		for (var nIndex = 0, aAttributes = document.namespaces, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
			aQuery.namespaces["xmlns" + (oAttribute.name == "xmlns" ? '' : ':') + oAttribute.name]	= oAttribute.urn;
	else
		for (var nIndex = 0, aAttributes = document.documentElement.attributes, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
			if (oAttribute.nodeName.match(/^xmlns($|:)/))
				aQuery.namespaces[oAttribute.nodeName]	= oAttribute.nodeValue;
	if (!aQuery.namespaces["xmlns"])
		aQuery.namespaces["xmlns"]	= "http://www.w3.org/1999/xhtml";
	if (!aQuery.namespaces["xmlns:aml"])
		aQuery.namespaces["xmlns:aml"]	= "http://www.amplesdk.com/ns/aml";
	var aNameSpaces	= [];
	for (var sKey in aQuery.namespaces)
		aNameSpaces.push(sKey + '="' + aQuery.namespaces[sKey] + '"');
	var sNameSpaces	= aNameSpaces.join(' ');
	function fResolver(sPrefix) {
		return aQuery.namespaces["xmlns" + (sPrefix ? ":" + sPrefix : '')];
	}
	//
	return aQuery;
})(this);