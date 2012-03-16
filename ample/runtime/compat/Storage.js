/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cStorage	= function (oDisk) {
	if (fGlobal != cStorage.caller)
		throw new cTypeError("Illegal" + ' ' + "constructor");
	//
	this.disk	= oDisk;
	fStorage_syncLength(this);
};

function fStorage_syncLength(oStorage) {
	oStorage.length	= oStorage.disk.length;
};

cStorage.prototype.length	= 0;

cStorage.prototype.key	= function(nIndex) {
	return this.disk.key(nIndex);
};

cStorage.prototype.getItem	= function(sKey) {
	return this.disk.getItem(sKey);
};

cStorage.prototype.setItem	= function(sKey, sValue) {
	this.disk.setItem(sKey, sValue);
	fStorage_syncLength(this);
};

cStorage.prototype.removeItem	= function(sKey) {
	var sValue	= this.disk.removeItem(sKey);
	fStorage_syncLength(this);
	return sValue;
};

cStorage.prototype.clear	= function() {
	this.disk.clear();
	this.length	= 0;
};

// Default Disk
function cDisk() {
	this.data	= {};
	this.length	= 0;
};

cDisk.prototype.data	= null;
cDisk.prototype.length	= null;

cDisk.prototype.key	= function(nIndex) {
	var nLength	= 0,
		sKey;
	for (sKey in this.data)
		if (this.data.hasOwnProperty(sKey) && nIndex == nLength++)
			return sKey;
	return null;
};

cDisk.prototype.getItem	= function(sKey) {
	return this.data.hasOwnProperty(sKey) ? this.data[sKey] : null;
};

cDisk.prototype.setItem	= function(sKey, sValue) {
	if (!this.data.hasOwnProperty(sKey))
		this.length++;
	this.data[sKey]	= sValue;
};

cDisk.prototype.removeItem	= function(sKey) {
	if (this.data.hasOwnProperty(sKey)) {
		var sValue	= this.data[sKey];
		delete this.data[sKey];
		this.length--;
		return sValue;
	}
	return null;
};

cDisk.prototype.clear	= function() {
	cDisk.call(this);
};

// IEUserDataDisk
function cUDDisk() {
	// Initialize behavior
	this.localStorage	= oUADocument.documentElement;
	this.localStorage.addBehavior('#default#' + "userData");
	// Load data
	fUDDisk_load(this);
};
cUDDisk.prototype	= new cDisk;

cUDDisk.prototype.setItem	= function(sKey, sValue) {
	cDisk.prototype.setItem.call(this, sKey, sValue);
	// Save data
	fUDDisk_save(this);
};

cUDDisk.prototype.removeItem	= function(sKey) {
	cDisk.prototype.removeItem.call(this, sKey);
	// Save data
	fUDDisk_save(this);
};

cUDDisk.prototype.clear	= function() {
	cDisk.call(this);
	// Save data
	fUDDisk_save(this);
};

function fUDDisk_load(oDisk) {
	// Read data
	oDisk.localStorage.load("localStorage");
	// Get data
	var sData	= oDisk.localStorage.getAttribute("userData");
	oDisk.data	= sData ? oJSON.parse(sData) : {};
	oDisk.length= oDisk.localStorage.getAttribute("userData" + '-' + "length") * 1 || 0;
};

function fUDDisk_save(oDisk) {
	// Set data
	var sData	= oJSON.stringify(oDisk.data);
	oDisk.localStorage.setAttribute("userData", sData);
	oDisk.localStorage.setAttribute("userData" + '-' + "length", oDisk.length);
	// Write data
	oDisk.localStorage.save("localStorage");
};

//
if (!oUASessionStorage) {
	oUASessionStorage	= new cStorage(new cDisk);

	// Export
	fExporter_export(oUASessionStorage,	"sessionStorage",	window);
	fExporter_export(cStorage,			"Storage",			window);
};

if (!oUALocalStorage) {
	oUALocalStorage	= new cStorage(bTrident && nVersion < 8 ? new cUDDisk : new cDisk);

	// Export
	fExporter_export(oUALocalStorage,	"localStorage",		window);
	if (!window.Storage)
		fExporter_export(cStorage,		"Storage",			window);
};