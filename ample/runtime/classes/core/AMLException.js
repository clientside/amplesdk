/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLException	= function(nException) {
	this.code	= nException;

	var sMessage	= "Ample" + ' ' + "exception" + ': ' + nException;
//->Debug
	// Replace placeholders
	sMessage	= oAML_messages[nException] || "Unknown error";
	if (arguments.length > 2)
		sMessage	= fAML_format(sMessage, arguments[2]);
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
cAMLException.AML_SELECTOR_ELEMENT_ERR		=-3;
cAMLException.AML_SELECTOR_ATTRIBUTE_ERR	=-4;
cAMLException.AML_NOT_INITIALIZED_ERR		=-5;
cAMLException.AML_MODAL_SET_MODAL_ERR		=-6;
cAMLException.AML_MODAL_RELEASE_MODAL_ERR	=-7;

//
cAMLException.prototype.code	= null;
cAMLException.prototype.message	= null;

cAMLException.prototype.toString	= function() {
	return this.message;
};
