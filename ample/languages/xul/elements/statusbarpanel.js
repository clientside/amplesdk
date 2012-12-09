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
		this.$getContainer().innerHTML	=(this.hasAttribute("image") ? '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" align="absmiddle"/>' : '') + ample.$encodeXMLCharacters(sValue || '');
	else
	if (sName == "image")
		this.$getContainer().innerHTML	=(sValue ? '<img src="' + ample.$encodeXMLCharacters(sValue) + '" align="absmiddle"/>' : '') + ample.$encodeXMLCharacters(this.getAttribute("label") || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_statusbarpanel.prototype.$getTagOpen	= function() {
	var sHtml	= '<div class="xul-statusbarpanel' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">';
	if (this.hasAttribute("image"))
		sHtml	+= '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" align="absmiddle"/>';
	else
	if (this.hasAttribute("label"))
		sHtml	+= ample.$encodeXMLCharacters(this.getAttribute("label"));
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
