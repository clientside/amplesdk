/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create Ample SDK document object
var oAmple_document		= fAMLImplementation_createDocument(new cAMLImplementation, "http://www.w3.org/1999/xhtml", "body", null);
oAmple_document.documentElement.$getContainer	= function(sName) {return sName && sName != "gateway" ? null : oUADocument.body};
oAmple_document.readyState	= "loading";

//
function fQuery(vArgument1, vArgument2, vArgument3) {
	// Validate API call
	var oQuery	= new cAMLQuery;
	if (arguments.length > 0) {
		if (typeof vArgument1 == "string" || vArgument1 instanceof cString) {
			if (vArgument1.substr(0,1) == '<') {
				// XML string
				var aNameSpaces	= [];
				for (var sKey in oAmple.namespaces)
					aNameSpaces.push(sKey + '="' + oAmple.namespaces[sKey] + '"');
				//
				var sNameSpaces	= ' ' + aNameSpaces.join(' ');
					oDocument	= new cDOMParser().parseFromString(
														'<!' + "DOCTYPE" + ' ' + "script" + '[' + aUtilities_entities + ']>' +
														'<' + "script" + ' ' + "type" + '="' + "application/ample+xml" + '"' + sNameSpaces + '>' +
//->Debug
														'\n' +
//<-Debug
														vArgument1 +
//->Debug
														'\n' +
//<-Debug
														'</' + "script" + '>', "text/xml");
				if (!oDocument || ((bTrident && oDocument.parseError != 0) || !oDocument.documentElement || oDocument.getElementsByTagName("parsererror").length))
					throw new cAMLException(cAMLException.SYNTAX_ERR, fQuery.caller);
				else
					for (var nIndex = 0, aElements = oDocument.documentElement.childNodes; nIndex < aElements.length; nIndex++)
						if (aElements[nIndex].nodeType == cAMLNode.ELEMENT_NODE)
							oQuery[oQuery.length++]	= fAMLDocument_importNode(oAmple_document, aElements[nIndex], true);
			}
			else {
				// Validate API call (custom)
				// Context
				if (arguments.length > 1) {
					if (!(vArgument2 instanceof cAMLNode))
						throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fQuery.caller
//->Debug
							, ['2' + oGuard_endings[1], "context", "query", "AMLNode"]
//<-Debug
						);
				}
				else
					vArgument2	= oAmple_document;
				// Resolver
				if (arguments.length > 2 && vArgument3 !== null) {
					if (!(vArgument3 instanceof cFunction))
						throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fQuery.caller
//->Debug
							, ['3' + oGuard_endings[2], "query", "query", "Function"]
//<-Debug
						);
				}
				else
					vArgument3	= fAmple_resolver;
				//
				oQuery.length	= 0;
				oQuery.context	= vArgument2;
				oQuery.selector	= vArgument1;
				// Invoke implementation
				var aResult;
				try {
					aResult	= fAMLSelector_query([oQuery.context], vArgument1, vArgument3);
				}
				catch (oException) {
					// Re-point caller property and re-throw error
					oException.caller	= fQuery.caller;
					throw oException;
				}
				for (var nIndex = 0; nIndex < aResult.length; nIndex++)
					oQuery[oQuery.length++]	= aResult[nIndex];
			}
		}
		else
		if (vArgument1 instanceof cAMLElement)
			oQuery[oQuery.length++]	= vArgument1;
		else
		if (vArgument1 instanceof cAMLQuery)
			fAMLQuery_each(vArgument1, function() {
				oQuery[oQuery.length++]	= this;
			});
		else
			throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fQuery.caller
//->Debug
				, ['1' + oGuard_endings[0], "query", "query", "String" + '", "' + "AMLQuery" + '" or "' + "AMLElement"]
//<-Debug
			);
	}

	// Invoke implementation
	return oQuery;
};
// Magic
fQuery.prototype	= cAMLQuery.prototype;

// Create Ample object
var oAmple	= oAmple_document;
oAmple.query	= fQuery;
oAmple.namespaces	= {};
//->Source
oAmple.elements		= oAMLImplementation_elements;
oAmple.attributes	= oAMLImplementation_attributes;
//<-Source

