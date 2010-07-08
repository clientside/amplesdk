/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_keyset	= function(){};
cXULElement_keyset.prototype	= new cXULElement;
cXULElement_keyset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods

// Register Element with language
oXULNamespace.setElement("keyset", cXULElement_keyset);
