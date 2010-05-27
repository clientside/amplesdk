/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element_tbody	= function(){};
cHTML5Element_tbody.prototype	= new cHTML5Element;

cHTML5Element_tbody.prototype.$getTagOpen	= function() {
	return '<div class="tbody' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<table '+
					(this.parentNode.hasAttribute("width") ? ' width="' + this.parentNode.getAttribute("width") + '"' : '') +
					(this.parentNode.hasAttribute("cellpadding") ? ' cellpadding="' + this.parentNode.getAttribute("cellpadding") + '"' : '') +
					(this.parentNode.hasAttribute("cellspacing") ? ' cellspacing="' + this.parentNode.getAttribute("cellspacing") + '"' : '') +
					(this.parentNode.hasAttribute("border") ? ' border="' + this.parentNode.getAttribute("border") + '"' : '') +
					'>\
					<tbody class="tbody--gateway">';
};

cHTML5Element_tbody.prototype.$getTagClose	= function() {
	return '		</tbody>\
				</table>\
			</div>';
};

// Register Element with language
oHTML5Namespace.setElement("tbody", cHTML5Element_tbody);