function fAmple_extend(oSource, oTarget) {
	if (oSource instanceof cFunction) {
		var oPrototype	= oSource.prototype;
		if (oPrototype instanceof cAMLElement)
			oAMLImplementation_elements[oPrototype.namespaceURI + '#' + oPrototype.localName]	= oSource;
		else
		if (oPrototype instanceof cAMLAttr)
			oAMLImplementation_attributes[oPrototype.namespaceURI + '#' + oPrototype.localName]	= oSource;
		else
			throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, null
//->Debug
				, ['1' + oGuard_endings[0], "source", "extend", "AMLAttr" + '" or "' + "AMLElement"]
//<-Debug
			);
	}
	else {
		if (!oTarget)
			oTarget	= oAmple.prototype;
		for (var sName in oSource) {
//->Debug
			if (oTarget == oAmple.prototype && oTarget.hasOwnProperty(sName))
				fUtilities_warn(sAML_REWRITING_LOADED_PLUGIN_WRN, [sName]);
//<-Debug
			if (oSource.hasOwnProperty(sName))
				oTarget[sName]	= oSource[sName];
		}
	}
};

// Extension Mechanism
oAmple.extend	= function(oSource, oTarget) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject],
		["target",	cObject, true]
	]);

	// Invoke implementation
	fAmple_extend(oSource, oTarget);
};

// Ready event
oAmple.ready	= function(fHandler) {
	// Validate API call
	fGuard(arguments, [
		["handler",	cFunction]
	]);

	// Invoke implementation
	oAmple_document.addEventListener("load", fHandler, false);
};

oAmple.guard	= function(aArguments, aParameters) {
	// Validate API call
	fGuard(arguments, [
		["arguments",	cArguments],
		["parameters",	cArray]
	]);

	// Invoke implementation
	fGuard(aArguments, aParameters);
};

oAmple.config	= function(sName, oValue) {
	// Validate API call
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject, true]
	]);

	// Invoke implementation
	var sPrefix	= "ample" + '-';
	if (arguments.length > 1) {
		if (sName != "version")
			fAMLConfiguration_setParameter(oAmple_document.domConfig, sPrefix + sName, oValue);
//->Debug
		else
			fUtilities_warn(sAML_CONFIGURATION_READONLY_WRN, [sName]);
//<-Debug
	}
	else
		return fAMLConfiguration_getParameter(oAmple_document.domConfig, sPrefix + sName);
};

// Bind shortcut
oAmple.bind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLEventTarget_addEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

// Unbind shortcut
oAmple.unbind	= function(sType, fHandler, bCapture) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["handler",	cFunction],
		["capture",	cBoolean,	true]
	]);

	// Invoke implementation
	fAMLEventTarget_removeEventListener(oAmple_document, sType, fHandler, bCapture || false);
};

oAmple.trigger	= function(sType, oDetail) {
	// Validate API call
	fGuard(arguments, [
		["type",	cString],
		["detail",	oDetail, true, true]
	]);

	// Invoke implementation
	if (arguments.length < 2)
		oDetail	= null;

	var oEvent	= new cAMLCustomEvent;
	oEvent.initCustomEvent(sType, true, true, oDetail);
	fAMLNode_dispatchEvent(oAmple_document);
};

// Lookup namespaces
if (bTrident)
	for (var nIndex = 0, aAttributes = oUADocument.namespaces, oAttribute, nLength = aAttributes.length; nIndex < nLength; nIndex++)
		oAmple.namespaces["xmlns" + ':' + (oAttribute = aAttributes[nIndex]).name]	= oAttribute.urn;
