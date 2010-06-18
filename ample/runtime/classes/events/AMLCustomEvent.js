/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLCustomEvent	= function(){};
cAMLCustomEvent.prototype	= new cAMLEvent;

// nsIDOMCustomEvent
cAMLCustomEvent.prototype.detail	= null;

cAMLCustomEvent.prototype.initCustomEvent	= function(sType, bCanBubble, bCancelable, oDetail)
{
	// Validate arguments
	fAML_validate(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean],
		["detail",		cObject,	false, true]
	]);

	this.initEvent(sType, bCanBubble, bCancelable);

	this.detail	= oDetail;
};
