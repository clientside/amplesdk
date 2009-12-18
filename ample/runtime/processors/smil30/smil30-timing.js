/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fAMLSMIL30_onTimeline() {
//	console.info("progress timeline");

	// Walk over all active elements
	var oDate	= new cDate,
		nTimeRunRate,
		nTimeSimpleDuration,
		nTimeIntermediateActiveDuration,
		nTimeActiveDuration,
		nTimeUnfilteredActiveTime,
		nTimeFilteredActiveTime,
		nTimeModifiedSimpleDuration,
		nTimeUnfilteredSimpleTime,
		nTimeAccelerationDuration,
		nTimeDecelerationDuration,
		nTimeFilteredSimpleTime,
		nTimeDeceleration;

	for (var nIndex = 0, oElement, oTime, oAnimation; oElement = aAMLSMIL30_activeElements[nIndex]; nIndex++) {
		oTime		= oElement.time;
		oAnimation	= oElement.animation;
		// Simple Duration
		nTimeSimpleDuration	= oTime.dur;

		// Active duration computation
		nTimeIntermediateActiveDuration	= oTime.dur * oTime.repeatCount;
		if (oTime.repeatDur != nInfinity)
			nTimeIntermediateActiveDuration	= oTime.repeatCount == 1 ? oTime.repeatDur : cMath.min(nTimeIntermediateActiveDuration, oTime.repeatDur);
		nTimeActiveDuration	= nTimeIntermediateActiveDuration;

		// Filtered active time calculation
		nTimeUnfilteredActiveTime	= oDate - oTime.start;
		nTimeFilteredActiveTime		= oTime.speed > 0 ? nTimeUnfilteredActiveTime * oTime.speed : nTimeActiveDuration - nTimeUnfilteredActiveTime * cMath.abs(oTime.speed);

		if ((oTime.end.offset && nTimeUnfilteredActiveTime >= oTime.end.offset) || (nTimeUnfilteredActiveTime >= nTimeActiveDuration * (oTime.autoReverse ? 2 : 1) / oTime.speed)) {
			if (oElement.parentNode && oElement.parentNode.time.type == "seq") {
				for (var nElement = 0, aChildNodes = oElement.parentNode.childNodes; nElement < aChildNodes.length; nElement++)
					if (aChildNodes[nElement] == oElement && aChildNodes[nElement+1])
						fAMLSMIL30_beginElement(aChildNodes[nElement+1]);
			}
			fAMLSMIL30_endElement(oElement);
		}
		else
		if (oAnimation && oAnimation.type != "set") {
			// Filtered simple time calculation
			nTimeModifiedSimpleDuration	= nTimeSimpleDuration * (oTime.autoReverse ? 2 : 1);
			// 1. Unfiltered simple time
			nTimeUnfilteredSimpleTime	= nTimeFilteredActiveTime - nTimeModifiedSimpleDuration * cMath.floor(nTimeFilteredActiveTime / nTimeModifiedSimpleDuration);
			// 2. Account for autoReverse behavior
			if (oTime.autoReverse && nTimeUnfilteredSimpleTime >= nTimeSimpleDuration)
				nTimeUnfilteredSimpleTime	= 2 * nTimeSimpleDuration - nTimeUnfilteredSimpleTime;
			// 3. Account for acceleration and/or deceleration behavior
			nTimeRunRate	= 1 / (1 - oTime.accelerate / 2 - oTime.decelerate / 2);
			nTimeAccelerationDuration	= nTimeSimpleDuration * oTime.accelerate;
			nTimeDecelerationDuration	= nTimeSimpleDuration * oTime.decelerate;
			if (nTimeUnfilteredSimpleTime < nTimeAccelerationDuration)
				nTimeFilteredSimpleTime	= nTimeUnfilteredSimpleTime * (nTimeRunRate * nTimeUnfilteredSimpleTime / nTimeAccelerationDuration) / 2;
			else
			if (nTimeUnfilteredSimpleTime > nTimeSimpleDuration - nTimeDecelerationDuration) {
				nTimeDeceleration	= nTimeUnfilteredSimpleTime - (nTimeSimpleDuration - nTimeDecelerationDuration);
				nTimeFilteredSimpleTime	= nTimeRunRate * (nTimeSimpleDuration - nTimeAccelerationDuration / 2 - nTimeDecelerationDuration +
											nTimeDeceleration * (2 - nTimeDeceleration / nTimeDecelerationDuration) / 2);
			}
			else
				nTimeFilteredSimpleTime	= nTimeRunRate * (nTimeUnfilteredSimpleTime - nTimeAccelerationDuration / 2);

			// Progress animation
			fAMLSMIL30_animation_progressAnimation(oElement, nTimeFilteredSimpleTime / nTimeSimpleDuration);
		}
	}

	// Process further
	fSetTimeout(arguments.callee, nAMLSMIL30_timeout);
};

//
function fAMLSMIL30_beginElement(oElement) {
//	console.info("begin element", oElement);
	var oAnimation	= oElement.animation;
	// If ID was specified for target element
	if (typeof oAnimation.targetElement == "string")
		oAnimation.targetElement	= ample.getElementById(oAnimation.targetElement.substr(1));

	// check if there is already animation running on that @targetElement/@attributeName
	if (oElement.animation)
		for (var nIndex = 0, oElementOld, oAnimationOld; oElementOld = aAMLSMIL30_activeElements[nIndex]; nIndex++)
			if ((oAnimationOld = oElementOld.animation) && oAnimationOld.targetElement == oAnimation.targetElement && oAnimationOld.attributeName == oAnimation.attributeName) {
				fAMLSMIL30_endElement(oElementOld);
				break;
			}

	// Add element to timeline
	oElement.time.start	= new Date;
	aAMLSMIL30_activeElements.push(oElement);

	// Begin Animation
	if (oAnimation)
		fAMLSMIL30_animation_beginAnimation(oElement);

	// Begin children Elements timeline
	var aChildNodes	= oElement.childNodes;
	if (aChildNodes.length) {
		if (oElement.time.type == "par")
			for (var nIndex = 0; nIndex < aChildNodes.length; nIndex++)
				fAMLSMIL30_beginElement(aChildNodes[nIndex]);
		else
		if (oElement.time.type == "seq")
			fAMLSMIL30_beginElement(aChildNodes[0]);
	}
};

function fAMLSMIL30_endElement(oElement) {
//	console.info("end element", oElement);

	// Remove element from timeline
	for (var nIndex = 0, oElementOld, bFound = false; oElementOld = aAMLSMIL30_activeElements[nIndex]; nIndex++)
		if (bFound)
			aAMLSMIL30_activeElements[nIndex - 1]	= oElementOld;
		else
		if (oElementOld == oElement)
			bFound	= true;
	if (bFound)
		aAMLSMIL30_activeElements.length--;

	// End children Elements timeline
	var aChildNodes	= oElement.childNodes;
	if (aChildNodes.length) {
		if (oElement.time.type == "par" || oElement.time.type == "seq")
			for (var nIndex = 0; nIndex < aChildNodes.length; nIndex++)
				fAMLSMIL30_endElement(aChildNodes[nIndex]);
	}

	// End Animation
	if (oElement.animation)
		fAMLSMIL30_animation_endAnimation(oElement);
};
