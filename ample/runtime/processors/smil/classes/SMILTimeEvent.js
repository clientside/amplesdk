/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSMILTimeEvent	= function(){};

cSMILTimeEvent.prototype	= new cEvent;
cSMILTimeEvent.prototype.eventInterface	= "TimeEvent";

cSMILTimeEvent.prototype.view	= null;
cSMILTimeEvent.prototype.detail	= null;

cSMILTimeEvent.prototype.initTimeEvent	= function(sType, oView, nDetail) {
	this.initEvent(sType, false, false);
	//
	this.view	= oView;
	this.detail	= nDetail;
};

// Register Event Interface
fAmple_extend(cSMILTimeEvent);
