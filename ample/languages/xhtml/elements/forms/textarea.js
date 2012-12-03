/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_textarea	= function(){
	this.validity	= new cXHTMLValidityState;
};
cXHTMLElement_textarea.prototype	= new cXHTMLInputElement("textarea");

// Public methods
cXHTMLElement_textarea.prototype.select	= function() {
	this.$getContainer().select();
};

// Events Handlers
cXHTMLElement_textarea.prototype._onChange	= function(oEvent) {
	// Fire Event
	var oEvent2	= this.ownerDocument.createEvent("UIEvent");
	oEvent2.initUIEvent("change", true, false, window, null);
	this.dispatchEvent(oEvent2);
};

// Events Handlers
cXHTMLElement_textarea.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("value").focus();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		//
		cXHTMLInputElement.register(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		//
		cXHTMLInputElement.unregister(this);
	}
};

// Renderers
cXHTMLElement_textarea.prototype.$getTagOpen	= function() {
	var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName,
		sClass	= this.getAttribute("class"),
		aHtml	=['<span'];
	for (var nIndex = 0, oAttribute; nIndex < this.attributes.length; nIndex++)
		if ((oAttribute = this.attributes[nIndex]) && oAttribute.name != "class" && oAttribute.name != "id" && !oAttribute.prefix)
			aHtml.push(' ' + oAttribute.name + '="' + ample.$encodeXMLCharacters(oAttribute.value) + '"');
	aHtml.push(	' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + (sClass ? ' ' + sClass : '') + '">');
	aHtml.push(	'<div style="position:absolute;margin-top:-2px;white-space:nowrap" class="' + sClassName + '--placeholder">' +(this.getAttribute("placeholder") || '')+ '</div>');
	aHtml.push(	'<div class="' + sClassName + '--field" style="position:relative;height:100%;">');
	aHtml.push(		'<textarea class="' + sClassName + '--value" onchange="ample.$instance(this)._onChange(event)" style="width:100%;height:100%">');
	return aHtml.join('');
};

cXHTMLElement_textarea.prototype.$getTagClose	= function() {
	return 			'</textarea>\
				</div>\
			</span>';
};

// Register Element
ample.extend(cXHTMLElement_textarea);
