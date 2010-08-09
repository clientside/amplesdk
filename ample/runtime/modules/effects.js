/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oAMLElementAnimation_durations	= {},
	aAMLElementAnimation_effects	= [];			// Variables

oAMLElementAnimation_durations["fast"]	= 300;
oAMLElementAnimation_durations["slow"]	= 600;

//
cAMLQuery.prototype.animate	= function(oProperties, vSpeed, sEasing, fCallback) {
	// Validate API call
	fGuard(arguments, [
		["properties",	cObject, true],
		["speed",		cObject, true],
		["easing",		cString, true],
		["callback",	cFunction, true]
	]);

	if (this.length)
		fAMLQuery_play(this[0], oProperties, vSpeed, sEasing, fCallback);

	// Invoke implementation
	return this;
};

cAMLQuery.prototype.stop	= function() {
	// TODO

	return this;
};



function fAMLQuery_play(oElement, oProperties, vDuration, vType, fHandler, sPseudo)
{
	// initialize effect
	var oEffect	= {},
		nEffect	= aAMLElementAnimation_effects.length,
		oElementDOM	= oElement.$getContainer(sPseudo),
		oStyle	= fBrowser_getComputedStyle(oElementDOM);
	oEffect._element	= oElement;
	oEffect._container	= oElementDOM;
	oEffect._duration	= oAMLElementAnimation_durations[vDuration || "fast"] || vDuration;
	oEffect._callback	= fHandler;
	oEffect._type		= vType || '';
	oEffect._start		= new cDate;
	oEffect._data		= {};
	oEffect._interval	= fSetInterval(function(){fAMLQuery_process(nEffect)}, 20);

	// read end params from input
	var sName;
	for (var sKey in oProperties)
		if (oProperties.hasOwnProperty(sKey))
			oEffect._data[sName = fUtilities_toCssPropertyName(sKey)]	= [fAmple_animate_parseValue(fAMLQuery_adjustStyleValue(oElementDOM, sName, fBrowser_getStyle(oElementDOM, sName, oStyle))), fAmple_animate_parseValue(fAMLQuery_adjustStyleValue(oElementDOM, sName, '' + oProperties[sKey]))];

	// delete running effects on new effect properties for the same element
	for (var nIndex = 0, oEffectOld; nIndex < aAMLElementAnimation_effects.length; nIndex++)
		if ((oEffectOld = aAMLElementAnimation_effects[nIndex]) && oEffectOld._element == oElement)
			for (var sKey in oEffectOld._data)
				if (oEffectOld._data.hasOwnProperty(sKey) && oEffect._data[sKey])
					delete oEffectOld._data[sKey];

	var oEventEffectStart	= new cAMLEvent;
	oEventEffectStart.initEvent("effectstart", false, false);
	fAMLNode_dispatchEvent(oElement, oEventEffectStart);

	// return effect resource identificator
	return aAMLElementAnimation_effects.push(oEffect);
};

function fAMLQuery_stop(nEffect)
{
	var oEffect	= aAMLElementAnimation_effects[nEffect];
	if (!oEffect)
		return;

	var oData,
		aValue;
	for (var sKey in oEffect._data)
		if (oEffect._data.hasOwnProperty(sKey))
		{
			oData	= oEffect._data[sKey];
			aValue	= oData[1];
			// Color value
			if (aValue && aValue[1] == '#')
				aValue	= ['#', fUtilities_numberToHex(aValue[0][0] * 255) + fUtilities_numberToHex(aValue[0][1] * 255) + fUtilities_numberToHex(aValue[0][2] * 255)];
			else
			if (sKey == "backgroundPosition")
				aValue	= [aValue[0][0], aValue[1], ' ', aValue[0][1], aValue[1]];
			//
			fBrowser_setStyle(oEffect._container, sKey, aValue.join(''));
		}

	var oEventEffectEnd	= new cAMLEvent;
	oEventEffectEnd.initEvent("effectend", false, false);
	fAMLNode_dispatchEvent(oEffect._element, oEventEffectEnd);

	// clear effect
	fAMLQuery_clear(nEffect);
};

