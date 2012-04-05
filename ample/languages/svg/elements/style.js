/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_style	= function(){};
cSVGElement_style.prototype	= new cSVGElement("style");

if (cSVGElement.useVML) {
	// Implementation for IE

	cSVGElement_style.translate	= function(sCSS) {
		var aCSS	= [],
			aRules	= sCSS.match(/[^\{]+\{[^\}]+\}/g);
		if (aRules) {
			for (var nIndex = 0, nLength = aRules.length, aRule; nIndex < nLength; nIndex++) {
				aRule	= aRules[nIndex].match(/([^\{]+)(\{[^\}]+\})/);
				aCSS.push(aRule[1]
								.replace(/\|/g, '-')							// Namespace
								.replace(/([\s>+~,])(\w+\|)?([\w])/g, '$1.svg-$3')	// Element
								,
								aRule[2]);
			}
		}
		return aCSS.join('');
	};

	cSVGElement_style.prototype.$mapAttribute	= function(sName, sValue) {
		// No implementation
	};

	// presentation
	cSVGElement_style.prototype.$getTagOpen	= function() {
		// Fix/Translate styles (only invoked for startup)
		if (this.firstChild instanceof ample.classes.Text) {
			this.firstChild.nodeValue	=
			this.firstChild.data	= cSVGElement_style.translate(this.firstChild.data);
			this.firstChild.length	= this.firstChild.data.length;
		}

		return '<style type="text/css">';
	};

	cSVGElement_style.prototype.$getTagClose	= function() {
		return '</style>';
	};
};

// Register Element
ample.extend(cSVGElement_style);
