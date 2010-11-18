/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create Ample SDK document object
var oAmple_document	= fAMLImplementation_createDocument(new cAMLImplementation, sNS_XHTML, "body", null),
	oAmple_root		= oAmple_document.documentElement;
oAmple_root.$getContainer	= function(sName) {return sName == "gateway" ? oBrowser_body : sName ? null : oBrowser_root};

//
function fQuery(vArgument1, vArgument2, vArgument3) {
	// Validate API call
	var oQuery	= new cAMLQuery;
	if (arguments.length > 0) {
		if (typeof vArgument1 == "string" || vArgument1 instanceof cString) {
			if (vArgument1.substr(0,1) == '<') {
				// XML string
				var aNameSpaces	= [],
					sText;
				for (var sKey in oAmple.prefixes)
					if (oAmple.prefixes.hasOwnProperty(sKey) && sKey != "toString")
						aNameSpaces.push("xmlns" + (sKey == '' ? '' : ':') + sKey + '="' + oAmple.prefixes[sKey] + '"');
				//
				sText	=						//		"<?" + "xml" + ' ' + 'version="1.0"' + "?>" +
														'<!' + "DOCTYPE" + ' ' + "div" + '[' + aUtilities_entities + ']>' +
//->Debug
														'\n' +
//<-Debug
														'<' + "div" + ' ' + "type" + '="' + "application/ample+xml" + '"' + ' ' + aNameSpaces.join(' ') + '>' +
//->Debug
														'\n' +
//<-Debug
														vArgument1 +
//->Debug
														'\n' +
//<-Debug
														'</' + "div" + '>';
				// Bugfix FF4 (remote XUL)
				if (bGecko)
					sText	= sText.replace(new cRegExp(sNS_XUL, 'g'), sNS_XUL + '#');
				//
				var oDocument	= new cDOMParser().parseFromString(sText, "text/xml");
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
							, ['3' + oGuard_endings[2], "resolver", "query", "Function"]
//<-Debug
						);
				}

				//
				oQuery.length	= 0;
				oQuery.selector	= vArgument1;
				oQuery.context	= vArgument2;
				oQuery.resolver	= vArgument3 || null;
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

// Create Ample object
var oAmple	= oAmple_document;
oAmple.query	= fQuery;
oAmple.prefixes	= {};
oAmple.activeElement= null;
oAmple.readyState	= "loading";

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
			oTarget	= oAmple;

		//
		for (var sName in oSource)
			if (sName != "toString") {
//->Debug
				if (oTarget.hasOwnProperty(sName))
					fUtilities_warn(sAML_REWRITING_MEMBER_WRN, [sName]);
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
	// Sign
	fAMLExporter_signMembers(oSource, "plugin");
	// Extend
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

oAmple.publish	= function(oSource, sName, oTarget) {
	// Validate API call
	fGuard(arguments, [
		["source",	cObject],
		["name",	cString],
		["target",	cObject,	true]
	]);

	// Invoke implementation
	fAMLExporter_export(oSource, sName, oTarget, "plugin");
};

oAmple.config	= function(sName, oValue) {
	// Validate API call
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject, true,	true]
	]);

	// Invoke implementation
	var sParameter	= "ample" + '-' + sName,
		oOldValue	= fAMLConfiguration_getParameter(oAmple_document.domConfig, sParameter);
	if (arguments.length > 1) {
		if (sName != "version") {
			fAMLConfiguration_setParameter(oAmple_document.domConfig, sParameter, oValue);
			// Dispatch change event
			if (oOldValue != oValue) {
				var oEvent	= new cAMLCustomEvent;
				oEvent.initCustomEvent("configchange", false, false, sName);
				fAMLNode_dispatchEvent(oAmple_document, oEvent);
			}
		}
//->Debug
		else
			fUtilities_warn(sAML_CONFIGURATION_READONLY_WRN, [sName]);
//<-Debug
	}
	else
		return oOldValue;
};

