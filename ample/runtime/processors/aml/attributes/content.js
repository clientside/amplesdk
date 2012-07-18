/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLAttr_content	= function(){};
cAMLAttr_content.prototype	= new cAMLAttr("content");

// Class Events Handlers
cAMLAttr_content.handlers	= {};
cAMLAttr_content.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	fAMLAttr_content_map(this.ownerElement, this.value);
};
cAMLAttr_content.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	fAMLAttr_content_map(this.ownerElement, '');
};

function fAMLAttr_content_map(oElement, sValue) {
	if (!oElement.childNodes.length) {
		var oElementDOM	= oElement.$getContainer("gateway") || oElement.$getContainer();
		if (oElementDOM)
			oElementDOM.innerHTML	= sValue ? oAmple.locale.localize(sValue) || '' : '';
	}
};

// Register Attribute
fAmple_extend(cAMLAttr_content);
