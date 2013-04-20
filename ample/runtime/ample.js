/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var hClasses	= {};

// Create Ample SDK document object
var oAmple_document	= fDOMImplementation_createDocument(new cDOMImplementation, sNS_XHTML, "body", null),
	oAmple_root		= oAmple_document.documentElement;
oAmple_root.$getContainer	= function(sName) {return sName == "gateway" ? oBrowser_body : sName ? null : oBrowser_root;};

//
function fQuery(vArgument1, vArgument2, vArgument3) {
	var oQuery	= new cQuery;
	if (arguments.length > 0) {
		if (typeof vArgument1 == "string" || vArgument1 instanceof cString) {
			if (vArgument1.substr(0,1) == '<') {
				// XML string
				var aNameSpaces	= [];
				for (var sKey in oAmple.prefixes)
					if (oAmple.prefixes.hasOwnProperty(sKey) && sKey != "toString")
						aNameSpaces.push("xmlns" + (sKey == '' ? '' : ':') + sKey + '="' + oAmple.prefixes[sKey] + '"');
				//
				var oDocument	= fBrowser_createFragment(vArgument1, aNameSpaces.join(' '));
				if (!oDocument || ((bTrident && nVersion < 9 && oDocument.parseError != 0) || !oDocument.documentElement || oDocument.getElementsByTagName("parsererror").length))
					throw new cDOMException(cDOMException.SYNTAX_ERR
//->Debug
							, fQuery.caller
//<-Debug
					);
				else
					for (var nIndex = 0, aElements = oDocument.documentElement.childNodes; nIndex < aElements.length; nIndex++)
						if (aElements[nIndex].nodeType == 1)	// cNode.ELEMENT_NODE
							oQuery[oQuery.length++]	= fDocument_importNode(oAmple_document, aElements[nIndex], true);
			}
			else {
				// Validate API call (custom)
				// Context
				if (arguments.length > 1) {
//->Guard
					if (!(vArgument2 instanceof cNode) &&!(vArgument2 instanceof cQuery))
						throw new cAmpleException(cAmpleException.ARGUMENT_WRONG_TYPE_ERR
	//->Debug
								, fQuery.caller
								, ['2' + oGuard_endings[1], "context", "query", "Node" + '" ' + 'or' + ' "' + "Query"]
	//<-Debug
						);
//<-Guard
				}
				else
					vArgument2	= oAmple_document;
				// Resolver
				if (arguments.length > 2 && vArgument3 !== null) {
//->Guard
					if (!(vArgument3 instanceof cFunction))
						throw new cAmpleException(cAmpleException.ARGUMENT_WRONG_TYPE_ERR
	//->Debug
								, fQuery.caller
								, ['3' + oGuard_endings[2], "resolver", "query", "Function"]
	//<-Debug
						);
//<-Guard
				}

				//
				oQuery.length	= 0;
				oQuery.selector	= vArgument1;
				oQuery.context	= vArgument2;
				oQuery.resolver	= vArgument3 || null;
				// Invoke implementation
				var aResult;
				try {
					aResult	= fNodeSelector_query(vArgument2 instanceof cNode ? [vArgument2] : vArgument2, vArgument1, vArgument3);
				}
				catch (oException) {
//->Debug
					// Re-point caller property
					oException.caller	= fQuery.caller;
//<-Debug
					// Re-throw error
					throw oException;
				}
				for (var nIndex = 0; nIndex < aResult.length; nIndex++)
					oQuery[oQuery.length++]	= aResult[nIndex];
			}
		}
		else
		if (vArgument1 instanceof cElement)
			oQuery[oQuery.length++]	= vArgument1;
		else
		if (vArgument1 instanceof cNodeList)
			fQuery_each(vArgument1, function() {
				if (this.nodeType == 1)
					oQuery[oQuery.length++]	= this;
			});
		else
		if (vArgument1 instanceof cQuery)
			fQuery_each(vArgument1, function() {
				oQuery[oQuery.length++]	= this;
			});
//->Guard
		else
			throw new cAmpleException(cAmpleException.ARGUMENT_WRONG_TYPE_ERR
	//->Debug
					, fQuery.caller
					, ['1' + oGuard_endings[0], "query", "query", "String" + '", "' + "Query" + '" or "' + "Element"]
	//<-Debug
			);
//<-Guard
	}

	return oQuery;
};

// Create Ample object
var oAmple	= oAmple_document;
oAmple.query	= fQuery;
oAmple.prefixes	= {};
oAmple.classes	= hClasses;
oAmple.activeElement= null;
oAmple.readyState	= "loading";

