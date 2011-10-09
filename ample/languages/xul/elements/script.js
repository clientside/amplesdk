/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_script	= function(){};
cXULElement_script.prototype	= new cXULElement("script");

// Attributes Defaults
cXULElement_script.attributes	= {};
cXULElement_script.attributes.hidden	= "true";

// Public Methods

// Element Handlers
cXULElement_script.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "src":
					if (oEvent.newValue)
						this.$getContainer().src  = cXULElement.decodeXMLEntities(oEvent.newValue || '');
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.attributes["src"])
			this.$getContainer().src  = cXULElement.decodeXMLEntities(this.attributes["src"]);
		else
		if (this.firstChild) {
			var oElement	= document.body.appendChild(document.createElement("script"));
			oElement.type	= "text/javascript";
			oElement.text	= cXULElement.decodeXMLEntities(this.firstChild.nodeValue);
		}
	}
};

// Element Render: open
cXULElement_script.prototype.$getTagOpen	= function() {
    return '<script type="text/javascript">';
};

// Element Render: close
cXULElement_script.prototype.$getTagClose	= function() {
    return '</script>';
};

// Register Element
ample.extend(cXULElement_script);
