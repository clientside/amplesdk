/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_progressmeter	= function(){};
cXULElement_progressmeter.prototype  = new cXULElement;

// Private Properties
cXULElement_progressmeter.prototype._interval	= null;
cXULElement_progressmeter.prototype._left		= 0;

// Attributes Defaults
cXULElement_progressmeter.attributes	= {};
cXULElement_progressmeter.attributes.value	= "100";

// Public Methods
cXULElement_progressmeter.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "value")
    {
        if (this.attributes["mode"] != "undetermined")
            this.$getContainer("units").style.width = sValue + '%';
    }
    else
    if (sName == "mode")
    {
        if (sValue == "undetermined")
        {
            if (!this._interval)
            {
            	var oElementDOM	= this.$getContainer("units");
                oElementDOM.style.width = '0%';
                oElementDOM.style.left  = '0%';

                this._left  = 0;
                var oSelf	= this;
                this._interval  = setInterval(function() {
                	oSelf._onInterval();
                }, 40);
            }
        }
        else
        {
            if (this._interval)
            {
                clearInterval(this._interval);
                this._interval  = null;
            }
           	var oElementDOM	= this.$getContainer("units");
            oElementDOM.style.width = this.attributes["value"] + '%';
            oElementDOM.style.left  = '0%';
        }
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Private Methods
cXULElement_progressmeter.prototype._onInterval  = function()
{
    this._left  = this._left + 1 > 100 + 30 ? 0 : this._left + 1;

    this.$getContainer("units").style.left  =(this._left > 30 ? this._left - 30 : 0)+ '%';
    this.$getContainer("units").style.width =(this._left < 30 ? this._left : 100 + 30 - this._left < 30 ? 100 + 30 - this._left : 30)+ '%';
};

// Class handlers
cXULElement_progressmeter.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
	    if (this.getAttribute("mode") == "undetermined") {
	        var oSelf	= this;
	        this._interval	= setInterval(function() {
	        	oSelf._onInterval();
	        }, 40);
	    }
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this._interval)
			clearInterval(this._interval);
	}
};

// Element Render: open
cXULElement_progressmeter.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" width="' + (this.attributes["width"] || "100%") + '" class="xul-progressmeter"' +(this.attributes["hidden"] == "true" ? ' style="display:none;"' : "")+ '>';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-progressmeter-bar-left"><br /></td>';
    sHtml  += '<td class="xul-progressmeter-bar-middle" valign="center">';
    sHtml  += '<div style="position:relative;';
    if (this.attributes["value"])
        sHtml  += 'width:' + this.attributes["value"] + '%;';
    sHtml  += '" class="xul-progressmeter--units"><br><img width="1" height="1"/></br></div>';
    sHtml  += '</td>';
    sHtml  += '<td class="xul-progressmeter-bar-right"><br /></td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("progressmeter", cXULElement_progressmeter);
