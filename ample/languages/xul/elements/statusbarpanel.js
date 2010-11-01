/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_statusbarpanel	= function(){};
cXULElement_statusbarpanel.prototype = new cXULElement("statusbarpanel");

// Attributes Defaults
cXULElement_statusbarpanel.attributes	= {};
cXULElement_statusbarpanel.attributes.align	= "center";

// Class Events Handlers
cXULElement_statusbarpanel.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "label":
					this.$getContainer().innerHTML    =(this.attributes["image"] ? '<img src="' + this.attributes["image"] + '" align="absmiddle"/>' : '') + oEvent.newValue || '';
					break;

				case "image":
					this.$getContainer().innerHTML    =(oEvent.newValue ? '<img src="' + oEvent.newValue + '" align="absmiddle"/>' : '') + this.attributes["label"] || '';
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Element Render: open
cXULElement_statusbarpanel.prototype.$getTagOpen	= function() {
    var sHtml   = '<div class="xul-statusbarpanel' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/>';
    else
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];
//    else
//        sHtml  += ' ';
    return sHtml;
};

// Element Render: close
cXULElement_statusbarpanel.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element
ample.extend(cXULElement_statusbarpanel);
