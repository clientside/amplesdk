/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_button	= function(){};
cXULElement_button.prototype	= new cXULElement;
cXULElement_button.prototype.tabIndex	= 0;

// Public Methods
cXULElement_button.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "disabled")
    {
        this.$getContainer().disabled = sValue == "true";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events Handlers
cXULElement_button.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"click":	function(oEvent) {
		this.doCommand();
	}
};

// Element Render: open
cXULElement_button.prototype.$getTagOpen	= function()
{
    var sHtml   = '<button class="xul-button' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '"';
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' style="';
    if (this.attributes["width"])
        sHtml  += 'width:'+this.attributes["width"]+';';
    if (this.attributes["height"])
        sHtml  += 'height:'+this.attributes["height"]+';';
    sHtml  += '">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

// Element Render: close
cXULElement_button.prototype.$getTagClose	= function()
{
    return '</button>';
};

// Register Element with language
oXULNamespace.setElement("button", cXULElement_button);
