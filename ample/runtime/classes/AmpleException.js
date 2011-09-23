/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAmpleException	= function(nCode) {
	this.code	= nCode;
	var sMessage= "AmpleException" + ' ' + nCode;
//->Debug
	// Replace placeholders
	var sValue	= oGuardException_messages[nCode];
	if (arguments.length > 2)
		sValue	= fGuardException_format(sValue, arguments[2]);
	sMessage	+= '...' + ' ' + sValue;
//<-Debug

	this.message= sMessage;
	this.caller	= arguments[1] || cAmpleException.caller.caller;
};

// Constants
cAmpleException.ARGUMENT_MISSING_ERR	= 1;
cAmpleException.ARGUMENT_WRONG_TYPE_ERR	= 2;
cAmpleException.ARGUMENT_NULL_ERR		= 3;
cAmpleException.NOT_INITIALIZED_ERR		= 4;
cAmpleException.CANNOT_ACCESS_DOM_ERR	= 5;
cAmpleException.MEMBER_MISSING_ERR		= 6;

//
cAmpleException.prototype.code		= null;
cAmpleException.prototype.message	= null;

cAmpleException.prototype.toString	= function() {
	return '[' + this.message + ']';
};

//->Debug
// Ample Exceptions
var oGuardException_messages	= {};
oGuardException_messages[cAmpleException.ARGUMENT_MISSING_ERR]		= 'Missing required %0 argument "%1" in "%2" function call';
oGuardException_messages[cAmpleException.ARGUMENT_WRONG_TYPE_ERR]	= 'Incompatible type of %0 argument "%1" in "%2" function call. Expecting "%3"';
oGuardException_messages[cAmpleException.ARGUMENT_NULL_ERR]			= 'null is not allowed value of %0 argument "%1" in "%2" function call';
oGuardException_messages[cAmpleException.NOT_INITIALIZED_ERR]		= 'Object "%0" has not been initialized';
oGuardException_messages[cAmpleException.CANNOT_ACCESS_DOM_ERR]		= 'Cannot access DOM in element constructor';
oGuardException_messages[cAmpleException.MEMBER_MISSING_ERR]		= 'Object does not have a method named "%0"';
//<-Debug

function fGuardException_format(sMessage, aArguments) {
	for (var nIndex = 0; nIndex < aArguments.length; nIndex++)
		sMessage	= sMessage.replace('%' + nIndex, aArguments[nIndex]);
	return sMessage;
};