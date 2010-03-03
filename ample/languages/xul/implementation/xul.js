/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULNamespace	= new AMLNamespace;
oXULNamespace.windowIndex	= 1;
oXULNamespace.tooltipPane	= null;

// Register language
ample.domConfig.setNamespace("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", oXULNamespace);

// XUL load handler
ample.addEventListener("load",		function(oEvent) {
	for (var nIndex = 0, aElements = oEvent.target.getElementsByTagNameNS(oXULNamespace.namespaceURI, "*"), oElement; oElement = aElements[nIndex]; nIndex++) {
   		// refresh boxed elements
   		if (oElement.viewType == cXULElement.VIEW_TYPE_BOXED)
			oElement.refresh();

		switch (oElement.localName) {
			case "broadcaster":	// broadcast
			case "command":		// resend commands
				for (var sName in oElement.attributes)
					if (oElement.attributes.hasOwnProperty(sName))
						oElement.setAttribute(sName, oElement.attributes[sName]);
				break;
		}
	}
}, false);

// XUL command handler
ample.addEventListener("command",	function(oEvent) {
//	var oElement	= this.getElementById(oEvent.target.getAttribute("command"));
//	if (oElement)
//		oElement.$handleEvent(oEvent);
},	false);

//
ample.addEventListener("click",	function(oEvent) {
	for (var oElement = oEvent.target, oPopup; oElement.nodeType != AMLNode.DOCUMENT_NODE; oElement = oElement.parentNode) {
		if (oElement.$isAccessible()) {
			if (oEvent.button == 2) {
		        if (oElement.attributes["context"]) {
		            if (oPopup = this.getElementById(oElement.attributes["context"])) {
		                oPopup.showPopup(oElement, oEvent.clientX, oEvent.clientY, cXULPopupElement.POPUP_TYPE_POPUP);
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
		                oPopup.showPopup(oElement, oEvent.clientX, oEvent.clientY, cXULPopupElement.POPUP_TYPE_POPUP);
			    		this.popupNode	= oPopup;
			    	}
		            oEvent.preventDefault();
		            break;
	        	}
	        }
		}
	}
}, true);

ample.addEventListener("mousedown",	function(oEvent) {
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
	// manage windows stack
	for (var oElement = oEvent.target, oStyle; oElement; oElement = oElement.parentNode)
		if (oElement instanceof cXULElement_window || oElement instanceof cXULElement_dialog || oElement instanceof cXULElement_wizard)
			if ((oStyle = oElement.$getContainer().style) && (oStyle.zIndex < oXULNamespace.windowIndex))
				oStyle.zIndex	= ++oXULNamespace.windowIndex;
}, true);

ample.addEventListener("mouseenter",	function(oEvent) {
	for (var oElement = oEvent.target, oTooltip; oElement.nodeType != AMLNode.DOCUMENT_NODE; oElement = oElement.parentNode) {
		if (oElement.$isAccessible()) {
		    if (oElement.attributes["tooltiptext"]) {
		    	oTooltip	= oXULNamespace.tooltipPane;
		    	if (!oTooltip)	{
		    		oTooltip	= this.documentElement.appendChild(this.createElementNS(oElement.namespaceURI, "xul:tooltip-pane"));
		    		oTooltip.$getContainer().style.position	= "absolute";
		    		oXULNamespace.tooltipPane	= oTooltip;
		    	}
				oTooltip.setText(oElement.attributes["tooltiptext"]);
	        	oTooltip.showPopup(null, oEvent.clientX, oEvent.clientY + 18, cXULPopupElement.POPUP_TYPE_TOOLTIP);
	    		this.tooltipNode	= oTooltip;
		    }
		    else
		    if (oElement.attributes["tooltip"]) {
		    	oTooltip	= this.getElementById(oElement.attributes["tooltip"]);
		    	if (oTooltip) {
		    		oTooltip.showPopup(null, oEvent.clientX, oEvent.clientY + 18, cXULPopupElement.POPUP_TYPE_TOOLTIP);
		    		this.tooltipNode	= oElement;
		    	}
		    }
		}
	}
}, true);

ample.addEventListener("mouseleave",	function(oEvent) {
	if (this.tooltipNode)	{
		this.tooltipNode.hidePopup();
		this.tooltipNode	= null;
	}
}, true);
