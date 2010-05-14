/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLSMIL30_animation_beginAnimation(oElement) {
//	console.log("begin animation", oAnimation);

	var oAnimation	= oElement.animation;

	//
	oAnimation.original	= fAMLSMIL30_animation_getAttributeValue(oAnimation);

	// Apply initial value immediately if 'set' animation
	if (oAnimation.type == "set")
		fAMLSMIL30_animation_setAttributeValue(oAnimation, oAnimation.to);
};

function fAMLSMIL30_animation_progressAnimation(oElement, nProgress) {
//	console.log("progress animation", oAnimation, nProgress);

	//
	var oAnimation	= oElement.animation,
		aValues		= oAnimation.values,
		nValues		= aValues.length;
		nSegment	= cMath.floor(nProgress * aValues.length),
		oValue		= aValues[nSegment];
	if (oAnimation.calcMode == "discrete" || oAnimation.calcMode == "paced") {
		if (oAnimation.calcMode == "paced")
			for (var nIndex = 0; nIndex < nSegment; nIndex++)
				oValue	= fAMLSMIL30_animation_sumValues(aValues[nIndex], oValue);
	}
	else {	// linear = default
		var oFrom	= oAnimation.from ? oAnimation.from : oAnimation.original;
		if (nValues) {
			nSegment	= cMath.floor(nProgress * (aValues.length - 1));
			oValue		= aValues[nSegment];
			if (nSegment < nValues - 1)
				oValue	= fAMLSMIL30_animation_sumValues(oValue, fAMLSMIL30_animation_multiplyValue(fAMLSMIL30_animation_subValues(aValues[nSegment + 1], oValue), (nProgress - nSegment / (nValues - 1)) * (nValues - 1)));
		}
		else
			oValue	= fAMLSMIL30_animation_sumValues(oFrom, fAMLSMIL30_animation_multiplyValue(oAnimation.to ? fAMLSMIL30_animation_subValues(oAnimation.to, oFrom) : oAnimation.by, nProgress));
	}

	fAMLSMIL30_animation_setAttributeValue(oAnimation, oValue);
};

function fAMLSMIL30_animation_endAnimation(oElement) {
//	console.log("end animation", oAnimation);

	//
	var oAnimation	= oElement.animation,
		oValue;

	// if element is to be frozen on it is a child of another time container that is still active
	if (oAnimation.fill == "freeze" || (oAnimation.fill == "hold" && aAMLSMIL30_activeElements.indexOf(oElement.parentNode) >-1))
		oValue	= oAnimation.values[oAnimation.values.length - 1] || oAnimation.to || fAMLSMIL30_animation_sumValues(oAnimation.original, oAnimation.by);
	else
		oValue	= oAnimation.original;

	//
	fAMLSMIL30_animation_setAttributeValue(oAnimation, oValue);
};

// Utilities
function fAMLSMIL30_animation_getAttributeValue(oAnimation) {
	var aValue	= null;
	if (oAnimation.attributeType == "CSS") {
		var oElementDOM	= oAnimation.targetElement.$getContainer(),
			oStyle		= fAML_getComputedStyle(oElementDOM);
		if (oAnimation.type == "animateMotion") {
			var oValue1	= fAMLSMIL30_parseValue(oStyle["top"]),
				oValue2	= fAMLSMIL30_parseValue(oStyle["left"]);
			aValue	= [[oValue1[0], oValue2[0]], oValue1[1]];
		}
		else {
			if (oAnimation.attributeName == "opacity") {
				if (bTrident && nVersion < 9) {
					aValue	= [1];
					if (cString(oStyle.filter).match(/opacity=([\.0-9]+)/i))
						aValue	= [oElementDOM.filters.item("DXImageTransform.Microsoft.Alpha").opacity / 100];
				}
				else
				if (oStyle.MozOpacity != null)
					aValue	= [oStyle.MozOpacity || 1];
				else
				if (oStyle.opacity != null)
					aValue	= [oStyle.opacity || 1];
				else
					aValue	= [1];
			}
			else
				aValue	= fAMLSMIL30_parseValue(oStyle[fAML_toCssPropertyName(oAnimation.attributeName)]);
		}
	}
	else {	// "XML" = "auto"
		if (oAnimation.type == "animateMotion")
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
		else
			aValue	= fAMLSMIL30_parseValue(oAnimation.targetElement.getAttribute(oAnimation.attributeName));
	}
	return aValue;
};