var aAmple_protectedEventInterfaces	= [
	"Event", "CustomEvent", "MutationEvent",
	"UIEvent", "MouseEvent", "KeyboardEvent", "FocusEvent", "WheelEvent", "TextEvent",
	"DragEvent", "ResizeEvent",
	"ClipboardEvent",
	"GestureEvent", "TouchEvent"
];

function fAmple_extend(oTarget, oSource) {
	if (!oSource && oTarget instanceof cFunction) {
		var oPrototype	= oTarget.prototype;
		if (oPrototype instanceof cEvent) {
			var sEventInterface	= oPrototype.eventInterface;
			// Check if event triggering allowed
			if (aAmple_protectedEventInterfaces.indexOf(sEventInterface) !=-1)
				throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR
//->Debug
						, null
						, [sEventInterface]
//<-Debug
				);

			hClasses[sEventInterface]	= oTarget;
		}
		else
		if (oPrototype instanceof cElement)
			hClasses[oPrototype.namespaceURI + '#' + oPrototype.localName]	= oTarget;
		else
		if (oPrototype instanceof cAttr)
			hClasses[oPrototype.namespaceURI + '#' + '@' + oPrototype.localName]	= oTarget;
		else
		if (oPrototype instanceof cProcessingInstruction)
			hClasses['?' + oPrototype.target]	= oTarget;
//->Guard
		else
			throw new cAmpleException(cAmpleException.ARGUMENT_WRONG_TYPE_ERR
	//->Debug
					, null
					, ['1' + oGuard_endings[0], "source", "extend", "Attr" + '" or "' + "Element"]
	//<-Debug
			);
//<-Guard
		return oAmple;
	}
	else {
		if (!oSource) {
			oSource	= oTarget;
			oTarget	= oAmple;
		}

		//
		for (var sName in oSource)
			if (sName != "toString" && sName != "prototype") {
//->Debug
				if (oTarget.hasOwnProperty(sName))
					fUtilities_warn(sGUARD_REWRITING_MEMBER_WRN, [sName]);
//<-Debug
				if (oSource.hasOwnProperty(sName))
					oTarget[sName]	= oSource[sName];
			}
		//
		return oTarget;
	}
};

// Extension Mechanism
oAmple.extend	= function(oTarget, oSource) {
//->Guard
	fGuard(arguments, [
		["target",	cObject],
		["source",	cObject, true]
	]);
//<-Guard

	// Sign
	fExporter_signMembers(oTarget, "plugin");

	// Extend
	return fAmple_extend(oTarget, oSource);
};

// Ready event
oAmple.ready	= function(fHandler) {
//->Guard
	fGuard(arguments, [
		["handler",	cFunction]
	]);
//<-Guard

	fEventTarget_addEventListener(oAmple_document, "load", fHandler, false);
};

oAmple.guard	= function(aArguments, aParameters) {
//->Guard
	fGuard(arguments, [
		["arguments",	cArguments],
		["parameters",	cArray]
	]);
//<-Guard

//->Guard
	fGuard(aArguments, aParameters);
//<-Guard
};

oAmple.publish	= function(oSource, sName, oTarget) {
//->Guard
	fGuard(arguments, [
		["source",	cObject],
		["name",	cString],
		["target",	cObject,	true]
	]);
//<-Guard

	fExporter_export(oSource, sName, oTarget, "plugin");
};

oAmple.config	= function(sName, oValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject, true,	true]
	]);
//<-Guard

	var sParameter	= "ample" + '-' + sName,
		oOldValue	= fDOMConfiguration_getParameter(oAmple_document.domConfig, sParameter);
	if (arguments.length > 1) {
		if (sName != "version") {
			fDOMConfiguration_setParameter(oAmple_document.domConfig, sParameter, oValue);
			// Dispatch change event
			if (oOldValue != oValue) {
				var oEvent	= new cCustomEvent;
				oEvent.initCustomEvent("configchange", false, false, sName);
				fEventTarget_dispatchEvent(oAmple_document, oEvent);
			}
		}
//->Debug
		else
			fUtilities_warn(sGUARD_CONFIGURATION_READONLY_WRN, [sName]);
//<-Debug
	}
	else
		return oOldValue;
};

var sAmple_include	= oUALocation.href;
oAmple.include	= function(sSrc) {
//->Guard
	fGuard(arguments, [
		["src",	cString]
	]);
//<-Guard

	var sValue	= sAmple_include;
	// Save current location
	sAmple_include	= fUtilities_resolveUri(sSrc, sValue);
	//
	var oRequest	= fBrowser_load(sAmple_include, "text/javascript");
	// Evaluate result
	fBrowser_eval(oRequest.responseText);
	// Restore base location
	sAmple_include	= sValue;
};

