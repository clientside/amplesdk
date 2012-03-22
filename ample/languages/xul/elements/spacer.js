/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_spacer	= function(){};
cXULElement_spacer.prototype = new cXULElement("spacer");

//Class Events Handlers
cXULElement_spacer.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Element Render: open
cXULElement_spacer.prototype.$getTagOpen	= function() {
    var sHtml   = '<div class="xul-spacer' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="';
    sHtml  += 'width:'  +(this.attributes["width"] ? this.attributes["width"] : '0')+ 'px;';
    sHtml  += 'height:' +(this.attributes["height"]? this.attributes["height"]: '0')+ 'px;';
    sHtml  += '"><img height="1" width="1" /></div>';

    return sHtml;
};

// Register Element
ample.extend(cXULElement_spacer);
