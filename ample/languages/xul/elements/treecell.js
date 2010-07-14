/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treecell	= function(){};
cXULElement_treecell.prototype   = new cXULElement;

// Private methods
cXULElement_treecell.prototype._onNodeClick	= function(oEvent) {
	this.parentNode.parentNode.setAttribute("open", this.parentNode.parentNode.getAttribute("open") == "true" ? "false" : "true");
};

// Class Events Handlers
cXULElement_treecell.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName)  {
				case "label":
			        this.$getContainer("gateway").innerHTML  =(this.attributes["src"] ? '<img src="' + this.attributes["src"] + '" align="absmiddle" /> ' :'') + (oEvent.newValue || '');
					break;

				case "src":
			        this.$getContainer("gateway").innerHTML  =(oEvent.newValue ? '<img src="' + oEvent.newValue + '" align="absmiddle" /> ' :'') + (this.attributes["label"] || '');
					break;

				case "editable":
			        if (oEvent.newValue == "true") {
			        	var oElementDOM	= this.$getContainer("gateway");
			            oElementDOM.innerHTML  = '<input style="border:none; margin:0px; margin-left: 2px; padding-left: 2px; padding-top:1px; width:100px;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this).setAttribute(\'label\', this.value)" onblur="this.onchange();" onkeydown="if (event.keyCode == 13) this.onchange(); else if (event.keyCode == 27) ample.$instance(this).setAttribute(\'editable\', \'false\')"/>';
			            oElementDOM.firstChild.focus();
			            oElementDOM.firstChild.value   = this.attributes["label"] || '';
			        }
			        else
			            this.setAttribute("label", this.attributes["label"]);
			        break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oChildren	= this.parentNode.parentNode.parentNode;
		if (oChildren.tree.head && oChildren.tree.head._getPrimaryColIndex() == this.parentNode.childNodes.$indexOf(this))
			oXULReflowManager.schedule(oChildren);
	}
};

// Element Render: open
cXULElement_treecell.prototype.$getTagOpen	= function() {
	var oChildren	= this.parentNode.parentNode.parentNode,
		oHead	= oChildren && oChildren.tree ? oChildren.tree.head : null,
		nCellIndex	= this.parentNode.childNodes.$indexOf(this);
	var sHtml   = '<td class="xul-treecell"' + (oHead && oHead.childNodes[nCellIndex] && oHead.childNodes[nCellIndex].attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>';
    if (oHead && oHead._getPrimaryColIndex() == nCellIndex) {
        var oElementCurrent = this;
        do {
            if (oElementCurrent instanceof cXULElement_treeitem)
                sHtml  += '<div onmousedown="return ample.$instance(this)._onNodeClick(event);" class="xul-treecell-line"><br /></div>';
            else
            if (oElementCurrent instanceof cXULElement_tree)
                break;
        } while(oElementCurrent = oElementCurrent.parentNode);
    }

    sHtml  += '<div class="xul-treecell--gateway">';
    if (this.attributes["src"])
        sHtml  += '<img src="' + this.attributes["src"] + '" align="absmiddle"/> ';
    sHtml  += this.attributes["label"] ? this.attributes["label"] : '';

    return sHtml;
};

// Element Render: close
cXULElement_treecell.prototype.$getTagClose	= function() {
    return '</div></td>';
};

// Register Element with language
oXULNamespace.setElement("treecell", cXULElement_treecell);
