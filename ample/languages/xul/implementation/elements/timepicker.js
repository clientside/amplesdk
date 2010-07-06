/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_timepicker	= function(){};
cXULElement_timepicker.prototype	= new cXULInputElement;

// Default attributes
cXULElement_timepicker.attributes	= {
	"mask":		'YYYY-MM-DDThh:mm:ss',
	"value":	'1970-01-01T00:00:00'
};


cXULElement_timepicker.prototype._onInputTimeChange    = function(oEvent, sName, sValue) {
    this._setValue(sName, sValue);

    // Fire Event
    cXULInputElement.dispatchChange(this);
};

cXULElement_timepicker.prototype._onTimeKeyDown    = function(oEvent, sName) {
    if (oEvent.keyIdentifier == "Up") {	// Arrow Up
        this._onInterval(1);
    }
    else
    if (oEvent.keyIdentifier == "Down")	{ // Arrow Down
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
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true")
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

// Element Render: open
cXULElement_timepicker.prototype.$getTagOpen		= function() {
    var aTime    = this.attributes["value"].match(/([0-9]{2}):([0-9]{2}):([0-9]{2})$/);
    return '<div class="xul-timepicker' + (this.attributes["disabled"] == "true" ? " xul-timepicker_disabled" : '') + '">\
				<div class="xul-timepicker--field">\
					<div class="xul-timepicker--button-up" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-up\'); ample.$instance(this)._onSpinMouseDown(event, \'up\')}"><br/></div>\
					<div class="xul-timepicker--button-down" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-down\'); ample.$instance(this)._onSpinMouseDown(event, \'down\')}"><br/></div>\
					<input type="text" class="xul-timepicker--input" maxlength="8"' +(this.attributes["disabled"] == "true" ? ' disabled="true"' : '')+ ' style="border:0px solid white;width:100%;" value="' + (aTime ? aTime[1] : "00") + ':' + (aTime ? aTime[2] : "00") + ':' + (aTime ? aTime[3] : "00") + '" onchange="ample.$instance(this)._onInputTimeChange(event,  \'minutes\', this.value)" onkeydown="return ample.$instance(this)._onTimeKeyDown(event, \'minutes\')" onselectstart="event.cancelBubble=true" onkeypress="if (event.keyCode == 38 || event.keyCode == 40) return false" />\
				</div>\
			</div>';

    return '<table cellpadding="0" cellspacing="0" border="0" class="xul-timepicker' + (this.attributes["disabled"] == "true" ? " xul-timepicker_disabled" : '') + '">\
    			<tbody>\
    				<tr>\
    					<td width="100%"><input type="text" class="xul-timepicker--input" maxlength="8"' +(this.attributes["disabled"] == "true" ? ' disabled="true"' : '')+ ' style="border:0px solid white;width:100%;" value="' + (aTime ? aTime[1] : "00") + ':' + (aTime ? aTime[2] : "00") + ':' + (aTime ? aTime[3] : "00") + '" onchange="ample.$instance(this)._onInputTimeChange(event,  \'minutes\', this.value)" onkeydown="return ample.$instance(this)._onTimeKeyDown(event, \'minutes\')" onselectstart="event.cancelBubble=true" onkeypress="if (event.keyCode == 38 || event.keyCode == 40) return false" /></td>\
    					<td valign="top">\
    						<div class="xul-timepicker--button-up" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-up\'); ample.$instance(this)._onSpinMouseDown(event, \'up\')}"><br/></div>\
    						<div class="xul-timepicker--button-down" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-down\'); ample.$instance(this)._onSpinMouseDown(event, \'down\')}"><br/></div>\
    					</td>\
    				</tr>\
    			</tbody>\
    		</table>';
};

// Register Widget with language
oXULNamespace.setElement("timepicker", cXULElement_timepicker);
