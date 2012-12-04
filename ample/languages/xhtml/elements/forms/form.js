/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_form	= function() {
	this.elements	= new ample.classes.NodeList;
};
cXHTMLElement_form.prototype	= new cXHTMLElement("form");

// Public Properties
cXHTMLElement_form.prototype.elements	= null;
cXHTMLElement_form.prototype.length		= 0;

// Public Methods
cXHTMLElement_form.prototype.submit	= function() {
	// Handle @target="#target"
	var sTarget	= this.getAttribute("target") || '',
		oTarget;
	if (sTarget.match(/#(.+)$/) && (oTarget = this.ownerDocument.getElementById(window.RegExp.$1))) {
		var aValue	= [],
			sAction	= this.getAttribute("action") || '',
			oProperties,
			vValue,
			sName,
			oElement;
		for (var nIndex = 0; nIndex < this.elements.length; nIndex++) {
			oElement	= this.elements[nIndex];
			if (!oElement.hasAttribute("disabled") && oElement.hasAttribute("name") && (vValue = oElement.$getValue()) != null)	{
				sName	= oElement.getAttribute("name") || '';
				if (vValue instanceof Array)
					for (var nValue = 0; nValue < vValue.length; nValue++)
						aValue.push(sName + '=' + vValue[nValue]);
				else
					aValue.push(sName + '=' + vValue);
			}
		}

		vValue	= window.encodeURI(aValue.join('&'));
		if (this.hasAttribute("method") && this.getAttribute("method").toLowerCase() == "post")
			oProperties	= {"type": "POST", "url": sAction, "headers": {'Content-Type': 'application/x-www-form-urlencoded'}, "data": vValue};
		else
			oProperties	= {"type": "GET", "url": sAction.replace(/\?.+/, '') + '?' + vValue};

		//
		oProperties.complete	= function fComplete(oRequest) {
			// TODO: Check if works
			ample.query(oTarget).html(oRequest.responseText);
		};

		ample.ajax(oProperties);
	}
	else
		this.$getContainer().submit();
};

cXHTMLElement_form.prototype.reset	= function() {
	this.$getContainer().reset();
};

// Validation
cXHTMLElement_form.prototype.checkValidity	= function() {

};

cXHTMLElement_form.prototype.dispatchFormInput	= function() {

};

cXHTMLElement_form.prototype.dispatchFormChange	= function() {

};

/* Event handlers */
cXHTMLElement_form.prototype._onSubmit	= function() {
	// Fire Event
	var oEvent	= this.ownerDocument.createEvent("Event");
	oEvent.initEvent("submit", true, true);
	return this.dispatchEvent(oEvent);
};

cXHTMLElement_form.prototype._onReset	= function() {
	// Fire Event
	var oEvent	= this.ownerDocument.createEvent("Event");
	oEvent.initEvent("reset", true, true);
	return this.dispatchEvent(oEvent);
};

// Default Element Render: open
cXHTMLElement_form.prototype.$getTagOpen	= function() {
	var sHtml	= '<' + this.localName + ' onsubmit="var oElement = ample.$instance(this); if (oElement._onSubmit()) oElement.submit(); return false;" onreset="var oElement = ample.$instance(this); if (oElement._onReset()) oElement.reset(); return false;"';
	for (var nIndex = 0, oAttribute; nIndex < this.attributes.length; nIndex++)
		if ((oAttribute = this.attributes[nIndex]).name != "class" && oAttribute.name != "id" && oAttribute.name.indexOf(':') ==-1)
			sHtml	+= ' ' + oAttribute.name + '="' + ample.$encodeXMLCharacters(oAttribute.value) + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '"';
	return sHtml + '>';
};

// Register Element
ample.extend(cXHTMLElement_form);
