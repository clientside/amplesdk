/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAUIElement_panel	= function(){};
cAUIElement_panel.prototype	= new cAUIElement("panel");

cAUIElement_panel.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "collapsed":
					// TODO
					break;
			}
		}
	}
};

cAUIElement_panel.prototype.toggle	= function() {
	this.setAttribute("collapsed", this.getAttribute("collapsed") == "true" ? "false" : "true");
};

// Renderers
cAUIElement_panel.prototype.$getTagOpen	= function() {
	return '<div class="aml-panel"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<div class="aml-panel--head">\
					<div class="aml-panel--icon"><br /></div>\
					<div class="aml-panel--label">' + this.getAttribute("label")+ '</div>\
				</div>\
				<div class="aml-panel--gateway">';
};

cAUIElement_panel.prototype.$getTagClose	= function() {
    return '	</div>\
    		</div>';
};

// Register Element
ample.extend(cAUIElement_panel);
