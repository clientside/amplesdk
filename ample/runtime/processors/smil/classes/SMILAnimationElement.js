/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILAnimationElement	= function() {
	cSMILTimeElement.apply(this, arguments);
};
cSMILAnimationElement.prototype	= new cSMILTimeElement("#element-animation");

function fSMILAnimationElement_init(oEvent) {
	var oElement	= oEvent.currentTarget;
	// Target
	oElement.targetElement	= fElement_getAttribute(oElement, "targetElement") || fElement_getAttribute(oElement, "xlink:href");
	oElement.attributeName	= fElement_getAttribute(oElement, "attributeName");
	oElement.attributeType	= fElement_getAttribute(oElement, "attributeType");
	// Simple Animation
	oElement.from		= fNodeAnimation_parseValue(fElement_getAttribute(oElement, "from"));
	oElement.to			= fNodeAnimation_parseValue(fElement_getAttribute(oElement, 'to'));
	oElement.by			= fNodeAnimation_parseValue(fElement_getAttribute(oElement, 'by'));
	oElement.values		= fSMILElement_parseValues(fElement_getAttribute(oElement, "values"));
	//
	oElement.calcMode	= fElement_getAttribute(oElement, "calcMode");
	// Fill
	oElement.fill		= fElement_getAttribute(oElement, "fill");
	// Additive and Cumulative animation
	oElement.additive	= fElement_getAttribute(oElement, "additive");		// sum|replace, "replace" is default
	oElement.accumulate	= fElement_getAttribute(oElement, "accumulate");	// sum|none, "none" is default

	if (!oElement.targetElement)
		for (var oParent = oElement; oParent = oParent.parentNode;)
			if (!(oParent instanceof cSMILElement)) {
				oElement.targetElement	= oParent;
				break;
			}

	// Call "parent" method
	fSMILTimeElement_init(oEvent);
};

//
function fSMILAnimationElement_beginAnimation(oElement) {
//	console.log("begin animation", oElement);

	//
	oElement.original	= fSMILAnimationElement_getAttributeValue(oElement) || ['', '', ''];

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
				oValue	= fNodeAnimation_sumValue(aValues[nIndex], oValue);
	}
	else {	// linear = default
		var oFrom	= oElement.from ? oElement.from : oElement.original;
		if (nLength) {
			nSegment	= cMath.floor(nProgress * (nLength - 1));
			oValue		= aValues[nSegment];
			if (nSegment < nLength - 1)
				oValue	= fNodeAnimation_sumValue(oValue, fNodeAnimation_mulValue(fNodeAnimation_subValue(aValues[nSegment + 1], oValue), (nProgress - nSegment / (nLength - 1)) * (nLength - 1)));
		}
		else
			oValue	= fNodeAnimation_sumValue(oFrom, fNodeAnimation_mulValue(oElement.to ? fNodeAnimation_subValue(oElement.to, oFrom) : oElement.by, nProgress));
	}

	fSMILAnimationElement_setAttributeValue(oElement, oValue);
};

function fSMILAnimationElement_endAnimation(oElement) {
//	console.log("end animation", oElement);

	//
	var oValue;

	// if element is to be frozen on it is a child of another time container that is still active
	if (oElement.fill == "freeze" || (oElement.fill == "hold" && aSMILTimeElement_activeElements.indexOf(oElement.parentNode) >-1))
		oValue	= oElement.values[oElement.values.length - 1] || oElement.to || fNodeAnimation_sumValue(oElement.original, oElement.by);
	else
		oValue	= oElement.original;

	//
	fSMILAnimationElement_setAttributeValue(oElement, oValue);
};

//
function fSMILAnimationElement_getAttributeValue(oElement) {
	var aValue	= null;
	if (oElement.attributeType == "CSS") {
		if (oElement instanceof cSMILElement_animateMotion) {
			var oElementDOM	= oElement.targetElement.$getContainer();
			if (oElementDOM) {
				var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM),
					oValue	= fNodeAnimation_parseValue(oComputedStyle.top),
					oValue2	= fNodeAnimation_parseValue(oComputedStyle.left);
				aValue	= [[oValue[0], oValue2[0]], oValue[1]];
			}
		}
		else
			aValue	= fNodeAnimation_parseValue(oElement.targetElement.$getStyleComputed(oElement.attributeName));
	}
	else {	// "XML" = "auto"
		if (oElement instanceof cSMILElement_animateMotion)
			throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
		else
			aValue	= fNodeAnimation_parseValue(oElement.targetElement.getAttribute(oElement.attributeName)) || ['', '', ''];
		if (oElement instanceof cSMILElement_animateTransform)
			aValue[2]	= '';
	}
	return aValue;
};

function fSMILAnimationElement_setAttributeValue(oElement, aValue) {
	try {
		// Color value
		if (aValue && aValue[1] == '#')
			aValue	= fNodeAnimation_toHex(aValue[0]);

		if (oElement.attributeType == "CSS") {
			if (oElement instanceof cSMILElement_animateMotion) {
				var oElementDOM	= oElement.targetElement.$getContainer();
				if (oElementDOM) {
					var oStyle		= oElementDOM.style;
					oStyle.top	= aValue[0][0] +(aValue[1] || 'px');	// default to "px"
					oStyle.left	= aValue[0][1] +(aValue[1] || 'px');	// default to "px"
				}
			}
			else
				oElement.targetElement.$setStyle(oElement.attributeName, aValue.join(''));
		}
		else {	// "XML" = "auto"
			if (oElement instanceof cSMILElement_animateMotion)
				throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
			else
			if (oElement instanceof cSMILElement_animateTransform)
				oElement.targetElement.setAttribute(oElement.attributeName, aValue[0] ? fElement_getAttribute(oElement, "type") + '(' + aValue[0] + ')' : '');
			else
				oElement.targetElement.setAttribute(oElement.attributeName, aValue[2] ? aValue[2] + '(' + aValue[0] + ')' : aValue.join(''));
		}
	}
	catch (oException) {
//->Debug
		fUtilities_warn(sGUARD_ERROR_ANIMATING_ATTR_WRN, [oElement.attributeName, aValue]);
//<-Debug
	}
};

function fSMILElement_parseValues(sValue) {
	if (!sValue)
		return [];

	for (var nIndex = 0, aValuesRaw	= sValue.split(';'), aValues = [], oValue; nIndex < aValuesRaw.length; nIndex++)
		if (oValue = fNodeAnimation_parseValue(aValuesRaw[nIndex]))
			aValues.push(oValue);
	return aValues;
};

// Register Element
fAmple_extend(cSMILAnimationElement);