var sAmple_include	= oUALocation.href;
oAmple.include	= function(sSrc) {
	// Validate API call
	fGuard(arguments, [
		["src",	cString]
	]);

	// Invoke implementation
	var sValue	= sAmple_include;
	// Save current location
	sAmple_include	= fUtilities_resolveUri(sSrc, sValue);
	var oRequest	= new cXMLHttpRequest;
	oRequest.open("GET", sAmple_include, false);
	oRequest.send();
	// Evaluate result
	fBrowser_eval(oRequest.responseText);
	// Restore base location
	sAmple_include	= sValue;
};

// Lookup namespaces
var oPrefixes	= oAmple.prefixes;
if (bTrident)
	for (var nIndex = 0, aAttributes = oUADocument.namespaces, oAttribute, nLength = aAttributes.length; nIndex < nLength; nIndex++)
		oPrefixes[(oAttribute = aAttributes[nIndex]).name]	= oAttribute.urn;
else
	for (var nIndex = 0, aAttributes = oBrowser_root.attributes, oAttribute; oAttribute = aAttributes[nIndex]; nIndex++)
		if (oAttribute.nodeName.match(/^xmlns($|:)(.*)/))
			oPrefixes[cRegExp.$2]	= oAttribute.nodeValue;
if (!oPrefixes[''])
	oPrefixes['']		= sNS_XHTML;
if (!oPrefixes["aml"])
	oPrefixes["aml"]	= sNS_AML;
if (!oPrefixes["ev"])
	oPrefixes["ev"]		= sNS_XEVENTS;
if (!oPrefixes["xi"])
	oPrefixes["xi"]		= sNS_XINCLUDE;
if (!oPrefixes["smil"])
	oPrefixes["smil"]	= sNS_SMIL;
if (!oPrefixes["xlink"])
	oPrefixes["xlink"]	= sNS_XLINK;

// Add known prefixes to ample.documentElement
for (var sKey in oPrefixes)
	if (oPrefixes.hasOwnProperty(sKey) && sKey != '')
		oAmple_root.attributes["xmlns" + ':' + sKey]	= oPrefixes[sKey];

// Set xml:base
oAmple_root.attributes["xml:base"]	= fUtilities_resolveUri('.', sAmple_include);

//
oAmple.open	= function() {
	if (oAmple.readyState == "loading") {
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
	if (oAmple.readyState == "loading")
		oUADocument.write('</' + "script" + '>');
//->Debug
	else
		fUtilities_warn(sAML_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

//
function fAmple_instance(oDocument, oNode) {
    for (var oElement, sId; oNode; oNode = oNode.parentNode)
        if ((sId = oNode.id) && (oElement = (oAMLDocument_ids[sId] || oAMLDocument_all[sId])))
            return oElement;
    return null;
};

oAmple.$instance	= function(oNode) {
	return fAmple_instance(oAmple_document, oNode);
};

//
oAmple.$element		= function(sUri) {
	// Validate API call
	fGuard(arguments, [
		["uri",	cString]
	]);

	// Invoke implementation
	return oAMLImplementation_elements[sUri] || null;
};

oAmple.$attribute	= function(sUri) {
	// Validate API call
	fGuard(arguments, [
		["uri",	cString]
	]);

	// Invoke implementation
	return oAMLImplementation_attributes[sUri] || null;
};
/*
oAmple.$class	= function(oNode) {
	var oElement	= fAmple_instance(oAmple_document, oNode);
	return oElement ? oAMLImplementation_elements[oElement.namespaceURI + '#' + oElement.localName] || cAMLElement : null;
};
*/
//
oAmple.param	= function(vValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject]
	]);

	// Invoke implementation
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

//
oAmple.resolveUri	= function(sUri, sBaseUri) {
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
fAMLConfiguration_setParameter(oConfiguration, "ample-locale", "en");
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