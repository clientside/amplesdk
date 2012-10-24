/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var aNodeAnimation_effects	= [],
	nNodeAnimation_timeout	= 0,
	nNodeAnimation_counter	= 0,
	oNodeAnimation_easing	= {},
	oNodeAnimation_durations	= {};			// Variables
oNodeAnimation_durations["fast"]	= 200;
oNodeAnimation_durations["normal"]	= 400;
oNodeAnimation_durations["slow"]	= 600;

function fNodeAnimation_play(oElement, oProperties, vDuration, vType, fHandler, sPseudo) {
	var oElementDOM	= sPseudo && sPseudo.ownerDocument == oUADocument ? sPseudo : oElement.$getContainer(sPseudo);
	if (!oElementDOM)
		return;
	// initialize effect
	var oEffect	= {},
		oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
		sValue;
	oEffect._element	= oElement;
	oEffect._container	= oElementDOM;
	oEffect._duration	= fIsNaN(vDuration) ? oNodeAnimation_durations[vDuration] || oNodeAnimation_durations["normal"] : vDuration;
	oEffect._callback	= fHandler;
	oEffect._type		= vType || '';
	oEffect._start		= new cDate;
	oEffect._data		= {};
	oEffect._identifier	= nNodeAnimation_counter++;

	// read end params from input
	var sName;
	for (var sKey in oProperties)
		if (oProperties.hasOwnProperty(sKey)) {
			sValue	= '' + oProperties[sKey];
			if (sKey == "scrollTop" || sKey == "scrollLeft")
				oEffect._data[sKey]	= [[oElementDOM[sKey]], [sValue]];
			else
				oEffect._data[sName	= fUtilities_toCssPropertyName(sKey)]	= [fNodeAnimation_parseValue(fBrowser_adjustStyleValue(oElementDOM, sName, fBrowser_getStyle(oElementDOM, sName, oComputedStyle))), fNodeAnimation_parseValue(fBrowser_adjustStyleValue(oElementDOM, sName, sValue))];
		}

	// delete running effects on new effect properties for the same element
	for (var nIndex = 0, oEffectOld; oEffectOld = aNodeAnimation_effects[nIndex]; nIndex++)
		if (oEffectOld._container == oElementDOM)
			for (var sKey in oEffectOld._data)
				if (oEffectOld._data.hasOwnProperty(sKey) && oEffect._data[sKey])
					delete oEffectOld._data[sKey];

	var oEventEffectStart	= new cEvent;
	oEventEffectStart.initEvent("effectstart", false, false);
	fEventTarget_dispatchEvent(oElement, oEventEffectStart);

	if (!nNodeAnimation_timeout)
		nNodeAnimation_timeout	= fSetTimeout(fNodeAnimation_onTimeout, 20);

	aNodeAnimation_effects.push(oEffect);

	// return effect resource identificator
	return oEffect._identifier;
};

function fNodeAnimation_stop(nEffect) {
	// Find effect
	for (var nIndex = 0, oEffect; oEffect = aNodeAnimation_effects[nIndex]; nIndex++)
		if (oEffect._identifier == nEffect)
			break;

	if (!oEffect)
		return;

	var oData,
		aValue;
	for (var sKey in oEffect._data)
		if (oEffect._data.hasOwnProperty(sKey)) {
			oData	= oEffect._data[sKey];
			aValue	= oData[1];
			if (sKey == "scrollTop" || sKey == "scrollLeft")
				oEffect._container[sKey]	= aValue[0];
			else {
				// Color value
				if (aValue && aValue[1] == '#')
					aValue	= fNodeAnimation_toHex(aValue[0]);
				else
				if (sKey == "backgroundPosition")
					aValue	= [aValue[0][0], aValue[1], ' ', aValue[0][1], aValue[1]];
				//
				fBrowser_setStyle(oEffect._container, sKey, aValue.join(''));
			}
		}

	var oEventEffectEnd	= new cEvent;
	oEventEffectEnd.initEvent("effectend", false, false);
	fEventTarget_dispatchEvent(oEffect._element, oEventEffectEnd);

	// clear effect
	fNodeAnimation_remove(nEffect);
};

function fNodeAnimation_delay(oElement, vDuration) {
	// TODO
};

