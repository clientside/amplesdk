/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var sAMLHistory_hash		= null,		// Properties
	nAMLHistory_timeout		= null,
	oAMLHistory_window		= null;

// Private Functions
function fAMLHistory_bookmark(sHash) {
	// Check if we do not submit the same page for second time
	if (sAMLHistory_hash == sHash)
		return;

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
	var sHash	= oUALocation.hash.replace(/^#/, '');
	if (sAMLHistory_hash != sHash) {
		// Manual input was conducted in Internet Explorer
//		if (oAMLHistory_window && oAMLHistory_window.hash && sHash != oAMLHistory_window.hash)
//			fAMLHistory_bookmark(sHash);
//		else {
			sAMLHistory_hash = sHash;

			// dispatch hashchange event
			var oEvent	= new cAMLUIEvent;
			oEvent.initUIEvent("hashchange", false, false, window, sHash);
			fAMLNode_dispatchEvent(oAML_document, oEvent);
//		}
	}

	nAMLHistory_timeout	= fSetTimeout(fAMLHistory_onTimeout, 20);
};

function fAMLHistory_onLoad(oEvent) {
	var sHash	= oUALocation.hash.replace(/^#/, '');
	if (bTrident) {
		var oElement	= oUADocument.createElement("iframe");
		oElement.style.display	= "none";
		oUADocument.body.appendChild(oElement);
		oAMLHistory_window	= oElement.contentWindow;
		if (oAMLConfiguration_values["ample-module-history-fix"])
			fAMLHistory_bookmark(sHash);
	}
	sAMLHistory_hash		= sHash;	// set to null to get initial 'hashchange' event
	nAMLHistory_timeout		= fSetTimeout(fAMLHistory_onTimeout, 20);
};

function fAMLHistory_onUnLoad(oEvent) {
	fClearTimeout(nAMLHistory_timeout);
};

// Attaching to implementation
oAML_document.$bookmark	= function(sHash) {
	// Validate arguments
	fAML_validate(arguments, [
		["hash",		cString]
	], "$bookmark");

	fAMLHistory_bookmark(sHash);
};

// Registering Event Handlers
fAMLEventTarget_addEventListener(oAML_document, "load",	fAMLHistory_onLoad,		false);
fAMLEventTarget_addEventListener(oAML_document, "unload",	fAMLHistory_onUnLoad,	false);
