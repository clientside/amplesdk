/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLConfiguration	= function() {
	this.parameterNames	= new cAMLStringList;
};
cAMLConfiguration.prototype.parameterNames	= null;

var oAMLConfiguration_values	= {};

function fAMLConfiguration_setParameter(oConfiguration, sName, vValue) {
	if (!fAMLStringList_contains(oConfiguration, sName))
		oConfiguration.parameterNames.$add(sName);
	oAMLConfiguration_values[sName]	= vValue;
};

cAMLConfiguration.prototype.setParameter	= function(sName, vValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);
//<-Guard
	fAMLConfiguration_setParameter(this, sName, vValue);
};

function fAMLConfiguration_getParameter(oConfiguration, sName) {
	return oAMLConfiguration_values.hasOwnProperty(sName) ? oAMLConfiguration_values[sName] : null;
};

cAMLConfiguration.prototype.getParameter	= function(sName) {
//->Guard
	fGuard(arguments, [
		["name",	cString]
	]);
//<-Guard
	return fAMLConfiguration_getParameter(this, sName);
};

cAMLConfiguration.prototype.canSetParameter	= function(sName, vValue) {
//->Guard
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);
//<-Guard
	return this.parameterNames.contains(sName);
};