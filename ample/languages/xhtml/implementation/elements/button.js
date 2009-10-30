/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_button	= function(){};
cXHTMLElement_button.prototype	= new cXHTMLElement;
cXHTMLElement_button.prototype.tabIndex		= 0;

cXHTMLElement_button.prototype.$isAccessible	= function()
{
	return !this.getAttribute("disabled");
};

cXHTMLElement_button.prototype.$validate	= function() {
	return true;
};

// Public Properties
cXHTMLElement_button.prototype.form	= null;

// Class Events Handlers
cXHTMLElement_button.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	}
};

// Register Element with language
oXHTMLNamespace.setElement("button", cXHTMLElement_button);
