/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cHTML5Element_tfoot	= function(){};
cHTML5Element_tfoot.prototype	= new cHTML5Element;

cHTML5Element_tfoot.prototype.$getTagOpen	= function() {
	return '<div class="tfoot' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<table '+
					(this.parentNode.hasAttribute("width") ? ' width="' + this.parentNode.getAttribute("width") + '"' : '') +
					(this.parentNode.hasAttribute("cellpadding") ? ' cellpadding="' + this.parentNode.getAttribute("cellpadding") + '"' : '') +
					(this.parentNode.hasAttribute("cellspacing") ? ' cellspacing="' + this.parentNode.getAttribute("cellspacing") + '"' : '') +
					(this.parentNode.hasAttribute("border") ? ' border="' + this.parentNode.getAttribute("border") + '"' : '') +
					'>\
					<tfoot class="tfoot--gateway">';
};

cHTML5Element_tfoot.prototype.$getTagClose	= function() {
	return '		</tfoot>\
				</table>\
			</div>';
};

// Register Element with language
oHTML5Namespace.setElement("tfoot", cHTML5Element_tfoot);
