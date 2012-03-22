/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cStorageEvent	= function () {};

cStorageEvent.prototype	= new cEvent;

cStorageEvent.prototype.key			= null;
cStorageEvent.prototype.oldValue	= null;
cStorageEvent.prototype.newValue	= null;
cStorageEvent.prototype.url			= null;
cStorageEvent.prototype.storageArea	= null;

cStorageEvent.prototype.initStorageEvent	= function(sType, bCanBubble, bCancelable, sKey, sOldValue, sNewValue, sUrl, oStorage) {
	this.initEvent(sType, bCanBubble, bCancelable);
	//
	this.key	= sKey;
	this.url	= sUrl;
	this.oldValue	= sOldValue;
	this.newValue	= sNewValue;
	this.storageArea	= oStorage;
};