/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_br	= function(){};
cXHTMLElement_br.prototype	= new cXHTMLElement("br");

// Element Render: close (cancel double tag)
cXHTMLElement_br.prototype.$getTagOpen	= function() {
	var sHtml	= '<' + (this.localName in cXHTMLElement.html524 ? cXHTMLElement.html524[this.localName] : this.localName),
		sClass	= this.getAttribute("class");
	for (var nIndex = 0, oAttribute; nIndex < this.attributes.length; nIndex++)
		if ((oAttribute = this.attributes[nIndex]) && oAttribute.name != "class" && oAttribute.name != "id" && !oAttribute.prefix)
			sHtml	+= ' ' + oAttribute.name + '="' + ample.$encodeXMLCharacters(oAttribute.value) + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + (sClass ? ' ' + sClass : '') + '"';
	return sHtml + '/>';
};

cXHTMLElement_br.prototype.$getTagClose	= function() {
	return '';
};

// Register Element
ample.extend(cXHTMLElement_br);
