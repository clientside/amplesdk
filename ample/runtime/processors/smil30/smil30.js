/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLSMIL30_implementation	= {},
	sAMLSMIL30_namespaceURI		= "http://www.w3.org/2008/SMIL30/",
	aAMLSMIL30_elements			= [],
	aAMLSMIL30_activeElements	= [],
	nAMLSMIL30_timeline			= 0,
	nAMLSMIL30_timeout			= 10,	// This is a timeout, not interval
	hAMLSMIL30_multipliers		= {'h': 3600, 'min': 60, 's': 1},
	hAMLSMIL30_colors			= fAML_stringToHash('aliceblue:F0F8FF;antiquewhite:FAEBD7;aqua:00FFFF;aquamarine:7FFFD4;azure:F0FFFF;beige:F5F5DC;bisque:FFE4C4;black:000000;blanchedalmond:FFEBCD;blue:0000FF;blueviolet:8A2BE2;brown:A52A2A;burlywood:DEB887;cadetblue:5F9EA0;chartreuse:7FFF00;chocolate:D2691E;coral:FF7F50;cornflowerblue:6495ED;cornsilk:FFF8DC;crimson:DC143C;cyan:00FFFF;darkblue:00008B;darkcyan:008B8B;darkgoldenrod:B8860B;darkgray:A9A9A9;darkgreen:006400;darkkhaki:BDB76B;darkmagenta:8B008B;darkolivegreen:556B2F;darkorange:FF8C00;darkorchid:9932CC;darkred:8B0000;darksalmon:E9967A;darkseagreen:8FBC8F;darkslateblue:483D8B;darkslategray:2F4F4F;darkturquoise:00CED1;darkviolet:9400D3;deeppink:FF1493;deepskyblue:00BFFF;dimgray:696969;dodgerblue:1E90FF;firebrick:B22222;floralwhite:FFFAF0;forestgreen:228B22;fuchsia:FF00FF;gainsboro:DCDCDC;ghostwhite:F8F8FF;gold:FFD700;goldenrod:DAA520;gray:808080;green:008000;greenyellow:ADFF2F;honeydew:F0FFF0;hotpink:FF69B4;indianred:CD5C5C;indigo:4B0082;ivory:FFFFF0;khaki:F0E68C;lavender:E6E6FA;lavenderblush:FFF0F5;lawngreen:7CFC00;lemonchiffon:FFFACD;lightblue:ADD8E6;lightcoral:F08080;lightcyan:E0FFFF;lightgoldenrodyellow:FAFAD2;lightgreen:90EE90;lightgrey:D3D3D3;lightpink:FFB6C1;lightsalmon:FFA07A;lightseagreen:20B2AA;lightskyblue:87CEFA;lightslategray:778899;lightsteelblue:B0C4DE;lightyellow:FFFFE0;lime:00FF00;limegreen:32CD32;linen:FAF0E6;magenta:FF00FF;maroon:800000;mediumaquamarine:66CDAA;mediumblue:0000CD;mediumorchid:BA55D3;mediumpurple:9370DB;mediumseagreen:3CB371;mediumslateblue:7B68EE;mediumspringgreen:00FA9A;mediumturquoise:48D1CC;mediumvioletred:C71585;midnightblue:191970;mintcream:F5FFFA;mistyrose:FFE4E1;moccasin:FFE4B5;navajowhite:FFDEAD;navy:000080;oldlace:FDF5E6;olive:808000;olivedrab:6B8E23;orange:FFA500;orangered:FF4500;orchid:DA70D6;palegoldenrod:EEE8AA;palegreen:98FB98;paleturquoise:AFEEEE;palevioletred:DB7093;papayawhip:FFEFD5;peachpuff:FFDAB9;peru:CD853F;pink:FFC0CB;plum:DDA0DD;powderblue:B0E0E6;purple:800080;red:FF0000;rosybrown:BC8F8F;royalblue:4169E1;saddlebrown:8B4513;salmon:FA8072;sandybrown:F4A460;seagreen:2E8B57;seashell:FFF5EE;sienna:A0522D;silver:C0C0C0;skyblue:87CEEB;slateblue:6A5ACD;slategray:708090;snow:FFFAFA;springgreen:00FF7F;steelblue:4682B4;tan:D2B48C;teal:008080;thistle:D8BFD8;tomato:FF6347;turquoise:40E0D0;violet:EE82EE;wheat:F5DEB3;white:FFFFFF;whitesmoke:F5F5F5;yellow:FFFF00;yellowgreen:9ACD32', '#');

