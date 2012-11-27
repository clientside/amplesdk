/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treecell	= function(){};
cXULElement_treecell.prototype	= new cXULElement("treecell");

// Class Events Handlers
cXULElement_treecell.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("toc"))
			this.parentNode.parentNode.setAttribute("open", this.parentNode.parentNode.getAttribute("open") == "true" ? "false" : "true");
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oChildren	= this.parentNode.parentNode.parentNode;
		if (oChildren.tree.head && oChildren.tree.head._getPrimaryColIndex() == this.parentNode.childNodes.$indexOf(this))
			oXULReflowManager.schedule(oChildren);
	}
};

cXULElement_treecell.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "label")
		this.$getContainer("gateway").innerHTML	=(this.attributes["src"] ? '<img src="' + this.attributes["src"] + '" align="absmiddle" /> ' :'') + (sValue || '');
	else
	if (sName == "src")
		this.$getContainer("gateway").innerHTML	=(sValue ? '<img src="' + sValue + '" align="absmiddle" /> ' :'') + (this.attributes["label"] || '');
	else
	if (sName == "editable") {
		if (sValue == "true") {
			var oElementDOM	= this.$getContainer("gateway");
			oElementDOM.innerHTML	= '<input style="border:none; margin:0px; margin-left: 2px; padding-left: 2px; padding-top:1px; width:100px;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this).setAttribute(\'label\', this.value)" onblur="this.onchange();" onkeydown="if (event.keyCode == 13) this.onchange(); else if (event.keyCode == 27) ample.$instance(this).setAttribute(\'editable\', \'false\')"/>';
			oElementDOM.firstChild.focus();
			oElementDOM.firstChild.value	= this.attributes["label"] || '';
		}
		else
			this.$mapAttribute("label", this.attributes["label"]);
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_treecell.prototype.$getTagOpen	= function() {
	var oChildren	= this.parentNode.parentNode.parentNode,
		oHead	= oChildren && oChildren.tree ? oChildren.tree.head : null,
		nCellIndex	= this.parentNode.childNodes.$indexOf(this);
	var sHtml	= '<td class="xul-treecell' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' + (oHead && oHead.childNodes[nCellIndex] && oHead.childNodes[nCellIndex].attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>';
	sHtml	+= '<div class="xul-treecell--box" style="position:relative;width:100%;"><div class="xul-treecell--label" style="position:absolute;width:100%;overflow:hidden;">';
	if (oHead && oHead._getPrimaryColIndex() == nCellIndex) {
		var oElementCurrent	= this;
		do {
			if (oElementCurrent instanceof cXULElement_treeitem)
				sHtml	+= '<div style="float:left;"><br /></div>';
			else
			if (oElementCurrent instanceof cXULElement_tree)
				break;
		} while(oElementCurrent = oElementCurrent.parentNode);
	}

	sHtml	+= '<div class="xul-treecell--gateway" style="width:100%">';
	if (this.attributes["src"])
		sHtml	+= '<img src="' + ample.$encodeXMLCharacters(this.attributes["src"]) + '" align="absmiddle"/> ';
	sHtml	+= this.attributes["label"] ? ample.$encodeXMLCharacters(this.attributes["label"]) : '';

	return sHtml;
};

// Element Render: close
cXULElement_treecell.prototype.$getTagClose	= function() {
	return '</div></div></div></td>';
};

// Register Element
ample.extend(cXULElement_treecell);
