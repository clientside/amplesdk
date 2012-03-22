/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_caption	= function(){};
cXULElement_caption.prototype	= new cXULElement("caption");
cXULElement_caption.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

// Class Events Handlers
cXULElement_caption.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
		    // ensure the parent is groupbox
		    if (!(this.parentNode instanceof cXULElement_groupbox))
		        return;

			switch (oEvent.attrName) {
				case "label":
			        this.parentNode.$getContainer("caption").innerHTML =(this.attributes["image"] ? '<img src="' + this.attributes["image"] + '" align="absmiddle" /> ' : '')+ (oEvent.newValue || '');
					break;

				case "image":
			        this.parentNode.$getContainer("caption").innerHTML =(oEvent.newValue ? '<img src="' + oEvent.newValue + '" align="absmiddle" /> ' : '') + (this.attributes["label"] ? this.attributes["label"] : '');
					break;

				case "hidden":
					this.parentNode.$getContainer("caption").style.display = oEvent.newValue == "true" ? "none" : "";
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.parentNode.$getContainer("caption").innerHTML	= (this.hasAttribute("image") ? '<img src="' + this.getAttribute("image") + '" align="absmiddle" /> ' : '')+(this.hasAttribute("label") ? this.getAttribute("label") : '');
		if (this.getAttribute("hidden") != "true")
			this.parentNode.$getContainer("caption").style.display = "";
	}
};

// Register Element
ample.extend(cXULElement_caption);
