/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listheader	= function(){};
cXULElement_listheader.prototype	= new cXULElement("listheader");
cXULElement_listheader.prototype.$hoverable	= true;

// Default attribute values
cXULElement_listheader.attributes	= {
	"minwidth":	"16",
	"sortDirection":	"natural"
};

// Public Methods
cXULElement_listheader.prototype.$isAccessible	= function() {
	return this.parentNode ? this.parentNode.$isAccessible() : true;
};

// Class Events Handlers
cXULElement_listheader.handlers	= {
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
	"click":		function(oEvent) {
		if (oEvent.button < 2 && oEvent.$pseudoTarget != this.$getContainer("resizer"))
			this.setAttribute("sortDirection", this.getAttribute("sortDirection") != "ascending" ? "ascending" : "descending");
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "hidden") {
				var nCell	= this.parentNode.items.$indexOf(this);
				for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
					aItems[nIndex].cells[nCell].setAttribute("hidden", oEvent.newValue);
			}
		}
	}
};

cXULElement_listheader.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "sortDirection")
		cXULElement_listbox.sort(this.parentNode.parentNode, this.$getContainer().cellIndex, sValue == "ascending");
	else
	if (sName == "width") {
		this.$getContainer("stretch").style.width	= sValue != null ? sValue + "px" : '';
		this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[this.parentNode.items.$indexOf(this) + (this.parentNode.parentNode.getAttribute("type") ? 1 : 0)].getElementsByTagName("div")[0].style.width	= sValue != null ? sValue + "px" : '';
	}
	else
	if (sName == "label")
		this.$getContainer("label").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	else
	if (sName == "hidden") {
		var nCell	= this.parentNode.items.$indexOf(this);
		this.$getContainer().style.display	= sValue == "true" ? "none" : "";
		this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + (this.parentNode.parentNode.getAttribute("type") ? 1 : 0)].style.display	= sValue == "true" ? "none" : "";
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_listheader.prototype.$getTagOpen	= function() {
	return '<td class="xul-listheader' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"' +(this.getAttribute("hidden") == "true" ? ' style="display:none"' : "")+ '>\
				<div class="xul-listheader--box" style="position:relative;width:100%;">\
					<div class="xul-listheader--label xul-listheader--gateway" style="position:absolute;width:100%;overflow:hidden;"> ' + (this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : "");
};

// Element Render: close
cXULElement_listheader.prototype.$getTagClose	= function() {
	return			'</div>\
					<div class="xul-listheader--resizer" style="position: absolute;right:0px;"><br /></div>\
				</div>\
				<div class="xul-listheader--stretch" style="height:1pt;font-size:1px;' + (this.hasAttribute("width") ? 'width:' + this.getAttribute("width") + 'px' : "") + '"></div>\
				<div style="height:1pt;font-size:1px;' + (this.hasAttribute("minwidth") ? 'width:' + this.getAttribute("minwidth") + 'px' : '') + '"></div>\
			</td>';
};

// Register Element
ample.extend(cXULElement_listheader);
