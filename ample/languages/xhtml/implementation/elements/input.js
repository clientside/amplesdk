/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_input	= function(){};
cXHTMLElement_input.prototype	= new cXHTMLElement;
cXHTMLElement_input.prototype.tabIndex	= 0;

// Public Properties
cXHTMLElement_input.prototype.form	= null;

cXHTMLElement_input.prototype.$isAccessible	= function() {
	return !this.getAttribute("disabled") && this.attributes["type"] != "hidden";
};

cXHTMLElement_input.prototype.$getValue	= function() {
	var vValue	= this.$getContainer().value;
	switch (this.attributes["type"]) {
		case "radio":
		case "checkbox":
			return this.$getContainer().checked ? vValue : null;
		default:
			return vValue;
	}
};

cXHTMLElement_input.prototype.$validate	= function() {
	var sValue		= this.$getContainer().value,
		bValid		= true,
		sRequired	= this.getAttributeNS("http://www.amplesdk.com/ns/aml", "required"),
		sDataType	= this.getAttributeNS("http://www.amplesdk.com/ns/aml", "type");

	if (sDataType) {
		if (sValue == '') {
			if (sRequired == "true")
				bValid	= false;
		}
		else
		if (sDataType) {
			var aQName	= sDataType.split(':'),
				sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
				sLocalName		= aQName[1],
				oDataType		= this.ownerDocument.$model.getTypeDefinition(sNameSpaceURI, sLocalName);

			if (oDataType)
				bValid	= oDataType.$validate(sValue);
		}
		// set pseudo-classes
	    this.$setPseudoClass("valid", bValid);
	    this.$setPseudoClass("invalid", !bValid);

	    // Fire Event
	    var oEvent2 = this.ownerDocument.createEvent("CustomEvents");
	    oEvent2.initCustomEvent("validate", true, false, bValid);
	    this.dispatchEvent(oEvent2);
	}
	return bValid;
};

// Public methods
cXHTMLElement_input.prototype.select	= function() {
	this.$getContainer().select();
};

// Events Handlers
cXHTMLElement_input.prototype._onChange	= function(oEvent) {
/*
	if (this.attributes["value"] == "checkbox")
		this.attributes["value"]	= this.$getContainer().value;
	else
		this.attributes["value"]	= this.$getContainer().value;
*/
    // Fire Event
    var oEvent2 = this.ownerDocument.createEvent("UIEvents");
    oEvent2.initUIEvent("change", true, false, window, null);

    this.dispatchEvent(oEvent2);
};

// Class Events Handlers
cXHTMLElement_input.handlers	= {
	"keyup":	function() {
		var that	= this;
		setTimeout(function() {
			that.$validate();
		}, 0);
	},
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$validate();
		this.$getContainer().blur();
	},
	"DOMNodeInsertedIntoDocument":	function() {
		this.$validate();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Element Render: open
cXHTMLElement_input.prototype.$getTagOpen		= function() {
    var sHtml   = '<' + this.localName + ' onchange="ample.$instance(this)._onChange(event)"';
    for (var sName in this.attributes)
    	if (sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '/>';
};

// Element Render: close (cancel double tag)
cXHTMLElement_input.prototype.$getTagClose	= function() {
	return '';
};

// Register Element with language
oXHTMLNamespace.setElement("input", cXHTMLElement_input);
