/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULPopupElement	= function() {
	cXULElement.apply(this, arguments);
};
cXULPopupElement.prototype	= new cXULElement;
cXULPopupElement.prototype.localName	= "#element-popup";

// Constants
cXULPopupElement.POPUP_TYPE_POPUP	= 0;
cXULPopupElement.POPUP_TYPE_TOOLTIP	= 1;
cXULPopupElement.POPUP_TYPE_MODAL	= 2;
cXULPopupElement.POPUP_TYPE_BUBBLE	= 3;

// Public Properties
cXULPopupElement.prototype.popupType	= cXULPopupElement.POPUP_TYPE_POPUP;

cXULPopupElement.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "top") {
		if (!isNaN(sValue) && !isNaN(this.getAttribute("left")))
			this.moveTo(this.getAttribute("left") * 1, sValue * 1);
	}
	else
	if (sName == "left") {
		if (!isNaN(sValue) && !isNaN(this.getAttribute("top")))
			this.moveTo(sValue * 1, this.getAttribute("top") * 1);
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Public Methods
cXULPopupElement.prototype.showPopup	= function(oElement, nLeft, nTop, nType, oAnchor, sAlign) {
	// fire event
	if (cXULPopupElement.fireEventOnPopup(this, "showing") == false)
		return;

	this.popupType	= nType;

	// Show popup
	this.$getContainer().style.display	= "block";
	this.setAttribute("hidden", "false");
	if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
		this.setCapture(true);

	if ((!isNaN(nLeft) && nLeft !=-1) || (!isNaN(nTop) && nTop != -1)) {
		var oPosition	= this.getBoundingClientRect(),
			oPosition1	= this.ownerDocument.documentElement.getBoundingClientRect(),
			oPosition2	= {"top":0, "left":0, "bottom":0, "right":0};
		// If within windows (which are positioned absolutely)
		for (var oNode = this; oNode; oNode = oNode.parentNode)
			if (oNode instanceof cXULWindowElement) {
				oPosition2	= oNode.getBoundingClientRect();
				break;
			}
		if (oPosition.bottom - oPosition.top + nTop > oPosition1.bottom - oPosition1.top)
			nTop	-= oPosition.bottom - oPosition.top;
		if (oPosition.right - oPosition.left + nLeft > oPosition1.right - oPosition1.left)
			nLeft	-= oPosition.right - oPosition.left;
		this.moveTo(nLeft - oPosition2.left, nTop - oPosition2.top);
	}
	else
	if (oElement) {
		var oPosition	= oElement.getBoundingClientRect();
		switch (this.getAttribute("position")) {
			case "after_start":
				// popup is beneath the element, left corners aligned
				this.moveTo(oPosition.left, oPosition.bottom);
				break;

			case"after_end":
				// popup is beneath the element, right corners aligned
				break;

			case"before_start":
				// popup is above the element, left corners aligned
				break;

			case"before_end":
				// popup is above the element, right corners aligned
				break;

			case"end_after":
				// popup is next to the element, bottom edges are at the same level
				break;

			case"end_before":
				// popup is next to the element, top edges are at the same level
				break;

			case"start_after":
				// popup is before the element, bottom edges are at the same level
				break;

			case"start_before":
				// popup is before the element, top edges are at the same level
				break;

			case"overlap":
				// over top of the element
				break;
		}
	}
/*
	if (this.popupType == cXULPopupElement.POPUP_TYPE_TOOLTIP)
		ample.tooltipNode	= this;
	else
	{
		this.ownerDocument.popupNode	= this;
		if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
			this.ownerDocument.$getContainer("popup").style.display	= "block";
	}
*/
	var bIE	= navigator.userAgent.match(/MSIE ([\d\.]+)/),
		nVersion	= bIE ? RegExp.$1 : 0;
	// Position shadows
	if (bIE && nVersion < 8) {
		var oPosition2	= this.getBoundingClientRect();
		this.$getContainer("shadow-right").style.height	= (oPosition2.bottom - oPosition2.top - 3)+ "px";
		this.$getContainer("shadow-bottom").style.width	= (oPosition2.right - oPosition2.left - 3)+ "px";
	}
	// Aply transition
	if (!(bIE && nVersion < 9)) {
		// Play effect
		ample.query(this).css("opacity", "0").animate({"opacity":"1"}, "fast");
	}

	// fire event
	cXULPopupElement.fireEventOnPopup(this, "shown");
};

cXULPopupElement.prototype.hidePopup	= function() {
	// fire event
	if (cXULPopupElement.fireEventOnPopup(this, "hiding") == false)
		return;
/*
	if (this.popupType == cXULPopupElement.POPUP_TYPE_TOOLTIP)
		ample.tooltipNode	= null;
	else
	{
		this.ownerDocument.popupNode	= null;
		if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
			this.ownerDocument.$getContainer("popup").style.display	= "none";
	}
*/
	this.setAttribute("hidden", "true");

	// Hide popup
	this.$getContainer().style.display	= "none";

	if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
		this.releaseCapture();

	// fire event
	cXULPopupElement.fireEventOnPopup(this, "hidden");
};

cXULPopupElement.prototype.moveTo	= function(nLeft, nTop) {
	var oElementDOM	= this.$getContainer();
	oElementDOM.style.left	= nLeft		+ "px";
	oElementDOM.style.top	= nTop		+ "px";
};

cXULPopupElement.prototype.sizeTo	= function(nWidth, nHeight) {
	var oElementDOM	= this.$getContainer();
	oElementDOM.style.width	= nWidth	+ "px";
	oElementDOM.style.height= nHeight	+ "px";
};

// Static Methods
cXULPopupElement.fireEventOnPopup	= function(oInstance, sName) {
	var oEvent	= oInstance.ownerDocument.createEvent("Event");
	oEvent.initEvent("popup" + sName, true, true);

	return oInstance.dispatchEvent(oEvent);
};

// Register Element
ample.extend(cXULPopupElement);
