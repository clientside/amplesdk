/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listitem	= function() {
	// Collections
	this.cells	= new ample.classes.NodeList;
};
cXULElement_listitem.prototype	= new cXULElement("listitem");
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

		if (oView.getAttribute("seltype") == "single") {
			oView.selectItem(this);
		} else {
			if (oEvent.shiftKey) {
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
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_listcell)
				this.cells.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_listcell)
				this.cells.$remove(oEvent.target);
	}
};

cXULElement_listitem.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "selected") {
		this.$setPseudoClass("selected", sValue == "true");
		if (this.parentNode.parentNode.getAttribute("type") == "checkbox" || this.parentNode.parentNode.getAttribute("type") == "radio")
			this.$getContainer("command").checked	= sValue == "true";
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULElement_listitem.prototype.$isAccessible	= function() {
	var oParent	= this.parentNode;
	return oParent && oParent.parentNode ? oParent.parentNode.$isAccessible() : true;
};

// Events Handlers
cXULElement_listitem.prototype._onCommandClick	= function(oEvent) {
	if (this.$getContainer("command").checked) {
		if (this.parentNode.parentNode.getAttribute("type") == "radio")
			this.parentNode.parentNode.selectItem(this);
		else
		if (this.parentNode.parentNode.getAttribute("type") == "checkbox")
			this.parentNode.parentNode.addItemToSelection(this);
	}
	else {
		this.parentNode.parentNode.removeItemFromSelection(this);
	}
};

// Element Render: open
cXULElement_listitem.prototype.$getTagOpen	= function() {
	var oListBox	= this.parentNode.parentNode;
	return '<tr class="xul-listitem' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="height:1.2em;vertical-align:top">' +
				(this.hasAttribute("label") || (oListBox && (oListBox.getAttribute("type") == "checkbox" || oListBox.getAttribute("type") == "radio"))
				? ('<td style="padding:0" onmousedown="event.cancelBubble=true;" class="xul-listcell">' +
					(this.hasAttribute("label")
					? '<div class="xul-listcell--gateway">' + (this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : '') + '</div>'
					: (this.parentNode.parentNode.getAttribute("type") == "checkbox"
						? '<input type="checkbox" name="' + oListBox.uniqueID + '_cmd" class="xul-listitem--command" onclick="return ample.$instance(this)._onCommandClick(event);" autocomplete="off"/>'
							: (this.parentNode.parentNode.getAttribute("type") == "radio"
							? '<input type="radio" name="' + oListBox.uniqueID + '_cmd" class="xul-listitem--command" onclick="return ample.$instance(this)._onCommandClick(event);"/>'
						: ' ')))+
				'</td>')
				: '');
};

// Element Render: close
cXULElement_listitem.prototype.$getTagClose	= function() {
	return '</tr>';
};

// Register Element
ample.extend(cXULElement_listitem);

