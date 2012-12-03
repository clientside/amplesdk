/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treerow	= function() {
	// Collections
	this.cells		= new ample.classes.NodeList;
};
cXULElement_treerow.prototype	= new cXULElement("treerow");
cXULElement_treerow.prototype.$hoverable	= true;

// Public Methods
cXULElement_treerow.prototype.$isAccessible	= function() {
	return this.parentNode && this.parentNode.parentNode && this.parentNode.parentNode.tree ? this.parentNode.parentNode.tree.$isAccessible() : true;
};

// Private members
cXULElement_treerow.prototype._onCommandClick	= function(oEvent) {
	var oTree	= this.parentNode.parentNode.tree;
	if (this.$getContainer("command").checked) {
		if (oTree.getAttribute("type") == "radio")
			oTree.selectItem(this.parentNode);
		else
		if (oTree.getAttribute("type") == "checkbox")
			oTree.addItemToSelection(this.parentNode);
	}
	else
		oTree.removeItemFromSelection(this.parentNode);
};

// Class events handlers
cXULElement_treerow.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		var oTarget	= oEvent.target;
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecell) {
				var oCellNext	= oTarget.nextSibling;
				if (oCellNext)
					this.cells.$add(oTarget, this.cells.$indexOf(oCellNext));
				else
					this.cells.$add(oTarget);
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecell)
				this.cells.$remove(oEvent.target);
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		// Move view node if neccessary
		var oItem	= this.parentNode,
			aItems	= oItem.parentNode.tree.items;
		var nItemIndex	= aItems.$indexOf(oItem);
		if (aItems[nItemIndex - 1]) {
			var oItemPrevious	= aItems[nItemIndex - 1].$getContainer();
			if (oItemPrevious) {
				var oRowContainer	= this.$getContainer();
				if (oRowContainer != oItemPrevious.nextSibling)
					oRowContainer.parentNode.insertBefore(oRowContainer, oItemPrevious.nextSibling);
			}
		}
	}
};

// Element Render: open
cXULElement_treerow.prototype.$getTagOpen	= function() {
	var oTree	= this.parentNode.parentNode.tree;
	return '<tr class="xul-treerow' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : '') + '" style="height:1.2em;vertical-align:top;' + (this.parentNode.parentNode.parentNode.getAttribute("open") == "false" ? 'display:none' : '')+ '">' +
			(this.parentNode.hasAttribute("label") || (oTree && (oTree.getAttribute("type") == "checkbox" || oTree.getAttribute("type") == "radio"))
			? ('<td style="padding:0" onmousedown="event.cancelBubble=true" class="xul-treecell">' +
				(this.parentNode.hasAttribute("label")
				? '<div class="xul-treecell--gateway">' + this.parentNode.getAttribute("label") + '</div>'
				: (oTree.getAttribute("type") == "checkbox"
					? '<input type="checkbox" name="' + oTree.uniqueID + '_cmd" class="xul-treeitem--command" onclick="ample.$instance(this)._onCommandClick(event);" autocomplete="off"/>'
						: (oTree.getAttribute("type") == "radio"
						? '<input type="radio" name="' + oTree.uniqueID + '_cmd" class="xul-treeitem--command" onclick="ample.$instance(this)._onCommandClick(event);"/>'
					: ' ')))+
			'</td>')
			: '');
};

// Element Render: close
cXULElement_treerow.prototype.$getTagClose	= function() {
	return '</tr>';
};

// Register Element
ample.extend(cXULElement_treerow);
