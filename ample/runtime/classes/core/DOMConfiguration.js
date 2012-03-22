/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDOMConfiguration	= function() {
	this.parameterNames	= new cDOMStringList;
};
cDOMConfiguration.prototype.parameterNames	= null;

var oDOMConfiguration_values	= {};

function fDOMConfiguration_setParameter(oConfiguration, sName, vValue) {
	if (!fDOMStringList_contains(oConfiguration, sName))
		oConfiguration.parameterNames.$add(sName);
	oDOMConfiguration_values[sName]	= vValue;
};

cDOMConfiguration.prototype.setParameter	= function(sName, vValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);
//<-Guard
	fDOMConfiguration_setParameter(this, sName, vValue);
};

function fDOMConfiguration_getParameter(oConfiguration, sName) {
	return oDOMConfiguration_values.hasOwnProperty(sName) ? oDOMConfiguration_values[sName] : null;
};

cDOMConfiguration.prototype.getParameter	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard
	return fDOMConfiguration_getParameter(this, sName);
};

cDOMConfiguration.prototype.canSetParameter	= function(sName, vValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);
//<-Guard
	return this.parameterNames.contains(sName);
};