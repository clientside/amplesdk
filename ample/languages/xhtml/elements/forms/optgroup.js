/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_optgroup	= function(){};
cXHTMLElement_optgroup.prototype	= new cXHTMLElement("optgroup");

// Class Events Handlers
cXHTMLElement_optgroup.handlers	= {
	"mouseenter":	function(oEvent) {
		this.$setPseudoClass("hover", true, "value");
	},
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("hover", false, "value");
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

cXHTMLElement_optgroup.prototype.$getTagOpen	= function() {
    var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName;
	return '<div class="' +	sClassName +
				("class" in this.attributes ? ' ' + this.attributes["class"] : '')+
				(this.attributes["required"] ? ' ' + sClassName + '_required' : '')+
				(this.attributes["disabled"] ? ' ' + sClassName + '_disabled' : '')+
			'">\
				<div class="' + sClassName + '--value">' +(this.attributes.label || '')+ '</div>\
				<div class="' + sClassName + '--gateway">';
};

cXHTMLElement_optgroup.prototype.$getTagClose	= function() {
	return 		'</div>\
			</div>';
};

// Register Element
ample.extend(cXHTMLElement_optgroup);
