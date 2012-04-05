/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_optgroup	= function(){};
cXHTMLElement_optgroup.prototype	= new cXHTMLElement("optgroup");
cXHTMLElement_optgroup.prototype.$selectable	= false;

// Class Events Handlers
cXHTMLElement_optgroup.handlers	= {
	"mouseover":	function(oEvent) {
		if (oEvent.target == this)
			this.$setPseudoClass("hover", true, "value");
	},
	"mouseout":	function(oEvent) {
		if (oEvent.target == this)
			this.$setPseudoClass("hover", false, "value");
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		// Add to the options collection
		for (var oNode = this, nDepth = 0; oNode = oNode.parentNode;)
			if (oNode instanceof cXHTMLElement_select)
				break;
			else
				nDepth++;
		if (oNode) {
			//
			if (this.parentNode != oNode)
				this.$getContainer("gap").style.width	= nDepth + "em";
		}
	}
};

cXHTMLElement_optgroup.prototype.$getTagOpen	= function() {
	var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName;
	return '<div class="' +	sClassName +
				("class" in this.attributes ? ' ' + this.attributes["class"] : '')+
				(this.attributes["disabled"] ? ' ' + sClassName + '_disabled' : '')+
			'">\
				<div class="' + sClassName + '--gap" style="height:1em;float:left"></div>\
				<div class="' + sClassName + '--value">' +(this.attributes.label || '')+ '</div>\
				<div class="' + sClassName + '--gateway">';
};

cXHTMLElement_optgroup.prototype.$getTagClose	= function() {
	return 		'</div>\
			</div>';
};

// Register Element
ample.extend(cXHTMLElement_optgroup);
