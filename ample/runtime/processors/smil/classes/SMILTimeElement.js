/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILTimeElement	= function() {
	cSMILElement.apply(this, arguments);
};
cSMILTimeElement.prototype	= new cSMILElement("#element-time");

function fSMILTimeElement_init(oEvent) {
	var oElement	= oEvent.currentTarget;
	// Timing and Synchronization
	oElement.begin			= fSMILTimeElement_parseDate(oElement.attributes["begin"]);
	oElement.end			= fSMILTimeElement_parseDate(oElement.attributes["end"]);
	oElement.dur			= fSMILTimeElement_parseDuration(oElement.attributes["dur"]);
	// Repetition
	oElement.repeatCount	= fSMILTimeElement_parseFloat(oElement.attributes["repeatCount"], 1);
	oElement.repeatDur		= fSMILTimeElement_parseDuration(oElement.attributes["repeatDur"]);
	// Time Manipulations
	oElement.autoReverse	= oElement.attributes["autoReverse"] == "true";
	oElement.accelerate		= fSMILTimeElement_parseFloat(oElement.attributes["accelerate"], 0);
	oElement.decelerate		= fSMILTimeElement_parseFloat(oElement.attributes["decelerate"], 0);
	oElement.speed			= fSMILTimeElement_parseFloat(oElement.attributes["speed"], 1);

	if (oElement.parentNode instanceof cSMILTimeElement)
		return;

	//
	var oTarget,
		fBegin	= function() {
			fSMILTimeElement_beginElement(oElement);
		},
		fEnd	= function() {
			fSMILTimeElement_endElement(oElement);
		};

	// If event-based
	if (oElement.begin.event) {
		oTarget	= oElement.begin.element ? oDocument_ids[oElement.begin.element] : oElement.parentNode;
		//
		fEventTarget_addEventListener(oTarget, oElement.begin.event, function() {
			oElement.begin.offset ? fSetTimeout(fBegin, oElement.begin.offset) : fBegin();
		});
	}
	else
		oElement.begin.offset ? fSetTimeout(fBegin, oElement.begin.offset) : fBegin();

	if (oElement.end.event) {
		oTarget	= oElement.end.element ? oDocument_ids[oElement.end.element] : oElement.parentNode;
		//
		fEventTarget_addEventListener(oTarget, oElement.end.event, function() {
			oElement.end.offset ? fSetTimeout(fEnd, oElement.end.offset) : fEnd();
		});
	}
};

// Public Methods
cSMILTimeElement.prototype.beginElement	= function() {
	fSMILTimeElement_beginElement(this);
};

cSMILTimeElement.prototype.endElement	= function() {
	fSMILTimeElement_endElement(this);
};

