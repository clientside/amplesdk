/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_textarea	= function(){};
cXHTMLElement_textarea.prototype	= new cXHTMLElement;
cXHTMLElement_textarea.prototype.tabIndex	= 0;

// Public Properties
cXHTMLElement_textarea.prototype.form		= null;

cXHTMLElement_textarea.prototype.$isAccessible	= function() {
	return !this.getAttribute("disabled");
};

cXHTMLElement_textarea.prototype.$getValue	= function(sValue) {
	return this.$getContainer().value;
};

cXHTMLElement_textarea.prototype.$validate	= function() {
	return true;
};

// Public methods
cXHTMLElement_textarea.prototype.select	= function() {
	this.$getContainer().select();
};

// Events Handlers
cXHTMLElement_textarea.prototype._onChange	= function(oEvent) {
    // Fire Event
    var oEvent2 = this.ownerDocument.createEvent("UIEvents");
    oEvent2.initUIEvent("change", true, false, window, null);

    this.dispatchEvent(oEvent2);
};

// Events Handlers
cXHTMLElement_textarea.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Renderers
cXHTMLElement_textarea.prototype.$getTagOpen	= function() {
    var sHtml   = '<' + this.localName + ' onchange="ample.$instance(this)._onChange(event)"';
    for (var sName in this.attributes)
    	if (sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '>';
};

// Register Element with language
oXHTMLNamespace.setElement("textarea", cXHTMLElement_textarea);
