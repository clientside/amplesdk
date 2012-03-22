/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
var cHashChangeEvent	= function() {};
cHashChangeEvent.prototype	= new cEvent;
cHashChangeEvent.prototype.eventInterface	= "HashChangeEvent";
//
cHashChangeEvent.prototype.oldURL	= null;
cHashChangeEvent.prototype.newURL	= null;

cHashChangeEvent.prototype.initHashChangeEvent	= function(sType, bCanBubble, bCancelable, sOldUrl, sNewUrl) {
	this.initEvent(sType, bCanBubble, bCancelable);

	this.oldURL	= sOldUrl;
	this.newURL	= sNewUrl;
};