oAMLSMIL30_implementation.traverse	= function(oElementDOM, oNode) {
	var oParent = arguments.length > 2 ? arguments[2] : null,
		oElement;
	switch (oElementDOM.localName || oElementDOM.baseName) {
		case "set":
		case "animate":
		case "animateColor":
		case "animateMotion":
			oElement	= fAMLSMIL30_createElement(
								fAMLSMIL30_getAnimation(oElementDOM),
								fAMLSMIL30_getTime(oElementDOM)
							);
			// Set parent
			if (oParent) {
				oElement.parentNode	= oParent;
				oParent.childNodes.push(oElement);
			}

			//
			if (!oElement.animation.targetElement)
				oElement.animation.targetElement	= oNode;

			break;

		case "excl":
		case "par":
		case "seq":
			oElement	= fAMLSMIL30_createElement(
								null,
								fAMLSMIL30_getTime(oElementDOM)
							);
			// Set parent
			if (oParent) {
				oElement.parentNode	= oParent;
				oParent.childNodes.push(oElement);
			}

			for (var nIndex = 0, aElements = oElementDOM.childNodes; nIndex < aElements.length; nIndex++)
				if (aElements[nIndex].nodeType == 1 && aElements[nIndex].namespaceURI == sAMLSMIL30_namespaceURI)
					oAMLSMIL30_implementation.traverse(aElements[nIndex], oNode, oElement);

			break;
//->Debug
		default:
			fAML_warn(nAML_UNKNOWN_ELEMENT_NS_WRN, [oElementDOM.tagName, oElementDOM.namespaceURI]);
//<-Debug
	}

	//
	if (oElement) {
		var oTarget,
			oTime	= oElement.time,
			fBegin	= function() {
				fAMLSMIL30_beginElement(oElement);
			},
			fEnd	= function() {
				fAMLSMIL30_endElement(oElement);
			};

		// If event-based
		if (oTime.begin.event) {
			if (oTime.begin.element)
				oTarget	= oNode.ownerDocument.getElementById(oTime.begin.element);
			else
				oTarget	= oNode;
			//
			fAMLEventTarget_addEventListener(oTarget, oTime.begin.event, function() {
				if (oTime.begin.offset)
					fSetTimeout(fBegin, oTime.begin.offset);
				else
					fBegin();
			});
		}
		else
		if (oTime.begin.offset) {
			if (oTime.begin.offset)
				fSetTimeout(fBegin, oTime.begin.offset);
			else
				fBegin();
		};

		if (oTime.end.event) {
			if (oTime.end.element)
				oTarget	= oNode.ownerDocument.getElementById(oTime.begin.element);
			else
				oTarget	= oNode;
			//
			fAMLEventTarget_addEventListener(oTarget, oTime.end.event, function() {
				if (oTime.end.offset)
					fSetTimeout(fEnd, oTime.end.offset);
				else
					fEnd();
			});
		}

		// Add element
		fAMLSMIL30_addElement(oElement);
	}
};

function fAMLSMIL30_getTime(oElementDOM) {
	var oTime	= {};
	//
	oTime.type		= oElementDOM.localName ||oElementDOM.baseName;

	// Timing and Synchronization
	oTime.begin			= fAMLSMIL30_parseDate(oElementDOM.getAttribute("begin"));
	oTime.end			= fAMLSMIL30_parseDate(oElementDOM.getAttribute("end"));
	oTime.dur			= fAMLSMIL30_parseDuration(oElementDOM.getAttribute("dur"));
	// Repeatition
	oTime.repeatCount	= fAMLSMIL30_parseFloat(oElementDOM.getAttribute("repeatCount"), 1);
	oTime.repeatDur		= fAMLSMIL30_parseDuration(oElementDOM.getAttribute("repeatDur"));
	// Time Manipulations
	oTime.autoReverse	= oElementDOM.getAttribute("autoReverse") == "true";
	oTime.accelerate	= fAMLSMIL30_parseFloat(oElementDOM.getAttribute("accelerate"), 0);
	oTime.decelerate	= fAMLSMIL30_parseFloat(oElementDOM.getAttribute("decelerate"), 0);
	oTime.speed			= fAMLSMIL30_parseFloat(oElementDOM.getAttribute("speed"), 1);

	return oTime;
};

