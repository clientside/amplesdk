/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_radiogroup	= function() {
	// Collections
	this.items		= new ample.classes.NodeList;
};
cXULElement_radiogroup.prototype	= new cXULInputElement("radiogroup");
cXULElement_radiogroup.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Public Properties
cXULElement_radiogroup.prototype.selectedIndex	=-1;
cXULElement_radiogroup.prototype.selectedItem	= null;

// Attributes Defaults
cXULElement_radiogroup.attributes	= {};
cXULElement_radiogroup.attributes.orient	= "vertical";
cXULElement_radiogroup.attributes.value	= "";

// Public Methods
cXULElement_radiogroup.prototype.appendItem	= function(sName, sValue) {

};

cXULElement_radiogroup.prototype.insertItemAt= function(nIndex, sName, sValue) {

};

cXULElement_radiogroup.prototype.removeItemAt= function(nIndex) {

};

// Class Events Handlers
cXULElement_radiogroup.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "value") {
				for (var nIndex = 0; nIndex < this.items.length; nIndex++) {
					if (this.items[nIndex].getAttribute("value") == oEvent.newValue) {
						this.items[nIndex].setAttribute("selected", "true");
						break;
					}
				}
			}
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_radio) {
			this.items.$add(oEvent.target);
			oEvent.target.group	= this;
			//
			if (oEvent.target.getAttribute("selected") == "true") {
				this.selectedIndex	= this.items.length - 1;
				this.selectedItem	= oEvent.target;
			}
		}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_radio) {
			//
			if (oEvent.target.getAttribute("selected") == "true") {
				if (this.selectedItem == oEvent.target) {
					this.selectedIndex	=-1;
					this.selectedItem	= null;
				}
			}//
			oEvent.target.group	= null;
			this.items.$remove(oEvent.target);
		}
	}
};

cXULElement_radiogroup.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
		cXULInputElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_radiogroup.prototype.$getTagOpen	= function() {
	return '<div class="xul-radiogroup' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + (!this.$isAccessible() ? " xul-radiogroup_disabled" : "") + '">';
};

// Element Render: close
cXULElement_radiogroup.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_radiogroup);
