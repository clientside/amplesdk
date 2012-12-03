/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tree	= function() {
	// Collections
	this.items	= new ample.classes.NodeList;
	this.selectedItems	= new ample.classes.NodeList;
};
cXULElement_tree.prototype	= new cXULSelectElement("tree");

// Public Properties
cXULElement_tree.prototype.head	= null;
cXULElement_tree.prototype.body	= null;

// Public Methods
cXULElement_tree.prototype.changeOpenState		= function(oRow, bState) {
	if (oRow && oRow instanceof cXULElement_treerow) {
		if (arguments.length < 2)
			bState	= oRow.parentNode.getAttribute("open") != "true";
		oRow.setAttribute("open", bState ? "true" : "false");
	}
};

cXULElement_tree.prototype.ensureRowIsVisible	= function(nIndex) {
	var oElement	= this.items[nIndex];
	do {
		if (oElement.parentNode.getAttribute("hidden") == "true")
			return false;
		oElement	= oElement.parentNode.parentNode;
	} while (oElement != this.body);

	// return true
	return true;
};

// Class Events Hadlers
cXULElement_tree.handlers	= {
	"keydown":	function(oEvent) {
		if (this.currentItem) {
			if (oEvent.keyIdentifier == "Up") {
				// Key: Up
				var nIndex	= this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;

				// Search for the first "previous" visible item
				while (nIndex - 1 > 0 && this.ensureRowIsVisible(nIndex - 1) == false)
					nIndex--;

				if (nIndex > 0) {
					if (oEvent.shiftKey) {
						// Jump over the only selected item
						if (this.selectedItems.length > 1)
							if (this.currentItem.$getContainer().rowIndex > this.selectedItems[0].$getContainer().rowIndex)
								nIndex++;

						this.toggleItemSelection(this.items[nIndex-1]);
					}
					else
						this.selectItem(this.items[nIndex-1]);

					// Scroll to item if not visible
					this.scrollToIndex(nIndex-1);
				}
				// Forbid vertical scrolling
				oEvent.preventDefault();
			}
			else
			if (oEvent.keyIdentifier == "Down") {
				// Key: Down
				var nIndex	= this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;

				// Search for the first "next" visible item
				while (nIndex + 1 < this.items.length && this.ensureRowIsVisible(nIndex + 1) == false)
					nIndex++;

				if (nIndex < this.items.length - 1) {
					if (oEvent.shiftKey) {
						// Jump over the only selected item
						if (this.selectedItems.length > 1)
							if (this.currentItem.$getContainer().rowIndex < this.selectedItems[0].$getContainer().rowIndex)
								nIndex--;

						this.toggleItemSelection(this.items[nIndex+1]);
					}
					else
						this.selectItem(this.items[nIndex+1]);

					// Scroll to item if not visible
					this.scrollToIndex(nIndex+1);
				}
				// Forbid vertical scrolling
				oEvent.preventDefault();
			}
			else
			if (oEvent.keyIdentifier == "Right") {
				// Key: Right
				if (this.currentItem.children) {
					if (this.currentItem.getAttribute("open") == "true")
						this.selectItem(this.currentItem.children.items[0]);
					else
						this.currentItem.setAttribute("open", "true");
				}

				// Forbid horizontal scrolling
				oEvent.preventDefault();
			}
			else
			if (oEvent.keyIdentifier == "Left") {
				// Key: Left
				if (this.currentItem.children && this.currentItem.getAttribute("open") == "true")
					this.currentItem.setAttribute("open", "false");
				else
				if (this.currentItem.parentNode.parentNode != this.body)
					this.selectItem(this.currentItem.parentNode.parentNode);

				// Forbid horizontal scrolling
				oEvent.preventDefault();
			}
			else
			if (oEvent.keyIdentifier == "Enter") {
				// Key: Enter
				if (this.currentItem.children)
					this.currentItem.setAttribute("open", this.currentItem.getAttribute("open") == "true" ? "false" : "true");
			}
		}
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.attrName == "seltype") {
				// TODO
			}
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
	 		if (oEvent.target instanceof cXULElement_treebody)
				this.body	= oEvent.target;
			else
			if (oEvent.target instanceof cXULElement_treecols)
				this.head	= oEvent.target;
		}
		else {
			if (oEvent.target instanceof cXULElement_treeitem) {
				// Update tree items collection
				var oItemPrevious	= cXULElement_tree.getPreviousItem(oEvent.target);
				//
				if (oItemPrevious)
					this.items.$add(oEvent.target, this.items.$indexOf(oItemPrevious) + 1);
				else
					this.items.$add(oEvent.target);
			}
			else
			if (oEvent.target instanceof cXULElement_treechildren) {
				var oItemPrevious	= oEvent.target.parentNode instanceof cXULElement_treeitem ? oEvent.target.parentNode : null;
				// caters for dynamic changes
				var oTree	= this;
				(function(oChildren, oItemPrevious) {
					for (var nIndex = 0, oItem; nIndex < oChildren.items.length; nIndex++) {
						oItem = oChildren.items[nIndex];
						if (oItemPrevious) {
							oTree.items.$add(oItem, oTree.items.$indexOf(oItemPrevious) + 1);
							oItemPrevious	= oItem;
						}
						else
							oTree.items.$add(oItem);
						// Recurse
						if (oItem.children)
							arguments.callee(oItem.children, oItem);
					}
				})(oEvent.target, oItemPrevious);
			}
		}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this) {
			if (oEvent.target instanceof cXULElement_treebody)
				this.body	= null;
			else
			if (oEvent.target instanceof cXULElement_treecols)
				this.head	= null;
		}
		else {
			if (oEvent.target instanceof cXULElement_treeitem) {
				// Remove from selection
				if (this.selectedItems.$indexOf(oEvent.target) !=-1)
					this.removeItemFromSelection(oEvent.target);
				//
				this.items.$remove(oEvent.target);
			}
			else
			if (oEvent.target instanceof cXULElement_treechildren) {
				// caters for dynamic changes
				var oTree	= this;
				(function(oChildren) {
					for (var nIndex = 0, oItem; nIndex < oChildren.items.length; nIndex++) {
						oItem	= oChildren.items[nIndex];
						oTree.items.$remove(oItem);
						// Recurse
						if (oItem.children)
							arguments.callee(oItem.children);
					}
				})(oEvent.target);
			}
		}
	}
};

