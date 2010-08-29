/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILElement	= function(sLocalName) {
	this.localName	= sLocalName;
};
cSMILElement.prototype	= new cAMLElement;
cSMILElement.prototype.namespaceURI	= "http://www.w3.org/2008/SMIL30/";
cSMILElement.prototype.localName	= "#element";

var aSMILElement_activeElements	= [],
	nSMILElement_timeline		= 0,
	nSMILElement_timeout		= 10;	// This is a timeout, not interval

// Time
function fSMILElement_onTimeline() {
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

	for (var nIndex = 0, oElement, oElement, oElement; oElement = aSMILElement_activeElements[nIndex]; nIndex++) {
		// Simple Duration
		nTimeSimpleDuration	= oElement.dur;

		// Active duration computation
		nTimeIntermediateActiveDuration	= oElement.dur * oElement.repeatCount;
		if (oElement.repeatDur != nInfinity)
			nTimeIntermediateActiveDuration	= oElement.repeatCount == 1 ? oElement.repeatDur : cMath.min(nTimeIntermediateActiveDuration, oElement.repeatDur);
		nTimeActiveDuration	= nTimeIntermediateActiveDuration;

		// Filtered active time calculation
		nTimeUnfilteredActiveTime	= oDate - oElement.start;
		nTimeFilteredActiveTime		= oElement.speed > 0 ? nTimeUnfilteredActiveTime * oElement.speed : nTimeActiveDuration - nTimeUnfilteredActiveTime * cMath.abs(oElement.speed);

		if ((oElement.end.offset && nTimeUnfilteredActiveTime >= oElement.end.offset) || (nTimeUnfilteredActiveTime >= nTimeActiveDuration * (oElement.autoReverse ? 2 : 1) / oElement.speed)) {
			//
			fSMILTimeElement_endElement(oElement);
			//
			if (oElement.parentNode instanceof cSMILElement_seq) {
				for (var aChildNodes = oElement.parentNode.childNodes, nChild = aChildNodes.$indexOf(oElement); nChild < aChildNodes.length; nChild++)
					if (aChildNodes[nChild+1] instanceof cSMILTimeElement) {
						fSMILTimeElement_beginElement(aChildNodes[nChild+1]);
						break;
					}
			}
		}
		else
		if (oElement instanceof cSMILAnimationElement && !(oElement instanceof cSMILElement_set)) {
			// Filtered simple time calculation
			nTimeModifiedSimpleDuration	= nTimeSimpleDuration * (oElement.autoReverse ? 2 : 1);
			// 1. Unfiltered simple time
			nTimeUnfilteredSimpleTime	= nTimeFilteredActiveTime - nTimeModifiedSimpleDuration * cMath.floor(nTimeFilteredActiveTime / nTimeModifiedSimpleDuration);
			// 2. Account for autoReverse behavior
			if (oElement.autoReverse && nTimeUnfilteredSimpleTime >= nTimeSimpleDuration)
				nTimeUnfilteredSimpleTime	= 2 * nTimeSimpleDuration - nTimeUnfilteredSimpleTime;
			// 3. Account for acceleration and/or deceleration behavior
			nTimeRunRate	= 1 / (1 - oElement.accelerate / 2 - oElement.decelerate / 2);
			nTimeAccelerationDuration	= nTimeSimpleDuration * oElement.accelerate;
			nTimeDecelerationDuration	= nTimeSimpleDuration * oElement.decelerate;
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
			fSMILAnimationElement_progressAnimation(oElement, nTimeFilteredSimpleTime / nTimeSimpleDuration);
		}
	}

	// Process further
	nSMILElement_timeline	= fSetTimeout(fSMILElement_onTimeline, nSMILElement_timeout);
};

// Register Element
fAmple_extend(cSMILElement);

// Temp

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAmple_document, "load",	function() {
	nSMILElement_timeline	= fSetTimeout(fSMILElement_onTimeline, nSMILElement_timeout);
}, false);
fAMLEventTarget_addEventListener(oAmple_document, "unload", function() {
	fClearTimeout(nSMILElement_timeline);
}, false);
