/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_wizardpage	= function(){};
cXULElement_wizardpage.prototype	= new cXULElement("wizardpage");
cXULElement_wizardpage.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_wizardpage.attributes	= {};
cXULElement_wizardpage.attributes.orient	= "vertical";
cXULElement_wizardpage.attributes.flex		= "1";
cXULElement_wizardpage.attributes.width		= "100%";
cXULElement_wizardpage.attributes.height	= "100%";

// Private Methods
cXULElement_wizardpage.dispatchEvent_onPage	= function(oElement, sName) {
	var oEvent	= oElement.ownerDocument.createEvent("Event");
	oEvent.initEvent("page" + sName, true, true);
	return oElement.dispatchEvent(oEvent);
};

cXULElement_wizardpage.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		if (!this.parentNode.currentPage)
			cXULElement_wizard.goTo(this.parentNode, this);
	}
};

cXULElement_wizardpage.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "label") {
		if (this.parentNode.currentPage == this)
			this.parentNode.$getContainer("label").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	}
	else
	if (sName == "description") {
		if (this.parentNode.currentPage == this)
			this.parentNode.$getContainer("description").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	}
	else
	if (sName == "class") {
		if (this.parentNode.currentPage == this)
			this.parentNode.$getContainer("header").className	= "xul-wizardheader xul-wizard--header " +(sValue || '');
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

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
