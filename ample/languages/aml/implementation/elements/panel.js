/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_panel	= function(){};
cAMLElement_panel.prototype	= new cAMLElement;

cAMLElement_panel.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "collapsed":
//					this.$setAttribute("collapsed", "true");
					break;
			}
		}
	}
};

cAMLElement_panel.prototype.toggle	= function() {
	this.setAttribute("collapsed", this.getAttribute("collapsed") == "true" ? "false" : "true");
};

// Renderers
cAMLElement_panel.prototype.$getTagOpen	= function() {
	return '<div class="aml-panel"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<div class="aml-panel--head">\
					<div class="aml-panel--icon"><br /></div>\
					<div class="aml-panel--label">' + this.getAttribute("label")+ '</div>\
				</div>\
				<div class="aml-panel--gateway">';
};

cAMLElement_panel.prototype.$getTagClose	= function() {
    return '	</div>\
    		</div>';
};

// Register Element with language
oAMLNamespace.setElement("panel", cAMLElement_panel);
