/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_script	= function(){};
cSVGElement_script.prototype	= new cSVGElement("script");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_script.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};
};

// presentation
cSVGElement_script.prototype.$getTag	= function() {
	return '';
};

cSVGElement_script.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.firstChild instanceof ample.classes.CharacterData) {
			var oScript	= document.createElement("script");
			document.getElementsByTagName("head")[0].appendChild(oScript);
			oScript.type	= "text/javascript";
			oScript.text	= this.firstChild.data;
		}
	}
};

// Register Element
ample.extend(cSVGElement_script);
