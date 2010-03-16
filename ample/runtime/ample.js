/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//->Debug
function fAML_warn(nWarning, aArguments) {
	var	oErrorHandler	= oAMLConfiguration_values["error-handler"];
	if (oErrorHandler)
		oErrorHandler.handleError(new cAMLError(fAML_format(oAML_messages[nWarning], aArguments || []), cAMLError.SEVERITY_WARNING));
};

// Warnings
var nAML_NOT_WELLFORMED_WRN			= 'a',	// Use strings in order to not intersect with exceptions
	nAML_NOT_UNIQUE_ID_WRN			= 'b',
	nAML_NOT_FOUND_SHADOW_WRN		= 'c',
	nAML_FEATURE_DEPRECATED_WRN		= 'd',
	nAML_UNKNOWN_ELEMENT_NS_WRN		= 'e',
	nAML_UNKNOWN_ATTRIBUTE_NS_WRN	= 'f',
	nAML_MISSING_ATTRIBUTE_WRN		= 'g',
	nAML_INVALID_ATTRIBUTE_WRN		= 'h',
	nAML_UNKNOWN_SIMPLE_TYPE_WRN	= 'i',
	nAML_ERROR_ANIMATING_ATTR_WRN	= 'j';

function fAML_format(sMessage, aArguments) {
	for (var nIndex = 0; nIndex < aArguments.length; nIndex++)
		sMessage	= sMessage.replace('%' + nIndex, aArguments[nIndex]);
	return sMessage;
};

var oAML_messages	= {};
oAML_messages[cAMLException.INDEX_SIZE_ERR]					= 'Index or size is negative or greater than the allowed amount';
//oAML_messages[cAMLException.DOMSTRING_SIZE_ERR]			= '';
oAML_messages[cAMLException.HIERARCHY_REQUEST_ERR]			= 'Node cannot be inserted at the specified point in the hierarchy';
//oAML_messages[cAMLException.WRONG_DOCUMENT_ERR]			= '';
//oAML_messages[cAMLException.INVALID_CHARACTER_ERR]		= '';
//oAML_messages[cAMLException.NO_DATA_ALLOWED_ERR]			= '';
//oAML_messages[cAMLException.NO_MODIFICATION_ALLOWED_ERR]	= '';
oAML_messages[cAMLException.NOT_FOUND_ERR]					= 'An attempt is made to reference a Node in a context where it does not exist';
oAML_messages[cAMLException.NOT_SUPPORTED_ERR]				= 'Implementation does not support the requested type of object or operation';
//oAML_messages[cAMLException.INUSE_ATTRIBUTE_ERR]			= '';
//oAML_messages[cAMLException.INVALID_STATE_ERR]			= '';
oAML_messages[cAMLException.SYNTAX_ERR]						= 'An invalid or illegal string is specified';
//oAML_messages[cAMLException.INVALID_MODIFICATION_ERR]		= '';
//oAML_messages[cAMLException.NAMESPACE_ERR]				= '';
//oAML_messages[cAMLException.INVALID_ACCESS_ERR]			= '';
//oAML_messages[cAMLException.VALIDATION_ERR]				= '';
oAML_messages[cAMLException.TYPE_MISMATCH_ERR]				= 'The type of an object is incompatible with the expected type of the parameter';

// AML Exceptions
// Errors
oAML_messages[cAMLException.AML_ARGUMENT_MISSING_ERR]		= 'Missing required %0 argument "%1" in "%2" function call';
oAML_messages[cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR]	= 'Incompatible type of %0 argument "%1" in "%2" function call';
oAML_messages[cAMLException.AML_SELECTOR_ELEMENT_ERR]		= 'Unknown element selector "%0"';
oAML_messages[cAMLException.AML_SELECTOR_ATTRIBUTE_ERR]		= 'Unknown attribute selector "%0"';
oAML_messages[cAMLException.AML_NOT_INITIALIZED_ERR]		= 'Object "%0" has not been initialized';
oAML_messages[cAMLException.AML_MODAL_SET_MODAL_ERR]		= 'Element is already modal';
oAML_messages[cAMLException.AML_MODAL_RELEASE_MODAL_ERR]	= 'Element can not be released';

