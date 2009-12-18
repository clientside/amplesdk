/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_script	= function(){};
cSVGElement_script.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
};

// presentation
cSVGElement_script.prototype.$getTag	= function() {
	return '';
};

cSVGElement_script.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.firstChild instanceof AMLCharacterData)
			eval(this.firstChild.data);
	}
};

// Register Element with language
oSVGNamespace.setElement("script", cSVGElement_script);
