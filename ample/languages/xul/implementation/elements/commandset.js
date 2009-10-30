/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_commandset	= function(){};
cXULElement_commandset.prototype = new cXULElement;
cXULElement_commandset.prototype.viewType    = cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods

// Register Element with language
oXULNamespace.setElement("commandset", cXULElement_commandset);
