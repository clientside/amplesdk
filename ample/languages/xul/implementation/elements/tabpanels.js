/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tabpanels	= function() {
    // Collections
    this.items      = new AMLNodeList;
};
cXULElement_tabpanels.prototype  = new cXULElement;

// Public Properties
cXULElement_tabpanels.prototype.selectedIndex	= null; // Not implemented
cXULElement_tabpanels.prototype.selectedPanel	= null; // Not implemented

// Public Methods

// Class event handlers
cXULElement_tabpanels.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	},
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
	return '<div class="xul-tabpanels">\
				<table class="xul-tabpanels--table" cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">\
					<tbody>\
						<tr>\
							<td>';
};

// Element Render: close
cXULElement_tabpanels.prototype.$getTagClose	= function() {
	return '				</td>\
						</tr>\
					</tbody>\
				</table>\
			</div>';
};

// Register Element with language
oXULNamespace.setElement("tabpanels", cXULElement_tabpanels);