// Lookup namespaces
var oPrefixes	= oAmple.prefixes;
if (bTrident && nVersion < 10)
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
if (!oPrefixes['ev'])
	oPrefixes['ev']		= sNS_XEVENTS;
if (!oPrefixes['xi'])
	oPrefixes['xi']		= sNS_XINCLUDE;
if (!oPrefixes["smil"])
	oPrefixes["smil"]	= sNS_SMIL;
if (!oPrefixes["xlink"])
	oPrefixes["xlink"]	= sNS_XLINK;

// Add known prefixes to ample.documentElement
for (var sKey in oPrefixes)
	if (oPrefixes.hasOwnProperty(sKey) && sKey != '')
		fElement_setAttributeNS(oAmple_root, sNS_XMLNS, "xmlns" + ':' + sKey, oPrefixes[sKey]);

// Set xml:base
fElement_setAttributeNS(oAmple_root, sNS_XML, "xml:base", fUtilities_resolveUri('.', sAmple_include));

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
		fUtilities_warn(sGUARD_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

oAmple.close	= function() {
	if (oAmple.readyState == "loading")
		oUADocument.write('</' + "script" + '>');
//->Debug
	else
		fUtilities_warn(sGUARD_DOCUMENT_INVALID_STATE_WRN);
//<-Debug
};

//
function fAmple_instance(oDocument, oNode) {
	for (var oElement, sId; oNode; oNode = oNode.parentNode)
		if ((sId = oNode.id) && (oElement = (oDocument_ids[sId] || oDocument_all[sId])))
			return oElement;
	return null;
};

oAmple.$instance	= function(oNode) {
	return fAmple_instance(oAmple_document, oNode);
};

oAmple.$encodeXMLCharacters	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cString]
	]);
//<-Guard
	return fUtilities_encodeXMLCharacters(sValue);
};

oAmple.$decodeXMLCharacters	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cString]
	]);
//<-Guard
	return fUtilities_decodeXMLCharacters(sValue);
};

/*
oAmple.$class	= function(oNode) {
	var oElement	= fAmple_instance(oAmple_document, oNode);
	return oElement ? hClasses[oElement.namespaceURI + '#' + oElement.localName] || cElement : null;
};
*/

//
oAmple.resolveUri	= function(sUri, sBaseUri) {
//->Guard
	fGuard(arguments, [
		["uri",		cString],
		["baseURI",	cString]
	]);
//<-Guard
	return fUtilities_resolveUri(sUri, sBaseUri);
};

// Special hook to init runtime when Ample SDK was loaded lazily
oAmple.$init	= function() {
	if (oAmple.readyState == "loading") {
		fBrowser_initialize();
		fAmple_initialize();
	}
};

// set standard parameters
var oConfiguration	= oAmple_document.domConfig;
fDOMConfiguration_setParameter(oConfiguration, "error-handler", null);
fDOMConfiguration_setParameter(oConfiguration, "element-content-whitespace", false);	// in DOM-Core spec the default value is true
fDOMConfiguration_setParameter(oConfiguration, "entities", false);	// in DOM-Core spec the default value is true
fDOMConfiguration_setParameter(oConfiguration, "comments", false);	// in DOM-Core spec the default value is true
// set ample parameters
fDOMConfiguration_setParameter(oConfiguration, "ample-module-history-fix", false);	// -> ample-history
fDOMConfiguration_setParameter(oConfiguration, "ample-fix-ie-css-transitions", true);
fDOMConfiguration_setParameter(oConfiguration, "ample-version", '@project_version@');
fDOMConfiguration_setParameter(oConfiguration, "ample-locale", 'en');
fDOMConfiguration_setParameter(oConfiguration, "ample-user-locale", oUANavigator.language || oUANavigator.userLanguage || 'en-US');
fDOMConfiguration_setParameter(oConfiguration, "ample-user-agent", '@project_userAgent@');
fDOMConfiguration_setParameter(oConfiguration, "ample-enable-style", true);
fDOMConfiguration_setParameter(oConfiguration, "ample-enable-css-hover", true);
fDOMConfiguration_setParameter(oConfiguration, "ample-enable-guard", true);
fDOMConfiguration_setParameter(oConfiguration, "ample-enable-transitions", true);

//->Debug
// Enable debugging
var fErrorHandler	= function(oError) {
	var oConsole	= window.console;
	if (oError.severity == cDOMError.SEVERITY_WARNING) {
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
fDOMConfiguration_setParameter(oConfiguration, "error-handler", fErrorHandler);
//<-Debug