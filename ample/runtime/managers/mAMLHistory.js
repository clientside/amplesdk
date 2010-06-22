/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var sAMLHistory_prev	= null,		// Properties
	sAMLHistory_new		= null,
	nAMLHistory_timeout		= null,
	oAMLHistory_window		= null;

// Private Functions
function fAMLHistory_bookmark(sHash) {
	// Check if we do not submit the same page for second time
	if (sAMLHistory_prev == sHash)
		return;

	//
	sAMLHistory_new	= sHash;

	if (oAMLHistory_window)	{
		var oDocument	= oAMLHistory_window.document;
		oDocument.open();
		oDocument.write('<' + "script" +'>' + "parent" + '.' + "location" + '.' + "hash" + /*'=' + "hash" +*/ '="' + sHash + '"</' + "script" + '>');
		oDocument.close();
	}
	else
		oUALocation.hash	= sHash;
};

function fAMLHistory_onTimeout() {
	fAMLHistory_onHashChange();
	//
	nAMLHistory_timeout	= fSetTimeout(fAMLHistory_onTimeout, 20);
};

function fAMLHistory_onHashChange() {
	var aUrl	= oUALocation.href.split('#'),
		sUrl	= aUrl[0],
		sHash	= aUrl[1] || '';
	if (sAMLHistory_prev != sHash) {
		// Manual input was conducted in Internet Explorer
//		if (oAMLHistory_window && oAMLHistory_window.hash && sHash != oAMLHistory_window.hash)
//			fAMLHistory_bookmark(sHash);
//		else {
			// dispatch hashchange event
			if (sAMLHistory_new != sHash) {
				var oEvent	= new cAMLHashChangeEvent;
				oEvent.initHashChangeEvent("hashchange", true, false, sUrl + (sAMLHistory_prev ? '#' : '') + sAMLHistory_prev, sUrl + (sHash ? '#' : '') + sHash);
				fAMLNode_dispatchEvent(oAML_document, oEvent);
			}
			//
			sAMLHistory_prev	= sHash;
			sAMLHistory_new		= null;
//		}
	}
};

function fAMLHistory_onLoad(oEvent) {
	if (bTrident && nVersion > 7)
		fAttachEvent(window, "hashchange", fAMLHistory_onHashChange);
	else {
		var sHash	= oUALocation.hash.replace(/^#/, '');
		if (bTrident) {
			var oElement	= oUADocument.createElement("iframe");
			oElement.style.display	= "none";
			oUADocument.body.appendChild(oElement);
			oAMLHistory_window	= oElement.contentWindow;
			if (oAMLConfiguration_values["ample-module-history-fix"])
				fAMLHistory_bookmark(sHash);
		}
		sAMLHistory_prev		= sHash;	// set to null to get initial 'hashchange' event
		nAMLHistory_timeout		= fSetTimeout(fAMLHistory_onTimeout, 20);
	}
};

function fAMLHistory_onUnLoad(oEvent) {
	if (bTrident && nVersion > 7)
		fDetachEvent(window, "hashchange", fAMLHistory_onHashChange);
	else
		fClearTimeout(nAMLHistory_timeout);
};

//
function cAMLHashChangeEvent() {

};
cAMLHashChangeEvent.prototype	= new cAMLEvent;
//
cAMLHashChangeEvent.prototype.oldURL	= null;
cAMLHashChangeEvent.prototype.newURL	= null;

cAMLHashChangeEvent.prototype.initHashChangeEvent	= function(sType, bCanBubble, bCancelable, sOldUrl, sNewUrl) {
	this.initEvent(sType, bCanBubble, bCancelable);

	this.oldURL	= sOldUrl;
	this.newURL	= sNewUrl;
};

// Attaching to implementation
oAML_document.$bookmark	= function(sHash) {
	// Validate arguments
	fAML_validate(arguments, [
		["hash",		cString]
	]);

	fAMLHistory_bookmark(sHash);
};

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAML_document, "load",		fAMLHistory_onLoad,		false);
fAMLEventTarget_addEventListener(oAML_document, "unload",	fAMLHistory_onUnLoad,	false);
