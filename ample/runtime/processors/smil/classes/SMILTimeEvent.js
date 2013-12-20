/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILTimeEvent	= function(sType) {
	fSMILTimeEvent_init(this, sType, arguments[1]);
};

cSMILTimeEvent.prototype	= new cEvent('#' + "TimeEvent");

cSMILTimeEvent.prototype.view	= null;
cSMILTimeEvent.prototype.detail	= null;

function fSMILTimeEvent_getDictionary(oView, nDetail) {
	var oValue	= fEvent_getDictionary(false, false);
	//
	oValue.view		= oView;
	oValue.detail	= nDetail;

	return oValue;
};

function fSMILTimeEvent_init(oEvent, sType, oValue) {
	fEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("view" in oValue)
			oEvent.view		= oValue.view;
		if ("detail" in oValue)
			oEvent.detail	= oValue.detail;
	}
};

//
cSMILTimeEvent.prototype.initTimeEvent	= function(sType, oView, nDetail) {
	fSMILTimeEvent_init(this, sType, fSMILTimeEvent_getDictionary(oView, nDetail));
};

// Register Event Interface
fAmple_extend(cSMILTimeEvent);
