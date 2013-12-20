/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cEvent	= function(sType) {
	fEvent_init(this, sType, arguments[1]);
};

cEvent.CAPTURING_PHASE	= 1;
cEvent.AT_TARGET		= 2;
cEvent.BUBBLING_PHASE	= 3;

//->Source
cEvent.CAPTURING_PHASE	= "CAPTURING_PHASE";
cEvent.AT_TARGET		= "AT_TARGET";
cEvent.BUBBLING_PHASE	= "BUBBLING_PHASE";
//<-Source

// nsIDOMEvent
cEvent.prototype.bubbles		= false;	// readonly
cEvent.prototype.cancelable		= false;	// readonly
cEvent.prototype.currentTarget	= null;	// readonly
cEvent.prototype.eventPhase		= null;	// readonly
cEvent.prototype.target			= null;	// readonly
cEvent.prototype.timeStamp		= null;	// readonly
cEvent.prototype.type			= '#' + "Event";	// readonly
cEvent.prototype.namespaceURI	= null;	// readonly
cEvent.prototype.defaultPrevented	= false;// readonly

// Private Properties
cEvent.prototype._stopped			= false;
cEvent.prototype._stoppedImmediately= false;

function fEvent_getDictionary(bBubbles, bCancelable) {
	var oValue	= {};
	//
	oValue.bubbles		= bBubbles;
	oValue.cancelable	= bCancelable;

	return oValue;
};

function fEvent_init(oEvent, sType, oValue) {
	oEvent.type	= sType;
	//
	if (oValue) {
		if ("bubbles" in oValue)
			oEvent.bubbles		= oValue.bubbles;
		if ("cancelable" in oValue)
			oEvent.cancelable	= oValue.cancelable;
	}
};

// Public Methods
cEvent.prototype.initEvent		= function(sType, bBubbles, bCancelable) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fEvent_init(this, sType, fEvent_getDictionary(bBubbles, bCancelable));
};

cEvent.prototype.stopPropagation	= function() {
	this._stopped	= this.bubbles;
};

cEvent.prototype.stopImmediatePropagation	= function() {
	this._stoppedImmediately	= this._stopped	= this.bubbles;
};

cEvent.prototype.preventDefault	= function() {
	this.defaultPrevented	= this.cancelable;
};

cEvent.prototype.isPropagationStopped	= function() {
	return this._stopped;
};

//->Source
cEvent.prototype.toString	= function() {
	return	"type:		" + this.type + "\n" +
			"bubbles:		" + this.bubbles + "\n" +
			"cancelable:	" + this.cancelable + "\n" +
			"**************************************\n" +
			"defaultPrevented:		" + this.defaultPrevented + "\n" +
			"isPropagationStopped():	" + this.isPropagationStopped() + "\n" +
			"**************************************\n" +
			"eventPhase:	" + this.eventPhase + "\n" +
			"target:		" + this.target + "\n" +
			"currentTarget:	" + this.currentTarget + "\n";
};
//<-Source
