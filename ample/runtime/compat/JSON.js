/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!oJSON) {
	oJSON	= new cObject;

	var rCx	= /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		rEscapable	= /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
		sGap,
		sIndent,
		hMeta	= {	// table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
		},
		vRep;

	function fQuote(sValue) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

		rEscapable.lastIndex	= 0;
		return rEscapable.test(sValue) ?
			'"' + sValue.replace(rEscapable, function (a) {
				var c	= hMeta[a];
				return typeof c == "string" ? c :
					'\\u' + ("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' :
			'"' + sValue + '"';
	};

	function fStr(sKey, oHolder) {

// Produce a string from holder[key].

		var i,			// The loop counter.
			k,			// The member key.
			v,			// The member value.
			nLength,
			sMind	= sGap,
			aPartial,
			vValue	= oHolder[sKey];

// If the value has a toJSON method, call it to obtain a replacement value.

		if (vValue && typeof vValue == "object" &&
				typeof vValue.toJSON == "function") {
			vValue	= vValue.toJSON(sKey);
		}

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

		if (typeof vRep == "function") {
			vValue	= vRep.call(oHolder, sKey, vValue);
		}

// What happens next depends on the value's type.

		switch (typeof vValue) {
		case "string":
			return fQuote(vValue);

		case "number":

// JSON numbers must be finite. Encode non-finite numbers as null.

			return fIsFinite(vValue) ? cString(vValue) : "null";

		case "boolean":
		case "null":

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce "null". The case is included here in
// the remote chance that this gets fixed someday.

			return cString(vValue);

// If the type is "object", we might be dealing with an object or an array or
// null.

		case "object":

// Due to a specification blunder in ECMAScript, typeof null is "object",
// so watch out for that case.

			if (!vValue) {
				return "null";
			}

// Make an array to hold the partial results of stringifying this object value.

			sGap += sIndent;
			aPartial	= [];

// Is the value an array?

			if (cObject.prototype.toString.call(vValue) == '[' + "object" + ' ' + "Array" + ']') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

				nLength	= vValue.length;
				for (i = 0; i < nLength; i += 1) {
					aPartial[i]	= fStr(i, vValue) || "null";
				}

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

				v	= aPartial.length === 0 ? '[]' :
					sGap ? '[\n' + sGap +
							aPartial.join(',\n' + sGap) + '\n' +
								sMind + ']' :
							'[' + aPartial.join(',') + ']';
				sGap	= sMind;
				return v;
			}

// If the replacer is an array, use it to select the members to be stringified.

			if (vRep && typeof vRep == "object") {
				nLength	= vRep.length;
				for (i = 0; i < nLength; i += 1) {
					k	= vRep[i];
					if (typeof k == "string") {
						v	= fStr(k, vValue);
						if (v) {
							aPartial.push(fQuote(k) + (sGap ? ': ' : ':') + v);
						}
					}
				}
			} else {

// Otherwise, iterate through all of the keys in the object.

				for (k in vValue) {
					if (cObject.hasOwnProperty.call(vValue, k)) {
						v	= fStr(k, vValue);
						if (v) {
							aPartial.push(fQuote(k) + (sGap ? ': ' : ':') + v);
						}
					}
				}
			}

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

			v	= aPartial.length === 0 ? '{}' :
				sGap ? '{\n' + sGap + aPartial.join(',\n' + sGap) + '\n' +
						sMind + '}' : '{' + aPartial.join(',') + '}';
			sGap	= sMind;
			return v;
		}
	};

// If the JSON object does not yet have a stringify method, give it one.

	oJSON.stringify	= function (vValue, vReplacer, vSpace) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

		var i;
		sGap	= '';
		sIndent	= '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

		if (typeof vSpace == "number") {
			for (i = 0; i < vSpace; i += 1) {
				sIndent += ' ';
			}

// If the space parameter is a string, it will be used as the indent string.

		} else if (typeof vSpace == "string") {
			sIndent	= vSpace;
		}

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

		vRep	= vReplacer;
		if (vReplacer && typeof vReplacer != "function" &&
				(typeof vReplacer != "object" ||
				typeof vReplacer.length != "number")) {
			throw new cError("JSON" + '.' + "stringify");
		}

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

		return fStr('', {'': vValue});
	};


// If the JSON object does not yet have a parse method, give it one.

	oJSON.parse	= function(sText, fReviver) {
//->Guard
		fGuard(arguments, [
			["string",	cString],
			["reviver", cFunction, true]
		]);
//<-Guard

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

		var j;

		function fWalk(oHolder, sKey) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

			var k, v, vValue	= oHolder[sKey];
			if (vValue && typeof vValue == "object") {
				for (k in vValue) {
					if (cObject.hasOwnProperty.call(vValue, k)) {
						v	= fWalk(vValue, k);
						if (typeof v != "undefined") {
							vValue[k]	= v;
						} else {
							delete vValue[k];
						}
					}
				}
			}
			return fReviver.call(oHolder, sKey, vValue);
		};


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

		rCx.lastIndex	= 0;
		if (rCx.test(sText)) {
			sText	= sText.replace(rCx, function (a) {
				return '\\u' +
					("0000" + a.charCodeAt(0).toString(16)).slice(-4);
			});
		}

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

		if (/^[\],:{}\s]*$/.
test(sText.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

			j	= fEval('(' + sText + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

			return typeof fReviver == "function" ?
				fWalk({'': j}, '') : j;
		}

// If the text is not JSON parseable, then a SyntaxError is thrown.

		throw new cSyntaxError("JSON" + '.' + "parse");
	};

	//
	fExporter_export(oJSON,	"JSON",	window);
};

// Non-standard
if (!cString.prototype.toJSON)
	fExporter_export(function() {
		return this.valueOf();
	}, "toJSON", cString.prototype);

if (!cNumber.prototype.toJSON)
	fExporter_export(function() {
		return this.valueOf();
	}, "toJSON", cNumber.prototype);

if (!cBoolean.prototype.toJSON)
	fExporter_export(function() {
		return this.valueOf();
	}, "toJSON", cBoolean.prototype);
