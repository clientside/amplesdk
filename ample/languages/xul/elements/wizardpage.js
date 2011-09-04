/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_wizardpage	= function(){};
cXULElement_wizardpage.prototype = new cXULElement("wizardpage");
cXULElement_wizardpage.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_wizardpage.attributes	= {};
cXULElement_wizardpage.attributes.orient	= "vertical";
cXULElement_wizardpage.attributes.flex		= "1";
cXULElement_wizardpage.attributes.width		= "100%";
cXULElement_wizardpage.attributes.height	= "100%";

// Private Methods
cXULElement_wizardpage.dispatchEvent_onPage    = function(oElement, sName) {
    var oEvent  = oElement.ownerDocument.createEvent("Event");
    oEvent.initEvent("page" + sName, true, true);
    return oElement.dispatchEvent(oEvent);
};

cXULElement_wizardpage.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "label":
					if (this.parentNode.currentPage == this)
						this.parentNode.$getContainer("label").innerHTML	= oEvent.newValue || '';
					break;

				case "description":
					if (this.parentNode.currentPage == this)
						this.parentNode.$getContainer("description").innerHTML	= oEvent.newValue || '';
					break;

				case "class":
					if (this.parentNode.currentPage == this)
						this.parentNode.$getContainer("header").className	= "xul-wizardheader xul-wizard--header " +(oEvent.newValue || '');
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.parentNode.wizardPages.$add(this);
		//
		if (!this.parentNode.currentPage)
			cXULElement_wizard.goTo(this.parentNode, this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.parentNode.wizardPages.$remove(this);
	}
}

// Element Render: open
cXULElement_wizardpage.prototype.$getTagOpen	= function() {
    return '<div class="xul-wizardpage" style="display:none;height:100%">';
};

// Element Render: close
cXULElement_wizardpage.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_wizardpage);