oAML_messages[nAML_NOT_WELLFORMED_WRN]		= 'Not well-formed XML';
oAML_messages[nAML_NOT_UNIQUE_ID_WRN]		= 'Duplicate ID attribute value "%0" used';
oAML_messages[nAML_NOT_FOUND_SHADOW_WRN]	= 'Shadow content was not found. Element "%0" quiried for pseudo-element "%1"';
oAML_messages[nAML_FEATURE_DEPRECATED_WRN]	= 'Feature "%0" had been deprecated. Use "%1" instead';
oAML_messages[nAML_UNKNOWN_ELEMENT_NS_WRN]	= 'Element "%0" definition is missing from "%1" namespace. Element processing skipped';
oAML_messages[nAML_UNKNOWN_ATTRIBUTE_NS_WRN]= 'Attribute "%0" definition is missing from "%1" namespace. Attribute processing skipped';
oAML_messages[nAML_MISSING_ATTRIBUTE_WRN]	= 'Required attribute "%0" is missing from "%1" element. Element processing skipped';
oAML_messages[nAML_INVALID_ATTRIBUTE_WRN]	= 'Attribute "%0" value "%1" is invalid. Element processing skipped';
oAML_messages[nAML_UNKNOWN_SIMPLE_TYPE_WRN]	= 'Simple type definition "%0" not found';
oAML_messages[nAML_ERROR_ANIMATING_ATTR_WRN]= 'Error animating %0 atttribute with %1 value';
//<-Debug

// Validation implementation
/*
 * Syntaxis:
 * fAML_validate(arguments, [
 * 		[sArgumentName,	cArgumentType, bOptional, bNullAllowed]
 * ], sFunctionName);
 */
//->Debug
var aAML_endings	= 'st-nd-rd'.split('-');
//<-Debug
function fAML_validate(aArguments, aParameters, sFunction) {
	var fCaller	= null;
	// Has to be wrapped in try/catch because Firebug throws "Permission denied to get property on Function.caller" in XMLHttpRequest
	try {
		fCaller	= fAML_validate.caller.caller.caller;
	} catch (oError) {}

	// Iterate over parameters list
	for (var nIndex = 0, nLength = aArguments.length, aParameter, oArgument, bValid; aParameter = aParameters[nIndex]; nIndex++) {
		oArgument	= aArguments[nIndex];
//->Debug
		var sArgument	=(nIndex + 1)+(nIndex < 3 ? aAML_endings[nIndex] : 'th');
//<-Debug
		// see if argument is passed
		if (nLength < nIndex + 1 && !aParameter[2])
			throw new cAMLException(cAMLException.AML_ARGUMENT_MISSING_ERR, fCaller
//->Debug
									, [sArgument, aParameter[0], sFunction]
//<-Debug
			);

		// see if argument has correct type
		if (nLength > nIndex) {
			if (oArgument === null && aParameter[3])
				bValid	= true;
			else
				switch (aParameter[1]) {
					// Primitive types
					case cString:		bValid	= typeof oArgument == "string";		break;
					case cBoolean:		bValid	= typeof oArgument == "boolean";	break;
					case cNumber:		bValid	= typeof oArgument == "number";		break;
					case cFunction:		bValid	= typeof oArgument == "function";	break;
					// Virtual types
					case cXMLNode:		bValid	= oArgument && !fIsNaN(oArgument.nodeType);	break;
					case cXMLElement:	bValid	= oArgument && oArgument.nodeType == 1;		break;
					case cXMLDocument:	bValid	= oArgument && oArgument.nodeType == 9;		break;
					// Object types
					case cObject:		bValid	= true;								break;
					default:			bValid	= oArgument instanceof aParameter[1];
				}

			if (!bValid)
				throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fCaller
//->Debug
										, [sArgument, aParameter[0], sFunction]
//<-Debug
				);
		}
	}
};

var oAML_processors	= {},
	oAML_namespaces	= {},
	oAML_all	= {},
	oAML_ids	= {},
//	oAML_shadow	= {},
	oAML_implementation	= new cAMLImplementation,
	oAML_configuration	= new cAMLConfiguration;

