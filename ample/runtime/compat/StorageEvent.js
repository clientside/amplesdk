/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cStorageEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fStorageEvent_init(this, arguments[1]);
};

cStorageEvent.prototype	= new cEvent('#' + "StorageEvent");

cStorageEvent.prototype.key			= null;
cStorageEvent.prototype.oldValue	= null;
cStorageEvent.prototype.newValue	= null;
cStorageEvent.prototype.url			= null;
cStorageEvent.prototype.storageArea	= null;

function fStorageEvent_getDictionary(sType, bBubbles, bCancelable, sKey, sOldValue, sNewValue, sUrl, oStorage) {
	var oValue	= fEvent_getDictionary(sType, bBubbles, bCancelable);
	//
	oValue.key	= sKey;
	oValue.oldValue	= sOldValue;
	oValue.newValue	= sNewValue;
	oValue.url	= sUrl;
	oValue.storageArea	= oStorage;

	return oValue;
};

function fStorageEvent_init(oEvent, oValue) {
	fEvent_init(oEvent, oValue);
	//
	if ("key" in oValue)
		oEvent.key		= oValue.key;
	if ("oldValue" in oValue)
		oEvent.oldValue	= oValue.oldValue;
	if ("newValue" in oValue)
		oEvent.newValue	= oValue.newValue;
	if ("url" in oValue)
		oEvent.url	= oValue.url;
	if ("storageArea" in oValue)
		oEvent.storageArea	= oValue.storageArea;
};

//
cStorageEvent.prototype.initStorageEvent	= function(sType, bBubbles, bCancelable, sKey, sOldValue, sNewValue, sUrl, oStorage) {
	fStorageEvent_init(this, fStorageEvent_getDictionary(sType, bBubbles, bCancelable, sKey, sOldValue, sNewValue, sUrl, oStorage));
};