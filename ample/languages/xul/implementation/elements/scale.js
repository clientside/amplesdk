/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
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
cXULElement_scale.prototype.$getValue	= function() {
	return this.$getContainer("input").value;
};

cXULElement_scale.prototype.$setValue	= function(sValue) {
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

// Events Handlers
cXULElement_scale.prototype._onButtonMouseDown  = function(oEvent) {
    if (this.getAttribute("disabled") == "true")
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

cXULElement_scale.prototype._onButtonKeyDown    = function(oEvent) {
    if (this.getAttribute("disabled") == "true")
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
cXULElement_scale._onDocumentMouseUp    = function(oEvent) {
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

cXULElement_scale._onDocumentMouseMove     = function(oEvent) {
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
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					this.$setValue(oEvent.newValue || '');
					break;

				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					this.$getContainer("input").disabled = oEvent.newValue == "true";
					this.$getContainer().disabled	= oEvent.newValue == "true";
					break;

				case "type":
					// TODO
					break;

				case "max":
					// TODO
					break;

				case "min":
					// TODO
					break;

				case "step":
					// TODO
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
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
//		this.$setValue(this.attributes["value"]);
	}/*,
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.form)
			this.form.elements.$remove(this);
	}*/
};

cXULElement_scale.getLeft	= function(oInstance, sValue) {
	var nMax	= oInstance.attributes["max"] * 1,
		nMin	= oInstance.attributes["min"] * 1;
	return 100 * (sValue - nMin) / (nMax - nMin) + '%';
};

// Element Render: open
cXULElement_scale.prototype.$getTagOpen	= function() {
    return '<div class="xul-scale' + (this.attributes["disabled"] == "true" ? " xul-scale_disabled" : '') + '" ' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"': '') + '>\
    			<div class="xul-scale-orient-' +(this.attributes["orient"] == "vertical" ? "vertical" : "horizontal") + '" style="position:relative;height:100%;">\
    				<div class="xul-scale--button" style="position:absolute;left:' + cXULElement_scale.getLeft(this, this.getAttribute("value")) + '" onmouseout="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button\')" onmouseover="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button\')" onmousedown="if (!ample.$instance(this).attributes.disabled) {return ample.$instance(this)._onButtonMouseDown(event);}"><br /></div>\
    			</div>\
   				<input type="text" class="xul-scale--input" autocomplete="off" value="' + this.attributes["value"] + '" style="display:none;width:1px;height:1px;"'+
   				(this.attributes["name"] ? ' name="' + this.attributes["name"] + '"' : '')+
   				(this.attributes["disabled"] == "true" ? ' disabled="' + "disabled" + '"' : '')+'/>\
   			</div>';
};

// Register Element with language
oXULNamespace.setElement("scale", cXULElement_scale);
