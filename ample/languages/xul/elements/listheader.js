/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listheader	= function(){};
cXULElement_listheader.prototype	= new cXULElement("listheader");
cXULElement_listheader.prototype.$hoverable	= true;

// Default attribute values
cXULElement_listheader.attributes	= {
	"width":	"100",
	"minwidth":	"10",
	"sortDirection":	"natural"
};

// Public Methods
cXULElement_listheader.prototype.$isAccessible	= function() {
	return this.parentNode.parentNode.$isAccessible();
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
			switch (oEvent.attrName) {
				case "sortDirection":
					cXULElement_listbox.sort(this.parentNode.parentNode, this.$getContainer().cellIndex, oEvent.newValue == "ascending");
					break;

				case "width":
					this.$getContainer("stretch").style.width	= oEvent.newValue != null ? oEvent.newValue + "px" : '';
					this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[this.parentNode.items.$indexOf(this) + (this.parentNode.parentNode.attributes["type"] ? 1 : 0)].getElementsByTagName("div")[0].style.width	= oEvent.newValue != null ? oEvent.newValue + "px" : '';
				break;

				case "label":
					this.$getContainer("label").innerHTML	= oEvent.newValue || '';
					break;

				case "hidden":
			    	var nCell	= this.parentNode.items.$indexOf(this);
			    	this.$getContainer().style.display	= oEvent.newValue == "true" ? "none" : "";
			        for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
			        	aItems[nIndex].cells[nCell].setAttribute("hidden", oEvent.newValue);
			        this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + (this.parentNode.parentNode.attributes["type"] ? 1 : 0)].style.display	= oEvent.newValue == "true" ? "none" : "";
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listhead)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listhead)
			this.parentNode.items.$remove(this);
	}
};

// Element Render: open
cXULElement_listheader.prototype.$getTagOpen	= function() {
	return '<td class="xul-listheader' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' +(this.attributes["hidden"] == "true" ? ' style="display:none"' : "")+ '>\
				<div class="xul-listheader--box" style="position:relative;width:100%;">\
    				<div class="xul-listheader--label xul-listheader--gateway" style="position:absolute;width:100%;overflow:hidden;"> ' + (this.attributes["label"] || "");
};

// Element Render: close
cXULElement_listheader.prototype.$getTagClose	= function() {
	return			'</div>\
					<div class="xul-listheader--resizer" style="position: absolute;right:0px;"><br /></div>\
				</div>\
				<div class="xul-listheader--stretch" style="height:1pt;font-size:1px;' + (this.attributes["width"] ? 'width:' + this.attributes["width"] + 'px' : "") + '"></div>\
				<div style="height:1pt;font-size:1px;' + (this.attributes["minwidth"] ? 'width:' + this.attributes["minwidth"] + 'px' : '') + '"></div>\
    		</td>';
};

// Register Element
ample.extend(cXULElement_listheader);
