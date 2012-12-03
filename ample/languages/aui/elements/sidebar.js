/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_sidebar	= function(){};
cAUIElement_sidebar.prototype	= new cAUIElement("sidebar");

// Public methods
cAUIElement_sidebar.prototype.toggle	= function(bState) {
	var oContainer	= this.$getContainer(),
		oStyle		= oContainer.style;
	// Reset old position
	var oPositionOld	= this.getBoundingClientRect();
	oStyle.width	= "";
	oStyle.height	= "";
	// Toggle pseudo-class
	this.$setPseudoClass("hover", bState || false);
	// Set new position
	var oPositionNew	= this.getBoundingClientRect();
	oStyle.width	=(oPositionOld.right - oPositionOld.left) + "px";
	oStyle.height	=(oPositionOld.bottom - oPositionOld.top) + "px";
	// Play effect
	ample.query(this).animate({"width": (oPositionNew.right - oPositionNew.left) + "px", "height": (oPositionNew.bottom - oPositionNew.top) + "px"}, 500);
};

// Class Event Handlers
cAUIElement_sidebar.handlers	= {
	"mouseenter":	function(oEvent) {
		this.toggle(true);
	},
	"mouseleave":	function(oEvent) {
		this.toggle(false);
	}
};

// Element Renderers
cAUIElement_sidebar.prototype.$getTagOpen	= function() {
	var sHtml	= '<div' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + ' class="aui-sidebar';
	sHtml	+=(this.hasAttribute("style") ? " " + "aui-sidebar-" + this.getAttribute("class") : '') + '">';

	return sHtml;
};

cAUIElement_sidebar.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cAUIElement_sidebar);
