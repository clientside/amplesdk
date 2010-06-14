/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULSelectElement	= function(){};
cXULSelectElement.prototype	= new cXULElement;

// Public Properties
cXULSelectElement.prototype.currentItem		= null; // last selected item element
cXULSelectElement.prototype.selectedItems	= null;
// Accessibility
cXULSelectElement.prototype.tabIndex		= 0;
cXULSelectElement.prototype.$selectable	= false;

// Public Methods
cXULSelectElement.prototype.selectAll	= function()
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    // prevent mutiple selection in single mode
    if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
        return;

    this.selectedItems  = new AMLNodeList;
    for (var nIndex = 0; nIndex < this.items.length; nIndex++)
    {
        this.items[nIndex].setAttribute("selected", "true");
        this.selectedItems.$add(this.items[nIndex]);
    }

    // Fire event
    this._fireEventOnSelect();
};

cXULSelectElement.prototype.clearSelection	= function()
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
        this.selectedItems[nIndex].setAttribute("selected", "false");
    this.selectedItems  = new AMLNodeList;

    // Fire event
    this._fireEventOnSelect();
};

cXULSelectElement.prototype.selectItem	= function(oElement)
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
        this.selectedItems[nIndex].setAttribute("selected", "false");
    this.selectedItems  = new AMLNodeList;

    oElement.setAttribute("selected", "true");

    this.selectedItems.$add(oElement);

    this.currentItem    = oElement;

    // move focus
//	this.currentItem.focus();

    // Fire event
    this._fireEventOnSelect();
};

cXULSelectElement.prototype.toggleItemSelection	= function(oElement)
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    // prevent mutiple selection in single mode
    if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
        if (this.selectedItems.length && this.selectedItems[0] != oElement)
            return;

    var aElements   = new AMLNodeList;
    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
    {
        if (this.selectedItems[nIndex] == oElement)
        {
            oElement.setAttribute("selected", "false");
        }
        else
        {
            aElements.$add(this.selectedItems[nIndex]);
        }
    }
    if (aElements.length == this.selectedItems.length)
    {
        oElement.setAttribute("selected", "true");
        aElements.$add(oElement);

        this.currentItem    = oElement;
    }
    this.selectedItems  = aElements;

    // Fire event
    this._fireEventOnSelect();
};

cXULSelectElement.prototype.addItemToSelection	= function(oElement)
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    // prevent mutiple selection in single mode
    if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
        if (this.selectedItems.length)
            return;

    oElement.setAttribute("selected", "true");
    this.selectedItems.$add(oElement);

    // Fire event
    this._fireEventOnSelect();
};


cXULSelectElement.prototype.removeItemFromSelection	= function(oElement)
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    var aElements   = new AMLNodeList;
    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
    {
        if (this.selectedItems[nIndex] == oElement)
        {
            oElement.setAttribute("selected", "false");
        }
        else
        {
            aElements.$add(this.selectedItems[nIndex]);
        }
    }
    this.selectedItems  = aElements;

    if (this.currentItem == oElement)
        this.currentItem    = null;

    // Fire event
    this._fireEventOnSelect();
};

cXULSelectElement.prototype.selectItemRange	= function(oElement1, oElement2)
{
    // Fire event onbeforeselect
    if (!this._fireEventOnBeforeSelect())
        return;

    // prevent mutiple selection in single mode
    if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
        return;

    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
        this.selectedItems[nIndex].setAttribute("selected", "false");
    this.selectedItems  = new AMLNodeList;

    var nIndex1 = this.items.$indexOf(oElement1);
    var nIndex2 = this.items.$indexOf(oElement2);

    var nIndexMin   = nIndex1;
    var nIndexMax   = nIndex2;

    if (nIndexMin > nIndexMax)
    {
        nIndexMin   = nIndex2;
        nIndexMax   = nIndex1;
    }

    nIndexMax++;

    for (var nIndex = nIndexMin; nIndex < nIndexMax; nIndex++)
    {
        this.items[nIndex].setAttribute("selected", "true");
        this.selectedItems.$add(this.items[nIndex]);
    }

    // Fire event
    this._fireEventOnSelect();
};

cXULSelectElement.prototype.scrollToIndex	= function(nIndex)
{
    if (this.items[nIndex])
    {
    	var oElementDOM	= this.items[nIndex].$getContainer();
        var oElement    = oElementDOM.parentNode.parentNode.parentNode;
        if (oElement.scrollTop > oElementDOM.offsetTop)
            oElementDOM.scrollIntoView(true);
        else
        if (oElement.offsetHeight + oElement.scrollTop < oElementDOM.offsetTop + oElementDOM.offsetHeight + 3)
            oElementDOM.scrollIntoView(false);
    }
};

