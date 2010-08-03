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

cAMLConfiguration.prototype.setParameter	= function(sName, vValue) {
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);

	if (!this.parameterNames.contains(sName))
		this.parameterNames.$add(sName);
	oAMLConfiguration_values[sName]	= vValue;
};

cAMLConfiguration.prototype.getParameter	= function(sName) {
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString]
	]);

	return oAMLConfiguration_values.hasOwnProperty(sName) ? oAMLConfiguration_values[sName] : null;
};

cAMLConfiguration.prototype.canSetParameter	= function(sName, vValue) {
	// Validate arguments
	fAML_validate(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);

	return this.parameterNames.contains(sName);
};
