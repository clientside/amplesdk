/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr_content	= function(){};
cAttr_content.prototype	= new cAMLAttr("content");

// Class Events Handlers
cAttr_content.handlers	= {};
cAttr_content.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	fAttr_content_map(this.ownerElement, this.value);
};
cAttr_content.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	fAttr_content_map(this.ownerElement, '');
};

function fAttr_content_map(oElement, sValue) {
	if (!oElement.childNodes.length) {
		var oElementDOM	= oElement.$getContainer("gateway") || oElement.$getContainer();
		if (oElementDOM)
			oElementDOM.innerHTML	= sValue ? ample.locale.localize(sValue) || '' : '';
	}
};

// Register Attribute
fAmple_extend(cAttr_content);
