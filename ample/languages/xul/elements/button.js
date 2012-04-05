/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_button	= function(){};
cXULElement_button.prototype	= new cXULElement("button");
cXULElement_button.prototype.tabIndex	= 0;
cXULElement_button.prototype.$hoverable	= true;

// Public Methods

// Class Events Handlers
cXULElement_button.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"keydown":	function(oEvent) {
		if (oEvent.keyIdentifier == "Enter" || oEvent.keyIdentifier == "U+0020")
			this.$activate();
	},
	"click":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		this.doCommand();
	}
};

cXULElement_button.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$getContainer().disabled	= sValue == "true";
	else
	if (sName == "label")
		this.$getContainer().innerHTML	=(this.attributes["image"] ? '<img src="' + this.attributes["image"] + '" align="absmiddle" /> ' :'') + (sValue || '');
	else
	if (sName == "image")
		this.$getContainer().innerHTML	=(sValue ? '<img src="' + sValue + '" align="absmiddle" /> ' :'') + (this.attributes["label"] || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_button.prototype.$getTagOpen	= function() {
	var sHtml	= '<button class="xul-button' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"';
	if (!this.$isAccessible())
		sHtml  += ' disabled="true"';
	sHtml  += ' style="';
	if (this.attributes["width"])
		sHtml  += 'width:'+this.attributes["width"]+';';
	if (this.attributes["height"])
		sHtml  += 'height:'+this.attributes["height"]+';';
	if (this.attributes["hidden"] == "true")
		sHtml  += 'display:none';
	sHtml  += '">';
	if (this.attributes["image"])
		sHtml  += '<img src="' + ample.$encodeXMLCharacters(this.attributes["image"]) + '" align="absmiddle"/> ';
	if (this.attributes["label"])
		sHtml  += ample.$encodeXMLCharacters(this.attributes["label"]);

	return sHtml;
};

// Element Render: close
cXULElement_button.prototype.$getTagClose	= function() {
	return '</button>';
};

// Register Element
ample.extend(cXULElement_button);
