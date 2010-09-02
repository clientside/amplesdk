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

// Public Methods
cXHTMLElement_select.prototype.add		= function(oElement, nIndex) {
	return this.appendChild(oElement);
};

cXHTMLElement_select.prototype.remove	= function(nIndex) {
	return this.removeChild(this.options[nIndex]);
};

// Class Events Handlers
cXHTMLElement_select.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("value").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("value").blur();
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
    	bMultiple	= !!this.attributes.multiple,
    	sClassNameMultiple	= bMultiple ? sClassName + '-multiple-' : '';
    return '<span class="' + sClassName + ' ' + sClassNameMultiple +
					("class" in this.attributes ? ' ' + this.attributes["class"] : '')+
					(this.attributes["required"] ? ' ' + sClassName + '_required' : '')+
					(this.attributes["disabled"] ? ' ' + sClassName + '_disabled' : '')+
    		'">\
				<div style="position:absolute;margin-top:-2px;white-space:nowrap" class="' + sClassName + '--placeholder">' +(this.getAttribute("placeholder") || '')+ '</div>\
   				<div class="' + sClassName + '--field ' + sClassNameMultiple + '--field" style="position:relative">\
    				<span class="' + sClassName + '--button" style="right:0;"></span>\
    				<input class="' + sClassName + '--value" type="text" />\
   				</div>\
   				<div class="' + sClassName + '--popup" style="' +(bMultiple ? '' : 'position:absolute;display:none;')+ '">\
    				<div class="' + sClassName + '--gateway">';
};

cXHTMLElement_select.prototype.$getTagClose	= function() {
	return 			'</div>\
				</div>\
			</span>';
};

// Register Element
ample.extend(cXHTMLElement_select);
