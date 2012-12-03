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
		for (var nIndex = 0, oAttribute; nIndex < this.attributes.length; nIndex++)
			if ((oAttribute = this.attributes[nIndex]).name != "class" && oAttribute.name != "id" && oAttribute.name.indexOf(':') ==-1)
				sHtml	+= ' ' + oAttribute.name + '="' + ample.$encodeXMLCharacters(oAttribute.value) + '"';
		sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '"';
		for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
			sHtml	+= ' ' + this.childNodes[nIndex].getAttribute("name") + '="' + this.childNodes[nIndex].getAttribute("value") + '"';
		return sHtml + ' />';
	}
	else
		return this.$getTag.call(this);
};

// Register Element
ample.extend(cXHTMLElement_object);
