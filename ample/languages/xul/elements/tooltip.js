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

// Class Events Handlers
cXULElement_tooltip.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "top":
					if (!isNaN(oEvent.newValue) && !isNaN(this.attributes["left"]))
						this.moveTo(this.attributes["left"] * 1, oEvent.newValue * 1);
					break;

				case "left":
					if (!isNaN(oEvent.newValue) && !isNaN(this.attributes["top"]))
						this.moveTo(oEvent.newValue * 1, this.attributes["top"] * 1);
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
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
