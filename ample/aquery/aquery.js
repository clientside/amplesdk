/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

(function(oScope) {
	// Query function
	function pQuery(vArgument1, vArgument2, vArgument3) {
		if (typeof vArgument1 == "string") {
			if (vArgument1.substr(0,1) == "<") {
				// XML string
				var oDocument	= new window.DOMParser().parseFromString('<div ' + sNameSpaces + '>' + vArgument1 + '</div>', "text/xml");
				if (!oDocument || ((window.document.namespaces && oDocument.parseError != 0) || !oDocument.documentElement || oDocument.getElementsByTagName("parsererror").length))
					throw new window.AMLException(window.AMLException.SYNTAX_ERR, fQuery.caller);
				else {
					var oDocumentElement	= window.ample.importNode(oDocument.documentElement, true);
					for (var nIndex = 0, aElements = oDocumentElement.childNodes; nIndex < aElements.length; nIndex++)
						this[nIndex]	= aElements[nIndex];
					this.length	= nIndex;
				}
			}
			else {
				// CSS selector
				var aResult;
				try {
					aResult	= (vArgument2 || window.ample).querySelectorAll(vArgument1, vArgument3 || fResolver);
				}
				catch (oException) {
					// Re-point caller property and re-throw error
					oException.caller	= fQuery.caller;
					throw oException;
				}
				for (var nIndex = 0; nIndex < aResult.length; nIndex++)
					this[nIndex]	= aResult[nIndex];
				this.length	= nIndex;
				this.selector	= vArgument1;
			}
		}
		else
		if (vArgument1 instanceof window.AMLElement)
			this[this.length++]	= vArgument1;
	};
	pQuery.prototype.length	= 0;
	pQuery.prototype.selector	= '';

	//
	function fQuery(vArgument1, vArgument2, vArgument3) {
		// Validate API call
		if (arguments.length > 0 && !(typeof vArgument1 == "string" || vArgument1 instanceof window.String) && !(vArgument1 instanceof window.AMLElement))
			throw new window.AMLException(window.AMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fQuery.caller, ["1st", "query", "aQuery", "String or aQuery", "undefined"]);

		// Invoke implementation
		return new pQuery(vArgument1, vArgument2, vArgument3);
	};

	// Magic
	fQuery.prototype	= pQuery.prototype;

	// Dangerous! No API validation
	fQuery.each	= function(oQuery, fCallback, aArguments) {
		for (var nIndex = 0; nIndex < oQuery.length; nIndex++)
			fCallback.apply(oQuery[nIndex], aArguments || [nIndex, oQuery[nIndex]]);
	};

	// Extension Mechanism
	fQuery.extend	= function(sName, fFunction) {
		// Validate API call
		fQuery.guard(arguments, [
			["name",		window.String],
			["function",	window.Function]
		]);

		if (!pQuery.prototype.hasOwnProperty(sName))
			fSign(pQuery.prototype[sName]	= fFunction, sName);
		else
			throw 'aQuery already has an extension with "' + sName + '" name';
	};

	// API Validation
	var aAML_endings	= 'st-nd-rd-th'.split('-'),
		rAML_function	= /function ([^\s]+)\(/;
	fQuery.guard	= function(aArguments, aParameters) {
		var fCallee	= aArguments.callee,
			fCaller	= null;
		// Has to be wrapped in try/catch because Firebug throws "Permission denied to get property on Function.caller" in XMLHttpRequest
		try {
			fCaller	= fCallee.caller;
		} catch (oException) {}
		var sFunction	= window.String(fCallee).match(rAML_function) ? window.RegExp.$1 : "anonymous";

		// Iterate over parameters list
		for (var nIndex = 0, nLength = aArguments.length, aParameter, vValue, bValid; aParameter = aParameters[nIndex]; nIndex++) {
			vValue	= aArguments[nIndex];
			var sArgument	=(nIndex + 1)+ aAML_endings[nIndex < 3 ? nIndex : 3];
			// see if argument is missing
			if (typeof vValue == "undefined" && !aParameter[2])
				throw new window.AMLException(window.AMLException.AML_ARGUMENT_MISSING_ERR, fCaller
									, [sArgument, aParameter[0], sFunction]
				);

			if (nLength > nIndex) {
				if (vValue === null) {
					// See if null is allowed
					if (!aParameter[3])
						throw new window.AMLException(window.AMLException.AML_ARGUMENT_NULL_ERR, fCaller
											, [sArgument, aParameter[0], sFunction]
						);
				}
				else {
					// see if argument has correct type
					switch (aParameter[1]) {
						// Primitive types
						case window.String:		bValid	= typeof vValue == "string"	|| vValue instanceof window.String;	break;
						case window.Boolean:	bValid	= typeof vValue == "boolean"|| vValue instanceof window.Boolean;	break;
						case window.Number:		bValid	=(typeof vValue == "number" || vValue instanceof window.Number) && !window.isNaN(vValue);	break;
						case window.Object:		bValid	= true;							break;
						// Complex types
						default:			bValid	= vValue instanceof aParameter[1];
					}

					if (!bValid)
						throw new window.AMLException(window.AMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fCaller
											, [sArgument, aParameter[0], sFunction, window.String(aParameter[1]).match(rAML_function) ? window.RegExp.$1 : "anonymous"]
						);
				}
			}
		}
	};

	// Ready event
	fQuery.ready	= function(fHandler) {
		// Validate API call
		fQuery.guard(arguments, [
			["handler",	window.Function]
		]);

		// Invoke implementation
		window.ample.addEventListener("load", fHandler, false);
	};

	// Ajax
	fQuery.ajax	= function(oBag) {
		// TODO
	};

	// Lookup namespaces
	fQuery.namespaces	= {};
	if (window.document.namespaces)
		for (var nIndex = 0, aAttributes = window.document.namespaces, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
			fQuery.namespaces["xmlns" + (oAttribute.name == "xmlns" ? '' : ':') + oAttribute.name]	= oAttribute.urn;
	else
		for (var nIndex = 0, aAttributes = window.document.documentElement.attributes, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
			if (oAttribute.nodeName.match(/^xmlns($|:)/))
				fQuery.namespaces[oAttribute.nodeName]	= oAttribute.nodeValue;
	if (!fQuery.namespaces["xmlns"])
		fQuery.namespaces["xmlns"]	= "http://www.w3.org/1999/xhtml";
	var aNameSpaces	= [];
	for (var sKey in fQuery.namespaces)
		aNameSpaces.push(sKey + '="' + fQuery.namespaces[sKey] + '"');
	var sNameSpaces	= aNameSpaces.join(' ');
	function fResolver(sPrefix) {
		return fQuery.namespaces["xmlns" + (sPrefix ? ":" + sPrefix : '')] || null;
	};

	// Signing
	function fSign(vObject, sName) {
		if (typeof vObject == "function")
			vObject.toString	= function () {
				return "function" + ' ' + sName + '() {\n\t[ample code]\n}';
			};
		else
			vObject.toString	= function () {
				return '[' + "object" + ' ' + sName + ']';
			};
	};
	//
	fSign(pQuery.prototype, "aQuery");
	fSign(fQuery, "aQuery");
	fSign(fQuery.each,		"each");
	fSign(fQuery.extend,	"extend");
	fSign(fQuery.guard,		"guard");
	fSign(fQuery.ready,		"ready");
	fSign(fQuery.ajax,		"ajax");

	//
	oScope.aQuery	= fQuery;
})(this);