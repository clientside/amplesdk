/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cClipboardEvent	= function(){};
cClipboardEvent.prototype	= new cEvent;
cClipboardEvent.prototype.eventInterface	= "ClipboardEvent";

// nsIDOMClipboardEvent
cClipboardEvent.prototype.clipboardData	= null;

cClipboardEvent.prototype.initClipboardEvent	= function(sType, bCanBubble, bCancelable, sType, vData) {
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean],
		["dataType",	cString],
		["data",		cObject,	false,	true]
	]);
//<-Guard

	this.initEvent(sType, bCanBubble, bCancelable);

	// TODO
	this.clipboardData	= new cClipboard;
	this.clipboardData.setData(sType, vData);
};
