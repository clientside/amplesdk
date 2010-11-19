/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var sAMLQuery_history_prev	= null,		// Properties
	sAMLQuery_history_new	= null,
	nAMLQuery_history_timeout	= null,
	oAMLQuery_history_window	= null;

// Private Functions
function fAMLQuery_history_bookmark(sHash, sTitle) {
	// Check if we do not submit the same page for second time
	if (sAMLQuery_history_prev == sHash)
		return;

	//
	sAMLQuery_history_new	= sHash;

	if (oAMLQuery_history_window)	{
		var oDocument	= oAMLQuery_history_window.document;
		oDocument.open();
		oDocument.write('<' + "script" +'>' + "parent" + '.' + "location" + '.' + "hash" + /*'=' + "hash" +*/ '="' + sHash + '"</' + "script" + '>');
		oDocument.close();
	}
	else
		oUALocation.hash	= sHash;
};

function fAMLQuery_history_onTimeout() {
	fAMLQuery_history_onHashChange();
	//
	nAMLQuery_history_timeout	= fSetTimeout(fAMLQuery_history_onTimeout, 20);
};

function fAMLQuery_history_onHashChange() {
	var aUrl	= oUALocation.href.split('#'),
		sUrl	= aUrl[0],
		sHash	= aUrl[1] || '';
	if (sAMLQuery_history_prev != sHash) {
		// Manual input was conducted in Internet Explorer
//		if (oAMLQuery_history_window && oAMLQuery_history_window.hash && sHash != oAMLQuery_history_window.hash)
//			fAMLQuery_history_bookmark(sHash);
//		else {
			// dispatch hashchange event
			if (sAMLQuery_history_new != sHash) {
				var oEvent	= new cAMLHashChangeEvent;
				oEvent.initHashChangeEvent("hashchange", true, false, sUrl + (sAMLQuery_history_prev ? '#' : '') + sAMLQuery_history_prev, sUrl + (sHash ? '#' : '') + sHash);
				fAMLNode_dispatchEvent(oAmple_document, oEvent);
			}
			//
			sAMLQuery_history_prev	= sHash;
			sAMLQuery_history_new		= null;
//		}
	}
};

function fAMLQuery_history_onLoad(oEvent) {
	if (bTrident && nVersion > 7)
		fBrowser_attachEvent(window, "hashchange", fAMLQuery_history_onHashChange);
	else {
		var sHash	= oUALocation.hash.replace(/^#/, '');
		if (bTrident) {
			var oElement	= oUADocument.createElement("iframe");
			oElement.style.display	= "none";
			oBrowser_body.appendChild(oElement);
			oAMLQuery_history_window	= oElement.contentWindow;
			if (oAMLConfiguration_values["ample-module-history-fix"])
				fAMLQuery_history_bookmark(sHash);
		}
		sAMLQuery_history_prev		= sHash;	// set to null to get initial 'hashchange' event
		nAMLQuery_history_timeout		= fSetTimeout(fAMLQuery_history_onTimeout, 20);
	}
};

function fAMLQuery_history_onUnLoad(oEvent) {
	if (bTrident && nVersion > 7)
		fBrowser_detachEvent(window, "hashchange", fAMLQuery_history_onHashChange);
	else
		fClearTimeout(nAMLQuery_history_timeout);
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
oAmple.bookmark	= function(sHash, sTitle) {
//->Guard
	fGuard(arguments, [
		["hash",	cString, true],
		["title",	cString, true]
	]);
//<-Guard

	if (arguments.length)
		fAMLQuery_history_bookmark(sHash, sTitle);
	else
		return sAMLQuery_history_prev;
};

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAmple_document, "load",	fAMLQuery_history_onLoad,	false);
fAMLEventTarget_addEventListener(oAmple_document, "unload",	fAMLQuery_history_onUnLoad,	false);
