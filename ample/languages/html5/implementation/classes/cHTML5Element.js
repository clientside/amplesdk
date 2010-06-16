/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element	= function(){};

cHTML5Element.prototype	= new AMLElement;

//
cHTML5Element.prototype.$isAccessible	= function() {
	return !this.hasAttribute("disabled");
};

//
cHTML5Element.mapAttribute	= function(oElement, sName, sValue) {
	switch (sName) {
		case "tabIndex":
			this.tabIndex	= isNaN(sValue) ? -1 : sValue * 1;
			break;

		case "accessKey":
			this.accessKey	= sValue || null;
			break;

		case "id":
		case "class":
		case "style":
			// Handled in the core
			break;

		default:
			this.$getContainer()[sName]	= sValue;
	}
};

cHTML5Element.html5to4	= {
	"article":	"div",
	"aside":	"div",
	"section":	"div",
	"footer":	"div",
	"header":	"div",
	"nav":		"div"
};

// Default Element Render: open
cHTML5Element.prototype.$getTagOpen	= function()
{
	var sHtml   = '<' + (this.localName in cHTML5Element.html5to4 ? cHTML5Element.html5to4[this.localName] : this.localName);
	for (var sName in this.attributes)
		if (sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '>';
};

// Default Element Render: close
cHTML5Element.prototype.$getTagClose	= function()
{
    return '</' + (this.localName in cHTML5Element.html5to4 ? cHTML5Element.html5to4[this.localName] : this.localName) + '>';
};

// Register Element with language
oHTML5Namespace.setElement("#element", cHTML5Element);
