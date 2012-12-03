/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULSelectElement	= function() {
	cXULElement.apply(this, arguments);
};
cXULSelectElement.prototype	= new cXULElement;
cXULSelectElement.prototype.localName	= "#element-select";

// Public Properties
cXULSelectElement.prototype.currentItem		= null; // last selected item element
cXULSelectElement.prototype.selectedItems	= null;
// Accessibility
cXULSelectElement.prototype.tabIndex		= 0;
cXULSelectElement.prototype.$selectable		= false;

cXULSelectElement.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
	if (sName == "seltype") {
		// TODO
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Public Methods
cXULSelectElement.prototype.selectAll	= function() {
	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	// prevent mutiple selection in single mode
	if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
		return;

	this.selectedItems	= new ample.classes.NodeList;
	for (var nIndex = 0; nIndex < this.items.length; nIndex++) {
		this.items[nIndex].setAttribute("selected", "true");
		this.selectedItems.$add(this.items[nIndex]);
	}

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};

cXULSelectElement.prototype.clearSelection	= function() {
	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
		this.selectedItems[nIndex].setAttribute("selected", "false");
	this.selectedItems	= new ample.classes.NodeList;

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};

cXULSelectElement.prototype.selectItem	= function(oElement) {
	if (this.selectedItems.length == 1 && this.selectedItems[0] == oElement)
		return;

	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
		this.selectedItems[nIndex].setAttribute("selected", "false");
	this.selectedItems	= new ample.classes.NodeList;

	oElement.setAttribute("selected", "true");

	this.selectedItems.$add(oElement);

	this.currentItem	= oElement;

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};

cXULSelectElement.prototype.toggleItemSelection	= function(oElement) {
	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	// prevent mutiple selection in single mode
	if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
		if (this.selectedItems.length && this.selectedItems[0] != oElement)
			return;

	var aElements	= new ample.classes.NodeList;
	for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++) {
		if (this.selectedItems[nIndex] == oElement) {
			oElement.setAttribute("selected", "false");
		}
		else
		{
			aElements.$add(this.selectedItems[nIndex]);
		}
	}
	if (aElements.length == this.selectedItems.length) {
		oElement.setAttribute("selected", "true");
		aElements.$add(oElement);

		this.currentItem	= oElement;
	}
	this.selectedItems	= aElements;

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};

cXULSelectElement.prototype.addItemToSelection	= function(oElement) {
	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	// prevent mutiple selection in single mode
	if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
		if (this.selectedItems.length)
			return;

	oElement.setAttribute("selected", "true");
	this.selectedItems.$add(oElement);

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};


cXULSelectElement.prototype.removeItemFromSelection	= function(oElement) {
	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	var aElements	= new ample.classes.NodeList;
	for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++) {
		if (this.selectedItems[nIndex] == oElement) {
			oElement.setAttribute("selected", "false");
		}
		else
		{
			aElements.$add(this.selectedItems[nIndex]);
		}
	}
	this.selectedItems	= aElements;

	if (this.currentItem == oElement)
		this.currentItem	= null;

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};

cXULSelectElement.prototype.selectItemRange	= function(oElement1, oElement2) {
	// Fire event onbeforeselect
	if (!cXULSelectElement.fireEventOnBeforeSelect(this))
		return;

	// prevent mutiple selection in single mode
	if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
		return;

	for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
		this.selectedItems[nIndex].setAttribute("selected", "false");
	this.selectedItems	= new ample.classes.NodeList;

	var nIndex1	= this.items.$indexOf(oElement1);
	var nIndex2	= this.items.$indexOf(oElement2);

	var nIndexMin	= nIndex1;
	var nIndexMax	= nIndex2;

	if (nIndexMin > nIndexMax) {
		nIndexMin	= nIndex2;
		nIndexMax	= nIndex1;
	}

	nIndexMax++;

	for (var nIndex = nIndexMin; nIndex < nIndexMax; nIndex++) {
		this.items[nIndex].setAttribute("selected", "true");
		this.selectedItems.$add(this.items[nIndex]);
	}

	// Fire event
	cXULSelectElement.fireEventOnSelect(this);
};

