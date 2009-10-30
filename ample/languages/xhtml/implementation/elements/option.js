/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_option	= function(){};
cXHTMLElement_option.prototype	= new cXHTMLElement;

cXHTMLElement_option.handlers	= {
	"mousedown":	function(oEvent) {
		oEvent.stopPropagation();	// What is this for?
	}
};

// Register Element with language
oXHTMLNamespace.setElement("option", cXHTMLElement_option);
