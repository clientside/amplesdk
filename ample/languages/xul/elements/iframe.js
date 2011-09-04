/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_iframe	= function(){};
cXULElement_iframe.prototype = new cXULElement("iframe");
cXULElement_iframe.prototype.tabIndex	= 0;

// Public Properties
cXULElement_iframe.prototype.contentDocument	= null;
cXULElement_iframe.prototype.contentWindow		= null;

// Class Events Handlers
cXULElement_iframe.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "src":
					if (oEvent.newValue)
						this.$getContainer().src  = oEvent.newValue;
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Events Handlers
cXULElement_iframe.prototype._onLoad     = function(oEvent) {
    this.contentWindow		= this.$getContainer().contentWindow;
    this.contentDocument	= this.$getContainer().contentDocument;

    // Fire event
    var oEvent  = this.ownerDocument.createEvent("Event");
    oEvent.initEvent("load", false, false);
    this.dispatchEvent(oEvent);
};

cXULElement_iframe.prototype._onUnLoad   = function(oEvent) {
	this.contentWindow		= null;
	this.contentDocument	= null;

    // Fire event
    var oEvent  = this.ownerDocument.createEvent("Event");
    oEvent.initEvent("unload", false, false);
    this.dispatchEvent(oEvent);
};

// Element Renders
cXULElement_iframe.prototype.$getTagOpen	= function() {
    return '<iframe class="xul-iframe' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" height="' +(this.attributes["height"] || '100%')+ '" width="' +(this.attributes["width"] || '100%')+ '" src="' +(this.attributes["src"] || 'about:blank') + '" frameborder="0" border="0" scrolling="no" onload="ample.$instance(this)._onLoad(event)" onunload="ample.$instance(this)._onUnLoad(event)">';
};

cXULElement_iframe.prototype.$getTagClose	= function() {
    return '</iframe>';
};

// Register Element
ample.extend(cXULElement_iframe);