function fAMLQuery_process(nEffect)
{
	var oEffect	= aAMLElementAnimation_effects[nEffect],
		nDuration	= oEffect._duration;
		oEffect._timestamp	= new cDate;

	// clear effect if node was removed
	if (!oAMLDocument_all[oEffect._element.uniqueID])
		return fAMLQuery_clear(nEffect);

	// stop effect if the time is up
	if (oEffect._duration <= oEffect._timestamp - oEffect._start) {
		fAMLQuery_stop(nEffect);
		if (oEffect._callback)
			oEffect._callback.call(oEffect._element);
		return;
	}

	// calculate current ratio
	var nRatio	= 0;
	if (oEffect._duration)
	{
		var nRatioRaw	=(oEffect._timestamp - oEffect._start) / nDuration;
		if (oEffect._type instanceof cFunction)
			nRatio	= oEffect._type(nRatioRaw);
		else
		if (oEffect._type.indexOf("cubic-bezier") == 0) {
			// TODO
		}
		else {
			switch (oEffect._type) {
				case "linear":
					nRatio	= nRatioRaw;
					break;

				case "easein":
				case "ease-in":
					nRatio	= fAMLQuery_cubicBezier(nRatioRaw, 0.42, 0, 1, 1, nDuration);
					break;

				case "easeout":
				case "ease-out":
					nRatio	= fAMLQuery_cubicBezier(nRatioRaw, 0, 0, 0.58, 1.0, nDuration);
					break;

				case "easeinout":
				case "ease-in-out":
					nRatio	= fAMLQuery_cubicBezier(nRatioRaw, 0.42, 0, 0.58, 1.0, nDuration);
					break;

//				case "ease":
				default:
					nRatio	= fAMLQuery_cubicBezier(nRatioRaw, 0.25, 0.1, 0.25, 1.0, nDuration);
					break;
			}
		}
	}

	//
	var oData,
		aValue;
	for (var sKey in oEffect._data)
		if (oEffect._data.hasOwnProperty(sKey))
		{
			oData	= oEffect._data[sKey];
			aValue	= fAmple_animate_sumValue(oData[0], fAmple_animate_mulValue(fAmple_animate_subValue(oData[1], oData[0]), nRatio));
			// Color value
			if (aValue[1] == '#')
				aValue	= ['#', fUtilities_numberToHex(aValue[0][0] * 255) + fUtilities_numberToHex(aValue[0][1] * 255) + fUtilities_numberToHex(aValue[0][2] * 255)];
			else
			if (sKey == "backgroundPosition")
				aValue	= [aValue[0][0], aValue[1], ' ', aValue[0][1], aValue[1]];
			//
			fBrowser_setStyle(oEffect._container, sKey, aValue.join(''));
		}
};

function fAMLQuery_clear(nEffect)
{
	var oEffect	= aAMLElementAnimation_effects[nEffect];

	// clear interval
	fClearInterval(oEffect._interval);

	// delete effect
	aAMLElementAnimation_effects[nEffect]	= null;
};

// Utilities
function fAMLQuery_adjustStyleValue(oElementDOM, sName, sValue) {
	if (sName == "opacity")
		return sValue == '' ? '1' : sValue;
	else
	if (sName == "backgroundPosition")
		return(sValue == "0% 0%" || sValue == "none" || sValue == '')? "0px 0px" : sValue;
	else
	if (sName == "lineHeight") {
		if (bTrident && nVersion < 9 && sValue == "normal")
			return fBrowser_getStyle(oElementDOM, "fontSize");
		return sValue;
	}
	else
	if (sName.match(/border(.+)Width/))
		return sValue == "medium" ? '3px' : sValue;
	else
	if (sName.match(/top|left|bottom|right/i))
		return sValue == "auto" ? "0px" : sValue;
	return sValue;
};

