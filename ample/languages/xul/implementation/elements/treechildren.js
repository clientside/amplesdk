/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treechildren	= function()
{
    // Public Collections
    this.items  = new AMLNodeList;
};
cXULElement_treechildren.prototype	= new cXULElement;

// Public Properties
cXULElement_treechildren.prototype.tree	= null;

// Public Methods
cXULElement_treechildren.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "hidden")
    {
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        {
            this.items[nIndex].setAttribute("hidden", sValue);
            if (this.items[nIndex].children && this.items[nIndex].getAttribute("open") != "false")
                this.items[nIndex].children.setAttribute("hidden", sValue);
        }
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

/*
cXULElement_treechildren.prototype.appendChild	= function(oNode)
{
	this.AMLElement.appendChild.call(this, oNode);

	// Add to the collection
	this.items.$add(oNode);

	var oElement	= oNode.previousSibling || this.parentNode;
	this.tree.items.$add(oNode, this.tree.items.$indexOf(oElement) + 1);
	this.tree.body.$getContainer("gateway").insertBefore(oNode.$createContainer(), oElement.$getContainer().nextSibling);

	return oNode;
};

cXULElement_treechildren.prototype.removeChild	= function(oNode)
{
	// Add to the collection
	this.items.$remove(oNode);

	this.tree.items.$remove(oNode);
	this.tree.body.$getContainer("gateway").removeChild(oNode.$getContainer());

	return this.AMLElement.removeChild.call(this, oNode);
};
*/

//
cXULElement_treechildren.prototype.refresh	= function()
{
    var nPrimaryCol = this.tree.head._getPrimaryColIndex();
    if (nPrimaryCol ==-1)
        return;

	var aStack	= [];
	for (var oElement = this; oElement != this.tree; oElement = oElement.parentNode.parentNode) {
		aStack.unshift(oElement);
		if (oElement.parentNode == this.tree)
			break;
	}

	this._refresh(aStack, nPrimaryCol);
};

cXULElement_treechildren.prototype._refresh	= function(aStack, nPrimaryCol)
{
    var nDepth		= aStack.length,
    	oChildren   = aStack[nDepth - 1],
    	nItems 		= oChildren.items.length;

    for (var nItem = 0, oItem, oElementDOM; nItem < nItems; nItem++)
    {
        // Path
        oItem		= oChildren.items[nItem];
        oElementDOM	= oItem.row.cells[nPrimaryCol].$getContainer();

        // Line
        for (var nIndex = 0; nIndex < nDepth - 1; nIndex++)
            oElementDOM.childNodes[nIndex].className = "xul-treecell-line" +(aStack[nIndex + 1].parentNode == aStack[nIndex + 1].parentNode.parentNode.items[aStack[nIndex + 1].parentNode.parentNode.items.length - 1] ? "" : " xul-treecell-line-regular");

        // Leaf
        oElementDOM.childNodes[nDepth - 1].className  = "xul-treecell-line xul-treecell-line-" +(nItem == nItems - 1 ? "last" : "next");

        // Toc
        if (oItem.getAttribute("container") == "true") {
            // Step In
            if (oItem.children)
	            this._refresh(aStack.concat(oItem.children), nPrimaryCol);

            // Add toc +/-
            oElementDOM.childNodes[nDepth - 1].className = "xul-treecell--toc" +(oChildren.items[nItem].attributes["open"] == "true" ? " xul-treecell--toc_open" : "");
        }
    }
};

// Class events handlers
cXULElement_treechildren.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= this.parentNode;

				// In both cases
				this.children  = oEvent.target;
			}
			else
			if (oEvent.target instanceof cXULElement_treeitem) {
				this.items.$add(oEvent.target);
				this.tree.items.$add(oEvent.target);
			}
		}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= null;

				// In both cases
				this.children  = null;
			}
			else
			if (oEvent.target instanceof cXULElement_treeitem) {
			    if (this.tree.selectedItems.$indexOf(oEvent.target) !=-1)
				    this.tree.removeItemFromSelection(oEvent.target);

				this.items.$remove(oEvent.target);
				this.tree.items.$remove(oEvent.target);
			}
		}
	}
};


//Element Render: open
cXULElement_treechildren.prototype.$getTagOpen	= function()
{
	if (this.parentNode instanceof cXULElement_tree)
		return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
					<td style="height:100%">\
						<div class="xul-treechildren--area" style="height:100%;width:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this).parentNode._onScroll(event)">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-treechildren' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="position:absolute;' + (navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 == 7 ? 'border-left: solid 18px white;margin-left:-18px;' : '') + '">\
								<tbody class="xul-treechildren--gateway">';
	return '';
};

//Element Render: close
cXULElement_treechildren.prototype.$getTagClose	= function()
{
	if (this.parentNode instanceof cXULElement_tree) {
		var sHtml	= '</tbody>';
		if (this.parentNode.head) {
			sHtml	+= '<tfoot class="xul-treechildren--foot">';
			sHtml	+= '<tr>';
			if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
				sHtml	+= '<td width="20" style="width:20px"><div style="width:20px" /></td>';
			for (var nIndex = 0, aItems = this.parentNode.head.items; nIndex < aItems.length; nIndex++)
				sHtml	+= '<td' + (aItems[nIndex].attributes["width"] ? ' width="' + aItems[nIndex].attributes["width"] + '"' : '') + '><div style="height:1px;' + (aItems[nIndex].attributes["minwidth"] ? 'width:' + aItems[nIndex].attributes["minwidth"] + 'px' : '') + '"/></td>';
			sHtml	+= '</tr>';
			sHtml	+= '</tfoot>';
		}
		sHtml	+= '</table>';
		sHtml	+= '</div>';
		sHtml	+= '</td>';
		sHtml	+= '</tr>';

		return sHtml;
	}
	return '';
};

// TODO: Temp hack (still needed?)
cXULElement_treechildren.prototype.$getContainer	= function(sName) {
	return this.parentNode instanceof cXULElement_tree ? cXULElement.prototype.$getContainer.call(this, sName) : sName == "gateway" ? this.parentNode.$getContainer("gateway") : null;
};

// Register Element with language
oXULNamespace.setElement("treechildren", cXULElement_treechildren);
