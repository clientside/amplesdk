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

// Class Events Handlers
cXULElement_treecol.handlers	= {
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		this.$setPseudoClass("active", true);
	},
	"mouseup":		function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "label":
					this.$getContainer("label").innerHTML	= oEvent.newValue || '';
					break;

				case "hidden":
				case "hideheader":
					var nCell	= this.parentNode.items.$indexOf(this);
					this.$getContainer().style.display	= oEvent.newValue == "true" ? "none" : "";
					for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
						if (aItems[nIndex].row)
							aItems[nIndex].row.cells[nCell].setAttribute("hidden", oEvent.newValue);
					this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + 1].style.display	= oEvent.newValue == "true" ? "none" : "";

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
/*
	,"mousemove":	function(oEvent) {
		var oElementDOM	= this.$getContainer();
		var oPosition	= this.getBoundingClientRect();
		if (Math.abs(oPosition.left - oEvent.clientX) < 10 || Math.abs(oPosition.right - oEvent.clientX) < 10)
			oElementDOM.style.cursor	= "col-resize";
		else
			oElementDOM.style.cursor	= "";
	}
*/
};

// Element Render: open
cXULElement_treecol.prototype.$getTagOpen	= function() {
	return '<td class="xul-treecol' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : "")+(this.attributes["hideheader"] == "true" ? ' style="display:none"' : "")+ ' align="left">\
				<div>\
					<div class="xul-treecol--resizer"></div>\
					<div class="xul-treecol--label xul-treecol--gateway"> ' +(this.attributes["label"] || "");
};

// Element Render: close
cXULElement_treecol.prototype.$getTagClose	= function() {
    return			'</div>\
				</div>\
				<div style="height:1pt;font-size:1px;' + (this.attributes["minwidth"] ? 'width:' + this.attributes["minwidth"] + 'px' : '') + '"></div>\
    		</td>';
};

// Register Element with language
oXULNamespace.setElement("treecol", cXULElement_treecol);
