/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_stack	= function(){};
cXULElement_stack.prototype	= new cXULElement("stack");

// Public Methods
cXULElement_stack.prototype.reflow	= function() {
	// set position style property to absolute
	for (var nIndex = 0, oElementDOM; nIndex < this.childNodes.length; nIndex++)
		if (oElementDOM = this.childNodes[nIndex].$getContainer())
			oElementDOM.style.position	= "absolute";
};

// Element Render: open
cXULElement_stack.prototype.$getTagOpen	= function() {
	return '<div class="xul-stack' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="position:relative">';
};

// Element Render: close
cXULElement_stack.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_stack);
