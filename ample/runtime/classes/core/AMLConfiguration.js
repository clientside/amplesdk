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

function fAMLConfiguration_setParameter(oConfiguration, sName, vValue) {
	if (!oConfiguration.parameterNames.contains(sName))
		oConfiguration.parameterNames.$add(sName);
	oAMLConfiguration_values[sName]	= vValue;
};

cAMLConfiguration.prototype.setParameter	= function(sName, vValue) {
	// Validate arguments
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);

	fAMLConfiguration_setParameter(this, sName, vValue);
};

function fAMLConfiguration_getParameter(oConfiguration, sName, vValue) {
	return oAMLConfiguration_values.hasOwnProperty(sName) ? oAMLConfiguration_values[sName] : null;
};

cAMLConfiguration.prototype.getParameter	= function(sName) {
	// Validate arguments
	fGuard(arguments, [
		["name",	cString]
	]);

	return fAMLConfiguration_getParameter(this, sName, vValue);
};

cAMLConfiguration.prototype.canSetParameter	= function(sName, vValue) {
	// Validate arguments
	fGuard(arguments, [
		["name",	cString],
		["value",	cObject,	false, true]
	]);

	return this.parameterNames.contains(sName);
};

var oAMLConfiguration_values	= {};
// set standard parameters
oAMLConfiguration_values["error-handler"]	= null;
oAMLConfiguration_values["element-content-whitespace"]	= false;	// in DOM-Core spec the default value is true
oAMLConfiguration_values["entities"]	= false;	// in DOM-Core spec the default value is true
oAMLConfiguration_values["comments"]	= false; 	// in DOM-Core spec the default value is true
//set ample parameters
oAMLConfiguration_values["ample-use-style-property"]= true;		// -> ample-core-style
oAMLConfiguration_values["ample-module-history-fix"]= false;	// -> ample-history
oAMLConfiguration_values["ample-enable-transitions"]= false;
oAMLConfiguration_values["ample-version"]		= '@project.version@';
oAMLConfiguration_values["ample-user-locale"]	= oUANavigator.language || oUANavigator.userLanguage || 'en-US';
oAMLConfiguration_values["ample-user-agent"]	= '@project.userAgent@';

//->Debug
// Enable debugging
var oAML_errorHandler	= {};
oAML_errorHandler.handleError	= function(oError) {
	var oConsole	= window.console;
	if (oError.severity == cAMLError.SEVERITY_WARNING) {
		// Warning in console
		if (oConsole)
			oConsole.warn(oError.message);
		return true;
	}
	// Error in console
	if (oConsole)
		oConsole.error(oError.message + '\n' + oError.relatedException.caller);
	return false;
};
oAMLConfiguration_values["error-handler"]	= oAML_errorHandler;
//<-Debug