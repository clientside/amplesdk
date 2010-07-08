/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tooltip_pane	= function(){};
cXULElement_tooltip_pane.prototype	= new cXULPopupElement;

// Public Methods
cXULElement_tooltip_pane.prototype.setText	= function(sValue) {
	this.$getContainer("gateway").innerHTML	= sValue;
};

// Class Events Handlers
cXULElement_tooltip_pane.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Render
cXULElement_tooltip_pane.prototype.$getTagOpen	= function() {
    return '<div class="xul-tooltip-pane" style="position:absolute;display:none;">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<div class="xul-tooltip-pane--gateway">';
};

cXULElement_tooltip_pane.prototype.$getTagClose	= function() {
	return '	</div>\
			</div>';
};

// Register Widget with language
oXULNamespace.setElement("tooltip-pane", cXULElement_tooltip_pane);
