/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbarseparator	= function(){};
cXULElement_toolbarseparator.prototype	= new cXULElement("toolbarseparator");

// Element Render: open
cXULElement_toolbarseparator.prototype.$getTagOpen	= function() {
	return '<div class="xul-toolbarseparator' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></div>';
};

// Register Element
ample.extend(cXULElement_toolbarseparator);