cSMILTimeElement.prototype.beginElementAt	= function(nOffset) {
//->Guard
	fGuard(arguments, [
		["offset",	cNumber]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.endElementAt		= function(nOffset) {
//->Guard
	fGuard(arguments, [
		["offset",	cNumber]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.seekElement	= function(nSeekTo) {
//->Guard
	fGuard(arguments, [
		["seekTo",	cNumber]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.pauseElement	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.resumeElement= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

var aSMILTimeElement_activeElements	= [],
	nSMILTimeElement_timeout;

// Time
function fSMILTimeElement_onTimeout() {
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

	for (var nIndex = 0, oElement; oElement = aSMILTimeElement_activeElements[nIndex]; nIndex++) {
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

	// Continue timer
	if (aSMILTimeElement_activeElements.length)
		nSMILTimeElement_timeout	= fSetTimeout(fSMILTimeElement_onTimeout, 10);
};

//
function fSMILTimeElement_beginElement(oElement) {
//	console.info("begin element", oElement.tagName, oElement);
	if (oElement instanceof cSMILAnimationElement) {
		// If ID was specified for target element
		if (typeof oElement.targetElement == "string")
			oElement.targetElement	= oDocument_ids[oElement.targetElement.substr(1)];

		// check if there is already animation running on that @targetElement/@attributeName
		for (var nIndex = 0, oElementOld; oElementOld = aSMILTimeElement_activeElements[nIndex]; nIndex++)
			if (oElementOld instanceof cSMILAnimationElement && oElementOld.targetElement == oElement.targetElement && oElementOld.attributeName == oElement.attributeName) {
				fSMILTimeElement_endElement(oElementOld);
				break;
			}
	}

	// Add element to timeline
	oElement.start	= new cDate;
	aSMILTimeElement_activeElements.push(oElement);

	// Begin Animation
	if (oElement instanceof cSMILAnimationElement)
		fSMILAnimationElement_beginAnimation(oElement);

	// Begin children Elements timeline
	var aChildNodes	= oElement.childNodes;
	if (oElement instanceof cSMILElement_par) {
		for (var nIndex = 0; nIndex < aChildNodes.length; nIndex++)
			if (aChildNodes[nIndex] instanceof cSMILTimeElement)
				fSMILTimeElement_beginElement(aChildNodes[nIndex]);
	}
	else
	if (oElement instanceof cSMILElement_seq) {
		for (var nIndex = 0; nIndex < aChildNodes.length; nIndex++)
			if (aChildNodes[nIndex] instanceof cSMILTimeElement) {
				fSMILTimeElement_beginElement(aChildNodes[nIndex]);
				break;
			}
	}

	// Start timer
	if (aSMILTimeElement_activeElements.length && !nSMILTimeElement_timeout)
		nSMILTimeElement_timeout	= fSetTimeout(fSMILTimeElement_onTimeout, 0);

	// Dispatch end event
	var oEvent	= new cSMILTimeEvent;
	oEvent.initTimeEvent("begin", window, null);
	fEventTarget_dispatchEvent(oElement, oEvent);
};

function fSMILTimeElement_endElement(oElement) {
//	console.info("end element", oElement.tagName, oElement);

	// Remove element from timeline
	for (var nIndex = 0, oElementOld, bFound = false; oElementOld = aSMILTimeElement_activeElements[nIndex]; nIndex++)
		if (bFound)
			aSMILTimeElement_activeElements[nIndex - 1]	= oElementOld;
		else
		if (oElementOld == oElement)
			bFound	= true;
	if (bFound)
		aSMILTimeElement_activeElements.length--;

	// End children Elements timeline
	var aChildNodes	= oElement.childNodes;
	if (oElement instanceof cSMILElement_par || oElement instanceof cSMILElement_seq)
		for (var nIndex = 0; nIndex < aChildNodes.length; nIndex++)
			if (aChildNodes[nIndex] instanceof cSMILTimeElement)
				fSMILTimeElement_endElement(aChildNodes[nIndex]);

	// End Animation
	if (oElement instanceof cSMILAnimationElement)
		fSMILAnimationElement_endAnimation(oElement);

	// Stop timer
	if (!aSMILTimeElement_activeElements.length && nSMILTimeElement_timeout)
		nSMILTimeElement_timeout	= fClearTimeout(nSMILTimeElement_timeout);

	// Dispatch end event
	var oEvent	= new cSMILTimeEvent;
	oEvent.initTimeEvent("end", window, null);
	fEventTarget_dispatchEvent(oElement, oEvent);
};

//Utilities
/*
Clock-value         ::= ( Full-clock-value | Partial-clock-value | Timecount-value )
Full-clock-value    ::= Hours ":" Minutes ":" Seconds ("." Fraction)?
Partial-clock-value ::= Minutes ":" Seconds ("." Fraction)?
Timecount-value     ::= Timecount ("." Fraction)? (Metric)?
Metric              ::= "h" | "min" | "s" | "ms"
Hours               ::= DIGIT+ // any positive number
Minutes             ::= 2DIGIT // range from 00 to 59
Seconds             ::= 2DIGIT // range from 00 to 59
Fraction            ::= DIGIT+
Timecount           ::= DIGIT+
2DIGIT              ::= DIGIT DIGIT
DIGIT               ::= [0-9]
*/
// Clock-value: /^(?:(\d+):)?([0-5]\d):([0-5]\d)(.\d+)?$/
// Timecount-value: /^(\d+)(.\d+)?(h|min|s|ms)$/
var hSMILElement_multipliers	= {};
hSMILElement_multipliers['h']	= 3600;
hSMILElement_multipliers["min"]	= 60;
hSMILElement_multipliers['s']	= 1;
function fSMILTimeElement_parseDate(sValue) {
	var oDate	= {},
		bOffsetPositive	= true,
		aValue;
	if (!sValue || sValue == "indefinite")
		oDate.time	= nInfinity;
	else
	// Wallclock
	if (aValue = sValue.match(/^wallclock\(.+\)$/))
		oDate.time	= null;
	// Event and/or Offset
	else {
		// Event
		if (aValue = sValue.match(/^(?:(\w+)\.)?([a-z]\w+)/)) {
			oDate.element	= aValue[1];
			oDate.event		= aValue[2];
			// remove from the value
			sValue	= sValue.replace(aValue[0], '');
		}
		else {
			oDate.element	= null;
			oDate.event		= null;
		}

		if (aValue = sValue.match(/^([+-])/)) {
			bOffsetPositive	= aValue[1] == '+';
			// remove from the value
			sValue	= sValue.replace(aValue[0], '');
		}

		// Offset
		// clock-value
		if (aValue = sValue.match(/^(?:(\d+):)?([0-5]\d):([0-5]\d)(.\d+)?$/))
			oDate.offset	= (bOffsetPositive ? 1 :-1) * ((aValue[1] ? aValue[1] * hSMILElement_multipliers['h'] : 0) + aValue[2] * hSMILElement_multipliers['min'] + aValue[3] * hSMILElement_multipliers['s']) * 1e3 + (aValue[4] ? aValue[4] : 0);
		else
		// Timecount-value
		if (aValue = sValue.match(/^(\d+)(.\d+)?(h|min|s|ms)?$/))
			oDate.offset	= (bOffsetPositive ? 1 :-1) * (aValue[1] * 1 + (aValue[2] ? aValue[2] * 1 : 0)) * (aValue[3] == 'ms' ? 1 : 1e3 * hSMILElement_multipliers[aValue[3] || 's']);
		else
			oDate.offset	= 0;
	}
	return oDate;
};

function fSMILTimeElement_parseDuration(sValue) {
	var aValue;
	if (!sValue || sValue == "indefinite")
		return nInfinity;
	else
	// clock-value
	if (aValue = sValue.match(/^(?:(\d+):)?([0-5]\d):([0-5]\d)(.\d+)?$/))
		return ((aValue[1] ? aValue[1] * hSMILElement_multipliers['h'] : 0) + aValue[2] * hSMILElement_multipliers['min'] + aValue[3] * hSMILElement_multipliers['s']) * 1e3 + (aValue[4] ? aValue[4] : 0);
	else
	// Timecount-value
	if (aValue = sValue.match(/^(\d+)(.\d+)?(h|min|s|ms)$/))
		return (aValue[1] * 1 + (aValue[2] ? aValue[2] * 1 : 0)) * (aValue[3] == 'ms' ? 1 : 1e3 * hSMILElement_multipliers[aValue[3]]);
	else
		return nInfinity;
};

function fSMILTimeElement_parseFloat(sValue, nDefault) {
	return fIsNaN(sValue = fParseFloat(sValue)) ? nDefault : sValue;
};


//Register Element
fAmple_extend(cSMILTimeElement);
