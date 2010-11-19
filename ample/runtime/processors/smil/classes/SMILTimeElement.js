/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
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
		oTarget	= oElement.begin.element ? oAMLDocument_ids[oElement.begin.element] : oElement.parentNode;
		//
		fAMLEventTarget_addEventListener(oTarget, oElement.begin.event, function() {
			oElement.begin.offset ? fSetTimeout(fBegin, oElement.begin.offset) : fBegin();
		});
	}
	else
		oElement.begin.offset ? fSetTimeout(fBegin, oElement.begin.offset) : fBegin();

	if (oElement.end.event) {
		oTarget	= oElement.end.element ? oAMLDocument_ids[oElement.end.element] : oElement.parentNode;
		//
		fAMLEventTarget_addEventListener(oTarget, oElement.end.event, function() {
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

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.endElementAt		= function(nOffset) {
//->Guard
	fGuard(arguments, [
		["offset",	cNumber]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.seekElement	= function(nSeekTo) {
//->Guard
	fGuard(arguments, [
		["seekTo",	cNumber]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.pauseElement	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cSMILTimeElement.prototype.resumeElement= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

//
function fSMILTimeElement_beginElement(oElement) {
//	console.info("begin element", oElement.tagName, oElement);
	if (oElement instanceof cSMILAnimationElement) {
		// If ID was specified for target element
		if (typeof oElement.targetElement == "string")
			oElement.targetElement	= oAMLDocument_ids[oElement.targetElement.substr(1)];

		// check if there is already animation running on that @targetElement/@attributeName
		for (var nIndex = 0, oElementOld; oElementOld = aSMILElement_activeElements[nIndex]; nIndex++)
			if (oElementOld instanceof cSMILAnimationElement && oElementOld.targetElement == oElement.targetElement && oElementOld.attributeName == oElement.attributeName) {
				fSMILTimeElement_endElement(oElementOld);
				break;
			}
	}

	// Add element to timeline
	oElement.start	= new cDate;
	aSMILElement_activeElements.push(oElement);

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

	// Dispatch end event
	var oEvent	= new cSMILTimeEvent;
	oEvent.initTimeEvent("begin", window, null);
	fAMLNode_dispatchEvent(oElement, oEvent);
};

function fSMILTimeElement_endElement(oElement) {
//	console.info("end element", oElement.tagName, oElement);

	// Remove element from timeline
	for (var nIndex = 0, oElementOld, bFound = false; oElementOld = aSMILElement_activeElements[nIndex]; nIndex++)
		if (bFound)
			aSMILElement_activeElements[nIndex - 1]	= oElementOld;
		else
		if (oElementOld == oElement)
			bFound	= true;
	if (bFound)
		aSMILElement_activeElements.length--;

	// End children Elements timeline
	var aChildNodes	= oElement.childNodes;
	if (oElement instanceof cSMILElement_par || oElement instanceof cSMILElement_seq)
		for (var nIndex = 0; nIndex < aChildNodes.length; nIndex++)
			if (aChildNodes[nIndex] instanceof cSMILTimeElement)
				fSMILTimeElement_endElement(aChildNodes[nIndex]);

	// End Animation
	if (oElement instanceof cSMILAnimationElement)
		fSMILAnimationElement_endAnimation(oElement);

	// Dispatch end event
	var oEvent	= new cSMILTimeEvent;
	oEvent.initTimeEvent("end", window, null);
	fAMLNode_dispatchEvent(oElement, oEvent);
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
var hSMILElement_multipliers		= {};
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
