/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var aAMLCapture_modals	= [];

// Attaching to impementation
cAMLDocument.prototype.releaseCapture	= function() {
	if (oAML_captureNode)
		fAMLCapture_releaseCapture(oAML_captureNode);
};

function fAMLCapture_setCapture(oNode, bCapture) {
	if (oAML_captureNode != oNode) {
		// Release capture from the previous element
		var oElement	= oAML_captureNode;
		if (oElement && oElement != oNode)
			fAMLCapture_releaseCapture(oElement);

		//
		oAML_captureNode	= oNode;
	}
};

cAMLElement.prototype.setCapture	= function(bCapture) {
	// Validate arguments
	fAML_validate(arguments, [
		["useCapture",	cBoolean, true]
	], "setCapture");

	// Raise NOT_SUPPORTED_ERR exception in case setCapture(false) called
	if (arguments.length && !bCapture)
		throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);

	fAMLCapture_setCapture(this, bCapture);
};

function fAMLCapture_releaseCapture(oNode) {
	if (oAML_captureNode == oNode) {
		// Notify element on capture lose
		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("losecapture", false, false, window, null);
		fAMLNode_dispatchEvent(oNode, oEvent);

		//
		oAML_captureNode	= null;
	}
};

cAMLElement.prototype.releaseCapture	= function() {
	fAMLElement_releaseCapture(this);
};

//Attach to the implementation
cAMLElement.prototype.$setModal		= function() {
	//
	if (aAMLCapture_modals.indexOf(this) > 0)
		throw new cAMLException(cAMLException.AML_MODAL_SET_MODAL_ERR);
	else {
		aAMLCapture_modals.push(this);
		// Set active element to the modal
		oAML_modalNode	= oAML_document.activeElement	= this;
	}
};

cAMLElement.prototype.$releaseModal	= function() {
	//
	if (aAMLCapture_modals[aAMLCapture_modals.length - 1] != this)
		throw new cAMLException(cAMLException.AML_MODAL_RELEASE_MODAL_ERR);
	else {
		aAMLCapture_modals.pop();
		// Set active element to the previous modal or null
		oAML_modalNode	= oAML_document.activeElement	= aAMLCapture_modals.length ? aAMLCapture_modals[aAMLCapture_modals.length - 1] : null;
	}
};
