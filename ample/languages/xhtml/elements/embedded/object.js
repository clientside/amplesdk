/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_object	= function(){};
cXHTMLElement_object.prototype	= new cXHTMLElement("object");

cXHTMLElement_object.prototype.$getTag	= function() {
	if (window.navigator.userAgent.indexOf("Gecko") >-1) {
		var sHtml	= '<embed';
		for (var sName in this.attributes)
			if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
				sHtml	+= ' ' + sName + '="' + ample.$encodeXMLCharacters(this.attributes[sName]) + '"';
		sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
		for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
			sHtml	+= ' ' + this.childNodes[nIndex].attributes["name"] + '="' + this.childNodes[nIndex].attributes["value"] + '"';
		return sHtml + ' />';
	}
	else
		return this.$getTag.call(this);
};

// Register Element
ample.extend(cXHTMLElement_object);
