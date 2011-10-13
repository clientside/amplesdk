/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_box	= function(){};

cXULElement_box.prototype	= new cXULElement("box");
cXULElement_box.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Class Handlers
cXULElement_box.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

cXULElement_box.prototype.$getTagOpen	= function() {
	var sWidth	= this.attributes.width,
		sHeight	= this.attributes.height;
	return '<div class="xul-' + this.localName +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
		(sWidth ? 'width:' + (isNaN(parseInt(sWidth)) ? sWidth : sWidth + 'px;') : '')+
		(sHeight ? 'height:' + (isNaN(parseInt(sHeight)) ? sHeight : sHeight + 'px;') : '')+
        this.getAttribute("style")+
	'">';
};

cXULElement_box.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_box);
