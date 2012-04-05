/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_popupset	= function(){};
cXULElement_popupset.prototype	= new cXULElement("popupset");
cXULElement_popupset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods

// Register Element
ample.extend(cXULElement_popupset);
