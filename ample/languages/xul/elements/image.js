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
	return '<img class="xul-image' +(this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" onload="ample.$instance(this)._onLoad(event)"' +
				(this.hasAttribute("width") ? ' width="' + this.getAttribute("width") + '"' : '')+
				(this.hasAttribute("height") ? ' height="' + this.getAttribute("height") + '"' : '') +
				(this.hasAttribute("src") ? ' src="' + ample.$encodeXMLCharacters(this.getAttribute("src")) + '"' :'') +
				'/>';
};

// Register Element
ample.extend(cXULElement_image);
