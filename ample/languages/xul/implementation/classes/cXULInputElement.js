/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULInputElement	= function(){};
cXULInputElement.prototype	= new cXULElement;
cXULInputElement.prototype.tabIndex	= 0;

// Static Methods
cXULInputElement.dispatchChange	= function(oInstance) {
	console.log(oInstance, oInstance.ownerDocument);
    // Fire Event
    var oEvent  = oInstance.ownerDocument.createEvent("UIEvents");
    oEvent.initEvent("change", true, false, window, null);
    oInstance.dispatchEvent(oEvent);
};