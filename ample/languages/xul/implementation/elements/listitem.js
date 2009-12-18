/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listitem	= function()
{
    // Collections
    this.cells  = new AMLNodeList;
};
cXULElement_listitem.prototype   = new cXULElement;
cXULElement_listitem.prototype.$hoverable	= true;

// Public Methods
cXULElement_listitem.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
        if (this.parentNode.parentNode.attributes["type"] == "checkbox" || this.parentNode.parentNode.attributes["type"] == "radio")
            this.$getContainer("command").checked = sValue == "true";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class Events Handlers
cXULElement_listitem.handlers	= {
	"mousedown":	function(oEvent) {
	    //
	    if (oEvent.button == 2 && this.parentNode.parentNode.selectedItems.$indexOf(this) !=-1)
	        return;

	    if (oEvent.shiftKey)
	    {
	        if (this.parentNode.parentNode.currentItem)
	            this.parentNode.parentNode.selectItemRange(this, this.parentNode.parentNode.currentItem);
	    }
	    else
	    {
	        if (oEvent.ctrlKey)
	            this.parentNode.parentNode.toggleItemSelection(this);
	        else
	            this.parentNode.parentNode.selectItem(this);
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

// Events Handlers
cXULElement_listitem.prototype._onCommandClick   = function(oEvent)
{
    if (this.$getContainer("command").checked)
    {
        if (this.parentNode.parentNode.attributes["type"] == "radio")
            this.parentNode.parentNode.selectItem(this);
        else
        if (this.parentNode.parentNode.attributes["type"] == "checkbox")
            this.parentNode.parentNode.addItemToSelection(this);
    }
    else
    {
        this.parentNode.parentNode.removeItemFromSelection(this);
    }
};

// Element Render: open
cXULElement_listitem.prototype.$getTagOpen	= function()
{
	var oListBox	= this.parentNode.parentNode;
	return '<tr class="xul-listitem' + (this.attributes["class"] ? " xul-listitem_" + this.attributes["class"] : "") + '">' +
				(this.attributes["label"] || (oListBox && (oListBox.attributes["type"] == "checkbox" || oListBox.attributes["type"] == "radio"))
				? ('<td style="padding:0" align="center" onmousedown="event.cancelBubble=true;" class="xul-listcell">' +
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
cXULElement_listitem.prototype.$getTagClose	= function()
{
	return '</tr>';
};

// Register Element with language
oXULNamespace.setElement("listitem", cXULElement_listitem);

