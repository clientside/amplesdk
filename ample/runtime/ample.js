/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
function fAmple(vArgument1, vArgument2, vArgument3) {
	// Validate API call
	var oQuery	= new cAMLQuery;
	if (arguments.length > 0) {
		if (typeof vArgument1 == "string" || vArgument1 instanceof cString) {
			if (vArgument1.substr(0,1) == "<") {
				// XML string
				var sNameSpaces	= (function() {
					var aNameSpaces	= [];
					for (var sKey in fAmple.namespaces)
						aNameSpaces.push(sKey + '="' + fAmple.namespaces[sKey] + '"');
					return ' ' + aNameSpaces.join(' ');
				})();
				var oDocument	= new cDOMParser().parseFromString(
														'<!' + "DOCTYPE" + ' ' + "div" + '[' + sAML_entities + ']>' +
														'<div' + sNameSpaces + '>' +
														vArgument1 +
														'</div>', "text/xml");
				if (!oDocument || ((window.document.namespaces && oDocument.parseError != 0) || !oDocument.documentElement || oDocument.getElementsByTagName("parsererror").length))
					throw new cAMLException(cAMLException.SYNTAX_ERR, fAmple.caller);
				else
					for (var nIndex = 0, aElements = oDocument.documentElement.childNodes; nIndex < aElements.length; nIndex++)
						if (aElements[nIndex].nodeType == cAMLNode.ELEMENT_NODE)
							oQuery[oQuery.length++]	= fAML_import(aElements[nIndex], true);
			}
			else {
				// Validate API call (custom)
				if (arguments.length > 1)
					if (!(vArgument2 instanceof cAMLNode))
						throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fAmple.caller
//->Debug
							, ['2' + aAML_endings[1], "context", "ample", "AMLNode"]
//<-Debug
						);
				if (arguments.length > 2 && vArgument3 !== null)
					if (!(vArgument3 instanceof cFunction))
						throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fAmple.caller
//->Debug
							, ['3' + aAML_endings[2], "query", "ample", "Function"]
//<-Debug
						);
				// Invoke implementation
				var aResult;
				try {
					aResult	= fAMLSelector_query([vArgument2 || oAML_document], vArgument1, vArgument3 || fResolver);
				}
				catch (oException) {
					// Re-point caller property and re-throw error
					oException.caller	= fAmple.caller;
					throw oException;
				}
				oQuery.length	= 0;
				for (var nIndex = 0; nIndex < aResult.length; nIndex++)
					oQuery[oQuery.length++]	= aResult[nIndex];
				oQuery.selector	= vArgument1;
			}
		}
		else
		if (vArgument1 instanceof cAMLElement)
			oQuery[oQuery.length++]	= vArgument1;
		else
		if (vArgument1 instanceof cAMLQuery)
			fAmple_each(vArgument1, function() {
				oQuery[oQuery.length++]	= this;
			});
		else
			throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fAmple.caller
//->Debug
				, ['1' + aAML_endings[0], "query", "ample", "String" + '", "' + "AMLQuery" + '" or "' + "AMLElement"]
//<-Debug
			);
	}

	// Invoke implementation
	return oQuery;
};

// Magic
fAmple.prototype	= cAMLQuery.prototype;

function fAmple_each(oQuery, fCallback, aArguments) {
	for (var nIndex = 0; nIndex < oQuery.length; nIndex++)
		fCallback.apply(oQuery[nIndex], aArguments || [nIndex, oQuery[nIndex]]);
};

// Extension Mechanism
fAmple.extend	= function(oSource, oTarget) {
	// Validate API call
	fAML_validate(arguments, [
		["source",	cObject],
		["target",	cObject, true]
	]);

	if (oSource instanceof cFunction) {
		var oPrototype	= oSource.prototype;
		if (oPrototype instanceof cAMLElement)
			oAML_elements[oPrototype.namespaceURI + '#' + oPrototype.localName]	= oSource;
		else
		if (oPrototype instanceof cAMLAttr)
			oAML_attributes[oPrototype.namespaceURI + '#' + oPrototype.localName]	= oSource;
		else
			throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, null
//->Debug
				, ['1' + aAML_endings[0], "source", "extend", "AMLAttr" + '" or "' + "AMLElement"]
//<-Debug
			);
	}
	else {
		if (!oTarget)
			oTarget	= fAmple.prototype;
		for (var sName in oSource) {
//->Debug
			if (oTarget == fAmple.prototype && oTarget.hasOwnProperty(sName))
				fAML_warn(nAML_REWRITING_LOADED_PLUGIN_WRN, [sName]);
//<-Debug
			if (oSource.hasOwnProperty(sName))
				oTarget[sName]	= oSource[sName];
		}
	}
};

