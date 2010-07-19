/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treerow	= function() {
    // Collections
    this.cells      = new AMLNodeList;
};
cXULElement_treerow.prototype	= new cXULElement;
cXULElement_treerow.prototype.$hoverable	= true;

// Public Methods
cXULElement_treerow.prototype.$isAccessible	= function() {
	return this.parentNode.parentNode.tree.$isAccessible();
};

// Private members
cXULElement_treerow.prototype._onCommandClick   = function(oEvent) {
	var oTree	= this.parentNode.parentNode.tree;
    if (this.$getContainer("command").checked) {
        if (oTree.attributes["type"] == "radio")
            oTree.selectItem(this.parentNode);
        else
        if (oTree.attributes["type"] == "checkbox")
            oTree.addItemToSelection(this.parentNode);
    }
    else
        oTree.removeItemFromSelection(this.parentNode);
};

// Class events handlers
cXULElement_treerow.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecell)
				this.cells.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecell)
				this.cells.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_treerow.prototype.$getTagOpen	= function() {
	var oTree	= this.parentNode.parentNode.tree;
    if (this.parentNode.parentNode.parentNode.attributes["open"] == "false")
        this.parentNode.parentNode.attributes["hidden"] = "true";

	return '<tr class="xul-treerow' + (this.attributes["class"] ? " xul-treerow_" + this.attributes["class"] : '') + '" style="height:1em;vertical-align:top;' + (this.parentNode.parentNode.parentNode.attributes["open"] == "false" ? 'display:none' : '')+ '">' +
	    	(this.parentNode.attributes["label"] || (oTree && (oTree.attributes["type"] == "checkbox" || oTree.attributes["type"] == "radio"))
			? ('<td style="padding:0" onmousedown="event.cancelBubble=true" class="xul-treecell">' +
				(this.parentNode.attributes["label"]
				? '<div class="xul-treecell--gateway">' + this.parentNode.attributes["label"] + '</div>'
				: (oTree.attributes["type"] == "checkbox"
					? '<input type="checkbox" name="' + oTree.uniqueID + '_cmd" class="xul-treeitem--command" onclick="ample.$instance(this)._onCommandClick(event);" autocomplete="off"/>'
						: (oTree.attributes["type"] == "radio"
						? '<input type="radio" name="' + oTree.uniqueID + '_cmd" class="xul-treeitem--command" onclick="ample.$instance(this)._onCommandClick(event);"/>'
	        		: ' ')))+
	        '</td>')
	        : '');
};

// Element Render: close
cXULElement_treerow.prototype.$getTagClose	= function() {
    return 		'<td class="xul-treecell" width="100%"></td>\
    		</tr>';
};

// Register Element with language
oXULNamespace.setElement("treerow", cXULElement_treerow);
