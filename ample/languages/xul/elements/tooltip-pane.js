/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tooltip_pane	= function(){};
cXULElement_tooltip_pane.prototype	= new cXULPopupElement("tooltip-pane");

// Public Methods
cXULElement_tooltip_pane.prototype.setText	= function(sValue) {
	this.$getContainer("gateway").innerHTML	= ample.$encodeXMLCharacters(sValue);
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

// Register Element
ample.extend(cXULElement_tooltip_pane);
