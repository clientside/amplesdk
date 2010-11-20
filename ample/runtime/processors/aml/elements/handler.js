/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cElement_handler	= function(){};
cElement_handler.prototype	= new cAMLElement("handler");

// Class Event Handlers
cElement_handler.handlers	= {};
cElement_handler.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	if (this.firstChild) {
		if (this.attributes["event"])
			this.parentNode.addEventListener(this.attributes["event"], new cFunction("event", this.firstChild.nodeValue), this.attributes["phase"] == "capture");
		else {
			var oElement	= oUIDocument.createElement("script");
			oElement.type	= "text/javascript";
			oElement.text	= this.firstChild.nodeValue;
			oBrowser_head.appendChild(oElement);
			oElement.parentNode.removeChild(oElement);
		}
	}
};

// Register Element
fAmple_extend(cElement_handler);
