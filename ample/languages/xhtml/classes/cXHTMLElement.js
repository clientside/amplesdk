/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement	= function(sLocalName) {
	this.localName	= sLocalName;
};

cXHTMLElement.prototype	= new ample.classes.AMLElement;
cXHTMLElement.prototype.namespaceURI= "http://www.w3.org/1999/xhtml";
cXHTMLElement.prototype.localName	= "#element";
cXHTMLElement.prototype.accessKey	= null;

// Public methods
cXHTMLElement.prototype.$isAccessible	= function() {
	return !this.attributes["disabled"];
};

// Static method
cXHTMLElement.mapAttribute	= function(oElement, sName, sValue) {
	switch (sName) {
		case "tabIndex":
			oElement.tabIndex	= isNaN(sValue) ? -1 : sValue * 1;
			break;

		case "accessKey":
			oElement.accessKey	= sValue || null;
			break;

		case "id":
		case "class":
		case "style":
			break;

		default:
			oElement.$getContainer()[sName]	= sValue;
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
	var sHtml   = '<' + (this.localName in cXHTMLElement.html524 ? cXHTMLElement.html524[this.localName] : this.localName);
	for (var sName in this.attributes)
		if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '>';
};

// Default Element Render: close
cXHTMLElement.prototype.$getTagClose	= function() {
    return '</' + (this.localName in cXHTMLElement.html524 ? cXHTMLElement.html524[this.localName] : this.localName) + '>';
};

// Register Element
ample.extend(cXHTMLElement);
