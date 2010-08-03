/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_filepicker	= function(){};
cAMLElement_filepicker.prototype = new cAMLElement("filepicker");
//
cAMLElement_filepicker.prototype.tabIndex	= 0;

cAMLElement_filepicker.prototype.$isAccessible	= function()
{
	return !this.getAttribute("disabled");
};

// Public Methods
cAMLElement_filepicker.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "disabled")
    {
	   	var oElementDOM	= this.$getContainer();
    	oElementDOM.className   = oElementDOM.className.replace(sValue == "true" ? "normal" : "disabled", sValue == "true" ? "disabled" : "normal");
        this.$getContainer("input").disabled =(sValue == "true");
	}

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Events Handlers
cAMLElement_filepicker.prototype._onChange   = function(oEvent)
{
    this.attributes["value"]   = this.$getContainer("input").value;

    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", true, false);
    this.dispatchEvent(oEvent);
};

// Class Events Handlers
cAMLElement_filepicker.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

// Element Render: open
cAMLElement_filepicker.prototype.$getTagOpen	= function()
{
    return '<span class="aml-filepicker"><input type="file" class="aml-filepicker--input"' +(this.attributes["disabled"] ? ' disabled="true"' : '')+ ' style="padding-left:3px;" onselectstart="event.cancelBubble=true;" />';
};

// Element Render: close
cAMLElement_filepicker.prototype.$getTagClose	= function()
{
    return '</span>';
};

// Register Element
ample.extend(cAMLElement_filepicker);