cXULSelectElement.prototype.scrollToIndex	= function(nIndex) {
	if (this.items[nIndex]) {
		var oElementDOM	= this.items[nIndex].$getContainer();
		var oElement	= oElementDOM.parentNode.parentNode.parentNode;
		if (oElement.scrollTop > oElementDOM.offsetTop)
			oElementDOM.scrollIntoView(true);
		else
		if (oElement.offsetHeight + oElement.scrollTop < oElementDOM.offsetTop + oElementDOM.offsetHeight + 3)
			oElementDOM.scrollIntoView(false);
	}
};

//Static Methods
cXULSelectElement.fireEventOnSelect	= function(oInstance) {
	if (oInstance.head) {
		if (oInstance.getAttribute("type") == "checkbox")
			oInstance.head.$getContainer("command").checked	= oInstance.selectedItems.length == oInstance.items.length ? true : false;
		else
		if (oInstance.getAttribute("type") == "radio")
			oInstance.head.$getContainer("command").checked	= oInstance.selectedItems.length != 0;
	}

	var oEvent	= oInstance.ownerDocument.createEvent("Event");
	oEvent.initEvent("select", true, true);
	oInstance.dispatchEvent(oEvent);

	oInstance.doCommand();
};

cXULSelectElement.fireEventOnBeforeSelect	= function(oInstance) {
	var oEvent	= oInstance.ownerDocument.createEvent("Event");
	oEvent.initEvent("beforeselect", false, true);
	return oInstance.dispatchEvent(oEvent);
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
			oPopup.appendChild(oItem);
		}
	}

	return cXULSelectElement.popup;
};

// Column Resize
cXULSelectElement.resizing	= false;
cXULSelectElement.clientX	= 0;
cXULSelectElement.minWidth	= 0;
cXULSelectElement.maxWidth	= 0;

cXULSelectElement.onResizeStart	= function(oEvent) {
	if (oEvent.button == 0 && oEvent.$pseudoTarget == oEvent.currentTarget.$getContainer("resizer")) {
		//
		var oHeader	= oEvent.currentTarget,
			oView	= oHeader.parentNode.parentNode,
			oHeaderRect	= oHeader.getBoundingClientRect(),
			oViewRect	= oView.getBoundingClientRect(),
			oResizer	= oView.$getContainer("resizer");

		// Show resizer
		oResizer.style.display	= "";
		// Move resizer
		oResizer.style.left	= (oHeaderRect.right - oViewRect.left) + "px";
		//
		cXULSelectElement.resizing	= true;
		cXULSelectElement.clientX	= oEvent.clientX;
		cXULSelectElement.minWidth	= oHeader.getAttribute("minwidth") * 1 || 0;
		cXULSelectElement.maxWidth	= oHeader.getAttribute("maxwidth") * 1 || Infinity;
	}
};

cXULSelectElement.onResize		= function(oEvent) {
	if (cXULSelectElement.resizing) {
		var oHeader	= oEvent.currentTarget,
			oView	= oHeader.parentNode.parentNode,
			oHeaderRect	= oHeader.getBoundingClientRect(),
			oViewRect	= oView.getBoundingClientRect(),
			oResizer	= oView.$getContainer("resizer"),
			nWidth	=(oHeaderRect.right - oHeaderRect.left)-(cXULSelectElement.clientX - oEvent.clientX);

		// Check min/max
		nWidth	= Math.min(cXULSelectElement.maxWidth, Math.max(nWidth, cXULSelectElement.minWidth));

		// Move resizer
		oResizer.style.left	= (oHeaderRect.left - oViewRect.left + nWidth) + "px";
	}
};

cXULSelectElement.onResizeEnd	= function(oEvent) {
	if (cXULSelectElement.resizing) {
		cXULSelectElement.resizing	= false;
		//
		var oHeader	= oEvent.currentTarget,
			oView	= oHeader.parentNode.parentNode,
			oHeaderRect	= oHeader.getBoundingClientRect(),
			oViewRect	= oView.getBoundingClientRect(),
			oResizer	= oView.$getContainer("resizer"),
			nWidth	=(oHeaderRect.right - oHeaderRect.left)-(cXULSelectElement.clientX - oEvent.clientX);
		// Hide Resizer
		oResizer.style.display	= "none";

		// Check min/max
		nWidth	= Math.floor(Math.min(cXULSelectElement.maxWidth, Math.max(nWidth, cXULSelectElement.minWidth)));

		// Set column width
		oHeader.setAttribute("width", nWidth);
	}
};

// Register Element
ample.extend(cXULSelectElement);