else
	for (var nIndex = 0, aAttributes = oUADocument.documentElement.attributes, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
		if (oAttribute.nodeName.match(/^xmlns($|:)/))
			oAmple.namespaces[oAttribute.nodeName]	= oAttribute.nodeValue;
if (!oAmple.namespaces["xmlns"])
	oAmple.namespaces["xmlns"]	= "http://www.w3.org/1999/xhtml";
if (!oAmple.namespaces["xmlns:aml"])
	oAmple.namespaces["xmlns:aml"]	= "http://www.amplesdk.com/ns/aml";
if (!oAmple.namespaces["xmlns:ev"])
	oAmple.namespaces["xmlns:ev"]	= "http://www.w3.org/2001/xml-events";
if (!oAmple.namespaces["xmlns:xi"])
	oAmple.namespaces["xmlns:xi"]	= "http://www.w3.org/2001/XInclude";
if (!oAmple.namespaces["xmlns:smil"])
	oAmple.namespaces["xmlns:smil"]	= "http://www.w3.org/2008/SMIL30/";
//
function fAmple_resolver(sPrefix) {
	return oAmple.namespaces["xmlns" + (sPrefix ? ':' + sPrefix : '')] || null;
};

//
oAmple.open	= function() {
	if (oAmple_document.readyState == "loading") {
		var aElements	= oUADocument.getElementsByTagName("script"),
			oElement	= aElements[aElements.length - 1];
		oElement.parentNode.removeChild(oElement);
		oUADocument.write('<' + "script" + ' ' + "type" + '="' + "application/ample+xml" + '"' + '>');
	}
//->Debug
	else
		fUtilities_warn(sAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

oAmple.close	= function() {
	if (oAmple_document.readyState == "loading")
		oUADocument.write('</' + "script" + '>');
//->Debug
	else
		fUtilities_warn(sAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

oAmple.$instance	= function(oNode) {
    for (var oElement, sId; oNode; oNode = oNode.parentNode)
        if ((sId = oNode.id) && (oElement = (oAMLDocument_ids[sId] || oAMLDocument_all[sId])))
            return oElement;
    return null;
};
/*
oAmple.$class	= function(oNode) {
	var oElement	= oAmple.$instance(oNode);
	return oElement ? oAMLImplementation_elements[oElement.namespaceURI + '#' + oElement.localName] || cAMLElement : null;
};
*/
oAmple.$resolveUri	= function(sUri, sBaseUri) {
	return fUtilities_resolveUri(sUri, sBaseUri);
};


// set standard parameters
var oConfiguration	= oAmple_document.domConfig;
fAMLConfiguration_setParameter(oConfiguration, "error-handler", null);
fAMLConfiguration_setParameter(oConfiguration, "element-content-whitespace", false);	// in DOM-Core spec the default value is true
fAMLConfiguration_setParameter(oConfiguration, "entities", false);	// in DOM-Core spec the default value is true
fAMLConfiguration_setParameter(oConfiguration, "comments", false); 	// in DOM-Core spec the default value is true
//set ample parameters
fAMLConfiguration_setParameter(oConfiguration, "ample-use-style-property", true);	// -> ample-core-style
fAMLConfiguration_setParameter(oConfiguration, "ample-module-history-fix", false);	// -> ample-history
fAMLConfiguration_setParameter(oConfiguration, "ample-version", '@project.version@');
fAMLConfiguration_setParameter(oConfiguration, "ample-user-locale", oUANavigator.language || oUANavigator.userLanguage || 'en-US');
fAMLConfiguration_setParameter(oConfiguration, "ample-user-agent", '@project.userAgent@');
fAMLConfiguration_setParameter(oConfiguration, "ample-enable-animations", true);
fAMLConfiguration_setParameter(oConfiguration, "ample-enable-transitions", true);

//->Debug
// Enable debugging
var oAML_errorHandler	= {};
oAML_errorHandler.handleError	= function(oError) {
	var oConsole	= window.console;
	if (oError.severity == cAMLError.SEVERITY_WARNING) {
		// Warning in console
		if (oConsole)
			oConsole.warn(oError.message);
		return true;
	}
	// Error in console
	if (oConsole)
		oConsole.error(oError.message + '\n' + oError.relatedException.caller);
	return false;
};
fAMLConfiguration_setParameter(oConfiguration, "error-handler", oAML_errorHandler);
//<-Debug