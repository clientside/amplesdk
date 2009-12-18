/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_title	= function(){};
cSVGElement_title.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE

	cSVGElement_title.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			if (!(this.parentNode instanceof cSVGElement_svg) && this.firstChild)
				this.parentNode.$getContainer().title	= this.firstChild.data;
		}
	};

	// presentation
	cSVGElement_title.prototype.$getTag	= function() {
		return '';
	};
};

// Register Element with language
oSVGNamespace.setElement("title", cSVGElement_title);
