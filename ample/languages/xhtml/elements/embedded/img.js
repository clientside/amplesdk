/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_img	= function(){};
cXHTMLElement_img.prototype	= new cXHTMLElement("img");

// Element Render: open
cXHTMLElement_img.prototype.$getTagOpen	= function() {
	var sHtml	= '<' + this.localName + ' onmousedown="return '+ "false" + '" ondragstart="return '+ "false" + '"';
	for (var nIndex = 0, oAttribute; nIndex < this.attributes.length; nIndex++)
		if ((oAttribute = this.attributes[nIndex]).name != "class" && oAttribute.name != "id" && oAttribute.name.indexOf(':') ==-1)
			sHtml	+= ' ' + oAttribute.name + '="' + ample.$encodeXMLCharacters(oAttribute.value) + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '"';
	return sHtml + '/>';
};

cXHTMLElement_img.prototype.$getTagClose	= function() {
	return '';
};

// Register Element
ample.extend(cXHTMLElement_img);
