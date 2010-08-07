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
				oValue	= fUtilities_sumCssValues(aValues[nIndex], oValue);
	}
	else {	// linear = default
		var oFrom	= oAnimation.from ? oAnimation.from : oAnimation.original;
		if (nValues) {
			nSegment	= cMath.floor(nProgress * (aValues.length - 1));
			oValue		= aValues[nSegment];
			if (nSegment < nValues - 1)
				oValue	= fUtilities_sumCssValues(oValue, fUtilities_mulCssValue(fUtilities_subCssValues(aValues[nSegment + 1], oValue), (nProgress - nSegment / (nValues - 1)) * (nValues - 1)));
		}
		else
			oValue	= fUtilities_sumCssValues(oFrom, fUtilities_mulCssValue(oAnimation.to ? fUtilities_subCssValues(oAnimation.to, oFrom) : oAnimation.by, nProgress));
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
		oValue	= oAnimation.values[oAnimation.values.length - 1] || oAnimation.to || fUtilities_sumCssValues(oAnimation.original, oAnimation.by);
	else
		oValue	= oAnimation.original;

	//
	fAMLSMIL30_animation_setAttributeValue(oAnimation, oValue);
};

// Utilities
function fAMLSMIL30_animation_getAttributeValue(oAnimation) {
	var aValue	= null;
	if (oAnimation.attributeType == "CSS") {
		var oElementDOM	= oAnimation.targetElement.$getContainer();
		if (oAnimation.type == "animateMotion") {
			var oStyle	= fBrowser_getComputedStyle(oElementDOM),
				oValue1	= fUtilities_parseCssValue(oStyle["top"]),
				oValue2	= fUtilities_parseCssValue(oStyle["left"]);
			aValue	= [[oValue1[0], oValue2[0]], oValue1[1]];
		}
		else
			aValue	= fUtilities_parseCssValue(fBrowser_getStyle(oElementDOM, fUtilities_toCssPropertyName(oAnimation.attributeName)));
	}
	else {	// "XML" = "auto"
		if (oAnimation.type == "animateMotion")
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
		else
			aValue	= fUtilities_parseCssValue(oAnimation.targetElement.getAttribute(oAnimation.attributeName));
	}
	return aValue;
};

function fAMLSMIL30_animation_setAttributeValue(oAnimation, aValue) {
	try {
		// Color value
		if (aValue && aValue[1] == '#')
			aValue	= ['#', fUtilities_numberToHex(aValue[0][0] * 255) + fUtilities_numberToHex(aValue[0][1] * 255) + fUtilities_numberToHex(aValue[0][2] * 255)];

		if (oAnimation.attributeType == "CSS") {
			var oElementDOM	= oAnimation.targetElement.$getContainer();
			if (oAnimation.type == "animateMotion") {
				var oStyle		= oElementDOM.style;
				oStyle.top	= aValue[0][0] +(aValue[1] || 'px');	// default to "px"
				oStyle.left	= aValue[0][1] +(aValue[1] || 'px');	// default to "px"
			}
			else
				fBrowser_setStyle(oElementDOM, fUtilities_toCssPropertyName(oAnimation.attributeName), aValue.join(''));
		}
		else {	// "XML" = "auto"
			if (oAnimation.type == "animateMotion")
				throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
			else
				oAnimation.targetElement.setAttribute(oAnimation.attributeName, aValue[2] ? aValue[2] + '(' + aValue[0] + ')' : aValue.join(''));
		}
	}
	catch (oException) {
//->Debug
		fUtilities_warn(sAML_ERROR_ANIMATING_ATTR_WRN, [oAnimation.attributeName, aValue]);
//<-Debug
	}
};
