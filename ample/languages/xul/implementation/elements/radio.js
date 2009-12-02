/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_radio	= function(){};
cXULElement_radio.prototype   = new cXULElement;

cXULElement_radio.prototype.group	= null;

// Public Methods
cXULElement_radio.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
     }
    else
    if (sName == "value")
    {
        this.$getContainer("input").value    = sValue;
    }
    else
    if (sName == "selected")
    {
        if (sValue == "true")
        {
            // deselect previously selected radio
            if (this.group.items[this.group.selectedIndex])
                this.group.items[this.group.selectedIndex].setAttribute("selected", "false");

            this.group.selectedIndex    = this.group.items.$indexOf(this);
            this.group.selectedItem     = this.group.items[this.group.selectedIndex];
            this.group.attributes["value"]  = this.attributes["value"];
        }
        else
        {
            this.group.selectedIndex    =-1;
            this.group.selectedItem     = null;
            this.group.attributes["value"]  = "";
        }
		this.$getContainer("input").checked  = sValue == "true";
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

cXULElement_radio.prototype.$isAccessible	= function()
{
	return this.getAttribute("disabled") != "true" && (this.group ? this.group.$isAccessible() : true);
};

// Events Handlers
cXULElement_radio.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
		this.setAttribute("selected", "true");
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		for (var oElement = this; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULElement_radiogroup)
				break;
		if (oElement) {
			this.$getContainer("input").name	= oElement.uniqueID + "_radio";
			oElement.items.$add(this);
			this.group   = oElement;
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		for (var oElement = this; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULElement_radiogroup)
				break;
		if (oElement) {
			oElement.items.$remove(this);
			this.group   = null;
		}
	}
};

cXULElement_radio.prototype._onClick = function(oEvent)
{
    if (this.group)
    {
        this.group.selectedIndex    = this.group.items.$indexOf(this);
        this.group.selectedItem     = this.group.items[this.group.selectedIndex];
        this.group.attributes["value"] = this.attributes["value"];

	    // Fire Event
	    var oEvent  = this.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", false, true);
	    this.group.dispatchEvent(oEvent);
    }
};

// Element Render: open
cXULElement_radio.prototype.$getTagOpen	= function()
{
    var sHtml   = '<label class="xul-radio' + ((this.group && this.group.attributes["disabled"] == "true") || this.attributes["disabled"] == "true" ? " xul-radio_disabled" : "")+ '">';
    sHtml	+= '<input type="radio" autocomplete="off"';
    if (this.attributes["value"])
        sHtml  += ' value="' + this.attributes["value"] + '"';
    if (this.attributes["selected"] == "true")
        sHtml  += ' checked="true"';
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' onclick="ample.$instance(this)._onClick(event)" class="xul-radio--input" />';
    sHtml  += '<span class="xul-radio--label">' + (this.attributes["label"] ? this.attributes["label"] : '') + '</span>';


    return sHtml;
};

// Element Render: close
cXULElement_radio.prototype.$getTagClose	= function()
{
    return '</label>';
};

// Register Element with language
oXULNamespace.setElement("radio", cXULElement_radio);
