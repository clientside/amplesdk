/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_textbox	= function(){};
cXULElement_textbox.prototype	= new cXULElement;
cXULElement_textbox.prototype.tabIndex	= 0;

// Attributes Defaults
cXULElement_textbox.attributes	= {};
cXULElement_textbox.attributes.value	= "";

// Class Events Handlers
cXULElement_textbox.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"keyup":	function(oEvent) {
    	this.attributes["value"]	= this.$getContainer("input").value;
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer("input").value    = oEvent.newValue || '';
					break;

				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					this.$getContainer("input").disabled = oEvent.newValue == "true";
					break;

				case "readonly":
					this.$getContainer("input").readOnly	= oEvent.newValue == "true";
					break;

				case "type":
					// TODO
					break;

				case "multiline":
					// TODO
					break;

				case "maxlength":
					break;

				case "rows":
					if (this.attributes["multiline"] == "true")
						this.$getContainer("input").rows	= oEvent.newValue;
					break;

				case "cols":
					if (this.attributes["multiline"] == "true")
						this.$getContainer("input").cols	= oEvent.newValue;
					break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	}
};

cXULElement_textbox.prototype._onChange  = function(oEvent) {
    // Fire Event
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

// Element Render: open
cXULElement_textbox.prototype.$getTagOpen	= function(oElement) {
	var bMultiline	= this.attributes["multiline"] == "true";
    return	'<div class="xul-textbox' + (bMultiline ? ' xul-textbox-multiline-true' : '') + (this.attributes["disabled"] == "true" ? " xul-textbox_disabled" : '')+ '" style="'+
				(this.attributes["height"] ? 'height:' + this.attributes["height"] + ';' : '')+
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + ';' : '')+ '">'+
				'<' +
				(bMultiline
					?("textarea" + (this.attributes["rows"] ? ' rows="' + this.attributes["rows"] + '"' : '')+(this.attributes["cols"] ? ' cols="' + this.attributes["cols"] + '"' : ''))
					: this.attributes["type"] == "password"
						? 'input type="password"'
						: 'input type="text"')+
					' class="xul-textbox--input" name="' + this.attributes["name"] + '" autocomplete="off" style="width:100%;' + (bMultiline ? 'height:100%;' : '') + 'margin:0;border:0px solid white;"'+
					' onblur="ample.$instance(this)._onChange(event)" onselectstart="event.cancelBubble=true;"'+
					(this.attributes["disabled"] == "true" ? ' disabled="true"' : '')+
					(this.attributes["readonly"] == "true" ? ' readonly="true"' : '')+
					(this.hasAttribute("maxlength") ? ' maxlength="' + this.getAttribute("maxlength") + '"' : '')+
				(bMultiline
					? '>' + this.attributes["value"] + '</textarea>'
					: ' value="' + this.attributes["value"] + '" />')+
			'</div>';
};

// Register Element with language
oXULNamespace.setElement("textbox", cXULElement_textbox);