// Private Methods
cXULSelectElement.prototype._fireEventOnSelect	= function()
{
    if (this.head)
    {
        if (this.attributes["type"] == "checkbox")
            this.head.$getContainer("command").checked    = this.selectedItems.length == this.items.length ? true : false;
        else
        if (this.attributes["type"] == "radio")
            this.head.$getContainer("command").checked    = this.selectedItems.length != 0;
    }

	if (this.selectedItems.length)
	{
	    var oEvent  = this.ownerDocument.createEvent("Events");
	    oEvent.initEvent("select", false, true);
	    this.selectedItems[0].dispatchEvent(oEvent);
	}

    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("select", false, true);
    this.dispatchEvent(oEvent);

    this.doCommand();
};

//
cXULSelectElement.prototype._fireEventOnBeforeSelect	= function()
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("beforeselect", false, true);
    return this.dispatchEvent(oEvent);
};

// Static properties
cXULSelectElement.popup	= null;

// Static methods
cXULSelectElement.getSettingsPopup	= function(oInstance) {
	var oPopup	= cXULSelectElement.popup;
	// Create popup if not yet created
	if (!oPopup) {
		oPopup	= oInstance.ownerDocument.documentElement.appendChild(oInstance.ownerDocument.createElementNS(oInstance.namespaceURI, "xul:menupopup"));
		// "change" handler
		oPopup.addEventListener("DOMActivate", function(oEvent) {
			oPopup.opener.items[oEvent.target.parentNode.childNodes.$indexOf(oEvent.target)].setAttribute("hidden", oEvent.target.getAttribute("checked") == "true" ? "false" : "true");
		}, false);
		cXULSelectElement.popup	= oPopup;
	}
	//
	if (oPopup.parentNode != oInstance) {
		oInstance.appendChild(oPopup);
		// Move view node (otherwise IE crashes because of wrong DOM structure table>tbody>div)
		oInstance.$getContainer("container").appendChild(oPopup.$getContainer());
		//
		oPopup.opener	= oInstance;

		// clear popup items
		while (oPopup.firstChild)
			oPopup.removeChild(oPopup.firstChild);

		// popuplate new items
		for (var nIndex = 0, oItem; nIndex < oInstance.items.length; nIndex++) {
			oItem	= oInstance.ownerDocument.createElementNS(oInstance.namespaceURI, "xul:menuitem");
			oItem.setAttribute("type", "checkbox");
			oItem.setAttribute("label", oInstance.items[nIndex].getAttribute("label"));
			if (oInstance.items[nIndex].getAttribute("hidden") != "true")
				oItem.setAttribute("checked", "true");
			if (!oInstance.items[nIndex].hasAttribute("width"))
				oItem.setAttribute("disabled",  "true");
			oPopup.appendChild(oItem);
		}
	}

	return cXULSelectElement.popup;
};

// Column Resize
cXULSelectElement.resizing	= false;
cXULSelectElement.clientX	= 0;

cXULSelectElement.onResizeStart	= function(oEvent) {
	if (oEvent.button == 0 && oEvent.$pseudoTarget == oEvent.currentTarget.$getContainer("resizer")) {
		//
		cXULSelectElement.resizing	= true;
		cXULSelectElement.clientX	= oEvent.clientX;
		//
		var oView	= oEvent.currentTarget.parentNode.parentNode,
			oResizer	= oView.$getContainer("resizer"),
			oViewRect	= oView.getBoundingClientRect(),
			oHeaderRect	= oEvent.currentTarget.getBoundingClientRect();

		// Show resizer
		oResizer.style.display	= "";
		// Move resizer
		oResizer.style.left	= (oHeaderRect.right - oViewRect.left) + "px";
	}
};

cXULSelectElement.onResize		= function(oEvent) {
	if (cXULSelectElement.resizing) {
		var oView	= oEvent.currentTarget.parentNode.parentNode,
			oResizer	= oView.$getContainer("resizer"),
			oViewRect	= oView.getBoundingClientRect(),
			oHeaderRect	= oEvent.currentTarget.getBoundingClientRect(),
			nOffset	= Math.min(oHeaderRect.right - oHeaderRect.left, Math.max(0, cXULSelectElement.clientX - oEvent.clientX));
		// Move resizer
		oResizer.style.left	= (oHeaderRect.right - oViewRect.left - nOffset) + "px";
	}
};

cXULSelectElement.onResizeEnd	= function(oEvent) {
	if (cXULSelectElement.resizing) {
		cXULSelectElement.resizing	= false;
		//
		var oView	= oEvent.target.parentNode.parentNode,
			oResizer	= oView.$getContainer("resizer"),
			oViewRect	= oView.getBoundingClientRect(),
			oHeaderRect	= oEvent.target.getBoundingClientRect(),
			nOffset	= Math.min(oHeaderRect.right - oHeaderRect.left, Math.max(0, cXULSelectElement.clientX - oEvent.clientX));
		// Hide Resizer
		oResizer.style.display	= "none";
		// Set column width
		oEvent.currentTarget.setAttribute("width", nOffset);
	}
};