function fAMLSMIL30_animation_setAttributeValue(oAnimation, aValue) {
	try {
		// Color value
		if (aValue && aValue[1] == '#')
			aValue	= ['#', fAMLSMIL30_animation_toHex(aValue[0][0] * 255) + fAMLSMIL30_animation_toHex(aValue[0][1] * 255) + fAMLSMIL30_animation_toHex(aValue[0][2] * 255)];

		if (oAnimation.attributeType == "CSS") {
			var oStyle		= oAnimation.targetElement.style;
			if (oAnimation.type == "animateMotion") {
				oStyle.top	= aValue[0][0] +(aValue[1] || 'px');	// default to "px"
				oStyle.left	= aValue[0][1] +(aValue[1] || 'px');	// default to "px"
			}
			else {
				if (oAnimation.attributeName == "opacity") {
					oStyle.MozOpacity	= aValue[0];
					oStyle.opacity		= aValue[0];
					if (bTrident && nVersion < 9) {
						if (!cString(oAnimation.targetElement.currentStyle.filter).match(/opacity=([\.0-9]+)/i))
							oStyle.filter	= oAnimation.targetElement.currentStyle.filter + ' ' + "progid" + ':' + "DXImageTransform.Microsoft.Alpha" + '(' + "opacity" + '=100)';
						oAnimation.targetElement.filters.item("DXImageTransform.Microsoft.Alpha").opacity	= cMath.round(aValue[0] * 100);
					}
				}
				else
					oStyle[fAML_toCssPropertyName(oAnimation.attributeName)]	= aValue.join('');
			}
		}
		else {	// "XML" = "auto"
			if (oAnimation.type == "animateMotion")
				throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
			else
				oAnimation.targetElement.setAttribute(oAnimation.attributeName, aValue[2] ? aValue[2] + '(' + aValue[0] + ')' : aValue.join(''));
		}
	}
	catch (oError) {
//->Debug
		fAML_warn(nAML_ERROR_ANIMATING_ATTR_WRN, [oAnimation.attributeName, aValue]);
//<-Debug
	}
};

function fAMLSMIL30_animation_sumValues(oValue1, oValue2) {
	if (oValue1[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue1[0].length; nIndex++)
			aValue.push(oValue1[0][nIndex] + oValue2[0][nIndex]);
		return [aValue, oValue1[1], oValue1[2]];
	}
	else
		return [oValue1[0] + oValue2[0], oValue1[1], oValue1[2]];
};

function fAMLSMIL30_animation_subValues(oValue1, oValue2) {
	if (oValue1[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue1[0].length; nIndex++)
			aValue.push(oValue1[0][nIndex] - oValue2[0][nIndex]);
		return [aValue, oValue1[1], oValue1[2]];
	}
	else
		return [oValue1[0] - oValue2[0], oValue1[1], oValue1[2]];
};

function fAMLSMIL30_animation_multiplyValue(oValue, nTimes) {
	if (oValue[0] instanceof cArray) {
		for (var nIndex = 0, aValue = []; nIndex < oValue[0].length; nIndex++)
			aValue.push(oValue[0][nIndex] * nTimes);
		return [aValue, oValue[1], oValue[2]];
	}
	else
		return [oValue[0] * nTimes, oValue[1], oValue[2]];
};

function fAMLSMIL30_animation_toHex(nValue) {
	var sValue	= cMath.abs(cMath.floor(nValue)).toString(16);
    return cArray(3 - sValue.length).join('0') + sValue;
};
