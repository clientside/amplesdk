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

// Public Methods
cXULInputElement.prototype.setSelectionRange	= function(nStart, nEnd) {
	var oInput	= this.$getContainer("input");
	if (oInput.setSelectionRange)
		oInput.setSelectionRange(nStart, nEnd);
	else
	if (oInput.createTextRange) {
		var oRange	= oInput.createTextRange();
		if (nStart != nEnd) {
			oRange.moveEnd("character", nEnd - oRange.text.length);
			oRange.moveStart("character", nStart);
		}
		else
			oRange.move("character", nStart);
		oRange.select();
	}
};

// Static Methods
cXULInputElement.dispatchChange	= function(oInstance) {
    // Fire Event
    var oEvent  = oInstance.ownerDocument.createEvent("UIEvents");
    oEvent.initEvent("change", true, false, window, null);
    oInstance.dispatchEvent(oEvent);
};