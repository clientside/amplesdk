/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_keyset	= function(){};
cXULElement_keyset.prototype	= new cXULElement("keyset");
cXULElement_keyset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods

// Register Element
ample.extend(cXULElement_keyset);
