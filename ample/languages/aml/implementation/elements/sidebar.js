/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_sidebar	= function(){};
cAMLElement_sidebar.prototype	= new cAMLElement;

// Public methods
cAMLElement_sidebar.prototype.toggle	= function(bState)
{
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
	this.$play("width:" + (oPositionNew.right - oPositionNew.left) + "px; height:" + (oPositionNew.bottom - oPositionNew.top) + "px;", 500, AMLElement.EFFECT_ACCELERATE);
};

// Class Event Handlers
cAMLElement_sidebar.handlers	= {
	"mouseenter":	function(oEvent) {
		this.toggle(true);
	},
	"mouseleave":	function(oEvent) {
		this.toggle(false);
	}
};

// Element Renderers
cAMLElement_sidebar.prototype.$getTagOpen	= function()
{
	var sHtml	= '<div' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') + ' class="aml-sidebar';
	sHtml  +=(this.attributes["class"] ? " " + "aml-sidebar-" + this.attributes["class"] : '') + '">';

	return sHtml;
};

cAMLElement_sidebar.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oAMLNamespace.setElement("sidebar", cAMLElement_sidebar);
