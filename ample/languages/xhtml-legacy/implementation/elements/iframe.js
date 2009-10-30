/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_iframe	= function(){};
cXHTMLElement_iframe.prototype	= new cXHTMLElement;
cXHTMLElement_iframe.prototype.tabIndex	= 0;

// Class Events Handlers
cXHTMLElement_iframe.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	}
};

// Register Element with language
oXHTMLNamespace.setElement("iframe", cXHTMLElement_iframe);
