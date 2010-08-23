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
	oElement.from		= fAMLNodeAnimation_parseValue(oElement.attributes["from"]);
	oElement.to			= fAMLNodeAnimation_parseValue(oElement.attributes['to']);
	oElement.by			= fAMLNodeAnimation_parseValue(oElement.attributes['by']);
	oElement.values		= fSMILElement_parseValues(oElement.attributes["values"]);
	//
	oElement.calcMode	= oElement.attributes["calcMode"];
	// Fill
	oElement.fill		= oElement.attributes["fill"];
	// Additive and Cumulative animation
	oElement.additive	= oElement.attributes["additive"];		// sum|replace, "replace" is default
	oElement.accumulate	= oElement.attributes["accumulate"];	// sum|none, "none" is default

	if (!oElement.targetElement)
		for (var oParent = oElement; oParent = oParent.parentNode;)
			if (!(oParent instanceof cSMILElement)) {
				oElement.targetElement	= oParent;
				break;
			}

	// Call "parent" method
	fSMILTimeElement_init(oElement);
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
		nLength		= aValues.length,
		nSegment	= cMath.floor(nProgress * nLength),
		oValue		= aValues[nSegment];
	if (oElement.calcMode == "discrete" || oElement.calcMode == "paced") {
		if (oElement.calcMode == "paced")
			for (var nIndex = 0; nIndex < nSegment; nIndex++)
				oValue	= fAMLNodeAnimation_sumValue(aValues[nIndex], oValue);
	}
	else {	// linear = default
		var oFrom	= oElement.from ? oElement.from : oElement.original;
		if (nLength) {
			nSegment	= cMath.floor(nProgress * (nLength - 1));
			oValue		= aValues[nSegment];
			if (nSegment < nLength - 1)
				oValue	= fAMLNodeAnimation_sumValue(oValue, fAMLNodeAnimation_mulValue(fAMLNodeAnimation_subValue(aValues[nSegment + 1], oValue), (nProgress - nSegment / (nLength - 1)) * (nLength - 1)));
		}
		else
			oValue	= fAMLNodeAnimation_sumValue(oFrom, fAMLNodeAnimation_mulValue(oElement.to ? fAMLNodeAnimation_subValue(oElement.to, oFrom) : oElement.by, nProgress));
	}

	fSMILAnimationElement_setAttributeValue(oElement, oValue);
};

function fSMILAnimationElement_endAnimation(oElement) {
//	console.log("end animation", oElement);

	//
	var oValue;

	// if element is to be frozen on it is a child of another time container that is still active
	if (oElement.fill == "freeze" || (oElement.fill == "hold" && aSMILElement_activeElements.indexOf(oElement.parentNode) >-1))
		oValue	= oElement.values[oElement.values.length - 1] || oElement.to || fAMLNodeAnimation_sumValue(oElement.original, oElement.by);
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
			var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
				oValue1	= fAMLNodeAnimation_parseValue(oComputedStyle.top),
				oValue2	= fAMLNodeAnimation_parseValue(oComputedStyle.left);
			aValue	= [[oValue1[0], oValue2[0]], oValue1[1]];
		}
		else
			aValue	= fAMLNodeAnimation_parseValue(fBrowser_getStyle(oElementDOM, fUtilities_toCssPropertyName(oElement.attributeName)));
	}
	else {	// "XML" = "auto"
		if (oElement instanceof cSMILElement_animateMotion)
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
		else
			aValue	= fAMLNodeAnimation_parseValue(oElement.targetElement.getAttribute(oElement.attributeName));
	}
	return aValue;
};

function fSMILAnimationElement_setAttributeValue(oElement, aValue) {
	try {
		// Color value
		if (aValue && aValue[1] == '#')
			aValue	= fAMLNodeAnimation_toHex(aValue[0]);

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
		if (oValue = fAMLNodeAnimation_parseValue(aValuesRaw[nIndex]))
			aValues.push(oValue);
	return aValues;
};

//Register Element
fAmple_extend(cSMILAnimationElement);
