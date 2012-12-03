var cXULElement_panel	= function(){};
cXULElement_panel.prototype	= new cXULPopupElement("panel");
cXULElement_panel.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_panel.attributes	= {};
cXULElement_panel.attributes.orient	= "vertical";
cXULElement_panel.attributes.width	= "150";

// Element Render: open
cXULElement_panel.prototype.$getTagOpen	= function() {
	return '<div class="xul-panel' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="display:none;position:absolute;width:' + this.getAttribute("width") + 'px;" onmousedown="event.cancelBubble=true;" oncontextmenu="return false">';
};

// Element Render: close
cXULElement_panel.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_panel);