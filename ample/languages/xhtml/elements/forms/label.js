/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_label	= function(){};
cXHTMLElement_label.prototype	= new cXHTMLElement("label");

// Class Events Handlers
cXHTMLElement_label.handlers	= {
	"click":	function() {
		this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		var oControl;
		if (this.attributes["for"] && (oControl = this.ownerDocument.getElementById(this.attributes["for"])))
			if (oControl instanceof cXHTMLInputElement)
				oControl.focus();
	}
};

// Register Element
ample.extend(cXHTMLElement_label);
