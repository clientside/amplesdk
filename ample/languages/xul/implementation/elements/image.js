/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_image	= function(){};
cXULElement_image.prototype  = new cXULElement;

// Class Events Handlers
cXULElement_image.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Events Handlers
cXULElement_image.prototype._onLoad  = function(oEvent) {
    // Fire Event
    var oEvent2 = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("load", false, false);
    this.dispatchEvent(oEvent2);
};

// Element Render: open
cXULElement_image.prototype.$getTagOpen	= function() {
    return '<img class="xul-image' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '')+(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '')+(this.attributes["src"] ? ' src="' + this.attributes["src"] + '"' :'')+ ' onload="ample.$instance(this)._onLoad(event)"/>';
};

// Register Element with language
oXULNamespace.setElement("image", cXULElement_image);
