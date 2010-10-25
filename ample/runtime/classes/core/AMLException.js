/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLException	= function(nException) {
	this.code	= nException;

	var sMessage	= "Ample" + ' ' + "exception" + ': ' + nException;
//->Debug
	// Replace placeholders
	sMessage	= oAMLException_messages[nException] || "Unknown error";
	if (arguments.length > 2)
		sMessage	= fAMLException_format(sMessage, arguments[2]);
//<-Debug

	this.message= sMessage;
	this.caller	= arguments[1] || cAMLException.caller.caller;
};

// nsIDOMException
cAMLException.INDEX_SIZE_ERR				= 1;	// DOM 1
cAMLException.DOMSTRING_SIZE_ERR			= 2;
cAMLException.HIERARCHY_REQUEST_ERR			= 3;
cAMLException.WRONG_DOCUMENT_ERR			= 4;
cAMLException.INVALID_CHARACTER_ERR			= 5;
cAMLException.NO_DATA_ALLOWED_ERR			= 6;
cAMLException.NO_MODIFICATION_ALLOWED_ERR	= 7;
cAMLException.NOT_FOUND_ERR					= 8;
cAMLException.NOT_SUPPORTED_ERR				= 9;
cAMLException.INUSE_ATTRIBUTE_ERR			= 10;
cAMLException.INVALID_STATE_ERR				= 11;
cAMLException.SYNTAX_ERR					= 12;	// DOM 2
cAMLException.INVALID_MODIFICATION_ERR		= 13;
cAMLException.NAMESPACE_ERR					= 14;
cAMLException.INVALID_ACCESS_ERR			= 15;
cAMLException.VALIDATION_ERR				= 16;	// DOM 3
cAMLException.TYPE_MISMATCH_ERR				= 17;

// AML Exceptions
cAMLException.AML_ARGUMENT_MISSING_ERR		=-1;
cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR	=-2;
cAMLException.AML_ARGUMENT_NULL_ERR			=-3;
cAMLException.AML_SELECTOR_ELEMENT_ERR		=-4;
cAMLException.AML_SELECTOR_ATTRIBUTE_ERR	=-5;
cAMLException.AML_NOT_INITIALIZED_ERR		=-6;
cAMLException.AML_MODAL_SET_MODAL_ERR		=-7;
cAMLException.AML_MODAL_RELEASE_MODAL_ERR	=-8;
cAMLException.AML_MEMBER_MISSING_ERR		=-9;
cAMLException.AML_TRIGGER_CORE_EVENT_ERR	=-10;
cAMLException.AML_LOCALE_BAD_NUMBER_FORMAT	=-20;
cAMLException.AML_LOCALE_BAD_DATE_FORMAT	=-21;

//
cAMLException.prototype.code	= null;
cAMLException.prototype.message	= null;

cAMLException.prototype.toString	= function() {
	return this.message;
};

function fAMLException_format(sMessage, aArguments) {
	for (var nIndex = 0; nIndex < aArguments.length; nIndex++)
		sMessage	= sMessage.replace('%' + nIndex, aArguments[nIndex]);
	return sMessage;
};

//->Debug
var oAMLException_messages	= {};
oAMLException_messages[cAMLException.INDEX_SIZE_ERR]				= 'Index or size is negative or greater than the allowed amount';
//oAMLException_messages[cAMLException.DOMSTRING_SIZE_ERR]			= '';
oAMLException_messages[cAMLException.HIERARCHY_REQUEST_ERR]			= 'Node cannot be inserted at the specified point in the hierarchy';
//oAMLException_messages[cAMLException.WRONG_DOCUMENT_ERR]			= '';
//oAMLException_messages[cAMLException.INVALID_CHARACTER_ERR]		= '';
//oAMLException_messages[cAMLException.NO_DATA_ALLOWED_ERR]			= '';
//oAMLException_messages[cAMLException.NO_MODIFICATION_ALLOWED_ERR]	= '';
oAMLException_messages[cAMLException.NOT_FOUND_ERR]					= 'An attempt is made to reference a Node in a context where it does not exist';
oAMLException_messages[cAMLException.NOT_SUPPORTED_ERR]				= 'Implementation does not support the requested type of object or operation';
//oAMLException_messages[cAMLException.INUSE_ATTRIBUTE_ERR]			= '';
//oAMLException_messages[cAMLException.INVALID_STATE_ERR]			= '';
oAMLException_messages[cAMLException.SYNTAX_ERR]					= 'An invalid or illegal string is specified';
//oAMLException_messages[cAMLException.INVALID_MODIFICATION_ERR]	= '';
//oAMLException_messages[cAMLException.NAMESPACE_ERR]				= '';
//oAMLException_messages[cAMLException.INVALID_ACCESS_ERR]			= '';
//oAMLException_messages[cAMLException.VALIDATION_ERR]				= '';
oAMLException_messages[cAMLException.TYPE_MISMATCH_ERR]				= 'The type of an object is incompatible with the expected type of the parameter';
// AML Exceptions
oAMLException_messages[cAMLException.AML_ARGUMENT_MISSING_ERR]		= 'Missing required %0 argument "%1" in "%2" function call';
oAMLException_messages[cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR]	= 'Incompatible type of %0 argument "%1" in "%2" function call. Expecting "%3"';
oAMLException_messages[cAMLException.AML_ARGUMENT_NULL_ERR]			= 'null is not allowed value of %0 argument "%1" in "%2" function call';
oAMLException_messages[cAMLException.AML_SELECTOR_ELEMENT_ERR]		= 'Unknown element selector "%0"';
oAMLException_messages[cAMLException.AML_SELECTOR_ATTRIBUTE_ERR]	= 'Unknown attribute selector "%0"';
oAMLException_messages[cAMLException.AML_NOT_INITIALIZED_ERR]		= 'Object "%0" has not been initialized';
oAMLException_messages[cAMLException.AML_MODAL_SET_MODAL_ERR]		= 'Element is already modal';
oAMLException_messages[cAMLException.AML_MODAL_RELEASE_MODAL_ERR]	= 'Element can not be released';
oAMLException_messages[cAMLException.AML_MEMBER_MISSING_ERR]		= 'Object does not have a method named "%0"';
oAMLException_messages[cAMLException.AML_TRIGGER_CORE_EVENT_ERR]	= 'Triggering core event "%0" is not allowed';
oAMLException_messages[cAMLException.AML_LOCALE_BAD_NUMBER_FORMAT]	= 'Bad number format string: "%0"';
oAMLException_messages[cAMLException.AML_LOCALE_BAD_DATE_FORMAT]	= 'Invalid date format string: "%0"';
//<-Debug