/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treecol	= function(){};
cXULElement_treecol.prototype	= new cXULElement("treecol");
cXULElement_treecol.prototype.$hoverable	= true;

// Default attribute values
cXULElement_treecol.attributes	= {
	"minwidth":	"16",
	"sortDirection":	"natural"
};

//Public Methods
cXULElement_treecol.prototype.$isAccessible	= function() {
	return this.parentNode ? this.parentNode.$isAccessible() : true;
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
			if (oEvent.attrName ==  "hidden" && this.parentNode) {
				var nCell	= this.parentNode.items.$indexOf(this);
				for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
					if (aItems[nIndex].row)
						aItems[nIndex].row.cells[nCell].setAttribute("hidden", oEvent.newValue);
			}
		}
	}
};

cXULElement_treecol.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "width") {
		this.$getContainer("stretch").style.width	= sValue != null ? sValue + "px" : '';
		this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[this.parentNode.items.$indexOf(this) + (this.parentNode.parentNode.hasAttribute("type") ? 1 : 0)].getElementsByTagName("div")[0].style.width	= sValue != null ? sValue + "px" : '';
	}
	else
	if (sName == "label")
		this.$getContainer("label").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	else
	if (sName == "hidden") {
		var nCell	= this.parentNode.items.$indexOf(this);
		this.$getContainer().style.display	= sValue == "true" ? "none" : "";
		this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + (this.parentNode.parentNode.hasAttribute("type") ? 1 : 0)].style.display	= sValue == "true" ? "none" : "";
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_treecol.prototype.$getTagOpen	= function() {
	return '<td class="xul-treecol' +(this.hasAttribute("class") ? " " + this.getAttribute("class") : "")+ '"' + (this.getAttribute("hidden") == "true" ? ' style="display:none"' : "")+ '>\
				<div class="xul-treecol--box" style="position:relative;width:100%;">\
					<div class="xul-treecol--label xul-treecol--gateway" style="position:absolute;width:100%;overflow:hidden;"> ' +(this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : "");
};

// Element Render: close
cXULElement_treecol.prototype.$getTagClose	= function() {
	return			'</div>\
					<div class="xul-treecol--resizer" style="position: absolute;right:0px;"><br /></div>\
				</div>\
				<div class="xul-treecol--stretch" style="height:1pt;font-size:1px;' + (this.hasAttribute("width") ? 'width:' + this.getAttribute("width") + 'px' : '') + '"></div>\
				<div style="height:1pt;font-size:1px;' + (this.hasAttribute("minwidth") ? 'width:' + this.getAttribute("minwidth") + 'px' : '') + '"></div>\
			</td>';
};

// Register Element
ample.extend(cXULElement_treecol);
