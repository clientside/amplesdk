/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var sQuery_history_prev	= null,		// Properties
	sQuery_history_new	= null,
	nQuery_history_timeout,
	oQuery_history_window;

// Private Functions
function fQuery_history_bookmark(sHash, sTitle) {
	// Check if we do not submit the same page for second time
	if (sQuery_history_prev == sHash)
		return;

	//
	sQuery_history_new	= sHash;

	if (oQuery_history_window)	{
		var oDocument	= oQuery_history_window.document;
		oDocument.open();
		oDocument.write('<' + "script" +'>' + "parent" + '.' + "location" + '.' + "hash" + /*'=' + "hash" +*/ '="' + sHash + '"</' + "script" + '>');
		oDocument.close();
	}
	else
		oUALocation.hash	= sHash;
};

function fQuery_history_onTimeout() {
	fQuery_history_onHashChange();
	//
	nQuery_history_timeout	= fSetTimeout(fQuery_history_onTimeout, 50);
};

function fQuery_history_onHashChange() {
	var aUrl	= oUALocation.href.split('#'),
		sUrl	= aUrl[0],
		sHash	= aUrl[1] || '';
	if (sQuery_history_prev != sHash) {
		// Manual input was conducted in Internet Explorer
//		if (oQuery_history_window && oQuery_history_window.hash && sHash != oQuery_history_window.hash)
//			fQuery_history_bookmark(sHash);
//		else {
			// dispatch hashchange event
			if (sQuery_history_new != sHash) {
				var oEvent	= new cHashChangeEvent;
				oEvent.initHashChangeEvent("hashchange", true, false, sUrl + (sQuery_history_prev ? '#' : '') + sQuery_history_prev, sUrl + (sHash ? '#' : '') + sHash);
				fEventTarget_dispatchEvent(oAmple_document, oEvent);
			}
			//
			sQuery_history_prev	= sHash;
			sQuery_history_new		= null;
//		}
	}
};

function fQuery_history_onLoad(oEvent) {
	var sHash	= oUALocation.hash.replace(/^#/, '');
	if (('on' + "hashchange") in window)
		fBrowser_attachEvent(window, "hashchange", fQuery_history_onHashChange);
	else {
		if (bTrident) {
			var oElement	= oUADocument.createElement("iframe");
			oElement.style.display	= "none";
			oBrowser_body.appendChild(oElement);
			oQuery_history_window	= oElement.contentWindow;
			if (oDOMConfiguration_values["ample-module-history-fix"])
				fQuery_history_bookmark(sHash);
		}
		nQuery_history_timeout	= fSetTimeout(fQuery_history_onTimeout, 0);
	}
	sQuery_history_prev		= sHash;	// set to null to get initial 'hashchange' event
};

function fQuery_history_onUnLoad(oEvent) {
	if (('on' + "hashchange") in window)
		fBrowser_detachEvent(window, "hashchange", fQuery_history_onHashChange);
	else
		fClearTimeout(nQuery_history_timeout);
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
		fQuery_history_bookmark(sHash, sTitle);
	else
		return sQuery_history_prev;
};

// Registering Event Handlers
fEventTarget_addEventListener(oAmple_document, "load",	fQuery_history_onLoad,	false);
fEventTarget_addEventListener(oAmple_document, "unload",	fQuery_history_onUnLoad,	false);
