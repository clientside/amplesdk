/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_image	= function(){};
cXULElement_image.prototype	= new cXULElement("image");

cXULElement_image.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "src")
		this.$getContainer().src	= sValue || "about:blank";
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Events Handlers
cXULElement_image.prototype._onLoad	= function(oEvent) {
	// Fire Event
	var oEvent2	= this.ownerDocument.createEvent("Event");
	oEvent2.initEvent("load", false, false);
	this.dispatchEvent(oEvent2);
};

// Element Render: open
cXULElement_image.prototype.$getTagOpen	= function() {
	return '<img class="xul-image' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '')+(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '') + (this.attributes["src"] ? ' src="' + ample.$encodeXMLCharacters(this.attributes["src"]) + '"' :'') + ' onload="ample.$instance(this)._onLoad(event)"/>';
};

// Register Element
ample.extend(cXULElement_image);
