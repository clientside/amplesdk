/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_statusbarpanel	= function(){};
cXULElement_statusbarpanel.prototype	= new cXULElement("statusbarpanel");

// Attributes Defaults
cXULElement_statusbarpanel.attributes	= {};
cXULElement_statusbarpanel.attributes.align	= "center";

cXULElement_statusbarpanel.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "label")
		this.$getContainer().innerHTML	=(this.attributes["image"] ? '<img src="' + this.attributes["image"] + '" align="absmiddle"/>' : '') + (sValue || '');
	else
	if (sName == "image")
		this.$getContainer().innerHTML	=(sValue ? '<img src="' + sValue + '" align="absmiddle"/>' : '') + (this.attributes["label"] || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_statusbarpanel.prototype.$getTagOpen	= function() {
	var sHtml	= '<div class="xul-statusbarpanel' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
	if (this.attributes["image"])
		sHtml	+= '<img src="' + ample.$encodeXMLCharacters(this.attributes["image"]) + '" align="absmiddle"/>';
	else
	if (this.attributes["label"])
		sHtml	+= ample.$encodeXMLCharacters(this.attributes["label"]);
//	else
//		sHtml	+= ' ';
	return sHtml;
};

// Element Render: close
cXULElement_statusbarpanel.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_statusbarpanel);
