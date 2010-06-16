/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element_thead	= function(){};
cHTML5Element_thead.prototype	= new cHTML5Element;

cHTML5Element_thead.prototype.$getTagOpen	= function() {
	return '<div class="thead' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<table '+
					(this.parentNode.hasAttribute("width") ? ' width="' + this.parentNode.getAttribute("width") + '"' : '') +
					(this.parentNode.hasAttribute("cellpadding") ? ' cellpadding="' + this.parentNode.getAttribute("cellpadding") + '"' : '') +
					(this.parentNode.hasAttribute("cellspacing") ? ' cellspacing="' + this.parentNode.getAttribute("cellspacing") + '"' : '') +
					(this.parentNode.hasAttribute("border") ? ' border="' + this.parentNode.getAttribute("border") + '"' : '') +
					'>\
					<thead class="thead--gateway">';
};

cHTML5Element_thead.prototype.$getTagClose	= function() {
	return '		</thead>\
				</table>\
			</div>';
};


// Register Element with language
oHTML5Namespace.setElement("thead", cHTML5Element_thead);

