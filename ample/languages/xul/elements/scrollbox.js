/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_scrollbox	= function(){};
cXULElement_scrollbox.prototype	= new cXULElement("scrollbox");
cXULElement_scrollbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Element Render: open
cXULElement_scrollbox.prototype.$getTagOpen	= function() {
	return '<div class="xul-scrollbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="position:relative;overflow:auto;width:100%;height:100%;">\
				<div style="position:absolute;width:100%;height:100%;">';
};

// Element Render: close
cXULElement_scrollbox.prototype.$getTagClose	= function() {
	return '	</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_scrollbox);
