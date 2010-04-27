/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listheader	= function(){};
cXULElement_listheader.prototype	= new cXULElement;
cXULElement_listheader.prototype.$hoverable	= true;

// Private Properties
cXULElement_listheader.prototype._sortDir	= "none";

// Class Events Handlers
cXULElement_listheader.handlers	= {
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		this.$setPseudoClass("active", true);
	},
	"mouseup":		function(oEvent) {
		this.$setPseudoClass("active", false);
	},
/*
	"mousemove":	function(oEvent) {
		var oElementDOM	= this.$getContainer();
		var oPosition	= this.getBoundingClientRect();
		if (Math.abs(oPosition.left - oEvent.clientX) < 10 || Math.abs(oPosition.right - oEvent.clientX) < 10)
			oElementDOM.style.cursor	= "col-resize";
		else
			oElementDOM.style.cursor	= "";
	},
*/
	"click":		function(oEvent) {
	    if (oEvent.button < 2) {
	        this._sortDir   = this._sortDir != "asc" ? "asc" : "desc";
	        this.parentNode.parentNode.sort(this.$getContainer().cellIndex, this._sortDir == "asc");
	    }
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "hidden":
			    	var nCell	= this.parentNode.items.$indexOf(this);
			    	this.$getContainer().style.display	= oEvent.newValue == "true" ? "none" : "";
			        for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
			        	aItems[nIndex].cells[nCell].setAttribute("hidden", oEvent.newValue);
			        this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + 1].style.display	= oEvent.newValue == "true" ? "none" : "";
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
	return '<th class="xul-listheader' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : "")+ ' align="left">\
				<div>\
					<div class="xul-listheader--resizer"></div>\
    				<div class="xul-listheader--label"> ' + (this.attributes["label"] || "");
};

// Element Render: close
cXULElement_listheader.prototype.$getTagClose	= function() {
	return			'</div>\
				</div>\
				<div style="height:1pt;font-size:1px;' + (this.attributes["minwidth"] ? 'width:' + this.attributes["minwidth"] + 'px' : '') + '"></div>\
    		</th>';
};

// Register Element with language
oXULNamespace.setElement("listheader", cXULElement_listheader);
