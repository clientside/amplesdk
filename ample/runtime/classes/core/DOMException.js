/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDOMException	= function(nCode) {
	this.code	= nCode;
	var sMessage	= "DOMException" + ' ' + nCode;

//->Debug
	sMessage	+= ':' + ' ' + oDOMException_messages[nCode];
	//
	this.caller	= arguments[1] || cDOMException.caller.caller;
//<-Debug

	this.message= sMessage;
};

// nsIDOMException
cDOMException.INDEX_SIZE_ERR				= 1;	// DOM 1
cDOMException.DOMSTRING_SIZE_ERR			= 2;
cDOMException.HIERARCHY_REQUEST_ERR			= 3;
cDOMException.WRONG_DOCUMENT_ERR			= 4;
cDOMException.INVALID_CHARACTER_ERR			= 5;
cDOMException.NO_DATA_ALLOWED_ERR			= 6;
cDOMException.NO_MODIFICATION_ALLOWED_ERR	= 7;
cDOMException.NOT_FOUND_ERR					= 8;
cDOMException.NOT_SUPPORTED_ERR				= 9;
cDOMException.INUSE_ATTRIBUTE_ERR			= 10;
cDOMException.INVALID_STATE_ERR				= 11;
cDOMException.SYNTAX_ERR					= 12;	// DOM 2
cDOMException.INVALID_MODIFICATION_ERR		= 13;
cDOMException.NAMESPACE_ERR					= 14;
cDOMException.INVALID_ACCESS_ERR			= 15;
cDOMException.VALIDATION_ERR				= 16;	// DOM 3
cDOMException.TYPE_MISMATCH_ERR				= 17;

//
cDOMException.prototype		= new cError;
//
cDOMException.prototype.code	= null;
cDOMException.prototype.message	= null;
//
cDOMException.prototype.toString	= function() {
	return this.message;
};

//->Debug
var oDOMException_messages	= {};
oDOMException_messages[cDOMException.INDEX_SIZE_ERR]				= 'Index or size is negative or greater than the allowed amount';
//oDOMException_messages[cDOMException.DOMSTRING_SIZE_ERR]			= '';
oDOMException_messages[cDOMException.HIERARCHY_REQUEST_ERR]			= 'Node cannot be inserted at the specified point in the hierarchy';
//oDOMException_messages[cDOMException.WRONG_DOCUMENT_ERR]			= '';
//oDOMException_messages[cDOMException.INVALID_CHARACTER_ERR]		= '';
//oDOMException_messages[cDOMException.NO_DATA_ALLOWED_ERR]			= '';
//oDOMException_messages[cDOMException.NO_MODIFICATION_ALLOWED_ERR]	= '';
oDOMException_messages[cDOMException.NOT_FOUND_ERR]					= 'An attempt is made to reference a Node in a context where it does not exist';
oDOMException_messages[cDOMException.NOT_SUPPORTED_ERR]				= 'Implementation does not support the requested type of object or operation';	// %1?
//oDOMException_messages[cDOMException.INUSE_ATTRIBUTE_ERR]			= '';
//oDOMException_messages[cDOMException.INVALID_STATE_ERR]			= '';
oDOMException_messages[cDOMException.SYNTAX_ERR]					= 'An invalid or illegal string is specified';	// %1?
//oDOMException_messages[cDOMException.INVALID_MODIFICATION_ERR]	= '';
//oDOMException_messages[cDOMException.NAMESPACE_ERR]				= '';
//oDOMException_messages[cDOMException.INVALID_ACCESS_ERR]			= '';
//oDOMException_messages[cDOMException.VALIDATION_ERR]				= '';
oDOMException_messages[cDOMException.TYPE_MISMATCH_ERR]				= 'The type of an object is incompatible with the expected type of the parameter';
//<-Debug