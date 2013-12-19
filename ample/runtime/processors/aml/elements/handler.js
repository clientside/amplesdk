/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_handler	= function(){};
cAMLElement_handler.prototype	= new cAMLElement("handler");

// Class Event Handlers
cAMLElement_handler.handlers	= {};
cAMLElement_handler.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	if (this.firstChild) {
		var sName	= fElement_getAttribute(this, "event");
		if (sName)
			fEventTarget_addEventListener(this.parentNode, sName, new cFunction("event", this.firstChild.nodeValue), fElement_getAttribute(this, "phase") == "capture");
		else
			fBrowser_eval(this.firstChild.nodeValue);
	}
};

// Register Element
fAmple_extend(cAMLElement_handler);
