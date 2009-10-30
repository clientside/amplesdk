/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_tooltip_pane	= function(){};
cXULElement_tooltip_pane.prototype	= new cXULPopupElement;

// Public Methods
cXULElement_tooltip_pane.prototype.setText	= function(sValue)
{
	this.$getContainer().innerHTML	= sValue;
};

// Render
cXULElement_tooltip_pane.prototype.$getTagOpen	= function()
{
    return '<span class="xul-tooltip-pane" style="position:absolute;display:none;">';
};

cXULElement_tooltip_pane.prototype.$getTagClose	= function()
{
	return '</span>';
};

// Register Widget with language
oXULNamespace.setElement("tooltip-pane", cXULElement_tooltip_pane);
