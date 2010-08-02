/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULPopupManager	= (function () {

	// Local variables
	var oTooltipPane	= null;

	// Extend ample document to XULDocument
	ample.document.tooltipNode	= null;
	ample.document.popupNode	= null;

	// Attaching manager to document
	ample.document.addEventListener("mouseenter",	function(oEvent) {
		for (var oElement = oEvent.target, oTooltip; oElement.nodeType != AMLNode.DOCUMENT_NODE; oElement = oElement.parentNode) {
			if (oElement.$isAccessible()) {
			    if (oElement.attributes["tooltiptext"]) {
			    	oTooltip	= oTooltipPane;
			    	if (!oTooltip)	{
			    		// Add as anonymous
			    		oTooltip	= this.documentElement.$appendChildAnonymous(this.createElementNS(oElement.namespaceURI, "xul:tooltip-pane"));
			    		oTooltipPane	= oTooltip;
			    		// Render
			    		var oTooltipNode	= this.documentElement.$getContainer("gateway").appendChild(document.createElement("div"));
			    		oTooltipNode.innerHTML	= oTooltip.$getTag();
			    	}
					oTooltip.setText(oElement.attributes["tooltiptext"]);
		        	oTooltip.showPopup(null, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + 18 + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_TOOLTIP);
		    		this.tooltipNode	= oTooltip;
			    }
			    else
			    if (oElement.attributes["tooltip"]) {
			    	oTooltip	= this.getElementById(oElement.attributes["tooltip"]);
			    	if (oTooltip) {
			    		oTooltip.showPopup(null, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + 18 + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_TOOLTIP);
			    		this.tooltipNode	= oTooltip;
			    	}
			    }
			}
		}
	}, true);

	ample.document.addEventListener("mouseleave",	function(oEvent) {
		if (this.tooltipNode)	{
			this.tooltipNode.hidePopup();
			this.tooltipNode	= null;
		}
	}, true);

	ample.document.addEventListener("click",	function(oEvent) {
		for (var oElement = oEvent.target, oPopup; oElement.nodeType != AMLNode.DOCUMENT_NODE; oElement = oElement.parentNode) {
			if (oElement.$isAccessible()) {
				if (oEvent.button == 2) {
			        if (oElement.attributes["context"]) {
			            if (oPopup = this.getElementById(oElement.attributes["context"])) {
			            	oPopup.showPopup(oElement, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_POPUP);
			                this.popupNode	= oPopup;
			            }
			            oEvent.preventDefault();
			            break;
			        }
				}
				else
		        if (oEvent.button == 0) {
		        	if (oElement.attributes["popup"]) {
			            if (oPopup = this.getElementById(oElement.attributes["popup"])) {
			                oPopup.showPopup(oElement, oEvent.clientX + document.documentElement.scrollLeft, oEvent.clientY + document.documentElement.scrollTop, cXULPopupElement.POPUP_TYPE_POPUP);
				    		this.popupNode	= oPopup;
				    	}
			            oEvent.preventDefault();
			            break;
		        	}
		        }
			}
		}
	}, true);

	ample.document.addEventListener("mousedown",	function(oEvent) {
		// Hide popup node
		if (this.popupNode && !(oEvent.target == this.popupNode ||(oEvent.target.compareDocumentPosition(this.popupNode) & AMLNode.DOCUMENT_POSITION_CONTAINS))) {
			this.popupNode.hidePopup();
			this.popupNode	= null;

			// stop propagating this event
			oEvent.stopPropagation();
		}
		// hide tooltip node
		if (this.tooltipNode) {
			this.tooltipNode.hidePopup();
			this.tooltipNode= null;
		}
	}, true);

	// Public Object
	return {

	};
})();