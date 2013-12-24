/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//->Debug
var sGUARD_XML_SYNTAX_WRN				= 'Not well-formed XML',
	sGUARD_JSON_SYNTAX_WRN				= 'JSON syntax error: %0',
	sGUARD_JAVASCRIPT_SYNTAX_WRN		= 'JavaScript syntax error: %0',
	sGUARD_NOT_UNIQUE_ID_WRN			= 'Duplicate ID attribute value "%0" used',
	sGUARD_NOT_FOUND_SHADOW_WRN			= 'Shadow content was not found. Element "%0" queried for pseudo-element "%1"',
	sGUARD_FEATURE_DEPRECATED_WRN		= 'Feature "%0" had been deprecated. Use "%1" instead',
	sGUARD_UNKNOWN_ELEMENT_NS_WRN		= 'Element "%0" definition is missing from "%1" namespace. Element processing skipped',
	sGUARD_UNKNOWN_ATTRIBUTE_NS_WRN		= 'Attribute "%0" definition is missing from "%1" namespace. Attribute processing skipped',
	sGUARD_INVALID_ATTRIBUTE_WRN		= 'Attribute "%0" value "%1" is invalid. Element processing skipped',
	sGUARD_ERROR_ANIMATING_ATTR_WRN		= 'Error animating "%0" atttribute with "%1" value',
	sGUARD_DOCUMENT_INVALID_STATE_WRN	= 'Document invalid state',
	sGUARD_REWRITING_MEMBER_WRN			= 'Re-writing member "%0"',
	sGUARD_QUERYING_PSEUDOELEMENT_WRN	= 'Querying for pseudo-elements is not supported',
	sGUARD_NOT_FOUND_LOCALE_WRN			= 'Locale "%0" was not found',
	sGUARD_CONFIGURATION_READONLY_WRN	= 'Configuration parameter "%0" is readonly. Value has not been set';

function fUtilities_warn(sWarning, aArguments) {
	var fErrorHandler	= oDOMConfiguration_values["error-handler"];
	if (fErrorHandler) {
		var oError	= new cDOMError(fAmpleException_format(sWarning, aArguments || []), cDOMError.SEVERITY_WARNING);
		if (typeof fErrorHandler == "function")
			fErrorHandler(oError);
		else
		if (typeof fErrorHandler.handleError == "function")
			fErrorHandler.handleError(oError);
	}
};
//<-Debug

var hUtilities_uriCache	= {};
/*
 * Returns an array of uri components:
 * [scheme, authority, path, query, fragment]
 */
function fUtilities_getUriComponents(sUri) {
	var aResult	= hUtilities_uriCache[sUri] ||(hUtilities_uriCache[sUri] = sUri.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?/));
	return [aResult[1], aResult[3], aResult[5], aResult[6], aResult[8]];
};

