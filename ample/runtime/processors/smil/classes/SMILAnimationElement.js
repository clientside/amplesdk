/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILAnimationElement	= function() {
	cSMILTimeElement.apply(this, arguments);
};
cSMILAnimationElement.prototype	= new cSMILTimeElement("#element-animation");

function fSMILAnimationElement_init(oElement) {
	// Target
	oElement.targetElement	= oElement.attributes["targetElement"];
	oElement.attributeName	= oElement.attributes["attributeName"];
	oElement.attributeType	= oElement.attributes["attributeType"];
	// Simple Animation
	oElement.from		= fUtilities_parseCssValue(oElement.attributes["from"]);
	oElement.to			= fUtilities_parseCssValue(oElement.attributes["to"]);
	oElement.by			= fUtilities_parseCssValue(oElement.attributes["by"]);
	oElement.values		= fSMILElement_parseValues(oElement.attributes["values"]);
	//
	oElement.calcMode	= oElement.attributes["calcMode"];
	// Fill
	oElement.fill		= oElement.attributes["fill"];
	// Additive and Cumulative animation
	oElement.additive	= oElement.attributes["additive"];		// sum|replace, "replace" is default
	oElement.accumulate	= oElement.attributes["accumulate"];	// sum|none, "none" is default

	if (!oElement.targetElement)
		oElement.targetElement	= oElement.parentNode;
};

//
function fSMILAnimationElement_beginAnimation(oElement) {
//	console.log("begin animation", oElement);

	//
	oElement.original	= fSMILAnimationElement_getAttributeValue(oElement);

	// Apply initial value immediately if 'set' animation
	if (oElement instanceof cSMILElement_set)
		fSMILAnimationElement_setAttributeValue(oElement, oElement.to);
};

function fSMILAnimationElement_progressAnimation(oElement, nProgress) {
//	console.log("progress animation", oElement, nProgress);

	//
	var aValues		= oElement.values,
		nValues		= aValues.length;
		nSegment	= cMath.floor(nProgress * aValues.length),
		oValue		= aValues[nSegment];
	if (oElement.calcMode == "discrete" || oElement.calcMode == "paced") {
		if (oElement.calcMode == "paced")
			for (var nIndex = 0; nIndex < nSegment; nIndex++)
				oValue	= fUtilities_sumCssValues(aValues[nIndex], oValue);
	}
	else {	// linear = default
		var oFrom	= oElement.from ? oElement.from : oElement.original;
		if (nValues) {
			nSegment	= cMath.floor(nProgress * (aValues.length - 1));
			oValue		= aValues[nSegment];
			if (nSegment < nValues - 1)
				oValue	= fUtilities_sumCssValues(oValue, fUtilities_mulCssValue(fUtilities_subCssValues(aValues[nSegment + 1], oValue), (nProgress - nSegment / (nValues - 1)) * (nValues - 1)));
		}
		else
			oValue	= fUtilities_sumCssValues(oFrom, fUtilities_mulCssValue(oElement.to ? fUtilities_subCssValues(oElement.to, oFrom) : oElement.by, nProgress));
	}

	fSMILAnimationElement_setAttributeValue(oElement, oValue);
};

function fSMILAnimationElement_endAnimation(oElement) {
//	console.log("end animation", oElement);

	//
	var oValue;

	// if element is to be frozen on it is a child of another time container that is still active
	if (oElement.fill == "freeze" || (oElement.fill == "hold" && aSMILElement_activeElements.indexOf(oElement.parentNode) >-1))
		oValue	= oElement.values[oElement.values.length - 1] || oElement.to || fUtilities_sumCssValues(oElement.original, oElement.by);
	else
		oValue	= oElement.original;

	//
	fSMILAnimationElement_setAttributeValue(oElement, oValue);
};

//
function fSMILAnimationElement_getAttributeValue(oElement) {
	var aValue	= null;
	if (oElement.attributeType == "CSS") {
		var oElementDOM	= oElement.targetElement.$getContainer();
		if (oElement instanceof cSMILElement_animateMotion) {
			var oStyle	= fBrowser_getComputedStyle(oElementDOM),
				oValue1	= fUtilities_parseCssValue(oStyle["top"]),
				oValue2	= fUtilities_parseCssValue(oStyle["left"]);
			aValue	= [[oValue1[0], oValue2[0]], oValue1[1]];
		}
		else
			aValue	= fUtilities_parseCssValue(fBrowser_getStyle(oElementDOM, fUtilities_toCssPropertyName(oElement.attributeName)));
	}
	else {	// "XML" = "auto"
		if (oElement instanceof cSMILElement_animateMotion)
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
		else
			aValue	= fUtilities_parseCssValue(oElement.targetElement.getAttribute(oElement.attributeName));
	}
	return aValue;
};

function fSMILAnimationElement_setAttributeValue(oElement, aValue) {
	try {
		// Color value
		if (aValue && aValue[1] == '#')
			aValue	= ['#', fUtilities_numberToHex(aValue[0][0] * 255) + fUtilities_numberToHex(aValue[0][1] * 255) + fUtilities_numberToHex(aValue[0][2] * 255)];

		if (oElement.attributeType == "CSS") {
			var oElementDOM	= oElement.targetElement.$getContainer();
			if (oElement instanceof cSMILElement_animateMotion) {
				var oStyle		= oElementDOM.style;
				oStyle.top	= aValue[0][0] +(aValue[1] || 'px');	// default to "px"
				oStyle.left	= aValue[0][1] +(aValue[1] || 'px');	// default to "px"
			}
			else
				fBrowser_setStyle(oElementDOM, fUtilities_toCssPropertyName(oElement.attributeName), aValue.join(''));
		}
		else {	// "XML" = "auto"
			if (oElement instanceof cSMILElement_animateMotion)
				throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
			else
				oElement.targetElement.setAttribute(oElement.attributeName, aValue[2] ? aValue[2] + '(' + aValue[0] + ')' : aValue.join(''));
		}
	}
	catch (oException) {
//->Debug
		fUtilities_warn(sAML_ERROR_ANIMATING_ATTR_WRN, [oElement.attributeName, aValue]);
//<-Debug
	}
};

function fSMILElement_parseValues(sValue) {
	if (!sValue)
		return [];

	for (var nIndex = 0, aValuesRaw	= sValue.split(';'), aValues = [], oValue; nIndex < aValuesRaw.length; nIndex++)
		if (oValue = fUtilities_parseCssValue(aValuesRaw[nIndex]))
			aValues.push(oValue);
	return aValues;
};

//Register Element
fAmple_extend(cSMILAnimationElement);
