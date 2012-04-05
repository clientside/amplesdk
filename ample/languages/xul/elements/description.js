/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_description	= function(){};
cXULElement_description.prototype	= new cXULElement("description");

cXULElement_description.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value")
		this.$getContainer().innerHTML	= sValue || '';
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_description.prototype.$getTagOpen		= function() {
	return '<div class="xul-description' +(this.attributes["class"] ? " " + this.attributes["class"] : '')+ '" style="' +
				'width:100%;height:100%;'+
				(this.attributes["style"] ? this.attributes["style"] : '') +
				'">' + (this.attributes["value"] ? ample.$encodeXMLCharacters(this.attributes["value"]) : "");
};

// Element Render: close
cXULElement_description.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_description);
