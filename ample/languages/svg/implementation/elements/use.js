/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_use	= function(){};
cSVGElement_use.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
	cSVGElement_use.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sHref	= this.getAttribute("xlink:href"),
				that	= this;
			if (sHref) {
				setTimeout(function() {
					var oRef	= that.ownerDocument.getElementById(sHref.substr(1));
					if (oRef && oRef.hasAttribute("d")) {
						that.$getContainer().path	= oRef.$getContainer().path;
					}
				});
			}
		}
	};

	// presentation
	cSVGElement_use.prototype.$getTagOpen	= function() {
		return '<svg2vml:shape class="svg-path' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;top:0;left:0;height:100%;width:100%;"\
				>' + cSVGElement.getTagStyle(this);
	};

	cSVGElement_use.prototype.$getTagClose	= function() {
		return '</svg2vml:shape>';
	};
};

// Register Element with language
oSVGNamespace.setElement("use", cSVGElement_use);
