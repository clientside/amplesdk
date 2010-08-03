var cXULElement_panel	= function(){};
cXULElement_panel.prototype	= new cXULPopupElement("panel");
cXULElement_panel.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_panel.attributes	= {};
cXULElement_panel.attributes.orient	= "vertical";
cXULElement_panel.attributes.width	= "150";

// Class Events Handlers
cXULElement_page.handlers	= {
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
cXULElement_panel.prototype.$getTagOpen	= function() {
    return '<div style="display:none;position:absolute;width:' + this.attributes["width"] + 'px;" class="xul-panel" onmousedown="event.cancelBubble=true;" oncontextmenu="return false">';
};

// Element Render: close
cXULElement_panel.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_panel);