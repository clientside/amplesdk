/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_checkbox	= function(){};
cXULElement_checkbox.prototype	= new cXULElement;
cXULElement_checkbox.prototype.tabIndex	= 0;

// Apply Behaviours

// Public Methods
cXULElement_checkbox.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
    }
    else
    if (sName == "value")
    {
        this.$getContainer("input").checked  =(sValue == "on" ? true : false);
        this.attributes["checked"]      =(sValue == "on" ? "true" : "false");
    }
    else
    if (sName == "checked")
    {
        this.$getContainer("input").checked  =(sValue == "true" ? true : false);
        this.attributes["value"]        =(sValue == "true" ? "on" : "off");
    }
    else
    if (sName == "label")
    {
        this.$getContainer("label").innerHTML = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events handlers
cXULElement_checkbox.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

//
cXULElement_checkbox.prototype._onChange = function(oEvent)
{
    this.attributes["checked"]  = this.$getContainer("input").checked.toString();
    this.attributes["value"]    = this.attributes["checked"] == "true" ? "on" : "off";

    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_checkbox.prototype.$getTagOpen		= function()
{
    var sHtml   = '<label class="xul-checkbox' + (this.attributes["disabled"] == "true" ? " xul-checkbox_disabled" : "") + '">';
    sHtml	+= '<input type="checkbox" name="' + this.attributes["name"] + '" class="xul-checkbox--input"';
    if (this.attributes["checked"] == "true" || this.attributes["value"] == "on")
    {
        sHtml  += ' checked="true"';
        this.attributes["checked"]  = "true";
        this.attributes["value"]    = "on";
    }
    else
    {
        this.attributes["checked"]  = "false";
        this.attributes["value"]    = "off";
    }
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' onclick="return ample.$instance(this)._onChange(event);" autocomplete="off" />';
    sHtml  += '<span class="xul-checkbox--label">' +(this.attributes["label"] ? this.attributes["label"] : '')+ '</span>';

    return sHtml;
};

// Element Render: close
cXULElement_checkbox.prototype.$getTagClose	= function()
{
    return '</label>';
};

// Register Element with language
oXULNamespace.setElement("checkbox", cXULElement_checkbox);
