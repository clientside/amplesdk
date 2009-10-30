/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement	= function(){};

cXHTMLElement.prototype	= new AMLElement;
cXHTMLElement.prototype.AMLElement	= new AMLElement;

// Class event handlers
/*
cXHTMLElement.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target != oEvent.currentTarget)
			return;

		switch (oEvent.attrName) {
			case "tabIndex":
				this.tabIndex	= window.isNaN(sValue) ? -1 : sValue * 1;
				break;

			case "accessKey":
				this.accessKey	= sValue || null;
				break;
		}
	}
};
*/

// Public Properties
cXHTMLElement.prototype.setAttribute	= function(sName, sValue)
{
	// Only set process own attributes
	if (sName.indexOf(":") ==-1) {
		if (sName == "tabIndex")
			this.tabIndex	= isNaN(sValue) ? -1 : sValue * 1;
		else
		if (sName == "accessKey")
			this.accessKey	= sValue;
		else
		if (sName != "id" && sName != "class" && sName != "style")
			this.$getContainer()[sName]	= sValue;
	}

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXHTMLElement.prototype.removeAttribute	= function(sName)
{
	if (sName.indexOf(":") ==-1) {
		if (sName == "tabIndex")
			this.tabIndex	=-1;
		else
		if (sName == "accessKey")
			this.accessKey	= null;
		else
		if (sName != "id" && sName != "class" && sName != "style")
			this.$getContainer()[sName]	= null;
	}
	this.AMLElement.removeAttribute.call(this, sName);
};

// Default Element Render: open
cXHTMLElement.prototype.$getTagOpen	= function()
{
	var sHtml   = '<' + this.localName;
	for (var sName in this.attributes)
		if (sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '>';
};

// Default Element Render: close
cXHTMLElement.prototype.$getTagClose	= function()
{
    return '</' + this.localName + '>';
};

// Register Element with language
oXHTMLNamespace.setElement("#element", cXHTMLElement);
