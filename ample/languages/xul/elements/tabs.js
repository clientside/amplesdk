/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabs	= function() {
	// Collections
	this.items		= new ample.classes.NodeList;
};
cXULElement_tabs.prototype	= new cXULElement("tabs");
cXULElement_tabs.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Accessibility
cXULElement_tabs.prototype.tabIndex	= 0;
cXULElement_tabs.prototype.$selectable	= false;

// Public Properties
cXULElement_tabs.prototype.selectedIndex	=-1;	// Not implemented
cXULElement_tabs.prototype.selectedItem		= null; // Not implemented

// Public Methods
cXULElement_tabs.prototype.advanceSelectedTab	= function(nDir) {
	if (nDir == 1)
		this.goTo(this.parentNode.selectedIndex + 1);
	else
	if (nDir ==-1)
		this.goTo(this.parentNode.selectedIndex - 1);
};

cXULElement_tabs.prototype.goTo		= function(nIndex) {
	// TODO
	if (this.parentNode.selectedIndex != nIndex && this.items[nIndex]) {
		// send onselect event
		var oEvent	= this.ownerDocument.createEvent("Event");
		oEvent.initEvent("beforeselect", false, true);
		if (this.dispatchEvent(oEvent) == false)
			return;

		// Deselect old tab
		if (this.parentNode.selectedTab)
			this.parentNode.selectedTab.setAttribute("selected", "false");
		if (this.parentNode.selectedPanel)
			this.parentNode.selectedPanel.setAttribute("hidden", "true");

		// Select new tab
		this.parentNode.selectedTab		= this.items[nIndex];
		this.parentNode.selectedTab.setAttribute("selected", "true");
		if (this.parentNode.tabpanels && this.parentNode.tabpanels.items[nIndex]) {
			this.parentNode.selectedPanel	= this.parentNode.tabpanels.items[nIndex];
			this.parentNode.selectedPanel.setAttribute("hidden", "false");
			// Schedule reflow
			oXULReflowManager.schedule(this.parentNode.selectedPanel);
		}

		this.parentNode.selectedIndex	= nIndex;

		// send onselect event
		var oEvent	= this.ownerDocument.createEvent("Event");
		oEvent.initEvent("select", true, true);
		this.dispatchEvent(oEvent);
	}
};

cXULElement_tabs.prototype.appendItem	= function(sLabel, sValue) {
	this.insertItemAt(this.items.length, sLabel, sValue);
};

cXULElement_tabs.prototype.insertItemAt	= function(nIndex, sLabel, sValue) {
	// TODO
};

cXULElement_tabs.prototype.removeItemAt	= function(nIndex) {
	// TODO
};

// Class events handlers
cXULElement_tabs.handlers	= {
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Left":
				var oTabBox	= this.parentNode;
				if (oTabBox.selectedTab && oTabBox.selectedTab.previousSibling)
					oTabBox.selectedTab.previousSibling.$activate();
				break;

			case "Right":
				var oTabBox	= this.parentNode;
				if (oTabBox.selectedTab && oTabBox.selectedTab.nextSibling)
					oTabBox.selectedTab.nextSibling.$activate();
				break;
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_tab)
				this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_tab)
				this.items.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_tabs.prototype.$getTagOpen	= function() {
	return '<div class="xul-tabs' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

// Element Render: close
cXULElement_tabs.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_tabs);
