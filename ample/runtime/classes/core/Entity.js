/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cEntity	= function() {};

cEntity.prototype	= new cNode;
cEntity.prototype.nodeType	= 6;	// cNode.ENTITY_NODE

//
cEntity.prototype.publicId	= null;
cEntity.prototype.systemId	= null;
cEntity.prototype.notationName	= null;
cEntity.prototype.inputEncoding	= null;
cEntity.prototype.xmlEncoding	= null;
cEntity.prototype.xmlVersion	= null;