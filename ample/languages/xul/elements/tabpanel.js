/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabpanel	= function(){};
cXULElement_tabpanel.prototype	= new cXULElement("tabpanel");
cXULElement_tabpanel.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_tabpanel.attributes	= {};
cXULElement_tabpanel.attributes.hidden	= "true";
cXULElement_tabpanel.attributes.width	= "100%";

// Public Methods

// Class event handlers
cXULElement_tabpanel.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabpanels) {
			var oTabBox	= this.parentNode.parentNode;
			if (oTabBox instanceof cXULElement_tabbox) {
				if (!isNaN(oTabBox.attributes["selectedIndex"]) && oTabBox.tabs.items.length > oTabBox.attributes["selectedIndex"] && this.parentNode.items.$indexOf(this) == oTabBox.attributes["selectedIndex"] * 1)
					oTabBox.tabs.goTo(oTabBox.attributes["selectedIndex"] * 1);
				else
				if (!this.nextSibling)
					oTabBox.tabs.goTo(0);
			}
		}
	}
};

// Element Render: open
cXULElement_tabpanel.prototype.$getTagOpen	= function() {
	return '<div class="xul-tabpanel' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' +(this.attributes["hidden"] != "false" ? ' style="display:none"' : '')+ '>';
};

// Element Render: close
cXULElement_tabpanel.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_tabpanel);
