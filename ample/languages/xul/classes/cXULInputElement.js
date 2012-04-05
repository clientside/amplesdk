/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULInputElement	= function() {
	cXULElement.apply(this, arguments);
};
cXULInputElement.prototype	= new cXULElement;
cXULInputElement.prototype.localName	= "#element-input";
cXULInputElement.prototype.tabIndex	= 0;

// Public Methods
cXULInputElement.getSelectionRange	= function(oInstance) {
	var oInput	= oInstance.$getContainer("input");
	if (oInput.setSelectionRange)
		return [oInput.selectionStart, oInput.selectionEnd];
	else
	if (oInput.createTextRange) {
		var oDocumentRange	= document.selection.createRange(),
			oRange	= oInput.createTextRange().duplicate();
		try {
		oRange.setEndPoint("EndToEnd", oDocumentRange);
		} catch (e) {}
		return [oRange.text.length - oDocumentRange.text.length, oRange.text.length];
	}
	else
		return [0, 0];
};

cXULInputElement.setSelectionRange	= function(oInstance, nStart, nEnd) {
	var oInput	= oInstance.$getContainer("input");
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
	var oEvent	= oInstance.ownerDocument.createEvent("UIEvent");
	oEvent.initEvent("change", true, false, window, null);
	oInstance.dispatchEvent(oEvent);
};

// Register Element
ample.extend(cXULInputElement);