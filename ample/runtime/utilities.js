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
	sAML_MISSING_ATTRIBUTE_WRN		= 'Required attribute "%0" is missing from "%1" element. Element processing skipped',
	sAML_INVALID_ATTRIBUTE_WRN		= 'Attribute "%0" value "%1" is invalid. Element processing skipped',
	sAML_UNKNOWN_SIMPLE_TYPE_WRN	= 'Simple type definition "%0" not found',
	sAML_ERROR_ANIMATING_ATTR_WRN	= 'Error animating "%0" atttribute with "%1" value',
	sAML_DOCUMENT_INVALID_STATE_WRN	= 'Document invalid state',
	sAML_REWRITING_LOADED_PLUGIN_WRN= 'Re-writing plugin "%0" which is already loaded',
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
	return sValue.replace(/&(?![a-z]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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
    	aAttributes,
    	oAttributes,
    	bReferenced;

	function fHashToString(hHash) {
		var aAttributes	= [], sAttribute;
		for (sAttribute in oAmple.namespaces)
			if (!(sAttribute in hHash) && oAmple.namespaces.hasOwnProperty(sAttribute))
				hHash[sAttribute]	= oAmple.namespaces[sAttribute];
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
    aElements = oUADocument.body.getElementsByTagName("script");
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
																		'<!' + "DOCTYPE" + ' ' + "script" + '[' + aUtilities_entities + ']>' +
//->Debug
																		'\n' +
//<-Debug
			    														'<' + "script" + ' ' + "type" + '="' + "application/ample+xml" + '"' + fHashToString(oAttributes).replace(/&/g, '&amp;') + '>' +
//->Debug
			    														'\n' +
//<-Debug
			    														oElementDOM.text.replace(/^\s*(<!\[CDATA\[)?\s*/, '').replace(/\s*(\]\]>)\s*$/, '').replace(/^\s*<\?xml.+\?>/, '').replace(/&/g, '&amp;').replace(/<script(.|\n|\r)+$/, '') +
//->Debug
			    														'\n' +
//<-Debug
			    														'</' + "script" + '>', "text/xml");
			}

			oParserError	= oDocument ? oDocument.getElementsByTagName("parsererror")[0] : null;
		    if (oDocument && oDocument.documentElement && !oParserError) {
		    	// import XML DOM into Ample DOM
		    	oElement	= fAMLDocument_importNode(oAmple_document, oDocument.documentElement, true, null, true);
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
		    	fAMLNode_appendChild(oAmple_document.documentElement, oElement);

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
					.replace(/(?:\s|;)(text-overflow\s*:\s*)(.+)(\n|;)/gi, sBefore + (bPresto ? "o" : bGecko ? "moz" : "webkit") + sAfter);
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
						.replace(/([\s>+~,]|not\()([\w])/g, '$1.$2')	// Element
						.replace(/\[([\w]+)=?([\w]+)?\]/g, '-$1-$2')	// Attribute
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

var hUtilities_cssColors	= fUtilities_stringToHash('aliceblue:F0F8FF;antiquewhite:FAEBD7;aqua:00FFFF;aquamarine:7FFFD4;azure:F0FFFF;beige:F5F5DC;bisque:FFE4C4;black:000000;blanchedalmond:FFEBCD;blue:0000FF;blueviolet:8A2BE2;brown:A52A2A;burlywood:DEB887;cadetblue:5F9EA0;chartreuse:7FFF00;chocolate:D2691E;coral:FF7F50;cornflowerblue:6495ED;cornsilk:FFF8DC;crimson:DC143C;cyan:00FFFF;darkblue:00008B;darkcyan:008B8B;darkgoldenrod:B8860B;darkgray:A9A9A9;darkgreen:006400;darkkhaki:BDB76B;darkmagenta:8B008B;darkolivegreen:556B2F;darkorange:FF8C00;darkorchid:9932CC;darkred:8B0000;darksalmon:E9967A;darkseagreen:8FBC8F;darkslateblue:483D8B;darkslategray:2F4F4F;darkturquoise:00CED1;darkviolet:9400D3;deeppink:FF1493;deepskyblue:00BFFF;dimgray:696969;dodgerblue:1E90FF;firebrick:B22222;floralwhite:FFFAF0;forestgreen:228B22;fuchsia:FF00FF;gainsboro:DCDCDC;ghostwhite:F8F8FF;gold:FFD700;goldenrod:DAA520;gray:808080;green:008000;greenyellow:ADFF2F;honeydew:F0FFF0;hotpink:FF69B4;indianred:CD5C5C;indigo:4B0082;ivory:FFFFF0;khaki:F0E68C;lavender:E6E6FA;lavenderblush:FFF0F5;lawngreen:7CFC00;lemonchiffon:FFFACD;lightblue:ADD8E6;lightcoral:F08080;lightcyan:E0FFFF;lightgoldenrodyellow:FAFAD2;lightgreen:90EE90;lightgrey:D3D3D3;lightpink:FFB6C1;lightsalmon:FFA07A;lightseagreen:20B2AA;lightskyblue:87CEFA;lightslategray:778899;lightsteelblue:B0C4DE;lightyellow:FFFFE0;lime:00FF00;limegreen:32CD32;linen:FAF0E6;magenta:FF00FF;maroon:800000;mediumaquamarine:66CDAA;mediumblue:0000CD;mediumorchid:BA55D3;mediumpurple:9370DB;mediumseagreen:3CB371;mediumslateblue:7B68EE;mediumspringgreen:00FA9A;mediumturquoise:48D1CC;mediumvioletred:C71585;midnightblue:191970;mintcream:F5FFFA;mistyrose:FFE4E1;moccasin:FFE4B5;navajowhite:FFDEAD;navy:000080;oldlace:FDF5E6;olive:808000;olivedrab:6B8E23;orange:FFA500;orangered:FF4500;orchid:DA70D6;palegoldenrod:EEE8AA;palegreen:98FB98;paleturquoise:AFEEEE;palevioletred:DB7093;papayawhip:FFEFD5;peachpuff:FFDAB9;peru:CD853F;pink:FFC0CB;plum:DDA0DD;powderblue:B0E0E6;purple:800080;red:FF0000;rosybrown:BC8F8F;royalblue:4169E1;saddlebrown:8B4513;salmon:FA8072;sandybrown:F4A460;seagreen:2E8B57;seashell:FFF5EE;sienna:A0522D;silver:C0C0C0;skyblue:87CEEB;slateblue:6A5ACD;slategray:708090;snow:FFFAFA;springgreen:00FF7F;steelblue:4682B4;tan:D2B48C;teal:008080;thistle:D8BFD8;tomato:FF6347;turquoise:40E0D0;violet:EE82EE;wheat:F5DEB3;white:FFFFFF;whitesmoke:F5F5F5;yellow:FFFF00;yellowgreen:9ACD32', '#');
function fUtilities_parseCssValue(sValue) {
	// TODO: Process rgba colors
	if (!sValue)
		return null;

	// trim spaces
	sValue	= sValue.trim();

	var aValue,
		nIndex,
		sValueLower = sValue.toLowerCase();

	// if standard color used
	if (sValueLower in hUtilities_cssColors)
		sValue	= hUtilities_cssColors[sValueLower];

	// #rgb or #rrggbb
	if (sValue == "transparent")
		return [[1, 1, 1], '#', ''];
	if (aValue = sValue.match(/^#([\da-f]{3})$/i))
		return [[fParseInt(aValue[1].substr(0, 1), 16) / 15, fParseInt(aValue[1].substr(1, 1), 16) / 15, fParseInt(aValue[1].substr(2, 1), 16) / 15], '#', ''];
	if (aValue = sValue.match(/^#([\da-f]{6})$/i))
		return [[fParseInt(aValue[1].substr(0, 2), 16) / 255, fParseInt(aValue[1].substr(2, 2), 16) / 255, fParseInt(aValue[1].substr(4, 2), 16) / 255], '#', ''];
	if (aValue = sValue.match(/^(\w+[\w\d]+)\((.+)\)$/)) {
		var sFunction	= aValue[1],
			sParameters	= aValue[2];
		if (aValue[1] == "rgb") {
			if (aValue = sParameters.match(/^(\d+),\s*(\d+),\s*(\d+)$/))
				return [[aValue[1] / 255, aValue[2] / 255, aValue[3] / 255], '#', ''];
			else
			if (aValue = sParameters.match(/^(\d+)%,\s*(\d+)%,\s*(\d+)%$/))
				return [[aValue[1] / 100, aValue[2] / 100, aValue[3] / 100], '#', ''];
		}
		else {
			if (aValue = sParameters.split(/\s*,\s*/g)) {
				for (var nIndex = 0, oValue, oValueOut = [[], '', '']; nIndex < aValue.length; nIndex++)
					if (oValue = fUtilities_parseCssValue(aValue[nIndex]))
						oValueOut[0].push(oValue[0]);
				oValueOut[2]	= sFunction;
				if (oValueOut[0].length)
					return oValueOut;
			}
		}
	}
	// +-ValueUnit
	if (aValue = sValue.match(/^([+-]?\d*.?\d+)(em|ex|px|in|cm|mm|pt|pc|%)?$/))
		return [cNumber(aValue[1]), aValue[2] || '', ''];
	// List of values
	if (sValue.indexOf(' ') > 0 &&(aValue = sValue.split(' '))) {
		for (var nIndex = 0, oValue, oValueOut = [[], '', '']; nIndex < aValue.length; nIndex++) {
			if (oValue = fUtilities_parseCssValue(aValue[nIndex])) {
				oValueOut[0].push(oValue[0]);
				oValueOut[1]	= oValue[1];
			}
		}
		if (oValueOut[0].length)
			return oValueOut;
	}
	//
	return [sValue, '', ''];
};

function fUtilities_sumCssValues(oValue1, oValue2) {
	if (oValue1[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue1[0].length; nIndex++)
			aValue.push(oValue1[0][nIndex] + oValue2[0][nIndex]);
		return [aValue, oValue1[1], oValue1[2]];
	}
	else
		return [oValue1[0] + oValue2[0], oValue1[1], oValue1[2]];
};

function fUtilities_subCssValues(oValue1, oValue2) {
	if (oValue1[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue1[0].length; nIndex++)
			aValue.push(oValue1[0][nIndex] - oValue2[0][nIndex]);
		return [aValue, oValue1[1], oValue1[2]];
	}
	else
		return [oValue1[0] - oValue2[0], oValue1[1], oValue1[2]];
};

function fUtilities_mulCssValue(oValue, nTimes) {
	if (oValue[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue[0].length; nIndex++)
			aValue.push(oValue[0][nIndex] * nTimes);
		return [aValue, oValue[1], oValue[2]];
	}
	else
		return [oValue[0] * nTimes, oValue[1], oValue[2]];
};

function fUtilities_stringToHash(sValue, sPrefix) {
	for (var hValue = {}, aValues = sValue.split(';'), nIndex = 0, nLength = aValues.length, aValue; nIndex < nLength; nIndex++)
		hValue[(aValue = aValues[nIndex].split(':'))[0]]	=(sPrefix || '') + aValue[1];
	return hValue;
};

function fUtilities_numberToHex(nValue, nLength/* =2 */) {
	var sValue	= cMath.abs(cMath.floor(nValue)).toString(16);
	if (!nLength)
		nLength	= 2;
	if (sValue.length < nLength)
		sValue	= cArray(nLength + 1 - sValue.length).join('0') + sValue;
	return sValue;
};
