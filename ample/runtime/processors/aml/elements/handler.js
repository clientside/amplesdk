/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLElement_handler(){};
cAMLElement_handler.prototype	= new cAMLElement_prototype("handler");

// Class Event Handlers
cAMLElement_handler.handlers	= {};
cAMLElement_handler.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	if (this.firstChild) {
		if (this.attributes["event"])
			this.parentNode.addEventListener(this.attributes["event"], new cFunction("event", this.firstChild.nodeValue), this.attributes["phase"] == "capture");
		else {
			var oElement	= oUIDocument.createElement("script");
			oElement.type	= "text/javascript";
			oElement.text	= this.firstChild.nodeValue;
			oUIDocument.getElementsByTagName("head")[0].appendChild(oElement);
			oElement.parentNode.removeChild(oElement);
		}
	}
};

// Register Element
fAmple_extend(cAMLElement_handler);