function fAML_import(oElementDOM, oNode, bCollapse) {
	var oDocument	= ample;
	switch (oElementDOM.nodeType) {
		case cAMLNode.ELEMENT_NODE:
			var oProcessor	= oAML_processors[oElementDOM.namespaceURI];
			if (oProcessor) {
				// if element was returned from traversal, it should be processed
				if (oElementDOM = oProcessor.traverse(oElementDOM, oNode))
					arguments.callee(oElementDOM, oNode);
			}
			else {
				// Create element
				var oElement	= fAMLDocument_createElementNS(oDocument, oElementDOM.namespaceURI, oElementDOM.nodeName),
					aAttributes = oElementDOM.attributes,
					oAttribute, sLocalName, sPrefix, sNameSpaceURI,
					sName, sValue,
					oEvent;

				for (var nIndex = 0, nLength = aAttributes.length; nIndex < nLength; nIndex++) {
					// oAttribute used to cache object
					oAttribute	= aAttributes[nIndex];
					sName	= oAttribute.nodeName;
					sValue	= oAttribute.nodeValue;
					sPrefix	= oAttribute.prefix;
					sLocalName		= oAttribute.baseName || oAttribute.localName;
					sNameSpaceURI	= oAttribute.namespaceURI;

					// Inline event handler
					if (sName.indexOf("on") == 0)
						oElement[sName]	= new cFunction("event", bCollapse ? sValue.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&') : sValue);
					else
						oElement.attributes[sName]	= bCollapse ? sValue : sValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
				}

				// Copy default attributes values if not specified
				var oNamespace	= oAML_namespaces[oElement.namespaceURI],
					cElement	= oNamespace ? oNamespace.elements[oElement.localName] : null;

				if (cElement) {
					for (sName in cElement.attributes)
						if (cElement.attributes.hasOwnProperty(sName) && !(sName in oElement.attributes))
							oElement.attributes[sName]	= cElement.attributes[sName];
				}
//->Debug
				else
				if (oNamespace && oElement.localName != "#document-fragment".substr(1))
					fAML_warn(nAML_UNKNOWN_ELEMENT_NS_WRN, [oElement.localName, oElement.namespaceURI]);
//<-Debug
				// and append it to parent (if there is one)
				if (oNode)
					fAMLNode_appendChild(oNode, oElement);

				// Render Children
				for (var nIndex = 0, nLength = oElementDOM.childNodes.length; nIndex < nLength; nIndex++)
			   		arguments.callee(oElementDOM.childNodes[nIndex], oElement, bCollapse);
			}
			break;

		case cAMLNode.ENTITY_REFERENCE_NODE:
			if (oNode.lastChild instanceof cAMLCharacterData)
				fAMLCharacterData_appendData(oNode.lastChild, oElementDOM.text);
			else
				fAMLNode_appendChild(oNode, fAMLDocument_createTextNode(oDocument, oElementDOM.text));
			break;

		case cAMLNode.TEXT_NODE:
			var sValue	= oElementDOM.nodeValue;
			if (!bCollapse)
				sValue	= sValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

			if (sValue.replace(/^\s+/, '').replace(/\s+$/, '') != '') {
				if (oNode.lastChild instanceof cAMLCharacterData)
					fAMLCharacterData_appendData(oNode.lastChild, sValue);
				else
					fAMLNode_appendChild(oNode, fAMLDocument_createTextNode(oDocument, sValue));
			}
			break;

		case cAMLNode.CDATA_SECTION_NODE:
			fAMLNode_appendChild(oNode, fAMLDocument_createCDATASection(oDocument, oElementDOM.nodeValue));
			break;

		case cAMLNode.COMMENT_NODE:
//->Source
/*
			fAMLNode_appendChild(oElement, oElement.ownerDocument.createComment(oElementDOM.nodeValue));
*/
//<-Source
			break;

		case cAMLNode.PROCESSING_INSTRUCTION_NODE:
			switch (oElementDOM.target)	{
				case "xml":
					break;

				case "xml-stylesheet":
					if (oElementDOM.nodeValue.match(/href=["']([^"']+)["']/)) {
						var sHref	= cRegExp.$1;
						if (oElementDOM.nodeValue.match(/type=["']([^"']+)["']/))
							if (cRegExp.$1 == "text/css" || cRegExp.$1 == "text/ample+css") {
								var sCSS	= fAML_loadStyleSheet(sHref);
								if (sCSS)
									document.getElementsByTagName("head")[0].appendChild(fAML_createStyleSheet(sCSS, sHref));
							}
					}
					// no break is left intentionally
				default:
					fAMLNode_appendChild(oNode, fAMLDocument_createProcessingInstruction(oDocument, oElementDOM.nodeName, oElementDOM.nodeValue));
			}
			break;

		case cAMLNode.DOCUMENT_NODE:
			for (var nIndex = 0, nLength = oElementDOM.childNodes.length; nIndex < nLength; nIndex++)
				arguments.callee(oElementDOM.childNodes[nIndex], oNode, bCollapse);
			break;

		case cAMLNode.DOCUMENT_TYPE_NODE:
			break;

		default:
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
	}
	return oElement;
};

function fAML_register(oNode) {
	//
	if (oNode.nodeType == cAMLNode.ELEMENT_NODE && !oAML_all[oNode.uniqueID]) {
		// Register Instance
		oAML_all[oNode.uniqueID]	= oNode;

		// Cache for shadow links
//		oAML_shadow[oNode.uniqueID]	= {};

		// Register "identified" Instance
		if (oNode.attributes.id)
			oAML_ids[oNode.attributes.id]	= oNode;

		// Set style property
		if (oAMLConfiguration_values["ample-use-style-property"]) {
			var oElementDOM	= oNode.$getContainer();
			if (oElementDOM)
				oNode.style	= oElementDOM.style;
		}

		// Fire Mutation event on Element
		var oEvent = new cAMLMutationEvent;
		oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
		fAMLNode_dispatchEvent(oNode, oEvent);

		// Global attributes module
		for (var sName in oNode.attributes) {
			if (oNode.attributes.hasOwnProperty(sName)) {
				var aAttribute	= sName.split(':'),
					sLocalName	= aAttribute.pop(),
					sPrefix		= aAttribute.pop(),
					sNameSpaceURI;

				if (sName != "xmlns" && sPrefix && sPrefix != "xmlns" && (sNameSpaceURI = fAMLNode_lookupNamespaceURI(oNode, sPrefix))) {
					var oNamespace	= oAML_namespaces[sNameSpaceURI],
						cAttribute	= oNamespace ? oNamespace.attributes[sLocalName] : null;

					if (cAttribute)	{
						// oAttribute used to create fake object
						var oAttribute	= new cAttribute;
						oAttribute.ownerElement	= oNode;
						oAttribute.name			=
						oAttribute.nodeName		= sName;
						oAttribute.value		=
						oAttribute.nodeValue	= oNode.attributes[sName];
						oAttribute.localName	= sLocalName;
						oAttribute.prefix		= sPrefix;
						oAttribute.namespaceURI	= sNameSpaceURI;

						// Fire Mutation event (pseudo)
						oEvent = new cAMLMutationEvent;
						oEvent.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
						oEvent.target	=
						oEvent.currentTarget	= oAttribute;
						oEvent.eventPhase		= cAMLEvent.AT_TARGET;
						fAMLNode_handleEvent(oAttribute, oEvent);
					}
//->Debug
					else
					if (oNamespace)
						fAML_warn(nAML_UNKNOWN_ATTRIBUTE_NS_WRN, [sLocalName, sNameSpaceURI]);
//<-Debug
				}
			}
		}

		// Process children
		for (var nIndex = 0, oElement; oElement = oNode.childNodes[nIndex]; nIndex++)
			arguments.callee(oElement);

		// Process anonymous children
		for (var nIndex = 0, oElement; oElement = oNode.$childNodesAnonymous[nIndex]; nIndex++)
			arguments.callee(oElement);
	}
};

function fAML_unregister(oNode) {
	//
	if (oNode.nodeType == cAMLNode.ELEMENT_NODE && oAML_all[oNode.uniqueID]) {
		// Fire Mutation event
		var oEvent = new cAMLMutationEvent;
		oEvent.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
		fAMLNode_dispatchEvent(oNode, oEvent);

		// Unset style property
		if (oAMLConfiguration_values["ample-use-style-property"])
			delete oNode.style;

		// Unregister Instance
		delete oAML_all[oNode.uniqueID];

		// Cache for shadow links
//		delete oAML_shadow[oNode.uniqueID];

		// Unregister "identified" Instance
		if (oNode.attributes.id)
			delete oAML_ids[oNode.attributes.id];

		// Process children
		for (var nIndex = 0, oElement; oElement = oNode.childNodes[nIndex]; nIndex++)
			arguments.callee(oElement);

		// Process anonymous children
		for (var nIndex = 0, oElement; oElement = oNode.$childNodesAnonymous[nIndex]; nIndex++)
			arguments.callee(oElement);
	}
};

var oAML_uriCache	= {};
/*
 * Returns an array of uri components:
 * [scheme, authority, path, query, fragment]
 */
function fAML_getUriComponents(sUri)
{
	var aResult	= oAML_uriCache[sUri] ||(oAML_uriCache[sUri] = sUri.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?/));
	return [aResult[2], aResult[4], aResult[5], aResult[7], aResult[9]];
};

