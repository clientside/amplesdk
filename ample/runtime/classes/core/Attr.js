/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAttr	= function(){};

cAttr.prototype	= new cNode;
cAttr.prototype.nodeType	= 2;	// cNode.ATTRIBUTE_NODE

// nsIDOMAttribute
cAttr.prototype.name		= null;
cAttr.prototype.specified	= null;
cAttr.prototype.value		= null;

cAttr.prototype.ownerElement= null;	// Introduced in DOM-Level-2