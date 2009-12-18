/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_timepicker	= function(){};
cXULElement_timepicker.prototype	= new cXULElement;
cXULElement_timepicker.prototype.tabIndex	= 0;

// Default attributes
cXULElement_timepicker.attributes	= {
	"mask":		'YYYY-MM-DDThh:mm:ss',
	"value":	'1970-01-01T00:00:00'
};


cXULElement_timepicker.prototype._onInputTimeChange    = function(oEvent, sName, sValue)
{
    this._setValue(sName, sValue);

    // Fire Event
    this._fireEventOnChange();
};

cXULElement_timepicker.prototype._onTimeKeyDown    = function(oEvent, sName)
{
    if (oEvent.keyIdentifier == "Up")	// Arrow Up
    {
        this._onInterval(1);
    }
    else
    if (oEvent.keyIdentifier == "Down")	// Arrow Down
    {
        this._onInterval(-1);
    }
};

cXULElement_timepicker.prototype._onSpinMouseDown	= function(oEvent, sName) {

};

// Class handlers
cXULElement_timepicker.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

// Element Render: open
cXULElement_timepicker.prototype.$getTagOpen		= function()
{
    var aTime    = this.attributes["value"].match(/([0-9]{2}):([0-9]{2}):([0-9]{2})$/);

    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" class="xul-timepicker' + (this.attributes["disabled"] ? " xul-timepicker_disabled" : '') + '">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td width="100%"><input type="text" class="xul-timepicker--input" maxlength="8"' +(this.attributes["disabled"] ? ' disabled="true"' : '')+ ' style="border:0px solid white;width:100%;" value="' + (aTime ? aTime[1] : "00") + ':' + (aTime ? aTime[2] : "00") + ':' + (aTime ? aTime[3] : "00") + '" onchange="ample.$instance(this)._onInputTimeChange(event,  \'minutes\', this.value)" onkeydown="return ample.$instance(this)._onTimeKeyDown(event, \'minutes\')" onselectstart="event.cancelBubble=true" onkeypress="if (event.keyCode == 38 || event.keyCode == 40) return false" /></td>';
    sHtml  += '<td valign="top">';
    sHtml  += '<div class="xul-timepicker--button-up" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-up\'); ample.$instance(this)._onSpinMouseDown(event, \'up\')}"><br/></div>';
    sHtml  += '<div class="xul-timepicker--button-down" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-down\'); ample.$instance(this)._onSpinMouseDown(event, \'down\')}"><br/></div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

// Element Render: close
cXULElement_timepicker.prototype.$getTagClose	= function()
{
    return '';
};

// Register Widget with language
oXULNamespace.setElement("timepicker", cXULElement_timepicker);
