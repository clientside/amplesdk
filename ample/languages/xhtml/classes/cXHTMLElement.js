/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement	= function(sLocalName) {
	this.localName	= sLocalName;
};

cXHTMLElement.prototype	= new ample.classes.Element;
cXHTMLElement.prototype.namespaceURI= "http://www.w3.org/1999/xhtml";
cXHTMLElement.prototype.localName	= "#element";
cXHTMLElement.prototype.accessKey	= null;

// Public methods
cXHTMLElement.prototype.$isAccessible	= function() {
	return !this.hasAttribute("disabled");
};

cXHTMLElement.prototype.$mapAttribute	= function(sName, sValue) {
	switch (sName) {
		case "tabIndex":
			this.tabIndex	= isNaN(sValue) ? -1 : sValue * 1;
			break;

		case "accessKey":
			this.accessKey	= sValue || null;
			break;

		default:
			var oContainer	= this.$getContainer();
			if (oContainer)
				oContainer[sName]	= sValue;
	}
};

cXHTMLElement.html524	= {
	"article":	"div",
	"aside":	"div",
	"section":	"div",
	"footer":	"div",
	"header":	"div",
	"nav":		"div",
	//
	"datalist":	"div",
	"output":	"span"
};

// Default Element Render: open
cXHTMLElement.prototype.$getTagOpen	= function() {
	var sHtml	= '<' + (this.localName in cXHTMLElement.html524 ? cXHTMLElement.html524[this.localName] : this.localName),
		sClass	= this.getAttribute("class");
	for (var nIndex = 0, oAttribute; nIndex < this.attributes.length; nIndex++)
		if ((oAttribute = this.attributes[nIndex]) && oAttribute.name != "class" && oAttribute.name != "id" && !oAttribute.prefix)
			sHtml	+= ' ' + oAttribute.name + '="' + ample.$encodeXMLCharacters(oAttribute.value) + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + (sClass ? ' ' + sClass : '') + '"';
	return sHtml + '>';
};

// Default Element Render: close
cXHTMLElement.prototype.$getTagClose	= function() {
	return '</' + (this.localName in cXHTMLElement.html524 ? cXHTMLElement.html524[this.localName] : this.localName) + '>';
};

// Register Element
ample.extend(cXHTMLElement);
