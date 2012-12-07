/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_dialogheader	= function(){};
cXULElement_dialogheader.prototype	= new cXULElement("dialogheader");
cXULElement_dialogheader.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Class Event Handlers
cXULElement_dialogheader.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_dialog) {
			this.$mapAttribute("title", this.getAttribute("title"));
			this.$mapAttribute("description", this.getAttribute("description"));
			//
			this.parentNode.$getContainer("header").style.display	= "";
		}
	}
};

cXULElement_dialogheader.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "title") {
		if (this.parentNode instanceof cXULElement_dialog)
			this.parentNode.$getContainer("label").innerHTML	= ample.$encodeXMLCharacters(sValue || " ");
	}
	else
	if (sName == "description") {
		if (this.parentNode instanceof cXULElement_dialog)
			this.parentNode.$getContainer("description").innerHTML = ample.$encodeXMLCharacters(sValue || " ");
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Renders
cXULElement_dialogheader.prototype.$getTag	= function() {
	return '';
};

// Register Element
ample.extend(cXULElement_dialogheader);