function fNodeAnimation_onTimeout() {
	for (var nIndex = 0, oEffect, nTimestamp = new cDate; oEffect = aNodeAnimation_effects[nIndex]; nIndex++) {
		// clear effect if node was removed
		if (!oDocument_all[oEffect._element.uniqueID]) {
			fNodeAnimation_remove(oEffect._identifier);
			nIndex--;
		}
		else {
			// stop effect if the time is up
			if (nTimestamp - oEffect._start >= oEffect._duration) {
				fNodeAnimation_stop(oEffect._identifier);
				nIndex--;
				if (oEffect._callback)
					oEffect._callback.call(oEffect._element);
			}
			else {
				oEffect._timestamp	= nTimestamp;
				fNodeAnimation_process(oEffect);
			}
		}
	}
	//
	nNodeAnimation_timeout	= aNodeAnimation_effects.length ? fSetTimeout(fNodeAnimation_onTimeout, 20) : 0;
};

function fNodeAnimation_process(oEffect) {
	// calculate current ratio
	var nDuration	= oEffect._duration,
		vType		= oEffect._type,
		nRatio	= 0;
	if (nDuration) {
		var nRatioRaw	=(oEffect._timestamp - oEffect._start) / nDuration;
		if (vType instanceof cFunction)
			nRatio	= vType(nRatioRaw);
		else
		if (typeof vType == "string" && vType.indexOf("cubic-bezier") == 0) {
			// TODO
		}
		else {
			switch (vType) {
				case "linear":
					nRatio	= nRatioRaw;
					break;

				case "easein":
				case "ease-in":
					nRatio	= fNodeAnimation_cubicBezier(nRatioRaw, 0.42, 0, 1, 1, nDuration);
					break;

				case "easeout":
				case "ease-out":
					nRatio	= fNodeAnimation_cubicBezier(nRatioRaw, 0, 0, 0.58, 1, nDuration);
					break;

				case "easeinout":
				case "ease-in-out":
					nRatio	= fNodeAnimation_cubicBezier(nRatioRaw, 0.42, 0, 0.58, 1, nDuration);
					break;

//				case "ease":
				default:
					nRatio	= fNodeAnimation_cubicBezier(nRatioRaw, 0.25, 0.1, 0.25, 1, nDuration);
					break;
			}
		}
	}

	//
	var oData,
		aValue;
	for (var sKey in oEffect._data)
		if (oEffect._data.hasOwnProperty(sKey)) {
			oData	= oEffect._data[sKey];
			aValue	= fNodeAnimation_sumValue(oData[0], fNodeAnimation_mulValue(fNodeAnimation_subValue(oData[1], oData[0]), nRatio));
			if (sKey == "scrollTop" || sKey == "scrollLeft")
				oEffect._container[sKey]	= aValue[0];
			else {
				// Color value
				if (aValue[1] == '#')
					aValue	= fNodeAnimation_toHex(aValue[0]);
				else
				if (sKey == "backgroundPosition")
					aValue	= [aValue[0][0], aValue[1], ' ', aValue[0][1], aValue[1]];
				//
				fBrowser_setStyle(oEffect._container, sKey, aValue.join(''));
			}
		}
};

function fNodeAnimation_remove(nEffect) {
	// delete effect
	for (var nIndex = 0, oEffect, bFound = false; oEffect = aNodeAnimation_effects[nIndex]; nIndex++)
		if (bFound)
			aNodeAnimation_effects[nIndex-1]	= oEffect;
		else
		if (oEffect._identifier == nEffect)
			bFound	= true;

	if (bFound)
		aNodeAnimation_effects.length--;
};

