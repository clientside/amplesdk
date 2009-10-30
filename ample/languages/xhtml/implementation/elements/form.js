/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_form	= function()
{
	this.elements	= new AMLNodeList;
};
cXHTMLElement_form.prototype	= new cXHTMLElement;

cXHTMLElement_form.prototype.$validate	= function()
{
	for (var nIndex = 0; nIndex < this.elements.length; nIndex++) {
		if (!this.elements[nIndex].$validate())
			return false;
	}
	return true;
}

// Public Methods
cXHTMLElement_form.prototype.submit	= function()
{
	// Handle @target="#target"
	var sTarget	= this.getAttribute("target"),
		oTarget;
	if (sTarget.match(/#(.+)$/) && (oTarget = this.ownerDocument.getElementById(window.RegExp.$1)))
	{
		var aValue	= [],
			sAction	= this.getAttribute("action").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&'),
			vValue,
			sName,
			oElement;
		for (var nIndex = 0; nIndex < this.elements.length; nIndex++)
		{
			oElement	= this.elements[nIndex];
			if (!oElement.hasAttribute("disabled") && oElement.hasAttribute("name") && (vValue = oElement.$getValue()) != null)
			{
				sName	= oElement.getAttribute("name");
				if (vValue instanceof window.Array)
					for (var nValue = 0; nValue < vValue.length; nValue++)
						aValue.push(sName + '=' + vValue[nValue]);
				else
					aValue.push(sName + '=' + vValue);
			}
		}
		vValue	= window.encodeURI(aValue.join('&'));
		if (this.getAttribute("method").toLowerCase() == "post")
			oTarget.$load(sAction, "POST", {'Content-Type': 'application/x-www-form-urlencoded'}, vValue);
		else
			oTarget.$load(sAction.replace(/\?.+/, '') + '?' + vValue, this.getAttribute("method"));
	}
	else
		this.$getContainer().submit();
};

cXHTMLElement_form.prototype.reset	= function()
{
	this.$getContainer().reset();
};

/* Event handlers */
cXHTMLElement_form.prototype._onSubmit	= function()
{
    // Fire Event
    var oEvent = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("submit", true, true);

    return this.dispatchEvent(oEvent);
};

cXHTMLElement_form.prototype._onReset	= function()
{
    // Fire Event
    var oEvent = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("reset", true, true);

    return this.dispatchEvent(oEvent);
};

// Default actions implementations
cXHTMLElement_form.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_input ||
			oEvent.target instanceof cXHTMLElement_select ||
			oEvent.target instanceof cXHTMLElement_textarea ||
			oEvent.target instanceof cXHTMLElement_button) {
				oEvent.target.form	= this;
				this.elements.$add(oEvent.target);
//				if (oEvent.target.hasAttribute("name"))
//					this.elements[oEvent.target.getAttribute("name")]	= oEvent.target;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target instanceof cXHTMLElement_input ||
			oEvent.target instanceof cXHTMLElement_select ||
			oEvent.target instanceof cXHTMLElement_textarea ||
			oEvent.target instanceof cXHTMLElement_button) {
				oEvent.target.form	= null;
				this.elements.$remove(oEvent.target);
//				if (oEvent.target.hasAttribute("name"))
//					delete this.elements[oEvent.target.getAttribute("name")];
		}
	}
}

// Default Element Render: open
cXHTMLElement_form.prototype.$getTagOpen	= function()
{
    var sHtml   = '<' + this.localName + ' onsubmit="var oElement = ample.$instance(this); if (oElement._onSubmit()) oElement.submit(); return false;" onreset="var oElement = ample.$instance(this); if (oElement._onReset()) oElement.reset(); return false;"';
    for (var sName in this.attributes)
		if (sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
			sHtml  += ' ' + sName + '="' + this.getAttribute(sName).replace(/"/g, '\"') + '"';
	sHtml	+= ' class="' + (this.prefix ? this.prefix + '-' : '') + this.localName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '"';
    return sHtml + '>';
};

// Register Element with language
oXHTMLNamespace.setElement("form", cXHTMLElement_form);
