/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabpanels	= function() {
    // Collections
    this.items      = new ample.classes.NodeList;
};
cXULElement_tabpanels.prototype  = new cXULElement("tabpanels");

// Public Properties
cXULElement_tabpanels.prototype.selectedIndex	= null; // Not implemented
cXULElement_tabpanels.prototype.selectedPanel	= null; // Not implemented

// Public Methods

// Class event handlers
cXULElement_tabpanels.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabpanels = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabpanels = null;
	}
};

// Element Render: open
cXULElement_tabpanels.prototype.$getTagOpen    = function() {
	return '<div class="xul-tabpanels' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_tabpanels.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_tabpanels);
