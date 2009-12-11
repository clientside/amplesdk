/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_treeitem	= function(){};
cXULElement_treeitem.prototype   = new cXULElement;

// Public Properties
cXULElement_treeitem.prototype.row		= null; // Reference to XULElement_treerow
cXULElement_treeitem.prototype.children	= null; // Reference to XULElement_treechildren

// Public Methods
cXULElement_treeitem.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
        if (this.parentNode.tree.attributes["type"] == "checkbox" || this.parentNode.tree.attributes["type"] == "radio")
            this.$getContainer("command").checked = sValue == "true";
    }
    else
    if (sName == "open")
    {
        if (this.children)
        {
            // Show/hide child items
            this.children.setAttribute("hidden", sValue == "true" ? "false" : "true");

            // Change toc image at primary cell
            if (this.parentNode.tree.head)
            {
                var nDepth  = this._getNodeDepth();
                var nIndex  = this.parentNode.tree.head._getPrimaryColIndex();
                if (nIndex !=-1 && this.row.cells[nIndex])
                {
                	// Apply pseudo-class
                	this.row.cells[nIndex].$setPseudoClass("open", sValue == "true", "toc");

					// force setting attribute before event is dispatched
					this.AMLElement.setAttribute.call(this, sName, sValue);

					var oEvent = this.ownerDocument.createEvent("Events");
					oEvent.initEvent("OpenStateChange", true, false);
					this.dispatchEvent(oEvent);

					return;
                }
            }
        }
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_treeitem.prototype._getNodeDepth = function()
{
	var oElement= this.parentNode;
    var nDepth  = 0;
    while (oElement = oElement.parentNode.parentNode)
        if (oElement instanceof cXULElement_tree)
            break;
        else
            nDepth++;
    return nDepth;
};

// Class Events Handlers
cXULElement_treeitem.handlers	= {
	"mousedown":	function(oEvent) {
		// only handle own clicks
		if (oEvent.target.parentNode != this && oEvent.target.parentNode.parentNode != this)
			return;

	    //
	    if (oEvent.button == 2 && this.parentNode.tree.selectedItems.$indexOf(this) !=-1)
	        return;

	    if (oEvent.shiftKey)
	    {
			if (this.parentNode.tree.currentItem)
				this.parentNode.tree.selectItemRange(this, this.parentNode.tree.currentItem);
	    }
		else
	    {
	        if (oEvent.ctrlKey)
	            this.parentNode.tree.toggleItemSelection(this);
	        else
	            this.parentNode.tree.selectItem(this);
	    }
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treerow)
				this.row		= oEvent.target;
			else
			if (oEvent.target instanceof cXULElement_treechildren) {
				this.children	= oEvent.target;
				oEvent.target.tree	= this.parentNode.tree;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treerow)
				this.row		= null;
			else
			if (oEvent.target instanceof cXULElement_treechildren) {
				this.children	= null;
				oEvent.target.tree	= null;
			}
	}
};

cXULElement_treeitem.prototype.$getContainer	= function(sName) {
	return sName == "gateway" ? this.parentNode.$getContainer("gateway") : this.row ? this.row.$getContainer(sName) : null;
};

// Register Element with language
oXULNamespace.setElement("treeitem", cXULElement_treeitem);
