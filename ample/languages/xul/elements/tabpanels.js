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
	this.items		= new ample.classes.NodeList;
};
cXULElement_tabpanels.prototype	= new cXULElement("tabpanels");

// Public Properties
cXULElement_tabpanels.prototype.selectedIndex	= null; // Not implemented
cXULElement_tabpanels.prototype.selectedPanel	= null; // Not implemented

// Public Methods

// Class event handlers
cXULElement_tabpanels.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_tabpanel)
				this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_tabpanel)
				this.items.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_tabpanels.prototype.$getTagOpen	= function() {
	return '<div class="xul-tabpanels' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">';
};

// Element Render: close
cXULElement_tabpanels.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_tabpanels);
