/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULPopupElement	= function(){};
cXULPopupElement.prototype	= new cXULElement;

// Constants
cXULPopupElement.POPUP_TYPE_POPUP	= 0;
cXULPopupElement.POPUP_TYPE_TOOLTIP	= 1;
cXULPopupElement.POPUP_TYPE_MODAL	= 2;
cXULPopupElement.POPUP_TYPE_BUBBLE	= 3;

// Public Properties
cXULPopupElement.prototype.popupType	= cXULPopupElement.POPUP_TYPE_POPUP;

// Public Methods
cXULPopupElement.prototype.showPopup	= function(oElement, nLeft, nTop, nType, oAnchor, sAlign)
{
    // fire event
    if (cXULPopupElement.fireEventOnPopup(this, "showing") == false)
        return;

    this.popupType = nType;

    // Show popup
    this.$getContainer().style.display	= "block";
	if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
		this.setCapture(true);

    if ((!isNaN(nLeft) && nLeft !=-1) || (!isNaN(nTop) && nTop != -1))
    {
    	var oPosition	= this.getBoundingClientRect(),
    		oPosition1	= this.ownerDocument.documentElement.getBoundingClientRect(),
    		oPosition2	= {"top":0, "left":0, "bottom":0, "right":0};
    	// If within windows (which are positioned absolutely)
    	for (var oNode = this; oNode; oNode = oNode.parentNode)
    		if (oNode instanceof cXULElement_window || oNode instanceof cXULElement_dialog || oNode instanceof cXULElement_wizard) {
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
    if (oElement)
    {
        var oPosition  = oElement.getBoundingClientRect();
		switch (this.getAttribute("position"))
		{
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
        this.ownerDocument.tooltipNode	= this;
    else
    {
        this.ownerDocument.popupNode	= this;
        if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
            this.ownerDocument.$getContainer("popup").style.display	= "block";
    }
*/
    if (navigator.userAgent.match(/MSIE ([\d\.]+)/)) {
    	if (RegExp.$1 < 8) {
    		var oPosition2	= this.getBoundingClientRect();
    		this.$getContainer("shadow-right").style.height	= (oPosition2.bottom - oPosition2.top - 3)+ "px";
    		this.$getContainer("shadow-bottom").style.width	= (oPosition2.right - oPosition2.left - 3)+ "px";
    	}
    }
    else {
	    // Play effect
		this.$getContainer().style.opacity	= "0";
		this.$play("opacity:1", 100, 1);
    }

	this.setAttribute("hidden", "false");

    // fire event
    cXULPopupElement.fireEventOnPopup(this, "shown");
};

cXULPopupElement.prototype.hidePopup	= function()
{
    // fire event
    if (cXULPopupElement.fireEventOnPopup(this, "hiding") == false)
        return;
/*
	if (this.popupType == cXULPopupElement.POPUP_TYPE_TOOLTIP)
    	this.ownerDocument.tooltipNode	= null;
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

cXULPopupElement.prototype.moveTo	= function(nLeft, nTop)
{
	var oElementDOM	= this.$getContainer();
    oElementDOM.style.left	= nLeft		+ "px";
    oElementDOM.style.top	= nTop		+ "px";
};

cXULPopupElement.prototype.sizeTo	= function(nWidth, nHeight)
{
	var oElementDOM	= this.$getContainer();
    oElementDOM.style.width	= nWidth	+ "px";
    oElementDOM.style.height= nHeight	+ "px";
};

// Static Methods
cXULPopupElement.fireEventOnPopup	= function(oInstance, sName)
{
    var oEvent  = oInstance.ownerDocument.createEvent("Events");
    oEvent.initEvent("popup" + sName, false, true);

    return oInstance.dispatchEvent(oEvent);
};