function fAMLSMIL30_getAnimation(oElementDOM) {
	var oAnimation	= {};
	//
	oAnimation.type		= oElementDOM.localName ||oElementDOM.baseName;

	// Target
	oAnimation.targetElement	= oElementDOM.getAttribute("targetElement");
	oAnimation.attributeName	= oElementDOM.getAttribute("attributeName");
	oAnimation.attributeType	= oElementDOM.getAttribute("attributeType");
	// Simple Animation
	oAnimation.from			= fAMLSMIL30_parseValue(oElementDOM.getAttribute("from"));
	oAnimation.to			= fAMLSMIL30_parseValue(oElementDOM.getAttribute("to"));
	oAnimation.by			= fAMLSMIL30_parseValue(oElementDOM.getAttribute("by"));
	oAnimation.values		= fAMLSMIL30_parseValues(oElementDOM.getAttribute("values"));
	//
	oAnimation.calcMode		= oElementDOM.getAttribute("calcMode");
	// Fill
	oAnimation.fill			= oElementDOM.getAttribute("fill");
	// Additive and Cumulative animation
	oAnimation.additive		= oElementDOM.getAttribute("additive");		// sum|replace, "replace" is default
	oAnimation.accumulate	= oElementDOM.getAttribute("accumulate");	// sum|none, "none" is default

	return oAnimation;
};

//
function fAMLSMIL30_createElement(oAnimation, oTime) {
	var oElement	= {};
	oElement.animation	= oAnimation;
	oElement.time		= oTime;
	oElement.parentNode	= null;
	oElement.childNodes	= [];

	return oElement;
};

//
function fAMLSMIL30_addElement(oElement) {
	// Add element to timeline
	aAMLSMIL30_elements.push(oElement);
};

function fAMLSMIL30_removeElement(oElement) {
	// Remove element from timeline
	for (var nIndex = 0, bFound = false; nIndex < aAMLSMIL30_elements.length; nIndex++)
		if (bFound)
			aAMLSMIL30_elements[nIndex - 1]	= aAMLSMIL30_elements[nIndex];
		else
		if (aAMLSMIL30_elements[nIndex] == oElement)
			bFound	= true;
	if (bFound)
		aAMLSMIL30_elements.length--;
};

// Parse functions
function fAMLSMIL30_parseFloat(sValue, nDefault) {
	return fIsNaN(sValue = fParseFloat(sValue)) ? nDefault : sValue;
};

/*
	Clock-value         ::= ( Full-clock-value | Partial-clock-value | Timecount-value )
	Full-clock-value    ::= Hours ":" Minutes ":" Seconds ("." Fraction)?
	Partial-clock-value ::= Minutes ":" Seconds ("." Fraction)?
	Timecount-value     ::= Timecount ("." Fraction)? (Metric)?
	Metric              ::= "h" | "min" | "s" | "ms"
	Hours               ::= DIGIT+ // any positive number
	Minutes             ::= 2DIGIT // range from 00 to 59
	Seconds             ::= 2DIGIT // range from 00 to 59
	Fraction            ::= DIGIT+
	Timecount           ::= DIGIT+
	2DIGIT              ::= DIGIT DIGIT
	DIGIT               ::= [0-9]
*/

