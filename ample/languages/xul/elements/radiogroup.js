/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_radiogroup	= function() {
    // Collections
    this.items      = new AMLNodeList;
};
cXULElement_radiogroup.prototype	= new cXULInputElement;
cXULElement_radiogroup.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Public Properties
cXULElement_radiogroup.prototype.selectedIndex	=-1;
cXULElement_radiogroup.prototype.selectedItem	= null;

// Attributes Defaults
cXULElement_radiogroup.attributes	= {};
cXULElement_radiogroup.attributes.orient	= "vertical";
cXULElement_radiogroup.attributes.value	= "";

// Public Methods
cXULElement_radiogroup.prototype.appendItem  = function(sName, sValue) {

};

cXULElement_radiogroup.prototype.insertItemAt= function(nIndex, sName, sValue) {

};

cXULElement_radiogroup.prototype.removeItemAt= function(nIndex) {

};

// Class Events Handlers
cXULElement_radiogroup.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					for (var nIndex = 0; nIndex < this.items.length; nIndex++) {
						if (this.items[nIndex].attributes["value"] == oEvent.newValue) {
							this.items[nIndex].setAttribute("selected", "true");
							break;
						}
					}
					break;

				case "disabled":
					var oElementDOM	= this.$getContainer();
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					for (var nIndex = 0; nIndex < this.items.length; nIndex++)
						this.items.setAttribute("disabled", oEvent.newValue);
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Element Render: open
cXULElement_radiogroup.prototype.$getTagOpen	= function() {
    return '<div class="xul-radiogroup' + (!this.$isAccessible() ? " xul-radiogroup_disabled" : "") + '">';
};

// Element Render: close
cXULElement_radiogroup.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("radiogroup", cXULElement_radiogroup);
