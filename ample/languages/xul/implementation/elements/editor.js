/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_editor	= function(){};
cXULElement_editor.prototype = new cXULElement;
cXULElement_editor.prototype.tabIndex	= 0;

// Attributes Defaults
cXULElement_editor.attributes	= {};
cXULElement_editor.attributes.value	= "";

// Public Methods
cXULElement_editor.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer("input").innerHTML = sValue;
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
    }
    else
    if (sName == "mode")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Private Methods
cXULElement_editor.prototype._updatePanel= function(oEvent)
{

};

// Events Handlers
cXULElement_editor.prototype._onKeyDown  = function(oEvent)
{

};

// Events Handlers
cXULElement_editor.prototype._onChange   = function(oEvent)
{
    this.attributes["value"]   = this.$getContainer("input").innerHTML;

    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

// Class Events handlers
cXULElement_editor.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

// Element Render: open
cXULElement_editor.prototype.$getTagOpen	= function()
{
    var sHtml   = '<div class="xul-editor">';
//    sHtml  += '<table cellpadding="0" cellspacing="0" border="0" class="xul-toolbar">';
//    sHtml  += '<tbody>';
//    sHtml  += '<tr>';
//    sHtml  += '<td></td>';
//    sHtml  += '</tr>';
//    sHtml  += '</tbody>';
//    sHtml  += '</table>';
    sHtml  += '<div contenteditable="'+'true" onclick="ample.$instance(this)._updatePanel(event)" onkeydown="ample.$instance(this)._onKeyDown(event)" onselectstart="event.cancelBubble=true;" style="';
    sHtml  += 'width:' + (this.attributes["width"] ? this.attributes["width"] : '100%') + ';';
    sHtml  += 'height:' + (this.attributes["height"] ? this.attributes["height"] : '100') + ';';
    sHtml  += 'overflow:scroll;" class="xul-editor--input">' + this.attributes["value"] + '</div>';
    sHtml  += '</div>';

    return sHtml;
};

// Element Render: close
cXULElement_editor.prototype.$getTagClose	= function()
{
    return '';
};

// Register Element with language
oXULNamespace.setElement("editor", cXULElement_editor);
