/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_select	= function() {
    this.options	= new AMLNodeList;

    var oSelf	= this;
    this.options.add	= function (oElement, nIndex) {oSelf.add(oElement, nIndex)};
    this.options.remove	= function (nIndex) {oSelf.remove(nIndex)};
};
cXHTMLElement_select.prototype	= new cXHTMLElement("select");
cXHTMLElement_select.prototype.tabIndex		= 0;

// Public Properties
cXHTMLElement_select.prototype.form		= null;
cXHTMLElement_select.prototype.options	= null;

cXHTMLElement_select.prototype.$getValue	= function() {
	if (this.hasAttribute("multiple")) {
		var aValue	= [];
		for (var nIndex = 0; nIndex < this.options.length; nIndex++)
			if (this.options[nIndex].$getContainer().selected)
				aValue[aValue.length]	= this.options[nIndex].$getContainer().value;
		return aValue;
	}
	else
		return this.$getContainer().value;
};

// Public Methods
cXHTMLElement_select.prototype.add		= function(oElement, nIndex) {
	return this.appendChild(oElement);
};

cXHTMLElement_select.prototype.remove	= function(nIndex) {
	return this.removeChild(this.options[nIndex]);
};

// Events Handlers
cXHTMLElement_select.prototype._onChange	= function(oEvent) {
    // Fire Event
    var oEvent2  = this.ownerDocument.createEvent("UIEvents");
    oEvent2.initUIEvent("change", true, false, window, null);

    this.dispatchEvent(oEvent2);
};

// Class Events Handlers
cXHTMLElement_select.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_option)
			this.options.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_option)
			this.options.$remove(oEvent.target);
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Renderers
cXHTMLElement_select.prototype.$getTagOpen	= function() {
    var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName,
    	aHtml   = ['<span'];
    for (var sName in this.attributes)
    	if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
    		aHtml.push(' ' + sName + '="' + this.attributes[sName].replace(/"/g, '\"') + '"');
    aHtml.push(' class="' + sClassName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '">');
	aHtml.push(	'<div style="position:absolute;margin-top:-2px;white-space:nowrap" class="' + sClassName + '--placeholder">' +(this.getAttribute("placeholder") || '')+ '</div>');
	aHtml.push(	'<div class="' + sClassName + '--field" style="position:relative">');
	aHtml.push(		'<span class="' + sClassName + '--button" style="right:0;"></span>');
	aHtml.push(		'<div class="' + sClassName + '--value"></div>');
	aHtml.push(	'</div>');
    aHtml.push(	'<ul class="' + sClassName + '--popup ' + sClassName + '--gateway" style="position:absolute">');
    return aHtml.join('');
};

cXHTMLElement_select.prototype.$getTagClose	= function() {
	return 		'</ul>\
			</span>';
};

// Register Element
ample.extend(cXHTMLElement_select);
