/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tooltip	= function(){};
cXULElement_tooltip.prototype	= new cXULPopupElement("tooltip");
cXULElement_tooltip.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULInputElement.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "top") {
		if (!isNaN(sValue) && !isNaN(this.attributes["left"]))
			this.moveTo(this.attributes["left"] * 1, sValue * 1);
	}
	else
	if (sName == "left") {
		if (!isNaN(sValue) && !isNaN(this.attributes["top"]))
			this.moveTo(sValue * 1, this.attributes["top"] * 1);
	}
	else
		cXULPopupElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_tooltip.prototype.$getTagOpen		= function() {
    return '<div style="display:none;position:absolute;" class="xul-tooltip' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_tooltip.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_tooltip);
