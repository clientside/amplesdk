/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLInputElement	= function() {
	cXHTMLElement.apply(this, arguments);
};

cXHTMLInputElement.prototype	= new cXHTMLElement("#element-input");
cXHTMLInputElement.prototype.$hoverable	= true;

// Accessibility
cXHTMLInputElement.prototype.tabIndex	= 0;

//
cXHTMLInputElement.prototype.form	= null;

// Validation
cXHTMLInputElement.prototype.validity		= null;
cXHTMLInputElement.prototype.willValidate	= true;
cXHTMLInputElement.prototype.checkValidity	= function() {

};
cXHTMLInputElement.prototype.validationMessage	= "";
cXHTMLInputElement.prototype.setCustomValidty	= function(sMessage) {

};

// Static Members
cXHTMLInputElement.isValid	= function(oInstance) {
	return true;
};

cXHTMLInputElement.register	= function(oInstance) {
	// Add to the form collection
	for (var oNode = oInstance; oNode = oNode.parentNode;)
		if (oNode instanceof cXHTMLElement_form)
			break;
	if (oNode) {
		oInstance.form	= oNode;
		oNode.elements.$add(oInstance);
		if (oInstance.hasAttribute("name"))
			oNode.elements[oInstance.getAttribute("name")]	= this;
	}
	//
	if (!isNaN(oInstance.getAttribute("tabIndex")))
		oInstance.tabIndex	= oInstance.getAttribute("tabIndex") * 1;
	if (oInstance.hasAttribute("accessKey"))
		oInstance.accessKey	= oInstance.getAttribute("accessKey");
	if (oInstance.hasAttribute("autofocus"))
		oInstance.focus();
};

cXHTMLInputElement.unregister	= function(oInstance) {
	// Remove from the collection
	if (oInstance.form) {
		oInstance.form.elements.$remove(oInstance);
		if (oInstance.hasAttribute("name"))
			delete oInstance.form.elements[oInstance.getAttribute("name")];
		oInstance.form	= null;
	}
};

// Register Element
ample.extend(cXHTMLInputElement);