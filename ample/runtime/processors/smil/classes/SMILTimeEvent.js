/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILTimeEvent	= function(sType) {
	this.type	= sType;
	// Initializer
	if (arguments.length > 1)
		fSMILTimeEvent_init(this, arguments[1]);
};

cSMILTimeEvent.prototype	= new cEvent('#' + "TimeEvent");

cSMILTimeEvent.prototype.view	= null;
cSMILTimeEvent.prototype.detail	= null;

function fSMILTimeEvent_getDictionary(sType, oView, nDetail) {
	var oValue	= fEvent_getDictionary(sType, false, false);
	//
	oValue.view		= oView;
	oValue.detail	= nDetail;

	return oValue;
};

function fSMILTimeEvent_init(oEvent, oValue) {
	fEvent_init(oEvent, oValue);
	//
	if ("view" in oValue)
		oEvent.view		= oValue.view;
	if ("detail" in oValue)
		oEvent.detail	= oValue.detail;
};

//
cSMILTimeEvent.prototype.initTimeEvent	= function(sType, oView, nDetail) {
	fSMILTimeEvent_init(this, fSMILTimeEvent_getDictionary(sType, oView, nDetail));
};

// Register Event Interface
fAmple_extend(cSMILTimeEvent);
