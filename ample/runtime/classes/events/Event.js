/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cEvent	= function(){};
cEvent.prototype.eventInterface	= "Event";

cEvent.CAPTURING_PHASE	= 1;
cEvent.AT_TARGET		= 2;
cEvent.BUBBLING_PHASE	= 3;

//->Source
cEvent.CAPTURING_PHASE	= "CAPTURING_PHASE";
cEvent.AT_TARGET		= "AT_TARGET";
cEvent.BUBBLING_PHASE	= "BUBBLING_PHASE";
//<-Source

// nsIDOMEvent
cEvent.prototype.bubbles		= null;	// readonly
cEvent.prototype.cancelable		= null;	// readonly
cEvent.prototype.currentTarget	= null;	// readonly
cEvent.prototype.eventPhase		= null;	// readonly
cEvent.prototype.target			= null;	// readonly
cEvent.prototype.timeStamp		= null;	// readonly
cEvent.prototype.type			= null;	// readonly
cEvent.prototype.namespaceURI	= null;	// readonly
cEvent.prototype.defaultPrevented	= false;// readonly

// Private Properties
cEvent.prototype._stopped			= false;
cEvent.prototype._stoppedImmediately= false;

// Public Methods
cEvent.prototype.initEvent		= function(sType, bCanBubble, bCancelable) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	this.type		= sType;
	this.bubbles	= bCanBubble;
	this.cancelable	= bCancelable;
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