function fAML_resolveUri(sUri, sBaseUri)
{
	if (sUri == '' || sUri.charAt(0) == '#')
		return sBaseUri;

	var aUri = fAML_getUriComponents(sUri);
	if (aUri[0])	// scheme
		return sUri;

	var aBaseUri = fAML_getUriComponents(sBaseUri);
	aUri[0] = aBaseUri[0];	// scheme

	if (!aUri[1]) {
		// authority
		aUri[1] = aBaseUri[1];

		// path
		if (aUri[2].charAt(0) != '/') {
			var aUriSegments = aUri[2].split('/'),
				aBaseUriSegments = aBaseUri[2].split('/');
			aBaseUriSegments.pop();

			var nBaseUriStart = aBaseUriSegments[0] == '' ? 1 : 0;
			for (var nIndex = 0, nLength = aUriSegments.length; nIndex < nLength; nIndex++) {
				if (aUriSegments[nIndex] == '..') {
					if (aBaseUriSegments.length > nBaseUriStart)
						aBaseUriSegments.pop();
					else {
						aBaseUriSegments.push(aUriSegments[nIndex]);
						nBaseUriStart++;
					}
				}
				else
				if (aUriSegments[nIndex] != '.')
					aBaseUriSegments.push(aUriSegments[nIndex]);
			}
			if (aUriSegments[--nIndex] == '..' || aUriSegments[nIndex] == '.')
				aBaseUriSegments.push('');
			aUri[2]	= aBaseUriSegments.join('/');
		}
	}

	var aResult = [];
	if (aUri[0])
		aResult.push(aUri[0] + ':');
	if (aUri[1])
		aResult.push('/' + '/' + aUri[1]);
	if (aUri[2])
		aResult.push(aUri[2]);
	if (aUri[3])
		aResult.push('?' + aUri[3]);
	if (aUri[4])
		aResult.push('#' + aUri[4]);

	return aResult.join('');
};

