/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabbox	= function(){};
cXULElement_tabbox.prototype	= new cXULElement("tabbox");
cXULElement_tabbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Public Properties
cXULElement_tabbox.prototype.tabs		= null; // Reference to tabs child element
cXULElement_tabbox.prototype.tabpanels	= null; // Reference to tabpanels child element

cXULElement_tabbox.prototype.selectedIndex	= -1;
cXULElement_tabbox.prototype.selectedTab	= null; // not supported
cXULElement_tabbox.prototype.selectedPanel	= null; // not supported

//Class event handlers
cXULElement_tabbox.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_tabs)
				this.tabs	= oEvent.target;
			else
			if (oEvent.target instanceof cXULElement_tabpanels)
				this.tabpanels	= oEvent.target;
		}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_tabs)
				this.tabs	= oEvent.target;
			else
			if (oEvent.target instanceof cXULElement_tabpanels)
				this.tabpanels	= oEvent.target;
		}
	}
};

// Attributes Defaults
cXULElement_tabbox.attributes	= {};
cXULElement_tabbox.attributes.orient	= "vertical";

// Element Render: open
cXULElement_tabbox.prototype.$getTagOpen	= function() {
	return '<div class="xul-tabbox' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">';
};

// Element Render: close
cXULElement_tabbox.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_tabbox);