cXULElement_tree.getPreviousItem	= function(oItem) {
	var oItemPrevious	= oItem.previousSibling;
	if (oItemPrevious)
		while (oItemPrevious.children && oItemPrevious.children.items.length)
			oItemPrevious	= oItemPrevious.children.items[oItemPrevious.children.items.length - 1];
	else
	if (oItem.parentNode && oItem.parentNode.parentNode instanceof cXULElement_treeitem)
		oItemPrevious	= oItem.parentNode.parentNode;
	//
	return oItemPrevious;
};

cXULElement_tree.getNextItem		= function(oItem) {

};

// Element Render: open
cXULElement_tree.prototype.$getTagOpen		= function() {
	var sHeight	= this.getAttribute("height"),
		sWidth	= this.getAttribute("width");
	return '<div class="xul-tree' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + (!this.$isAccessible() ? " xul-tree_disabled" : "") + '" style="' + (sHeight ? 'height:' + (sHeight * 1 == sHeight ? sHeight + "px" : sHeight) + ';' : '') + (sWidth ? 'width:' + (sWidth * 1 == sWidth ? sWidth + "px" : sWidth) + ';' : '') + (this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
				<div style="position:relative;height:100%;top:0;padding-bottom:inherit;">\
					<div class="xul-tree--resizer" style="height:100%;position:absolute;top:0px;display:none;z-index:1"></div>\
					<table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" style="position:absolute">\
						<tbody class="xul-tree--gateway">';
};

// Element Render: close
cXULElement_tree.prototype.$getTagClose	= function() {
	return 				'</tbody>\
					</table>\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_tree);
