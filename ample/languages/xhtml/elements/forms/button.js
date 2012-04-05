/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_button	= function(){
		this.validity	= new cXHTMLValidityState;
};
cXHTMLElement_button.prototype	= new cXHTMLInputElement("button");

// Class Events Handlers
cXHTMLElement_button.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		cXHTMLInputElement.register(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		//
		cXHTMLInputElement.unregister(this);
	},
	"mousedown":	function() {
		this.$setPseudoClass("active", true);
		this.setCapture(true);
	},
	"mouseup":	function() {
		this.$setPseudoClass("active", false);
		this.releaseCapture();
	},
	"click":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	}
};

cXHTMLElement_button.prototype.$getTagOpen	= function() {
	var sClassName	=(this.prefix ? this.prefix + '-' : '') + this.localName,
		bDisabled	= this.attributes["disabled"] && this.attributes["disabled"] != "false";
	return '<span class="' + sClassName + ' ' +
				("class" in this.attributes ? ' ' + this.attributes["class"] : '') +
				' ' + sClassName + '_' + (bDisabled ? 'disabled' : 'enabled') + ' '+
				'" ' +(this.attributes.style ? ' style="' + this.attributes.style + '"' : '')+ '>\
				<span class="' + sClassName + '--before" style="float:left"></span>\
				<span class="' + sClassName + '--after" style="float:right"></span>\
				<div class="' + sClassName + '--field" style="position:relative">\
					<div class="' + sClassName + '--label">';
};

cXHTMLElement_button.prototype.$getTagClose	= function() {
	return '		</div>\
				</div>\
			</span>';
};

// Register Element
ample.extend(cXHTMLElement_button);
