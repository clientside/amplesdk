/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cAMLAttr(){};

cAMLAttr.prototype	= new cAMLNode;
cAMLAttr.prototype.nodeType	= cAMLNode.ATTRIBUTE_NODE;

// nsIDOMAttribute
cAMLAttr.prototype.name			= null;
cAMLAttr.prototype.specified	= null;
cAMLAttr.prototype.value		= null;

cAMLAttr.prototype.ownerElement	= null;	// Introduced in DOM-Level-2