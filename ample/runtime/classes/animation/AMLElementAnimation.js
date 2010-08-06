/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var nAMLElementAnimation_EFFECT_LINEAR		= 1,	// Constants
	nAMLElementAnimation_EFFECT_ACCELERATE	= 2,
	nAMLElementAnimation_EFFECT_DECELERATE	= 3,
	nAMLElementAnimation_EFFECT_SPRING		= 4,
	nAMLElementAnimation_EFFECT_BOUNCE		= 5,
	aAMLElementAnimation_effects	= [];				// Variables

function fAMLElementAnimation_play(oElement, sParams, nDuration, vType, fHandler, sPseudo)
{
	// initialize effect
	var oEffect	= {},
		nEffect	= aAMLElementAnimation_effects.length;
	oEffect._element	= oElement;
	oEffect._container	= oElement.$getContainer(sPseudo);
	oEffect._duration	= nDuration;
	oEffect._callback	= fHandler;
	oEffect._type		= vType;
	oEffect._start		= new cDate;
	oEffect._data		= {};
	oEffect._interval	= fSetInterval(function(){fAMLElementAnimation_process(nEffect)}, 20);

	// read end params from input
	var aParams	= sParams.split(/\s*;\s*/),
		sParam,
		aParam;
	for (var nIndex = 0; nIndex < aParams.length; nIndex++)
		if (aParam = aParams[nIndex].match(/([a-z\-]+)\s*\:\s*(.+)/i))
			oEffect._data[sParam = fUtilities_toCssPropertyName(aParam[1])]	= [fAMLSMIL30_parseValue(fAMLElementAnimation_adjustStyleValue(sParam, fBrowser_getStyle(oEffect._container, sParam))), fAMLSMIL30_parseValue(fAMLElementAnimation_adjustStyleValue(sParam, aParam[2]))];

	// delete running effects on new effect properties for the same element
	for (var nIndex = 0, oEffectOld; nIndex < aAMLElementAnimation_effects.length; nIndex++)
		if ((oEffectOld = aAMLElementAnimation_effects[nIndex]) && oEffectOld._element == oEffect._element)
			for (var sKey in oEffectOld._data)
				if (oEffectOld._data.hasOwnProperty(sKey) && oEffect._data[sKey])
					delete oEffectOld._data[sKey];

	var oEventEffectStart	= new cAMLEvent;
	oEventEffectStart.initEvent("effectstart", false, false);
	fAMLNode_dispatchEvent(oEffect._element, oEventEffectStart);

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
	var oEffect	= aAMLElementAnimation_effects[nEffect];
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
		var nRatioRaw	=(oEffect._timestamp - oEffect._start) / oEffect._duration;
		if (oEffect._type instanceof cFunction)
			nRatio	= oEffect._type(nRatioRaw);
		else
		{
			switch (oEffect._type)
			{
				case nAMLElementAnimation_EFFECT_ACCELERATE:
					nRatio	= cMath.pow(nRatioRaw, cMath.E);
					break;

				case nAMLElementAnimation_EFFECT_DECELERATE:
					nRatio	= cMath.pow(nRatioRaw, 1 / cMath.E);
					break;

				case nAMLElementAnimation_EFFECT_SPRING:
					nRatio	= nRatioRaw;
					break;

				case nAMLElementAnimation_EFFECT_BOUNCE:
					nRatio	= nRatioRaw;
					break;

				default:
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
			aValue	= fAMLSMIL30_animation_sumValues(oData[0], fAMLSMIL30_animation_multiplyValue(fAMLSMIL30_animation_subValues(oData[1], oData[0]), nRatio));
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
function fAMLElementAnimation_adjustStyleValue(sName, sValue) {
	if (sName == "opacity")
		return sValue == '' ? '1' : sValue;
	else
	if (sName == "backgroundPosition")
		return(sValue == "0% 0%" || sValue == "none" || sValue == '')? "0px 0px" : sValue;
	else
	if (sName == "lineHeight")
		return sValue == "normal" ? '1' : sValue;
	else
	if (sName.match(/border(.+)Width/))
		return sValue == "medium" ? '3px' : sValue;
	else
	if (sName.match(/top|left|bottom|right/i))
		return sValue == "auto" ? "0px" : sValue;
	else
	if (sName == "width" || sName == "height")
		return sValue == "auto" ? '1px' : sValue;
	return sValue;
};

// Attaching to implementation
cAMLElement.EFFECT_LINEAR		= nAMLElementAnimation_EFFECT_LINEAR;
cAMLElement.EFFECT_ACCELERATE	= nAMLElementAnimation_EFFECT_ACCELERATE;
cAMLElement.EFFECT_DECELERATE	= nAMLElementAnimation_EFFECT_DECELERATE;
cAMLElement.EFFECT_SPRING		= nAMLElementAnimation_EFFECT_SPRING;
cAMLElement.EFFECT_BOUNCE		= nAMLElementAnimation_EFFECT_BOUNCE;

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

	return fAMLElementAnimation_play(this, sParams, nDuration, vType, fHandler, sPseudo);
};

cAMLElement.prototype.$stop	= function(nEffect)
{
	// Validate arguments
	fGuard(arguments, [
		["effect",		cNumber]
	]);

	fAMLElementAnimation_stop(nEffect);
};