//<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" [
//]>
var sAML_entities	= '',
	aEntities		= 'nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml yacute thorn yuml'.split(' ');
for (var nIndex = 0, nLength = aEntities.length; nIndex < nLength; nIndex++)
	sAML_entities	+= '<!' + "ENTITY" + ' ' + aEntities[nIndex] + ' "&#' +(160 + nIndex)+ ';">';

function fAML_processScripts() {
	var oDocument,
    	oNamespaces = {},
    	oParserError,
    	oParserMessage,
		aElements,
		oElement,
		oElementDOM,
		oElementNew,
		oAttribute,
		sAttribute,
    	aAttributes,
    	oAttributes,
    	bReferenced;

	// Collect attributes from document root element
	if (bTrident)
		for (var nIndex = 0, aAttributes = document.namespaces; oAttribute = aAttributes[nIndex]; nIndex++)
			oNamespaces["xmlns" + (oAttribute.name == "xmlns" ? '' : ':') + oAttribute.name]	= oAttribute.urn;
	else
		for (var nIndex = 0, aAttributes = document.documentElement.attributes; oAttribute = aAttributes[nIndex]; nIndex++)
			if (oAttribute.nodeName.match(/^xmlns($|:)/))
				oNamespaces[oAttribute.nodeName]	= oAttribute.nodeValue;

	function fAML_hashToString(oHash) {
		var aAttributes	= [], sAttribute;
		for (sAttribute in oNamespaces)
			if (oNamespaces.hasOwnProperty(sAttribute) && !(sAttribute in oHash))
				oHash[sAttribute]	= oNamespaces[sAttribute];
		for (sAttribute in oHash)
			if (oHash.hasOwnProperty(sAttribute))
				aAttributes.push(' ' + sAttribute + '="' + oHash[sAttribute] + '"');
		return aAttributes.join('');
	};

	// Process script tags
    aElements = document.body.getElementsByTagName("script");
    for (var nIndex = 0, nSkip = 0; aElements.length > nSkip; nIndex++) {
    	// Current Script
	    oElementDOM	= aElements[nSkip];

		// Skip if differenet mime-type
		if (oElementDOM.getAttribute("type") != "application/ample+xml")
			nSkip++;
		else {
			oAttributes	= {};
			bReferenced	= false;

			// retrieve namespaces list (in older than IE6, attributes on script tag are not parsed into collection)
			if (bTrident && (nVersion < 6 || nVersion > 8)) {
				if (aAttributes	= oElementDOM.outerHTML.match(/<script([^\>]+)/i)[1].match(/[^=]+=("[^"]+"|[^\s]+)/gi))
					for (var nAttribute = 0; oAttribute = aAttributes[nAttribute]; nAttribute++)
						if (oAttribute.match(/\s([^=]+)="?([^"]+)"?/i) && (sAttribute = cRegExp.$1) != "type")
                			oAttributes[sAttribute]	= cRegExp.$2;
			}
			else {
		        aAttributes = oElementDOM.attributes;
		        for (var nAttribute = 0; oAttribute = aAttributes[nAttribute]; nAttribute++)
		        	if (oAttribute.specified && (sAttribute = oAttribute.nodeName.toLowerCase()) != "type")
                		oAttributes[sAttribute]	= (sAttribute == "style" ? oElementDOM[sAttribute].cssText : oAttribute.nodeValue).replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;');
			}

			// Add default namespace if missing
			if (!oAttributes["xmlns"])
				oAttributes["xmlns"]	= "http://www.w3.org/1999/xhtml";

			if (oElementDOM.getAttribute("src")) {
				var oRequest	= new cXMLHttpRequest;
				oRequest.open("GET", oElementDOM.src, false);
				oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
				oRequest.send(null);

				// loaded fragment
				oDocument	= fAML_getResponseDocument(oRequest);
				bReferenced	= true;
			}
			else {
				// Create fragment
			    oDocument   = new cDOMParser().parseFromString(//		"<?" + "xml" + ' ' + 'version="1.0"' + "?>" +
																		'<!' + "DOCTYPE" + ' ' + "#document-fragment".substr(1) + '[' + sAML_entities + ']>' +
//->Debug
																		'\n' +
//<-Debug
			    														'<' + "#document-fragment".substr(1) + fAML_hashToString(oAttributes).replace(/&/g, '&amp;') + '>' +
//->Debug
			    														'\n' +
//<-Debug
			    														oElementDOM.text.replace(/^\s*(<!\[CDATA\[)?\s*/, '').replace(/\s*(\]\]>)\s*$/, '').replace(/&/g, '&amp;').replace(/<script(.|\n|\r)+$/, '') +
//->Debug
			    														'\n' +
//<-Debug
			    														'</' + "#document-fragment".substr(1) + '>', "text/xml");
			}

			oParserError	= oDocument.getElementsByTagName("parsererror")[0];
		    if (oDocument.documentElement && !oParserError) {
		    	// import XML DOM into Ample DOM
		    	oElement	= fAML_import(oDocument.documentElement, null, true);
		    	// render Ample DOM
		    	if (bTrident) {
		    		oElementNew	= document.createElement("div");
		    		fAML_replaceNode(oElementDOM, oElementNew);
			    	oElementNew.innerHTML = oElement.$getTag();

					// Map attributes
					if (oElementDOM.style.cssText)
						oElementNew.style.cssText	= oElementDOM.style.cssText;
					if (oElementDOM.className)
						oElementNew.className = oElementDOM.className;
					// duplicate id problem
					if (!bReferenced)
						oElementNew.setAttribute("id", oElementDOM.getAttribute("id") || oElement.uniqueID);
		    	}
		    	else {
		    		for (var sName in oAttributes)
		    			if (oAttributes.hasOwnProperty(sName) && (sName.substr(0, 2) == "on" || sName == "src"))
		    				delete oAttributes[sName];
					// duplicate id problem
		    		if (!bReferenced && !oAttributes["id"])
		    			oAttributes["id"]	= oElement.uniqueID;
		    		oElementNew	= document.importNode(new cDOMParser().parseFromString('<!' + "DOCTYPE" + ' ' + "div" + ' ' + '[' + sAML_entities + ']>' +
//->Debug
																		'\n' +
//<-Debug
		    															'<' + "div" + fAML_hashToString(oAttributes).replace(/&/g, '&amp;') + '>' +
//->Debug
																		'\n' +
//<-Debug
		    															oElement.$getTag() +
//->Debug
																		'\n' +
//<-Debug
		    															'</' + "div"+ '>', "text/xml").documentElement, true);
		    		oElementDOM.parentNode.replaceChild(oElementNew, oElementDOM);
		    	}

				//
		    	fAMLNode_appendChild(ample.documentElement, oElement);

				// Register tree
				fAML_register(oElement);

			    // Fire load Event
		    	var oEventLoad = new cAMLEvent;
			    oEventLoad.initEvent("load", false, false);
			    fAMLNode_dispatchEvent(oElement, oEventLoad);
		    }
		    else {
				oElementNew	= document.createElement("pre");
				fAML_replaceNode(oElementDOM, oElementNew);
		    	oElementNew.innerHTML	= "script" + ' ' + "parsererror";
//->Debug
				// First "standard" errors output
			    if (oParserError) {
			    	// Gecko/Presto
					if (oParserMessage = oParserError.getElementsByTagName('sourcetext')[0])
						oElementNew.textContent	= oParserError.firstChild.textContent + '\n' +
															oParserMessage.textContent;
					else
					// Webkit
					if (oParserMessage = oParserError.getElementsByTagName('div')[0])
						oElementNew.textContent	= 'XML Parsing Error: ' + oParserMessage.textContent.replace(/.+:/, '') +
													'Location: ' + oLocation + '\n' +
													 oParserMessage.textContent.replace(/:.+/, '');
			    }
			    else
			    // Trident
			    if (oDocument.parseError) {
					oElementNew.innerText	= 'XML Parsing Error: ' + oDocument.parseError.reason + '\n' +
													'Location: ' + (oDocument.parseError.url || oLocation) + '\n' +
													'Line Number: ' + oDocument.parseError.line + ', Column ' + oDocument.parseError.linepos + ':\n'+
													oDocument.parseError.srcText + '\n' +
													new cArray(oDocument.parseError.linepos).join('-') + '^';
			    }
//<-Debug

//->Debug
			    fAML_warn(nAML_NOT_WELLFORMED_WRN);
//<-Debug
		    }
		}
    }
};

function fAML_processStyleSheets() {
	var	aElements,
		oElement,
		nIndex,
		nLength,
		nSkip;

	// Process inline StyleSheets
    aElements   = document.getElementsByTagName("style");
    for (nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++) {
    	oElement	= aElements[nIndex];

    	if (oElement.getAttribute("type") == "text/ample+css")
    		fAML_replaceNode(oElement, fAML_createStyleSheet(oElement.innerHTML, oLocation.href, oElement.getAttribute("media")));
	}

	// Process external StyleSheets
    aElements   = document.getElementsByTagName("link");
    for (nIndex = 0, nSkip = 0; aElements.length > nSkip; nIndex++) {
    	oElement	= aElements[nSkip];

		// Skip if different mime-type
		if (oElement.getAttribute("type") != "text/ample+css")
			nSkip++;
		else
			fAML_replaceNode(oElement, fAML_createStyleSheet(fAML_loadStyleSheet(oElement.href), oElement.href, oElement.getAttribute("media")));
    }
};

function fAML_initialize() {
//->Source
	document.title	= "Processing...";
//<-Source

//->Source
    var oDateCSS	= new cDate;
//<-Source

	// Process CSS stylesheets
	fAML_processStyleSheets();

//->Source
    var oDateXML	= new cDate;
//<-Source

	// Process XML markup
	fAML_processScripts();

	// change readystate to "loaded"
	fAML_changeReadyState(2);

	// Set documentElement style pointer object
    if (oAMLConfiguration_values["ample-use-style-property"])
		ample.documentElement.style	= document.body.style;

	// IE background images cache fix
	try {
		if (bTrident && nVersion < 7)
			document.execCommand("BackgroundImageCache", false, true);
	} catch (oError){};

	// change readystate to "interactive"
	fAML_changeReadyState(3);

    // Fire Event
    var oEventLoad = new cAMLEvent;
    oEventLoad.initEvent("load", false, false);
    fAMLNode_dispatchEvent(ample, oEventLoad);

	// change readystate to "complete"
	fAML_changeReadyState(4);

//->Source
    document.title	= 	"AML Elements: " + ample.getElementsByTagName('*').length + " units. " +
            			"DOM Elements: " + document.getElementsByTagName('*').length + " units. " +
            			"CSS time: " + (oDateXML - oDateCSS) + " ms. " +
            			"XML time: " + (new cDate - oDateXML) + " ms. ";
//<-Source
};

function fAML_finalize() {
	var aElements = ample.documentElement.childNodes,
		oEventUnload;
	for (var nIndex = 0; nIndex < aElements.length; nIndex++) {
	    // fire unload event on fragments
		oEventUnload = new cAMLEvent;
	    oEventUnload.initEvent("unload", false, false);
	    fAMLNode_dispatchEvent(aElements[nIndex], oEventUnload);
	}

    // fire unload event on document
    oEventUnload = new cAMLEvent;
    oEventUnload.initEvent("unload", false, false);
    fAMLNode_dispatchEvent(ample, oEventUnload);

	// free memory
    fAML_unregister(ample.documentElement);
};

function fAML_changeReadyState(nState) {
	// 0: uninitialized
	// 1: loading
	// 2: loaded
	// 3: interactive
	// 4: complete
	var oReadyStateChangeEvent	= new cAMLCustomEvent;
	oReadyStateChangeEvent.initCustomEvent("readystatechange", false, false, nState);
	fAMLNode_dispatchEvent(ample, oReadyStateChangeEvent);
};

// set standard parameters
oAMLConfiguration_values["error-handler"]	= null;
oAMLConfiguration_values["element-content-whitespace"]	= false;	// in DOM-Core spec the default value is true
oAMLConfiguration_values["entities"]	= false;	// in DOM-Core spec the default value is true
oAMLConfiguration_values["comments"]	= false; // in DOM-Core spec the default value is true
// set ample parameters
oAMLConfiguration_values["ample-use-style-property"]= true;		// -> ample-core-style
oAMLConfiguration_values["ample-module-history-fix"]=  false;	// -> ample-history
oAMLConfiguration_values["ample-version"]	= '@project.version@';
oAMLConfiguration_values["ample-user-agent"]= '@project.userAgent@';

// Create global "ample" object
ample	= fAMLImplementation_createDocument(oAML_implementation, document.documentElement.getAttribute("xmlns") || null, "document", null);
ample.documentElement.$getContainer	= function(sName) {return sName && sName != "gateway" ? null : document.body};

ample.$instance	= function(oNode) {
    for (var oElement, sId; oNode; oNode = oNode.parentNode)
        if ((sId = oNode.id) && (oElement = (oAML_ids[sId] || oAML_all[sId])))
            return oElement;
    return null;
};
/*
ample.$class	= function(oNode) {
	var oElement	= ample.$instance(oNode);
	if (oElement) {
		var sNameSpaceURI	= oElement.namespaceURI,
			oNamespace	= oAML_namespaces[sNameSpaceURI];
		return oNamespace && oNamespace.elements[sNameSpaceURI] ? oNamespace.elements[sNameSpaceURI] : cAMLElement;
	}
	return null;
};
*/
ample.$resolveUri	= function(sUri, sBaseUri) {
	return fAML_resolveUri(sUri, sBaseUri);
};
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
oAMLConfiguration_values["error-handler"]	= oAML_errorHandler;
//<-Debug

// change readystate to "uninitialized"
fAML_changeReadyState(0);
