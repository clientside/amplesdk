/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcell	= function(){};
cXULElement_listcell.prototype	= new cXULElement("listcell");

// Public Methods

// Class Events Handlers

cXULElement_listcell.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "label")
		this.$getContainer("gateway").innerHTML	=(this.attributes["src"] ? '<img src="' + this.attributes["src"] + '" align="absmiddle" /> ' :'') + (sValue || '');
	else
	if (sName == "src")
		this.$getContainer("gateway").innerHTML	=(sValue ? '<img src="' + sValue + '" align="absmiddle" /> ' :'') + (this.attributes["label"] || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_listcell.prototype.$getTagOpen	= function() {
	var oHeader	= this.parentNode.parentNode.parentNode.firstChild.childNodes[this.parentNode.childNodes.$indexOf(this)];
	var sHtml	= '<td class="xul-listcell' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' + (oHeader && oHeader.attributes["hidden"] == "true" ? ' style="display:none;"' : '') + '><div class="xul-listcell--box" style="position:relative;width:100%;"><div class="xul-listcell--label xul-listcell--gateway" style="position:absolute;width:100%;overflow:hidden;">';
	if (this.attributes["image"])
		sHtml	+= '<img src="' + ample.$encodeXMLCharacters(this.attributes["image"]) + '" align="absmiddle"/> ';
	if (this.attributes["label"])
		sHtml	+= ample.$encodeXMLCharacters(this.attributes["label"]);

	return sHtml;
};

// Element Render: close
cXULElement_listcell.prototype.$getTagClose	= function() {
	return '</div></div></td>';
};

// Register Element
ample.extend(cXULElement_listcell);
