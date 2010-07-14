/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listitem	= function() {
    // Collections
    this.cells  = new AMLNodeList;
};
cXULElement_listitem.prototype   = new cXULElement;
cXULElement_listitem.prototype.$hoverable	= true;

// Class Events Handlers
cXULElement_listitem.handlers	= {
	"mousedown":	function(oEvent) {
		var oView	= this.parentNode.parentNode;
		if (!oView.$isAccessible())
			return;
	    //
	    if (oEvent.button == 2 && oView.selectedItems.$indexOf(this) !=-1)
	        return;

	    if (oEvent.shiftKey)
	    {
	        if (oView.currentItem)
	        	oView.selectItemRange(this, oView.currentItem);
	    }
	    else
	    {
	        if (oEvent.ctrlKey)
	        	oView.toggleItemSelection(this);
	        else
	        	oView.selectItem(this);
	    }
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "selected":
			    	this.$setPseudoClass("selected", oEvent.newValue == "true");
			        if (this.parentNode.parentNode.attributes["type"] == "checkbox" || this.parentNode.parentNode.attributes["type"] == "radio")
			            this.$getContainer("command").checked = oEvent.newValue == "true";
			        break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbody && this.parentNode.parentNode instanceof cXULElement_listbox)
			this.parentNode.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbody && this.parentNode.parentNode instanceof cXULElement_listbox) {
		    // remove from selection
		    if (this.parentNode.parentNode.selectedItems.$indexOf(this) !=-1)
			    this.parentNode.parentNode.removeItemFromSelection(this);

			this.parentNode.parentNode.items.$remove(this);
		}
	}
};

cXULElement_listitem.prototype.$isAccessible	= function() {
	return this.parentNode.parentNode.$isAccessible();
};

// Events Handlers
cXULElement_listitem.prototype._onCommandClick   = function(oEvent) {
    if (this.$getContainer("command").checked)  {
        if (this.parentNode.parentNode.attributes["type"] == "radio")
            this.parentNode.parentNode.selectItem(this);
        else
        if (this.parentNode.parentNode.attributes["type"] == "checkbox")
            this.parentNode.parentNode.addItemToSelection(this);
    }
    else {
        this.parentNode.parentNode.removeItemFromSelection(this);
    }
};

// Element Render: open
cXULElement_listitem.prototype.$getTagOpen	= function() {
	var oListBox	= this.parentNode.parentNode;
	return '<tr class="xul-listitem' + (this.attributes["class"] ? " xul-listitem_" + this.attributes["class"] : "") + '">' +
				(this.attributes["label"] || (oListBox && (oListBox.attributes["type"] == "checkbox" || oListBox.attributes["type"] == "radio"))
				? ('<td style="padding:0" align="left" onmousedown="event.cancelBubble=true;" class="xul-listcell">' +
					(this.attributes["label"]
					? '<div class="xul-listcell--gateway">' + this.attributes["label"] + '</div>'
					: (this.parentNode.parentNode.attributes["type"] == "checkbox"
						? '<input type="checkbox" name="' + oListBox.uniqueID + '_cmd" class="xul-listitem--command" onclick="return ample.$instance(this)._onCommandClick(event);" autocomplete="off"/>'
							: (this.parentNode.parentNode.attributes["type"] == "radio"
							? '<input type="radio" name="' + oListBox.uniqueID + '_cmd" class="xul-listitem--command" onclick="return ample.$instance(this)._onCommandClick(event);"/>'
			    		: ' ')))+
			    '</td>')
	        	: '');
};

// Element Render: close
cXULElement_listitem.prototype.$getTagClose	= function() {
	return 		'<td class="xul-listcell"></td>\
			</tr>';
};

// Register Element with language
oXULNamespace.setElement("listitem", cXULElement_listitem);