// Utilities
function fNodeAnimation_parseValue(sValue) {
	// TODO: Process rgba colors
	if (!sValue)
		return null;

	// trim spaces
	sValue	= sValue.trim();

	var aValue,
		sValueLower	= sValue.toLowerCase();

	// if standard color used
	if (sValueLower in hBrowser_cssColors)
		sValue	= hBrowser_cssColors[sValueLower];

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
		else
		if (aValue[1] == "rgba") {
			if (aValue = sParameters.match(/^(\d+),\s*(\d+),\s*(\d+),\s*(\d+)$/))
				return [[aValue[4] == 0 ? 1 : aValue[1] / 255, aValue[4] == 0 ? 1 : aValue[2] / 255, aValue[4] == 0 ? 1 : aValue[3] / 255], '#', ''];
			else
			if (aValue = sParameters.match(/^(\d+)%,\s*(\d+)%,\s*(\d+)%,\s*(\d+)%$/))
				return [[aValue[4] == 0 ? 1 : aValue[1] / 100, aValue[4] == 0 ? 1 : aValue[2] / 100, aValue[4] == 0 ? 1 : aValue[3] / 100], '#', ''];
		}
		else {
			if (aValue = sParameters.split(/\s*,\s*/g)) {
				for (var nIndex = 0, oValue, oValue2 = [[], '', '']; nIndex < aValue.length; nIndex++)
					if (oValue = fNodeAnimation_parseValue(aValue[nIndex]))
						oValue2[0].push(oValue[0]);
				oValue2[2]	= sFunction;
				if (oValue2[0].length)
					return oValue2;
			}
		}
	}
	// +-ValueUnit
	if (aValue = sValue.match(/^([+-]?\d*\.?\d+)(em|ex|px|in|cm|mm|pt|pc|%)?$/))
		return [cNumber(aValue[1]), aValue[2] || '', ''];
	// List of values
	if ((aValue = sValue.split(/\s*,\s*|\s+/)) && aValue.length > 1) {
		for (var nIndex = 0, oValue, oValue2 = [[], '', '']; nIndex < aValue.length; nIndex++) {
			if (oValue = fNodeAnimation_parseValue(aValue[nIndex])) {
				oValue2[0].push(oValue[0]);
				oValue2[1]	= oValue[1];
			}
		}
		if (oValue2[0].length)
			return oValue2;
	}
	//
	return [sValue, '', ''];
};

function fNodeAnimation_toHex(aValue) {
	return ['#', ('000000' + (aValue[2] * 255 | (aValue[1] * 255 << 8) | (aValue[0] * 255 << 16)).toString(16)).slice(-6)];
};

function fNodeAnimation_sumValue(oValue, oValue2) {
	if (oValue[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue[0].length; nIndex++)
			aValue.push(oValue[0][nIndex] + oValue2[0][nIndex]);
		return [aValue, oValue2[1], oValue2[2]];
	}
	else
		return [oValue[0] + oValue2[0], oValue2[1], oValue2[2]];
};

function fNodeAnimation_subValue(oValue, oValue2) {
	if (oValue[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue[0].length; nIndex++)
			aValue.push(oValue[0][nIndex] - oValue2[0][nIndex]);
		return [aValue, oValue2[1], oValue2[2]];
	}
	else
		return [oValue[0] - oValue2[0], oValue[1], oValue[2]];
};

function fNodeAnimation_mulValue(oValue, nTimes) {
	if (oValue[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue[0].length; nIndex++)
			aValue.push(oValue[0][nIndex] * nTimes);
		return [aValue, oValue[1], oValue[2]];
	}
	else
		return [oValue[0] * nTimes, oValue[1], oValue[2]];
};

// UnitBezier.h, WebCore_animation_AnimationBase.cpp
function fNodeAnimation_cubicBezier(t, a, b, c, d, nDuration) {
	// Calculate the polynomial coefficients, implicit first and last control points are (0,0) and (1,1).
	var cx=3*a, bx=3*(c-a)-cx, ax=1-cx-bx, cy=3*b, by=3*(d-b)-cy, ay=1-cy-by;
	// `ax t^3 + bx t^2 + cx t' expanded using Horner's rule.
	function fSampleCurveX(t) {
		return ((ax*t+bx)*t+cx)*t;
	};
	function fSampleCurveY(t) {
		return ((ay*t+by)*t+cy)*t;
	};
	function fSampleCurveDerivativeX(t) {
		return (3*ax*t+2*bx)*t+cx;
	};
	// The epsilon value to pass given that the animation is going to run over |dur| seconds. The longer the
	// animation, the more precision is needed in the timing function result to avoid ugly discontinuities.
	function fSolveEpsilon(nDuration) {
		return 1/(200*nDuration);
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
		t0=0; t1=1; t2=x;
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
			t2=(t1-t0)/2+t0;
		}
		return t2; // Failure.
	};
	// Convert from input time to parametric value in curve, then from that to output time.
	return fSolve(t, fSolveEpsilon(nDuration));
};

// Extend Element
cElement.prototype.$animations	= null;
