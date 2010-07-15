/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treecol	= function(){};
cXULElement_treecol.prototype	= new cXULElement;
cXULElement_treecol.prototype.$hoverable	= true;

//Public Methods
cXULElement_treecol.prototype.$isAccessible	= function() {
	return this.parentNode.parentNode.$isAccessible();
};

// Class Events Handlers
cXULElement_treecol.handlers	= {
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		this.setCapture(true);
		cXULSelectElement.onResizeStart(oEvent);
		if (!cXULSelectElement.resizing)
			this.$setPseudoClass("active", true);
	},
	"mouseup":		function(oEvent) {
		this.releaseCapture();
		if (!cXULSelectElement.resizing)
			this.$setPseudoClass("active", false);
		cXULSelectElement.onResizeEnd(oEvent);
	},
	"mousemove":	function(oEvent) {
		cXULSelectElement.onResize(oEvent);
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "width":
					this.$getContainer("box").style.width	= oEvent.newValue != null ? oEvent.newValue + "px" : '';
					this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[this.parentNode.items.$indexOf(this) + (this.parentNode.parentNode.attributes["type"] ? 1 : 0)].getElementsByTagName("div")[0].style.width	= oEvent.newValue != null ? oEvent.newValue + "px" : '';
					break;

				case "label":
					this.$getContainer("label").innerHTML	= oEvent.newValue || '';
					break;

				case "hidden":
//				case "hideheader":
					var nCell	= this.parentNode.items.$indexOf(this);
					this.$getContainer().style.display	= oEvent.newValue == "true" ? "none" : "";
					for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
						if (aItems[nIndex].row)
							aItems[nIndex].row.cells[nCell].setAttribute("hidden", oEvent.newValue);
					this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + (this.parentNode.parentNode.attributes["type"] ? 1 : 0)].style.display	= oEvent.newValue == "true" ? "none" : "";
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Element Render: open
cXULElement_treecol.prototype.$getTagOpen	= function() {
	return '<td class="xul-treecol' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' + (this.attributes["hidden"] == "true" ? ' style="display:none"' : "")+ ' align="left">\
				<div class="xul-treecol--box"' + (this.attributes["width"] ? ' style="width:' + this.attributes["width"] + 'px"' : "") + '>\
					<div class="xul-treecol--label xul-treecol--gateway"> ' +(this.attributes["label"] || "");
};

// Element Render: close
cXULElement_treecol.prototype.$getTagClose	= function() {
    return			'</div>\
					<div class="xul-treecol--resizer"><br /></div>\
				</div>\
				<div class="xul-treecol--stretch" style="height:1pt;font-size:1px;' + (this.attributes["minwidth"] ? 'width:' + this.attributes["minwidth"] + 'px' : '') + '"></div>\
    		</td>';
};

// Register Element with language
oXULNamespace.setElement("treecol", cXULElement_treecol);
