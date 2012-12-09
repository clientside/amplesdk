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
		this.$getContainer("gateway").innerHTML	=(this.hasAttribute("src") ? '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("src")) + '" align="absmiddle" /> ' :'') + ample.$encodeXMLCharacters(sValue || '');
	else
	if (sName == "src")
		this.$getContainer("gateway").innerHTML	=(sValue ? '<img src="' + ample.$encodeXMLCharacters(sValue) + '" align="absmiddle" /> ' :'') + ample.$encodeXMLCharacters(this.getAttribute("label") || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_listcell.prototype.$getTagOpen	= function() {
	var oHeader	= this.parentNode.parentNode.parentNode.firstChild.childNodes[this.parentNode.childNodes.$indexOf(this)];
	var sHtml	= '<td class="xul-listcell' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '"' + (oHeader && oHeader.getAttribute("hidden") == "true" ? ' style="display:none;"' : '') + '><div class="xul-listcell--box" style="position:relative;width:100%;"><div class="xul-listcell--label xul-listcell--gateway" style="position:absolute;width:100%;overflow:hidden;">';
	if (this.hasAttribute("image"))
		sHtml	+= '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" align="absmiddle"/> ';
	if (this.hasAttribute("label"))
		sHtml	+= ample.$encodeXMLCharacters(this.getAttribute("label"));

	return sHtml;
};

// Element Render: close
cXULElement_listcell.prototype.$getTagClose	= function() {
	return '</div></div></td>';
};

// Register Element
ample.extend(cXULElement_listcell);
