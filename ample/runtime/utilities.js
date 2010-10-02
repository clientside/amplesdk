/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//->Debug
var sAML_NOT_WELLFORMED_WRN			= 'Not well-formed XML',
	sAML_NOT_UNIQUE_ID_WRN			= 'Duplicate ID attribute value "%0" used',
	sAML_NOT_FOUND_SHADOW_WRN		= 'Shadow content was not found. Element "%0" quiried for pseudo-element "%1"',
	sAML_FEATURE_DEPRECATED_WRN		= 'Feature "%0" had been deprecated. Use "%1" instead',
	sAML_UNKNOWN_ELEMENT_NS_WRN		= 'Element "%0" definition is missing from "%1" namespace. Element processing skipped',
	sAML_UNKNOWN_ATTRIBUTE_NS_WRN	= 'Attribute "%0" definition is missing from "%1" namespace. Attribute processing skipped',
	sAML_INVALID_ATTRIBUTE_WRN		= 'Attribute "%0" value "%1" is invalid. Element processing skipped',
	sAML_ERROR_ANIMATING_ATTR_WRN	= 'Error animating "%0" atttribute with "%1" value',
	sAML_DOCUMENT_INVALID_STATE_WRN	= 'Document invalid state',
	sAML_REWRITING_MEMBER_WRN		= 'Re-writing member "%0"',
	sAML_QUERYING_PSEUDOELEMENT_WRN	= 'Querying for pseudo-elements is not supported',
	sAML_CONFIGURATION_READONLY_WRN	= 'Configuration parameter "%0" is readonly. Value has not been set';

function fUtilities_warn(sWarning, aArguments) {
	var oErrorHandler	= oAMLConfiguration_values["error-handler"];
	if (oErrorHandler)
		oErrorHandler.handleError(new cAMLError(fAMLException_format(sWarning, aArguments || []), cAMLError.SEVERITY_WARNING));
};
//<-Debug

var fUtilities_uriCache	= {};
/*
 * Returns an array of uri components:
 * [scheme, authority, path, query, fragment]
 */
