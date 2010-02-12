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
cAMLDocument.prototype.$releaseCapture	= function() {
//->Debug
	fAML_warn(nAML_FEATURE_DEPRECATED_WRN, ["$releaseCapture", "releaseCapture"]);
//<-Debug
	this.releaseCapture();
};

cAMLDocument.prototype.releaseCapture	= function() {
	if (oAML_captureNode)
		oAML_captureNode.releaseCapture();
};

cAMLElement.prototype.setCapture	= function(bCapture) {
	if (oAML_captureNode != this) {
		// Validate arguments
		fAML_validate(arguments, [
			["useCapture",	cBoolean, true]
		], "setCapture");

		// Raise NOT_SUPPORTED_ERR exception in case setCapture(false) called
		if (arguments.length && !bCapture)
			throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);

		// Release capture from the previous element
		var oElement	= oAML_captureNode;
		if (oElement && oElement != this)
			oElement.releaseCapture();

		//
		oAML_captureNode	= this;
	}
};

cAMLElement.prototype.$setCapture	= function(bCapture) {
//->Debug
	fAML_warn(nAML_FEATURE_DEPRECATED_WRN, ["$setCapture", "setCapture"]);
//<-Debug
	this.setCapture(bCapture);
};

cAMLElement.prototype.releaseCapture	= function() {
	if (oAML_captureNode == this) {
		// Notify element on capture lose
		var oEvent	= new cAMLUIEvent;
		oEvent.initUIEvent("losecapture", false, false, window, null);
		fAMLNode_dispatchEvent(this, oEvent);

		//
		oAML_captureNode	= null;
	}
};

cAMLElement.prototype.$releaseCapture	= function() {
//->Debug
	fAML_warn(nAML_FEATURE_DEPRECATED_WRN, ["$releaseCapture", "releaseCapture"]);
//<-Debug
	this.releaseCapture();
};

//Attach to the implementation
cAMLElement.prototype.$setModal		= function() {
	//
	if (aAMLCapture_modals.indexOf(this) > 0)
		throw new cAMLException(cAMLException.AML_MODAL_SET_MODAL_ERR);
	else {
		aAMLCapture_modals.push(this);
		// Set active element to the modal
		oAML_modalNode	= ample.activeElement	= this;
	}
};

cAMLElement.prototype.$releaseModal	= function() {
	//
	if (aAMLCapture_modals[aAMLCapture_modals.length - 1] != this)
		throw new cAMLException(cAMLException.AML_MODAL_RELEASE_MODAL_ERR);
	else {
		aAMLCapture_modals.pop();
		// Set active element to the previous modal or null
		oAML_modalNode	= ample.activeElement	= aAMLCapture_modals.length ? aAMLCapture_modals[aAMLCapture_modals.length - 1] : null;
	}
};