// Ready event
fAmple.ready	= function(fHandler) {
	// Validate API call
	fAML_validate(arguments, [
		["handler",	cFunction]
	]);

	// Invoke implementation
	oAML_document.addEventListener("load", fHandler, false);
};

fAmple.guard	= function(aArguments, aParameters) {
	// Validate API call
	fAML_validate(arguments, [
		["arguments",	cArguments],
		["parameters",	cArray]
	]);

	// Invoke implementation
	fAML_validate(aArguments, aParameters);
};

fAmple.config	= function(vArgument1, vArgument2) {
	// Validate API call
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cObject, true]
	]);

	// Invoke implementation
	var sPrefix	= "ample" + '-';
	if (arguments.length > 1)
		oAML_document.domConfig.setParameter(sPrefix + vArgument1, vArgument2);
	else
		return oAML_document.domConfig.getParameter(sPrefix + vArgument1);
};

// Ajax
fAmple.ajax	= function(oBag) {
	// TODO
};

// Bind shortcut
fAmple.bind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fAML_validate(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLEventTarget_addEventListener(oAML_document, sType, fHandler, bCapture || false);
};

// Unbind shortcut
fAmple.unbind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fAML_validate(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLEventTarget_removeEventListener(oAML_document, sType, fHandler, bCapture || false);
};

fAmple.trigger	= function(sType, oDetail) {
	// Validate API call
	fAML_validate(arguments, [
		["type",	cString],
		["detail",	oDetail, true, true]
	]);

	// Invoke implementation
	if (arguments.length < 2)
		oDetail	= null;

	var oEvent	= new cAMLCustomEvent;
	oEvent.initCustomEvent(sType, true, true, oDetail);
	fAMLNode_dispatchEvent(oAML_document);
};

// Lookup namespaces
fAmple.namespaces	= {};
if (bTrident)
	for (var nIndex = 0, aAttributes = oUADocument.namespaces, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
		fAmple.namespaces["xmlns" + ':' + oAttribute.name]	= oAttribute.urn;
else
	for (var nIndex = 0, aAttributes = oUADocument.documentElement.attributes, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
		if (oAttribute.nodeName.match(/^xmlns($|:)/))
			fAmple.namespaces[oAttribute.nodeName]	= oAttribute.nodeValue;
if (!fAmple.namespaces["xmlns"])
	fAmple.namespaces["xmlns"]	= "http://www.w3.org/1999/xhtml";
//
function fResolver(sPrefix) {
	return fAmple.namespaces["xmlns" + (sPrefix ? ":" + sPrefix : '')] || null;
};

fAmple.document	= oAML_document;
//->Source
fAmple.elements		= oAML_elements;
fAmple.attributes	= oAML_attributes;
//<-Source

//
fAmple.open	= function() {
	if (oAML_document.readyState == "loading") {
		var aElements	= oUADocument.getElementsByTagName("script"),
			oElement	= aElements[aElements.length - 1];
		oElement.parentNode.removeChild(oElement);
		oUADocument.write('<' + "script" + ' ' + "type" + '="' + "application/ample+xml" + '"' + '>');
	}
//->Debug
	else
		fAML_warn(nAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

fAmple.close	= function() {
	if (oAML_document.readyState == "loading")
		oUADocument.write('</' + "script" + '>');
//->Debug
	else
		fAML_warn(nAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

fAmple.$instance	= function(oNode) {
    for (var oElement, sId; oNode; oNode = oNode.parentNode)
        if ((sId = oNode.id) && (oElement = (oAML_ids[sId] || oAML_all[sId])))
            return oElement;
    return null;
};
/*
fAmple.$class	= function(oNode) {
	var oElement	= fAmple.$instance(oNode);
	return oElement ? oAML_elements[oElement.namespaceURI + '#' + oElement.localName] || cAMLElement : null;
};
*/
fAmple.$resolveUri	= function(sUri, sBaseUri) {
	return fAML_resolveUri(sUri, sBaseUri);
};