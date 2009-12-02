/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_scale	= function(){};
cXULElement_scale.prototype	= new cXULElement;
cXULElement_scale.prototype.tabIndex	= 0;

// Default Attributes
cXULElement_scale.attributes	= {
	"min":		"0",
	"max":		"9",
	"step":		"1",
	"value":	"0"
};

// Public Properties
cXULElement_scale.prototype.form	= null;

//Public Methods
cXULElement_scale.prototype.$getValue	= function()
{
	return this.$getContainer("input").value;
};

cXULElement_scale.prototype.$setValue	= function(sValue)
{
    if (sValue * 1.0 < this.attributes["min"] * 1.0 || isNaN(sValue))
        sValue  = this.attributes["min"] * 1.0;
    else
    if (sValue * 1.0 > this.attributes["max"] * 1.0)
        sValue  = this.attributes["max"] * 1.0;

	var oPosition	= this.getBoundingClientRect();
    this.$getContainer("button").style.left   = Math.round((oPosition.right - oPosition.left - 17) * (sValue - this.attributes["min"] * 1.0) / (this.attributes["max"] * 1.0 - this.attributes["min"] * 1.0)) + "px";

    // Save value
    this.$getContainer("input").value	= sValue;
};

// Public Methods
cXULElement_scale.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "value")
    {
		this.$setValue(sValue);
    }
    else
    if (sName == "type")
    {
        // TODO
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue != "");
        this.$getContainer("input").disabled = sValue != "";
        this.$getContainer().disabled	= sValue != "";
    }
    else
    if (sName == "step")
    {

    }
    else
    if (sName == "min")
    {

    }
    else
    if (sName == "max")
    {

    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Events Handlers
cXULElement_scale.prototype._onButtonMouseDown  = function(oEvent)
{
    if (this.getAttribute("disabled"))
        return false;

    this._mouseX    = oEvent.clientX;
    this._mouseY    = oEvent.clientY;

    this._buttonX   = parseInt(this.$getContainer("button").style.left);
    this._buttonY   = parseInt(this.$getContainer("button").style.top);

	cXULElement_scale._element	= this;
	this.ownerDocument.addEventListener("mousemove",	cXULElement_scale._onDocumentMouseMove,	false);
	this.ownerDocument.addEventListener("mouseup",		cXULElement_scale._onDocumentMouseUp,		false);

	this.$setPseudoClass("active", true, "button");

	//
	return false;
};

cXULElement_scale.prototype._onButtonKeyDown    = function(oEvent)
{
    if (this.getAttribute("disabled"))
        return false;

    var sValue  = this.$getValue();
    if (oEvent.keyCode == 39 || oEvent.keyCode == 38)
        this.$setValue(sValue * 1.0 + this.attributes["step"] * 1.0);
    else
    if (oEvent.keyCode == 37 || oEvent.keyCode == 40)
        this.$setValue(sValue * 1.0 - this.attributes["step"] * 1.0);

    if (sValue != this.$getValue())
    {
	    // Fire Event
	    var oEvent  = this.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", true, false);
	    this.dispatchEvent(oEvent);
    }
};

// Static Methods
cXULElement_scale._onDocumentMouseUp    = function(oEvent)
{
	var oElement	= cXULElement_scale._element;

	// detach element
	delete cXULElement_scale._element;
	oElement.ownerDocument.removeEventListener("mousemove",	cXULElement_scale._onDocumentMouseMove,false);
	oElement.ownerDocument.removeEventListener("mouseup",	cXULElement_scale._onDocumentMouseUp,	false);

	// restore visual state
	oElement.$setPseudoClass("active", false, "button");

	var oPosition	= oElement.getBoundingClientRect();
	var sValue	= oElement.attributes["min"] * 1.0 + Math.round((oElement._buttonX  / (oPosition.right - oPosition.left - 17)) * (oElement.attributes["max"] * 1.0 - oElement.attributes["min"] * 1.0) / oElement.attributes["step"]) * oElement.attributes["step"];

	var sValueOld	= oElement.$getValue();
    oElement.$setValue(sValue);
	if (sValueOld != oElement.$getValue())
	{
	    // Fire Event
	    var oEvent  = oElement.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", true, false);
	    oElement.dispatchEvent(oEvent);
	}
};

cXULElement_scale._onDocumentMouseMove     = function(oEvent)
{
	var oElement	= cXULElement_scale._element;
	var oPosition	= oElement.getBoundingClientRect(),
		nWidth		= oPosition.right - oPosition.left;

    oElement._buttonX  += oEvent.clientX - oElement._mouseX;
    oElement._buttonY  += oEvent.clientY - oElement._mouseY;

    oElement.$getContainer("button").style.left   =(oElement._buttonX < 0 ? 0 : oElement._buttonX < nWidth - 17 ? oElement._buttonX : nWidth - 17) + "px";

    oElement._mouseX    = oEvent.clientX;
    oElement._mouseY    = oEvent.clientY;
};

// Class Event Handlers
cXULElement_scale.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		/*
		for (var oElementTemp = this; oElementTemp; oElementTemp = oElementTemp.parentNode)
			if (oElementTemp instanceof cXHTMLElement_form)
				break;

		if (oElementTemp)
		{
			// Set reference to the form element
			this.form	= oElementTemp;

			// Add to collection of elements
			oElementTemp.elements.$add(this);
	//		oElementTemp.elements[this.attributes["name"]]	= this;
		}*/
		this.$setValue(this.attributes["value"]);
	}/*,
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.form)
			this.form.elements.$remove(this);
	}*/
};

// Element Render: open
cXULElement_scale.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table tabindex="0"' +(this.attributes["disabled"] ? ' disabled="disabled"' : '') + ' cellpadding="0" cellspacing="0" border="0" class="xul-scale' + (this.attributes["disabled"] ? " xul-scale_disabled" : '') + '" ' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"': '') + ' onkeydown="return ample.$instance(this)._onButtonKeyDown(event);">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td><div style="width:3px" /></td>';
    sHtml  += '<td width="100%" class="xul-scale-orient-' +(this.attributes["orient"] == "vertical" ? "vertical" : "horizontal") + '">';
    sHtml  += '<div class="xul-scale--button" style="position:relative;left:0px;top:0px;" onmouseout="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button\')" onmouseover="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button\')" onmousedown="if (!ample.$instance(this).attributes.disabled) {return ample.$instance(this)._onButtonMouseDown(event);}"><br /></div>';
    sHtml  += '</td>';
    sHtml  += '<td><div style="width:3px"><input type="text" value="' + this.attributes["value"] + '" autocomplete="off"';
    if (this.attributes["name"])
        sHtml  += ' name="' + this.attributes["name"] + '"';
    if (this.attributes["disabled"])
        sHtml  += ' disabled="' + "disabled" + '"';
    sHtml  += ' style="display:none;width:1px;height:1px;" class="xul-scale--input"/></div></td>';
    sHtml  += '</tr>';
	sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("scale", cXULElement_scale);
