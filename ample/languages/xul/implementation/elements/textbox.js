/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_textbox	= function(){};
cXULElement_textbox.prototype	= new cXULElement;
cXULElement_textbox.prototype.tabIndex	= 0;

// Attributes Defaults
cXULElement_textbox.attributes	= {};
cXULElement_textbox.attributes.value	= "";

// Public Methods
cXULElement_textbox.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer().value    = sValue;
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer().disabled = sValue == "true";
    }
    else
    if (sName == "readonly")
    {
    	//
        this.$getContainer().readOnly	=(sValue == "true");
    }
    else
    if (sName == "type")
    {
        // values: password || default
        // changing this attribute is currently not supported
    }
    else
    if (sName == "multiline")
    {
        // values: true || default
        // changing this attribute is currently not supported
    }
    else
    if (sName == "maxlength")
    {

    }
    else
    if (sName == "rows")
    {
        if (this.attributes["multiline"] == "true")
            this.$getContainer().rows = sValue;
    }
    else
    if (sName == "cols")
    {
        if (this.attributes["multiline"] == "true")
            this.$getContainer().cols = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events Handlers
cXULElement_textbox.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"keyup":	function(oEvent) {
    	this.attributes["value"]	= this.$getContainer().value;
	}
};

cXULElement_textbox.prototype._onChange  = function(oEvent)
{
    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_textbox.prototype.$getTagOpen	= function(oElement)
{
    var sHtml   = '<';
    if (this.attributes["multiline"] == "true")
    {
        sHtml  += "textarea";
        if (this.attributes["rows"])
            sHtml  += ' rows="' + this.attributes["rows"] + '"';
        if (this.attributes["cols"])
            sHtml  += ' cols="' + this.attributes["cols"] + '"';
    }
    else
    if (this.attributes["type"] == "password")
        sHtml  += 'input type="password"';
    else
        sHtml  += 'input type="text"';
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    if (this.attributes["readonly"] == "true")
        sHtml  += ' readonly="true"';
    sHtml  += ' name="' + this.attributes["name"] + '" autocomplete="off" class="xul-textbox' +(this.attributes["disabled"] == "true" ? " xul-textbox_disabled" : '')+ '"';
    sHtml  += ' onblur="ample.$instance(this)._onChange(event)" onselectstart="event.cancelBubble=true;"';
    sHtml  += ' style="';
    if (this.attributes["multiline"] != "true")
        sHtml  += 'height: 19px;';
    else
    if (this.attributes["height"])
        sHtml  += 'height:' + this.attributes["height"] + ';';
    if (this.attributes["width"] || this.attributes["flex"])
        sHtml  += 'width:' + (this.attributes["width"] || "100%") + ';';
    sHtml  += '"';
    if (this.attributes["multiline"] == "true")
        sHtml  += '>' + this.attributes["value"] + '</textarea>';
    else
        sHtml  += ' value="' + this.attributes["value"] + '" />';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("textbox", cXULElement_textbox);
