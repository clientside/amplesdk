/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treeitem	= function(){};
cXULElement_treeitem.prototype   = new cXULElement("treeitem");

// Public Properties
cXULElement_treeitem.prototype.row		= null; // Reference to XULElement_treerow
cXULElement_treeitem.prototype.children	= null; // Reference to XULElement_treechildren

// Public Methods

// Private Methods
cXULElement_treeitem.prototype._getNodeDepth = function() {
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
		var oView	= this.parentNode.tree;
		if (!oView.$isAccessible())
			return;
		// only handle own clicks
		if (oEvent.target.parentNode != this && oEvent.target.parentNode.parentNode != this)
			return;

	    //
	    if (oEvent.button == 2 && oView.selectedItems.$indexOf(this) !=-1)
	        return;

	    if (oEvent.shiftKey) {
			if (oView.currentItem)
				oView.selectItemRange(this, oView.currentItem);
	    }
		else {
	        if (oEvent.ctrlKey)
	        	oView.toggleItemSelection(this);
	        else
	        	oView.selectItem(this);
	    }
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "open") {
				if (this.children) {
					// Show/hide child items
					this.children.setAttribute("hidden", oEvent.newValue == "true" ? "false" : "true");
					//
					var oEvent = this.ownerDocument.createEvent("Event");
					oEvent.initEvent("OpenStateChange", true, false);
					this.dispatchEvent(oEvent);
				}
			}
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

cXULElement_treeitem.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "selected") {
		this.$setPseudoClass("selected", sValue == "true");
		if (this.parentNode.tree.attributes["type"] == "checkbox" || this.parentNode.tree.attributes["type"] == "radio")
			this.$getContainer("command").checked = sValue == "true";
	}
	else
	if (sName == "open") {
		// Change toc image at primary cell
		if (this.parentNode.tree.head) {
			var nDepth  = this._getNodeDepth(),
				nIndex  = this.parentNode.tree.head._getPrimaryColIndex();
			if (nIndex !=-1 && this.row.cells[nIndex]) {
				// Apply pseudo-class
				this.row.cells[nIndex].$setPseudoClass("open", sValue == "true", "toc");
			}
		}
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULElement_treeitem.prototype.$getContainer	= function(sName) {
	return sName == "gateway" ? this.parentNode.$getContainer("gateway") : this.row ? this.row.$getContainer(sName) : null;
};

// Register Element
ample.extend(cXULElement_treeitem);
