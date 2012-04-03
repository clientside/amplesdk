var cXULElement_panel	= function(){};
cXULElement_panel.prototype	= new cXULPopupElement("panel");
cXULElement_panel.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_panel.attributes	= {};
cXULElement_panel.attributes.orient	= "vertical";
cXULElement_panel.attributes.width	= "150";

cXULElement_panel.prototype.$mapAttribute	= function(sName, sValue) {
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
cXULElement_panel.prototype.$getTagOpen	= function() {
    return '<div class="xul-panel' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="display:none;position:absolute;width:' + this.attributes["width"] + 'px;" onmousedown="event.cancelBubble=true;" oncontextmenu="return false">';
};

// Element Render: close
cXULElement_panel.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_panel);