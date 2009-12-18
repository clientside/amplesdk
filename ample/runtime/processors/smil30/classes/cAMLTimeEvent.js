/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLTimeEvent	= function() {

};

cAMLTimeEvent.prototype	= new cAMLEvent;

cAMLTimeEvent.prototype.view	= null;
cAMLTimeEvent.prototype.detail	= null;

cAMLTimeEvent.prototype.initTimeEvent	= function(sType, oView, nDetail) {
	this.initEvent(sType, false, false);
	//
	this.view	= oView;
	this.detail	= oDetail;
};