// Clock-value: /^(?:(\d+):)?([0-5]\d):([0-5]\d)(.\d+)?$/
// Timecount-value: /^(\d+)(.\d+)?(h|min|s|ms)$/
function fAMLSMIL30_parseDate(sValue) {
	var oDate	= {},
		bOffsetPositive	= true,
		aValue;
	if (!sValue || sValue == "indefinite")
		oDate.time	= nInfinity;
	else
	// Wallclock
	if (aValue = sValue.match(/^wallclock\(.+\)$/))
		oDate.time	= null;
	// Event and/or Offset
	else {
		// Event
		if (aValue = sValue.match(/^(?:(\w+)\.)?(\w+)/)) {
			oDate.element	= aValue[1];
			oDate.event		= aValue[2];
			// remove from the value
			sValue	= sValue.replace(aValue[0], '');
		}
		else {
			oDate.element	= null;
			oDate.event		= null;
		}

		if (aValue = sValue.match(/^([+-])/)) {
			bOffsetPositive	= aValue[1] == "+";
			// remove from the value
			sValue	= sValue.replace(aValue[0], '');
		}

		// Offset
		// clock-value
		if (aValue = sValue.match(/^(?:(\d+):)?([0-5]\d):([0-5]\d)(.\d+)?$/))
			oDate.offset	= (bOffsetPositive ? 1 :-1) * ((aValue[1] ? aValue[1] * hAMLSMIL30_multipliers['h'] : 0) + aValue[2] * hAMLSMIL30_multipliers['min'] + aValue[3] * hAMLSMIL30_multipliers['s']) * 1000 + (aValue[4] ? aValue[4] : 0);
		else
		// Timecount-value
		if (aValue = sValue.match(/^(\d+)(.\d+)?(h|min|s|ms)$/))
			oDate.offset	= (bOffsetPositive ? 1 :-1) * (aValue[1] * 1 + (aValue[2] ? aValue[2] * 1 : 0)) * (aValue[3] == "ms" ? 1 : 1000 * hAMLSMIL30_multipliers[aValue[3]]);
		else
			oDate.offset	= 0;
	}
	return oDate;
};

function fAMLSMIL30_parseDuration(sValue) {
	var aValue;
	if (!sValue || sValue == "indefinite")
		return nInfinity;
	else
	// clock-value
	if (aValue = sValue.match(/^(?:(\d+):)?([0-5]\d):([0-5]\d)(.\d+)?$/))
		return ((aValue[1] ? aValue[1] * hAMLSMIL30_multipliers['h'] : 0) + aValue[2] * hAMLSMIL30_multipliers['min'] + aValue[3] * hAMLSMIL30_multipliers['s']) * 1000 + (aValue[4] ? aValue[4] : 0);
	else
	// Timecount-value
	if (aValue = sValue.match(/^(\d+)(.\d+)?(h|min|s|ms)$/))
		return (aValue[1] * 1 + (aValue[2] ? aValue[2] * 1 : 0)) * (aValue[3] == "ms" ? 1 : 1000 * hAMLSMIL30_multipliers[aValue[3]]);
	else
		return nInfinity;
};

function fAMLSMIL30_parseValues(sValue) {
	if (!sValue)
		return [];

	for (var nIndex = 0, aValuesRaw	= sValue.split(';'), aValues = [], oValue; nIndex < aValuesRaw.length; nIndex++)
		if (oValue = fAMLSMIL30_parseValue(aValuesRaw[nIndex]))
			aValues.push(oValue);
	return aValues;
};

// TODO: Process rgba colors
function fAMLSMIL30_parseValue(sValue) {
	if (!sValue)
		return null;

	// trim spaces
	sValue	= sValue.trim();

	var aValue,
		nIndex,
		sValueLower = sValue.toLowerCase();

	// if standard color used
	if (sValueLower in hAMLSMIL30_colors)
		sValue	= hAMLSMIL30_colors[sValueLower];

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
					if (oValue = fAMLSMIL30_parseValue(aValue[nIndex]))
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
			if (oValue = fAMLSMIL30_parseValue(aValue[nIndex])) {
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

function fAMLSMIL30_onLoad(oEvent) {
	nAMLSMIL30_timeline	= fSetTimeout(fAMLSMIL30_onTimeline, nAMLSMIL30_timeout);
};

function fAMLSMIL30_onUnLoad() {
	fClearTimeout(nAMLSMIL30_timeline);
};

// Attaching to implementation
oAML_document.$time	= aAMLSMIL30_elements;

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAML_document, "load",	fAMLSMIL30_onLoad, false);
fAMLEventTarget_addEventListener(oAML_document, "unload", fAMLSMIL30_onUnLoad, false);

// register processor
oAML_processors[sAMLSMIL30_namespaceURI]	= oAMLSMIL30_implementation;
