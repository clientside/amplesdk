/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_checkbox	= function(){};
cXULElement_checkbox.prototype	= new cXULElement;
cXULElement_checkbox.prototype.tabIndex	= 0;

// Apply Behaviours

// Public Methods

// Class Events handlers
cXULElement_checkbox.handlers	= {
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
			    	this.$setPseudoClass("disabled", oEvent.newValue == "true");
			        this.$getContainer("input").disabled	= oEvent.newValue == "true";
			        break;

		    	case "value":
			        this.$getContainer("input").checked  =(oEvent.newValue == "on" ? true : false);
			        this.attributes["checked"]	=(oEvent.newValue == "on" ? "true" : "false");
			        break;

		    	case "checked":
			        this.$getContainer("input").checked  =(oEvent.newValue == "true" ? true : false);
			        this.attributes["value"]	=(oEvent.newValue == "true" ? "on" : "off");
			        break;

		    	case "label":
		    		this.$getContainer("label").innerHTML =(oEvent.newValue || '');
		    		break;

		    	default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

//
cXULElement_checkbox.prototype._onChange = function(oEvent) {
    this.attributes["checked"]  = this.$getContainer("input").checked.toString();
    this.attributes["value"]    = this.attributes["checked"] == "true" ? "on" : "off";

    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_checkbox.prototype.$getTagOpen		= function() {
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
cXULElement_checkbox.prototype.$getTagClose	= function() {
    return '</label>';
};

// Register Element with language
oXULNamespace.setElement("checkbox", cXULElement_checkbox);
