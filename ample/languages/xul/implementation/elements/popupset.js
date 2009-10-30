/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_popupset	= function(){};
cXULElement_popupset.prototype	= new cXULElement;
cXULElement_popupset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods

// Register Element with language
oXULNamespace.setElement("popupset", cXULElement_popupset);
