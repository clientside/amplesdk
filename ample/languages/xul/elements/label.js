/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_label	= function(){};
cXULElement_label.prototype	= new cXULElement("label");

// Public Methods

// Class Events Handlers
cXULElement_label.handlers	= {
	"click":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		var oControl;
		if (!oEvent.defaultPrevented)
			if (this.attributes["control"] && (oControl = this.ownerDocument.getElementById(this.attributes["control"])))
				oControl.focus();
	}
};

cXULElement_label.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value")
		this.$getContainer().innerHTML	= sValue || '';
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_label.prototype.$getTagOpen	= function() {
	return '<label class="xul-label' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '">' + (this.attributes["value"] ? ample.$encodeXMLCharacters(this.attributes["value"]) : '');
};

// Element Render: close
cXULElement_label.prototype.$getTagClose	= function() {
	return '</label>';
};

// Register Element
ample.extend(cXULElement_label);