function fUtilities_getUriComponents(sUri)
{
	var aResult	= fUtilities_uriCache[sUri] ||(fUtilities_uriCache[sUri] = sUri.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\\?([^#]*))?(#(.*))?/));
	return [aResult[2], aResult[4], aResult[5], aResult[7], aResult[9]];
};

function fUtilities_resolveUri(sUri, sBaseUri)
{
	if (sUri == '' || sUri.charAt(0) == '#')
		return sBaseUri;

	var aUri = fUtilities_getUriComponents(sUri);
	if (aUri[0])	// scheme
		return sUri;

	var aBaseUri = fUtilities_getUriComponents(sBaseUri);
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

function fUtilities_encodeEntities(sValue) {
	return sValue.replace(/&(?![a-z]+;)/gi, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

function fUtilities_decodeEntities(sValue) {
	return sValue.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

//<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" [
//]>
var aUtilities_entities	= '',
	aEntities		= 'nbsp iexcl cent pound curren yen brvbar sect uml copy ordf laquo not shy reg macr deg plusmn sup2 sup3 acute micro para middot cedil sup1 ordm raquo frac14 frac12 frac34 iquest Agrave Aacute Acirc Atilde Auml Aring AElig Ccedil Egrave Eacute Ecirc Euml Igrave Iacute Icirc Iuml ETH Ntilde Ograve Oacute Ocirc Otilde Ouml times Oslash Ugrave Uacute Ucirc Uuml Yacute THORN szlig agrave aacute acirc atilde auml aring aelig ccedil egrave eacute ecirc euml igrave iacute icirc iuml eth ntilde ograve oacute ocirc otilde ouml divide oslash ugrave uacute ucirc uuml yacute thorn yuml'.split(' ');
for (var nIndex = 0, nLength = aEntities.length; nIndex < nLength; nIndex++)
	aUtilities_entities	+= '<!' + "ENTITY" + ' ' + aEntities[nIndex] + ' "&#' +(160 + nIndex)+ ';">';

//
function fAML_processScripts() {
	var oDocument,
    	oParserError,
    	oParserMessage,
		aElements,
		oElement,
		oElementDOM,
		oElementNew,
		oAttribute,
		sAttribute,
		sPrefix,
    	aAttributes,
    	oAttributes,
    	bReferenced;

	function fHashToString(hHash) {
		var aAttributes	= [], sAttribute, sPrefix;
		for (sAttribute in oAmple.prefixes) {
			sPrefix = "xmlns" + (sAttribute == '' ? '' : ':' + sAttribute);
			if (!(sPrefix in hHash) && oAmple.prefixes.hasOwnProperty(sAttribute) && sAttribute != "toString")
				hHash[sPrefix]	= oAmple.prefixes[sAttribute];
		}
		for (sAttribute in hHash)
			if (hHash.hasOwnProperty(sAttribute))
				aAttributes.push(' ' + sAttribute + '="' + hHash[sAttribute] + '"');
		return aAttributes.join('');
	};

	function fGetTagChildren(oElement) {
		var aHtml	= [];
		for (var nIndex = 0, aElement = oElement.childNodes; nIndex < aElement.length; nIndex++)
			aHtml.push(aElement[nIndex].$getTag());
		return aHtml.join('');
	};

	// Process script tags
    aElements = oBrowser_body.getElementsByTagName("script");
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
                		oAttributes[sAttribute]	= fUtilities_encodeEntities(sAttribute == "style" ? oElementDOM[sAttribute].cssText : oAttribute.nodeValue);
			}

			if (oElementDOM.getAttribute("src")) {
				var oRequest	= new cXMLHttpRequest;
				oRequest.open("GET", oElementDOM.src, false);
				oRequest.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				oRequest.setRequestHeader("X-User-Agent", oAMLConfiguration_values["ample-user-agent"]);
				oRequest.send(null);

				// loaded fragment
				oDocument	= fBrowser_getResponseDocument(oRequest);
				bReferenced	= true;
			}
			else {
				// Create fragment
			    oDocument   = new cDOMParser().parseFromString(//		"<?" + "xml" + ' ' + 'version="1.0"' + "?>" +
																		'<!' + "DOCTYPE" + ' ' + "div" + '[' + aUtilities_entities + ']>' +
//->Debug
																		'\n' +
//<-Debug
			    														'<' + "div" + ' ' + "type" + '="' + "application/ample+xml" + '"' + fHashToString(oAttributes).replace(/&/g, '&amp;') + '>' +
//->Debug
			    														'\n' +
//<-Debug
			    														oElementDOM.text.replace(/^\s*(<!\[CDATA\[)?\s*/, '').replace(/\s*(\]\]>)\s*$/, '').replace(/^\s*<\?xml.+\?>/, '').replace(/&/g, '&amp;').replace(/<script(.|\n|\r)+$/, '') +
//->Debug
			    														'\n' +
//<-Debug
			    														'</' + "div" + '>', "text/xml");
			}

			oParserError	= oDocument ? oDocument.getElementsByTagName("parsererror")[0] : null;
		    if (oDocument && oDocument.documentElement && !oParserError) {
		    	// Set xml:base for referenced documents
		    	if (bReferenced)
		    		if (!oDocument.documentElement.getAttribute("xml:base"))
		    			oDocument.documentElement.setAttribute("xml:base", fUtilities_resolveUri(oElementDOM.src, fAMLNode_getBaseURI(oAmple_root)));

		    	// import XML DOM into Ample DOM
		    	oElement	= fAMLDocument_importNode(oAmple_document, oDocument.documentElement, true, null, true);
		    	// Remove prefixes declarations (already available from root)
		    	if (!bReferenced) {
		    		for (sAttribute in oAmple.prefixes) {
			    		sPrefix = "xmlns" + (sAttribute == '' ? '' : ':' + sAttribute);
		    			if (sPrefix in oAttributes && oAttributes[sPrefix] == oAmple.prefixes[sAttribute])
		    				delete oElement.attributes[sPrefix];
		    		}
		    		// Change root element name to script
		    		oElement.nodeName	=
		    		oElement.localName	=
		    		oElement.nodeName	= "script";
		    	}
		    	// render Ample DOM
		    	if (bTrident) {
		    		oElementNew	= oUADocument.createElement("div");
		    		fBrowser_replaceNode(oElementDOM, oElementNew);
			    	oElementNew.innerHTML = bReferenced ? oElement.$getTag() : fGetTagChildren(oElement);

					// Map attributes
					if (oElementDOM.style.cssText)
						oElementNew.style.cssText	= oElementDOM.style.cssText;
					if (oElementDOM.className)
						oElementNew.className = oElementDOM.className;
					// duplicate id problem
					if (!bReferenced)
						oElementNew.setAttribute('id', oElementDOM.getAttribute('id') || oElement.uniqueID);
		    	}
		    	else {
		    		for (var sName in oAttributes)
		    			if (oAttributes.hasOwnProperty(sName) && (sName.substr(0, 2) == 'on' || sName == "src"))
		    				delete oAttributes[sName];
					// duplicate id problem
		    		if (!bReferenced && !oAttributes['id'])
		    			oAttributes['id']	= oElement.uniqueID;

		    		oElementNew	= oUADocument.importNode(new cDOMParser().parseFromString(
		    															'<!' + "DOCTYPE" + ' ' + "div" + ' ' + '[' + aUtilities_entities + ']>' +
//->Debug
																		'\n' +
//<-Debug
		    															'<' + "div" + fHashToString(oAttributes).replace(/&/g, '&amp;') + '>' +
//->Debug
																		'\n' +
//<-Debug
																		(bReferenced ? oElement.$getTag() : fGetTagChildren(oElement)) +
//->Debug
																		'\n' +
//<-Debug
		    															'</' + "div"+ '>', "text/xml").documentElement, true);
		    		oElementDOM.parentNode.replaceChild(oElementNew, oElementDOM);
		    	}

				//
		    	fAMLNode_appendChild(oAmple_root, oElement);

				// Register tree
				fAMLDocument_register(oAmple_document, oElement);

			    // Fire load Event
		    	var oEventLoad = new cAMLEvent;
			    oEventLoad.initEvent("load", false, false);
			    fAMLNode_dispatchEvent(oElement, oEventLoad);
		    }
		    else {
				oElementNew	= oUADocument.createElement("pre");
				fBrowser_replaceNode(oElementDOM, oElementNew);
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
													'Location: ' + oUALocation + '\n' +
													 oParserMessage.textContent.replace(/:.+/, '');
			    }
			    else
			    // Trident
			    if (oDocument && oDocument.parseError) {
					oElementNew.innerText	= 'XML Parsing Error: ' + oDocument.parseError.reason + '\n' +
													'Location: ' + (oDocument.parseError.url || oUALocation) + '\n' +
													'Line Number: ' + oDocument.parseError.line + ', Column ' + oDocument.parseError.linepos + ':\n'+
													oDocument.parseError.srcText + '\n' +
													new cArray(oDocument.parseError.linepos).join('-') + '^';
			    }
//<-Debug

//->Debug
			    fUtilities_warn(sAML_NOT_WELLFORMED_WRN);
//<-Debug
		    }
		}
    }
};

function fAML_processStyleSheets() {
	var aElements,
		oElement;

	// Process inline StyleSheets
    aElements   = oUADocument.getElementsByTagName("style");
    for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++) {
    	oElement	= aElements[nIndex];

    	if (oElement.getAttribute("type") == "text/ample+css")
    		fBrowser_replaceNode(oElement, fBrowser_createStyleSheet(oElement.innerHTML, oUALocation.href, oElement.getAttribute("media")));
	}

	// Process external StyleSheets
    aElements   = oUADocument.getElementsByTagName("link");
    for (var nIndex = 0, nSkip = 0; aElements.length > nSkip; nIndex++) {
    	oElement	= aElements[nSkip];

		// Skip if different mime-type
		if (oElement.getAttribute("type") != "text/ample+css")
			nSkip++;
		else
			fBrowser_replaceNode(oElement, fBrowser_createStyleSheet(fBrowser_loadStyleSheet(oElement.href), oElement.href, oElement.getAttribute("media")));
    }
};

function fAML_parseStyleSheet(sCSS, sUri) {
	// 1. Remove namespace declarations
	var aNameSpaces = sCSS.match(/@namespace\s+([\w-]+\s+)?(url\()?(['"])?[^'";\s]+(['"])?\)?;?/g);
	if (aNameSpaces)
		for (var nIndex = 0; nIndex < aNameSpaces.length; nIndex++)
			sCSS	= sCSS.replace(aNameSpaces[nIndex], '');

	// 2. Rewrite Relative URLs
	var aCSS	= sCSS.match(/url\s*\([^\)]+\)/g);
	if (aCSS)
		for (var nIndex = 0, nLength = aCSS.length, aUrl; nIndex < nLength; nIndex++)
			if (aUrl = aCSS[nIndex].match(/url\s*\(['"]?([^\)"']+)['"]?\)/i))
				sCSS	= sCSS.replace(aCSS[nIndex], "url" + '("' + fUtilities_resolveUri(aUrl[1], sUri) + '")');

	// 3. Process imports
	var aImports	= sCSS.match(/@import\s+url\s*\(\s*['"]?[^'"]+['"]?\s*\)\s*;?/g);
	if (aImports)
		for (var nIndex = 0, nLength = aImports.length; nIndex < nLength; nIndex++)
			if (aUrl = aImports[nIndex].match(/url\s*\(['"]?([^\)"']+)['"]?\)/i))
				sCSS	= sCSS.replace(aImports[nIndex], fAML_parseStyleSheet(fBrowser_loadStyleSheet(aUrl[1]), aUrl[1]));

	// 4. Convert styles
	if (bTrident) {
		// Rewrite display:inline-block to display:inline (IE8-)
		if (nVersion < 8)
			sCSS	= sCSS.replace(/display\s*:\s*inline-block/g, 'display:inline;zoom:1');
		// Rewrite opacity
		if (nVersion < 9)
			sCSS	= sCSS.replace(/(?:[^-])opacity\s*:\s*([\d.]+)/g, function(sMatch, nOpacity) {
				return "filter" + ':' + "progid" + ':' + "DXImageTransform.Microsoft.Alpha" + '(' + "opacity" + '=' + nOpacity * 100 + ');zoom:1';
			});
	}
	else
	if (bGecko || bWebKit || bPresto) {
		var sBefore	= '$1$2$3-',
			sAfter	= '-$1$2$3';
		// Rewrite text-overflow
		sCSS	= sCSS
					.replace(/(?:\s|;)(text-overflow\s*:\s*)(.+)(\n|;)/gi, sBefore + (bPresto ? 'o' : bGecko ? "moz" : "webkit") + sAfter);
		//
		if (!bPresto) {
			// Rewrite box-shadow
			sCSS	= sCSS
						.replace(/(?:\s|;)(box-shadow\s*:\s*)(.+)(\n|;)/gi, sBefore + (bGecko ? "moz" : "webkit") + sAfter)
						.replace(/(?:\s|;)(outline-radius\s*:\s*)(.+)(\n|;)/gi, sBefore + (bGecko ? "moz" : "webkit") + sAfter)
						.replace(/(?:\s|;)(border-radius\s*:\s*)(.+)(\n|;)/gi, sBefore + (bGecko ? "moz" : "webkit") + sAfter);
			if (bGecko) {
				// Rewrite box-sizing
				sCSS	= sCSS.replace(/(?:\s|;)(box-sizing\s*:\s*)(.+)(\n|;)/gi, sBefore + "moz" + sAfter);
				// Rewrite border-radius
				sBefore	= sBefore + 'moz-border-radius-';
				sAfter	= ':$2$3';
				sCSS	= sCSS
							.replace(/(?:\s|;)(border-top-left-radius\s*:\s*)(.+)(\n|;)/gi, sBefore + 'topleft' + sAfter)
							.replace(/(?:\s|;)(border-top-right-radius\s*:\s*)(.+)(\n|;)/gi, sBefore + 'topright' + sAfter)
							.replace(/(?:\s|;)(border-bottom-left-radius\s*:\s*)(.+)(\n|;)/gi, sBefore + 'bottomleft' + sAfter)
							.replace(/(?:\s|;)(border-bottom-right-radius\s*:\s*)(.+)(\n|;)/gi, sBefore + 'bottomright' + sAfter);
			}
			// Rewrite linear-gradient
//			sCSS	= sCSS.replace(/(\s|;)(background-image\s*:\s*)(linear-gradient\(.+\))(\n|;)/gi, "$1$2$3$4$1$2\-moz\-$3$4");
		}
	}

	// 5. Modify selectors
	var aCSS	= [],
		aRules	= sCSS.match(/[^{]+{[^}]*}/g);
	if (aRules) {
		for (var nIndex = 0, nLength = aRules.length, aRule; nIndex < nLength; nIndex++) {
			aRule	= aRules[nIndex].match(/([^{]+)({[^}]*})/);
			aCSS.push(aRule[1]
//						.replace(/([\s>+~,])(?:([\w]+)\|)?([\w]+)/g, '$1.$2-$3')		// Element
						.replace(/\|/g, '-')							// Namespace
						.replace(/([\s>+~,]|not\()([\w-])/g, '$1.$2')	// Element
						.replace(/\[([\w-]+)=?([\w-]+)?\]/g, '-$1-$2')	// Attribute
						.replace(/::/g, '--')							// Pseudo-element
						.replace(/:nth-child\((\d+)\)/g, '_nth-child-$1')	// Pseudo-class nth-child
						.replace(/:(?!last-child|first-child|not)/g, '_')	// Pseudo-class
//						.replace(/>/g, '--' + "gateway" + '>').replace(/(--gateway){2,}/g, '--' + "gateway")// > selector
						,
						aRule[2]);
		}
		sCSS	= aCSS.join('');
	}

	return sCSS;
};

function fUtilities_toCssPropertyName(sName) {
	for (var nIndex = 1, aValue = sName.split('-'); nIndex < aValue.length; nIndex++)
    	aValue[nIndex] = aValue[nIndex].substr(0, 1).toUpperCase() + aValue[nIndex].substr(1);
	return aValue.join('');
};

function fUtilities_stringToHash(sValue, sPrefix) {
	for (var hValue = {}, aValues = sValue.split(';'), nIndex = 0, nLength = aValues.length, aValue; nIndex < nLength; nIndex++)
		hValue[(aValue = aValues[nIndex].split(':'))[0]]	=(sPrefix || '') + aValue[1];
	return hValue;
};