var hUtilities_cssColors	= fUtilities_stringToHash('aliceblue:F0F8FF;antiquewhite:FAEBD7;aqua:00FFFF;aquamarine:7FFFD4;azure:F0FFFF;beige:F5F5DC;bisque:FFE4C4;black:000000;blanchedalmond:FFEBCD;blue:0000FF;blueviolet:8A2BE2;brown:A52A2A;burlywood:DEB887;cadetblue:5F9EA0;chartreuse:7FFF00;chocolate:D2691E;coral:FF7F50;cornflowerblue:6495ED;cornsilk:FFF8DC;crimson:DC143C;cyan:00FFFF;darkblue:00008B;darkcyan:008B8B;darkgoldenrod:B8860B;darkgray:A9A9A9;darkgreen:006400;darkkhaki:BDB76B;darkmagenta:8B008B;darkolivegreen:556B2F;darkorange:FF8C00;darkorchid:9932CC;darkred:8B0000;darksalmon:E9967A;darkseagreen:8FBC8F;darkslateblue:483D8B;darkslategray:2F4F4F;darkturquoise:00CED1;darkviolet:9400D3;deeppink:FF1493;deepskyblue:00BFFF;dimgray:696969;dodgerblue:1E90FF;firebrick:B22222;floralwhite:FFFAF0;forestgreen:228B22;fuchsia:FF00FF;gainsboro:DCDCDC;ghostwhite:F8F8FF;gold:FFD700;goldenrod:DAA520;gray:808080;green:008000;greenyellow:ADFF2F;honeydew:F0FFF0;hotpink:FF69B4;indianred:CD5C5C;indigo:4B0082;ivory:FFFFF0;khaki:F0E68C;lavender:E6E6FA;lavenderblush:FFF0F5;lawngreen:7CFC00;lemonchiffon:FFFACD;lightblue:ADD8E6;lightcoral:F08080;lightcyan:E0FFFF;lightgoldenrodyellow:FAFAD2;lightgreen:90EE90;lightgrey:D3D3D3;lightpink:FFB6C1;lightsalmon:FFA07A;lightseagreen:20B2AA;lightskyblue:87CEFA;lightslategray:778899;lightsteelblue:B0C4DE;lightyellow:FFFFE0;lime:00FF00;limegreen:32CD32;linen:FAF0E6;magenta:FF00FF;maroon:800000;mediumaquamarine:66CDAA;mediumblue:0000CD;mediumorchid:BA55D3;mediumpurple:9370DB;mediumseagreen:3CB371;mediumslateblue:7B68EE;mediumspringgreen:00FA9A;mediumturquoise:48D1CC;mediumvioletred:C71585;midnightblue:191970;mintcream:F5FFFA;mistyrose:FFE4E1;moccasin:FFE4B5;navajowhite:FFDEAD;navy:000080;oldlace:FDF5E6;olive:808000;olivedrab:6B8E23;orange:FFA500;orangered:FF4500;orchid:DA70D6;palegoldenrod:EEE8AA;palegreen:98FB98;paleturquoise:AFEEEE;palevioletred:DB7093;papayawhip:FFEFD5;peachpuff:FFDAB9;peru:CD853F;pink:FFC0CB;plum:DDA0DD;powderblue:B0E0E6;purple:800080;red:FF0000;rosybrown:BC8F8F;royalblue:4169E1;saddlebrown:8B4513;salmon:FA8072;sandybrown:F4A460;seagreen:2E8B57;seashell:FFF5EE;sienna:A0522D;silver:C0C0C0;skyblue:87CEEB;slateblue:6A5ACD;slategray:708090;snow:FFFAFA;springgreen:00FF7F;steelblue:4682B4;tan:D2B48C;teal:008080;thistle:D8BFD8;tomato:FF6347;turquoise:40E0D0;violet:EE82EE;wheat:F5DEB3;white:FFFFFF;whitesmoke:F5F5F5;yellow:FFFF00;yellowgreen:9ACD32', '#');
function fAmple_animate_parseValue(sValue) {
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
					if (oValue = fAmple_animate_parseValue(aValue[nIndex]))
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
			if (oValue = fAmple_animate_parseValue(aValue[nIndex])) {
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

function fAmple_animate_sumValue(oValue1, oValue2) {
	if (oValue1[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue1[0].length; nIndex++)
			aValue.push(oValue1[0][nIndex] + oValue2[0][nIndex]);
		return [aValue, oValue1[1], oValue1[2]];
	}
	else
		return [oValue1[0] + oValue2[0], oValue1[1], oValue1[2]];
};

function fAmple_animate_subValue(oValue1, oValue2) {
	if (oValue1[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue1[0].length; nIndex++)
			aValue.push(oValue1[0][nIndex] - oValue2[0][nIndex]);
		return [aValue, oValue1[1], oValue1[2]];
	}
	else
		return [oValue1[0] - oValue2[0], oValue1[1], oValue1[2]];
};

function fAmple_animate_mulValue(oValue, nTimes) {
	if (oValue[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue[0].length; nIndex++)
			aValue.push(oValue[0][nIndex] * nTimes);
		return [aValue, oValue[1], oValue[2]];
	}
	else
		return [oValue[0] * nTimes, oValue[1], oValue[2]];
};

// UnitBezier.h, WebCore_animation_AnimationBase.cpp
function fAMLQuery_cubicBezier(t, a, b, c, d, nDuration) {
	var ax=0,bx=0,cx=0,ay=0,by=0,cy=0;
	// `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
    function fSampleCurveX(t) {
    	return ((ax*t+bx)*t+cx)*t;
    };
    function fSampleCurveY(t) {
    	return ((ay*t+by)*t+cy)*t;
    };
    function fSampleCurveDerivativeX(t) {
    	return (3.0*ax*t+2.0*bx)*t+cx;
    };
	// The epsilon value to pass given that the animation is going to run over |dur| seconds. The longer the
	// animation, the more precision is needed in the timing function result to avoid ugly discontinuities.
	function fSolveEpsilon(nDuration) {
		return 1.0/(200.0*nDuration);
	};
    function fSolve(x,nEpsilon) {
    	return fSampleCurveY(fSolveCurveX(x,nEpsilon));
    };
	// Given an x value, find a parametric value it came from.
    function fSolveCurveX(x,nEpsilon) {
    	var t0,t1,t2,x2,d2,i;
		function fFabs(n) {
			return n >= 0 ? n : 0-n;
		}
        // First try a few iterations of Newton's method -- normally very fast.
        for (t2=x, i=0; i<8; i++) {
        	x2=fSampleCurveX(t2)-x;
        	if(fFabs(x2)<nEpsilon)
        		return t2;
        	d2=fSampleCurveDerivativeX(t2);
        	if (fFabs(d2) < 1e-6)
        		break;
        	t2=t2-x2/d2;
        }
        // Fall back to the bisection method for reliability.
        t0=0.0; t1=1.0; t2=x;
        if(t2<t0)
        	return t0;
        if(t2>t1)
        	return t1;
        while(t0<t1) {
        	x2=fSampleCurveX(t2);
        	if(fFabs(x2-x)<nEpsilon)
        		return t2;
        	if(x>x2)
        		t0=t2;
        	else
        		t1=t2;
        	t2=(t1-t0)*.5+t0;
        }
        return t2; // Failure.
    };
	// Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
	cx=3.0*a; bx=3.0*(c-a)-cx; ax=1.0-cx-bx; cy=3.0*b; by=3.0*(d-b)-cy; ay=1.0-cy-by;
	// Convert from input time to parametric value in curve, then from that to output time.
	return fSolve(t, fSolveEpsilon(nDuration));
};