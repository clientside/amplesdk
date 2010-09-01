/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_optgroup	= function(){};
cXHTMLElement_optgroup.prototype	= new cXHTMLElement("optgroup");

// Class Events Handlers
cXHTMLElement_optgroup.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

cXHTMLElement_optgroup.prototype.$getTagOpen	= function() {
    var sClassName	= (this.prefix ? this.prefix + '-' : '') + this.localName,
    	aHtml   =['<li'];
    for (var sName in this.attributes)
    	if (this.attributes.hasOwnProperty(sName) && sName != "class" && sName != "id" && sName.indexOf(':') ==-1)
    		aHtml.push(' ' + sName + '="' + this.attributes[sName].replace(/"/g, '\"') + '"');
    aHtml.push(' class="' + sClassName + ("class" in this.attributes ? ' ' + this.attributes["class"] : '') + '">');
    aHtml.push(		'<div class="' + sClassName + '--input">' +(this.attributes.label || '')+ '</div>');
    aHtml.push(		'<ul class="' + sClassName + '--gateway">');
    return aHtml.join('');
};

cXHTMLElement_optgroup.prototype.$getTagClose	= function() {
	return 		'</ul>\
			</li>';
};

// Register Element
ample.extend(cXHTMLElement_optgroup);
