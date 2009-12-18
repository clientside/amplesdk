/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLEvent	= function(){};

cAMLEvent.CAPTURING_PHASE	= 1;
cAMLEvent.AT_TARGET			= 2;
cAMLEvent.BUBBLING_PHASE	= 3;

//->Source
cAMLEvent.CAPTURING_PHASE	= "CAPTURING_PHASE";
cAMLEvent.AT_TARGET			= "AT_TARGET";
cAMLEvent.BUBBLING_PHASE	= "BUBBLING_PHASE";
//<-Source

// nsIDOMEvent
cAMLEvent.prototype.bubbles			= null;	// readonly
cAMLEvent.prototype.cancelable		= null;	// readonly
cAMLEvent.prototype.currentTarget	= null;	// readonly
cAMLEvent.prototype.eventPhase		= null;	// readonly
cAMLEvent.prototype.target			= null;	// readonly
cAMLEvent.prototype.timeStamp		= null;	// readonly
cAMLEvent.prototype.type			= null;	// readonly
cAMLEvent.prototype.namespaceURI	= null;	// readonly
cAMLEvent.prototype.defaultPrevented= false;// readonly

// Private Properties
cAMLEvent.prototype._stopped			= false;
cAMLEvent.prototype._stoppedImmediately	= false;

// Public Methods
cAMLEvent.prototype.initEvent		= function(sType, bCanBubble, bCancelable)
{
/*
	// Validate arguments
	fAML_validate(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	], "initEvent");
*/
    this.type       = sType;
    this.bubbles    = bCanBubble;
    this.cancelable = bCancelable;
};

cAMLEvent.prototype.stopPropagation	= function()
{
	this._stopped	= this.bubbles;
};

cAMLEvent.prototype.stopImmediatePropagation	= function()
{
	this._stoppedImmediately	= this._stopped	= this.bubbles;
};

cAMLEvent.prototype.preventDefault	= function()
{
	this.defaultPrevented	= this.cancelable;
};

cAMLEvent.prototype.isPropagationStopped	= function()
{
	return this._stopped;
};

//->Source
cAMLEvent.prototype.toString	= function()
{
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
