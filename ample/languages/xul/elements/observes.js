/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_observes	= function(){};
cXULElement_observes.prototype	= new cXULElement("observes");
cXULElement_observes.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Register Element
ample.extend(cXULElement_observes);
