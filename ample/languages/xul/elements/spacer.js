/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_spacer	= function(){};
cXULElement_spacer.prototype	= new cXULElement("spacer");

// Element Render: open
cXULElement_spacer.prototype.$getTagOpen	= function() {
	var sHtml	= '<div class="xul-spacer' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="';
	sHtml	+= 'width:' +(this.hasAttribute("width") ? this.getAttribute("width") : '0')+ 'px;';
	sHtml	+= 'height:' +(this.hasAttribute("height")? this.getAttribute("height"): '0')+ 'px;';
	sHtml	+= '"><img height="1" width="1" /></div>';

	return sHtml;
};

// Register Element
ample.extend(cXULElement_spacer);
