/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var nAMLElementAnimation_EFFECT_LINEAR		= 0,	// Constants
	nAMLElementAnimation_EFFECT_EASE		= 1,
	nAMLElementAnimation_EFFECT_EASE_IN		= 2,
	nAMLElementAnimation_EFFECT_EASE_OUT	= 3,
	nAMLElementAnimation_EFFECT_EASE_IN_OUT	= 4,
	aAMLElementAnimation_effects	= [];			// Variables

function fAMLElementAnimation_play(oElement, oProperties, nDuration, vType, fHandler, sPseudo)
{
	// initialize effect
	var oEffect	= {},
		nEffect	= aAMLElementAnimation_effects.length,
		oElementDOM	= oElement.$getContainer(sPseudo),
		oStyle	= fBrowser_getComputedStyle(oElementDOM);
	oEffect._element	= oElement;
	oEffect._container	= oElementDOM;
	oEffect._duration	= nDuration;
	oEffect._callback	= fHandler;
	oEffect._type		= vType;
	oEffect._start		= new cDate;
	oEffect._data		= {};
	oEffect._interval	= fSetInterval(function(){fAMLElementAnimation_process(nEffect)}, 20);

	// read end params from input
	var sName;
	for (var sKey in oProperties)
		if (oProperties.hasOwnProperty(sKey))
			oEffect._data[sName = fUtilities_toCssPropertyName(sKey)]	= [fUtilities_parseCssValue(fAMLElementAnimation_adjustStyleValue(oElementDOM, sName, fBrowser_getStyle(oElementDOM, sName, oStyle))), fUtilities_parseCssValue(fAMLElementAnimation_adjustStyleValue(oElementDOM, sName, oProperties[sKey]))];

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

function fAMLElementAnimation_stop(nEffect)
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
	fAMLElementAnimation_clear(nEffect);
};

function fAMLElementAnimation_process(nEffect)
{
	var oEffect	= aAMLElementAnimation_effects[nEffect],
		nDuration	= oEffect._duration;
		oEffect._timestamp	= new cDate;

	// clear effect if node was removed
	if (!oAMLDocument_all[oEffect._element.uniqueID])
		return fAMLElementAnimation_clear(nEffect);

	// stop effect if the time is up
	if (oEffect._duration <= oEffect._timestamp - oEffect._start) {
		fAMLElementAnimation_stop(nEffect);
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
		{
			switch (oEffect._type)
			{
				case nAMLElementAnimation_EFFECT_EASE:
					nRatio	= fAMLElementAnimation_cubicBezier(nRatioRaw, 0.25, 0.1, 0.25, 1.0, nDuration);
					break;

				case nAMLElementAnimation_EFFECT_EASE_IN:
					nRatio	= fAMLElementAnimation_cubicBezier(nRatioRaw, 0.42, 0, 1, 1, nDuration);
					break;

				case nAMLElementAnimation_EFFECT_EASE_OUT:
					nRatio	= fAMLElementAnimation_cubicBezier(nRatioRaw, 0, 0, 0.58, 1.0, nDuration);
					break;

				case nAMLElementAnimation_EFFECT_EASE_IN_OUT:
					nRatio	= fAMLElementAnimation_cubicBezier(nRatioRaw, 0.42, 0, 0.58, 1.0, nDuration);
					break;

				default:	// also linear
					nRatio	= nRatioRaw;
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
			aValue	= fUtilities_sumCssValues(oData[0], fUtilities_mulCssValue(fUtilities_subCssValues(oData[1], oData[0]), nRatio));
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

function fAMLElementAnimation_clear(nEffect)
{
	var oEffect	= aAMLElementAnimation_effects[nEffect];

	// clear interval
	fClearInterval(oEffect._interval);

	// delete effect
	aAMLElementAnimation_effects[nEffect]	= null;
};

// Utilities
function fAMLElementAnimation_adjustStyleValue(oElementDOM, sName, sValue) {
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

// UnitBezier.h, WebCore_animation_AnimationBase.cpp
function fAMLElementAnimation_cubicBezier(t, a, b, c, d, nDuration) {
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


// Attaching to implementation
cAMLElement.EFFECT_LINEAR		= nAMLElementAnimation_EFFECT_LINEAR;
cAMLElement.EFFECT_NORMAL		= nAMLElementAnimation_EFFECT_EASE;
cAMLElement.EFFECT_ACCELERATE	= nAMLElementAnimation_EFFECT_EASE_IN;
cAMLElement.EFFECT_DECELERATE	= nAMLElementAnimation_EFFECT_EASE_OUT;
cAMLElement.EFFECT_SPRING		= nAMLElementAnimation_EFFECT_EASE_IN_OUT;

cAMLElement.prototype.$play	= function(sParams, nDuration, vType, fHandler, sPseudo)
{
	// Validate arguments
	fGuard(arguments, [
		["params",		cString],
		["duration",	cNumber],
		["type",		cObject, true],
		["handler",		cFunction, true, true],
		["pseudoElement",	cString, true]
	]);

	var oProperties	= {},
		aParams	= sParams.split(/\s*;\s*/),
		aParam;
	for (var nIndex = 0; nIndex < aParams.length; nIndex++)
		if (aParam = aParams[nIndex].match(/([a-z\-]+)\s*\:\s*(.+)/i))
			oProperties[aParam[1]]	= aParam[2];

	return fAMLElementAnimation_play(this, oProperties, nDuration, vType, fHandler, sPseudo);
};

cAMLElement.prototype.$stop	= function(nEffect)
{
	// Validate arguments
	fGuard(arguments, [
		["effect",		cNumber]
	]);

	fAMLElementAnimation_stop(nEffect);
};
