/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cDocumentType	= function() {
	this.entities	= {};
	this.notations	= {};
};

cDocumentType.prototype	= new cNode;
cDocumentType.prototype.nodeType	= 10;	// cNode.DOCUMENT_TYPE_NODE

//
cDocumentType.prototype.name		= null;
cDocumentType.prototype.entities	= null;
cDocumentType.prototype.notations	= null;
cDocumentType.prototype.publicId	= null;
cDocumentType.prototype.systemId	= null;
cDocumentType.prototype.internalSubset	= null;