function fUtilities_resolveUri(sUri, sBaseUri) {
	if (sUri == '' || sUri.charAt(0) == '#')
		return sBaseUri;

	var aUri	= fUtilities_getUriComponents(sUri);
	if (aUri[0])	// scheme
		return sUri;

	var aBaseUri	= fUtilities_getUriComponents(sBaseUri);
	aUri[0]	= aBaseUri[0];	// scheme

	if (!aUri[1]) {
		// authority
		aUri[1]	= aBaseUri[1];

		// path
		if (aUri[2].charAt(0) != '/') {
			var aUriSegments		= aUri[2].split('/'),
				aBaseUriSegments	= aBaseUri[2].split('/');
			aBaseUriSegments.pop();

			var nBaseUriStart	= aBaseUriSegments[0] == '' ? 1 : 0;
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

	var aResult	= [];
	if (aUri[0])
		aResult.push(aUri[0]);
	if (aUri[1])	// '//'
		aResult.push(aUri[1]);
	if (aUri[2])
		aResult.push(aUri[2]);
	if (aUri[3])	// '?'
		aResult.push(aUri[3]);
	if (aUri[4])	// '#'
		aResult.push(aUri[4]);

	return aResult.join('');
};

function fUtilities_encodeXMLCharacters(sValue) {
	return sValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
};

function fUtilities_decodeXMLCharacters(sValue) {
	return sValue.replace(/&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
};

function fUtilities_translateStyleSheet(sCSS, sUri) {
	var nIndex,
		nLength,
		aMatch,
		aValue;

	// 1. Remove namespace declarations
	if (aMatch = sCSS.match(/@namespace\s+([\w-]+\s+)?(url\()?(['"])?[^'";\s]+(['"])?\)?;?/g))
		for (nIndex = 0, nLength = aMatch.length; nIndex < nLength; nIndex++)
			sCSS	= sCSS.replace(aMatch[nIndex], '');

	// 2. Rewrite Relative URLs
	if (aMatch = sCSS.match(/url\s*\([^\)]+\)/g))
		for (nIndex = 0, nLength = aMatch.length; nIndex < nLength; nIndex++)
			if (aValue = aMatch[nIndex].match(/url\s*\(['"]?([^\)"']+)['"]?\)/i))
				sCSS	= sCSS.replace(aMatch[nIndex], "url" + '("' + fUtilities_resolveUri(aValue[1], sUri) + '")');

	// Process variables
	if (aMatch = sCSS.match(/@var\s+([^\s]+)\s+(?:['"]([^'"]+)['"]|([^\s;]+))\s*;?/g))
		for (nIndex = 0, nLength = aMatch.length; nIndex < nLength; nIndex++)
			if (aValue = aMatch[nIndex].match(/@var\s+([^\s]+)\s+(?:['"]([^'"]+)['"]|([^\s;]+))\s*;?/)) {
				// Apply variables
				sCSS	= sCSS.replace('$' + aValue[1], aValue[2] || aValue[3]);

				// Remove variable declarations
				sCSS	= sCSS.replace(aMatch[nIndex], '');
			}

	// 3. Process imports
	if (aMatch = sCSS.match(/@import\s+url\s*\(\s*['"]?[^'"]+['"]?\s*\)\s*;?/g))
		for (nIndex = 0, nLength = aMatch.length; nIndex < nLength; nIndex++)
			if (aValue = aMatch[nIndex].match(/url\s*\(['"]?([^\)"']+)['"]?\)/i))
				sCSS	= sCSS.replace(aMatch[nIndex], fUtilities_translateStyleSheet(fBrowser_load(aValue[1], "text/css").responseText, aValue[1]));

	var sPrefix	= bPresto ? 'o' : bGecko ? "moz" : bTrident ? "ms" : "webkit",
		sBefore	= '$1$2$3-',
		sAfter	= '-$1$2$3',
		sValue	= sBefore + sPrefix + sAfter;

	// Rewrite transitions, animations and transform
	sCSS	= sCSS.replace(/(?:\s|;)(transition\-?\w*\s*:\s*)(.+)(\n|;)/gi, sValue);
	sCSS	= sCSS.replace(/(?:\s|;)(transform\-?\w*\s*:\s*)(.+)(\n|;)/gi, sValue);

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
		// Rewrite text-overflow
		sCSS	= sCSS
					.replace(/(?:\s|;)(text-overflow\s*:\s*)(.+)(\n|;)/gi, sValue);
		//
		if (!bPresto) {
			// Rewrite box-shadow
			sCSS	= sCSS
						.replace(/(?:\s|;)(box-shadow\s*:\s*)(.+)(\n|;)/gi, sValue)
						.replace(/(?:\s|;)(outline-radius\s*:\s*)(.+)(\n|;)/gi, sValue)
						.replace(/(?:\s|;)(border-radius\s*:\s*)(.+)(\n|;)/gi, sValue);
			if (bGecko) {
				// Rewrite box-sizing
				sCSS	= sCSS.replace(/(?:\s|;)(box-sizing\s*:\s*)(.+)(\n|;)/gi, sValue);
				// Rewrite border-radius
				sBefore	= sBefore + sPrefix + '-border-radius-';
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
	if (aMatch = sCSS.match(/[^{]+{[^}]*}/g)) {
		var aCSS	= [];
		for (nIndex = 0, nLength = aMatch.length; nIndex < nLength; nIndex++) {
			if (aValue = aMatch[nIndex].match(/([^{]+)({[^}]*})/))
				aCSS.push(aValue[1]
//						.replace(/([\s>+~,])(?:([\w]+)\|)?([\w]+)/g, '$1.$2-$3')		// Element
						.replace(/\|/g, '-')							// Namespace
						.replace(/(^|[\s>+~,]|not\()([\w-])/g, '$1.$2')	// Element
						.replace(/\[([\w-]+)=?([\w-]+)?\]/g, '-$1-$2')	// Attribute
						.replace(/::/g, '--')							// Pseudo-element
						.replace(/:nth-child\((\d+)\)/g, '_nth-child-$1')	// Pseudo-class nth-child
						.replace(/:(?!last-child|first-child|not)/g, '.')	// Pseudo-class
//						.replace(/>/g, '--' + "gateway" + '>').replace(/(--gateway){2,}/g, '--' + "gateway")// > selector
						,
						aValue[2]);
		}
		sCSS	= aCSS.join('');
	}

	return sCSS;
};

function fUtilities_toCssPropertyName(sName) {
	for (var nIndex = 1, aValue = sName.split('-'); nIndex < aValue.length; nIndex++)
		aValue[nIndex]	= aValue[nIndex].substr(0, 1).toUpperCase() + aValue[nIndex].substr(1);
	return aValue.join('');
};

function fUtilities_stringToHash(sValue, sPrefix) {
	for (var hValue = {}, aValues = sValue.split(';'), nIndex = 0, nLength = aValues.length, aValue; nIndex < nLength; nIndex++)
		hValue[(aValue = aValues[nIndex].split(':'))[0]]	=(sPrefix || '') + aValue[1];
	return hValue;
};
