/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_stack	= function(){};
cXULElement_stack.prototype  = new cXULElement("stack");

// Public Methods

// Class event handlers
cXULElement_stack.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		oXULReflowManager.schedule(this);
	}
};

cXULElement_stack.prototype.reflow	= function() {
	// set position style property to absolute
	for (var nIndex = 0, oElementDOM; nIndex < this.childNodes.length; nIndex++)
		if (oElementDOM = this.childNodes[nIndex].$getContainer())
			oElementDOM.style.position   = "absolute";
};

// Element Render: open
cXULElement_stack.prototype.$getTagOpen	= function() {
    return '<div class="xul-stack" style="position:relative">';
};

// Element Render: close
cXULElement_stack.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_stack);
