/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

(function () {


var oXULNamespace	= new AMLNamespace;
oXULNamespace.windowIndex	= 1;
oXULNamespace.tooltipPane	= null;

ample.domConfig.setNamespace("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", oXULNamespace);

ample.addEventListener("load",		function(oEvent) {
	for (var nIndex = 0, aElements = oEvent.target.getElementsByTagNameNS(oXULNamespace.namespaceURI, "*"), oElement; oElement = aElements[nIndex]; nIndex++) {
   		   		if (oElement.viewType == cXULElement.VIEW_TYPE_BOXED)
			oElement.refresh();

		switch (oElement.localName) {
			case "broadcaster":				case "command":						for (var sName in oElement.attributes)
					oElement.setAttribute(sName, oElement.attributes[sName]);
				break;
		}
	}
}, false);

ample.addEventListener("command",	function(oEvent) {
},	false);

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
		if (this.popupNode && !(oEvent.target == this.popupNode ||(oEvent.target.compareDocumentPosition(this.popupNode) & AMLNode.DOCUMENT_POSITION_CONTAINS))) {
		this.popupNode.hidePopup();
		this.popupNode	= null;

				oEvent.stopPropagation();
	}
		if (this.tooltipNode) {
		this.tooltipNode.hidePopup();
		this.tooltipNode= null;
	}
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



var cXULElement	= function(){};

cXULElement.VIEW_TYPE_VIRTUAL	= 0;    cXULElement.VIEW_TYPE_BOXED		= 1;    cXULElement.VIEW_TYPE_NORMAL	= 2;    
cXULElement.prototype	= new AMLElement;
cXULElement.prototype.AMLElement	= new AMLElement;
cXULElement.prototype.viewType		= cXULElement.VIEW_TYPE_NORMAL;

cXULElement.prototype.setAttribute	= function(sName, sValue)
{
	this._setAttribute(sName, sValue);

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement.prototype._setAttribute	= function(sName, sValue)
{
	var oElementDOM	= this.$getContainer();
	switch (sName)
	{
		case "hidden":
	        	        if (this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
	        {
	            if (this.parentNode.attributes["orient"] != "vertical")
	                oElementDOM.parentNode.style.display   =(sValue == "true" ? "none" : "");
	            else
	                oElementDOM.parentNode.parentNode.style.display    =(sValue == "true" ? "none" : "");

	            	            this.parentNode.refresh();
	        }
	        	        oElementDOM.style.display   =(sValue == "true" ? "none" : "");
    		break;

		case "orient":
			break;

		case "debug":
			break;

		case "flex":
	        this.attributes[sName]	= sValue;
	        if (this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
	            this.parentNode.refresh();
			break;

		case "pack":
						break;

		case "align":
						break;

		case "width":
		case "height":
	    	if (this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
	    		oElementDOM.parentNode[sName] = sValue;
	    	else
		        oElementDOM.style[sName]  = sValue;
			break;

		case "src":
	        	        oElementDOM.src  = sValue;
	        break;

		case "label":
	        var sHtml   = "";
	        if (this.attributes["image"])
	            sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle" border="0"/> ';
	        sHtml  += sValue;
	        oElementDOM.innerHTML    = sHtml;
	        break;

		case "image":
	        var sHtml   = '<img src="' + sValue + '" align="absmiddle" border="0"/> ';
	        if (this.attributes["label"])
	            sHtml  += this.attributes["label"];
	        oElementDOM.innerHTML    = sHtml;
	        break;
	}
};

cXULElement.prototype.doCommand		= function()
{
        var oEvent = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("command", true, true);
	this.dispatchEvent(oEvent);
};

cXULElement.prototype.$isAccessible	= function()
{
	return this.getAttribute("disabled") != "true";
};

cXULElement.prototype.refresh   = function()
{
	var nLength	= this.childNodes.length;
    if (nLength)
    {
    	var oElement;
        var nFlex       = 0,
        	nElements   = 0,
           	nVirtual 	= 0;

                for (var nIndex = 0; nIndex < nLength; nIndex++)
        {
			oElement	= this.childNodes[nIndex];
            if (oElement.namespaceURI == this.namespaceURI && oElement.nodeType == AMLNode.ELEMENT_NODE && oElement.viewType != cXULElement.VIEW_TYPE_VIRTUAL)
            {
                nElements++;
                if (oElement.hasAttribute("flex") && !isNaN(oElement.attributes["flex"]))
                    nFlex  += parseInt(oElement.attributes["flex"]);
            }
        }

                if (nElements)
        {
            var oElementDOM    = this instanceof cXULElement_row ? document.getElementById("box_" + this.parentNode.parentNode.uniqueID) : document.getElementById((this instanceof cXULElement_box ? "" : "box_") + this.uniqueID);
            for (var nIndex = 0; nIndex < nLength; nIndex++)
            {
            	oElement	= this.childNodes[nIndex];
            	if (oElement.nodeType != AMLNode.ELEMENT_NODE)
            		nVirtual++;
            	else
                if (oElement.viewType != cXULElement.VIEW_TYPE_VIRTUAL)
                {
                    if (this.attributes["orient"] == "vertical")
                    {
                                                if (!isNaN(oElement.attributes["flex"]))
                            oElementDOM.tBodies[0].rows[nIndex - nVirtual].cells[0].setAttribute("height",  Math.ceil(oElement.attributes["flex"] * 100 / nFlex) + "%");
                        else
                        if (oElement.attributes["height"])
                            oElementDOM.tBodies[0].rows[nIndex - nVirtual].cells[0].setAttribute("height", oElement.attributes["height"]);
                    }
                    else
                    {
                                                if (!isNaN(oElement.attributes["flex"]))
                            oElementDOM.tBodies[0].rows[0].cells[nIndex - nVirtual].setAttribute("width", Math.ceil(oElement.attributes["flex"] * 100 / nFlex) + "%");
                        else
                        if (oElement.attributes["width"])
                            oElementDOM.tBodies[0].rows[0].cells[nIndex - nVirtual].setAttribute("width", oElement.attributes["width"]);
                    }
                }
            }
                        if (nFlex)
                oElementDOM.setAttribute(this.attributes["orient"] == "vertical" ? "height" : "width", "100%");
        }
    }
};

cXULElement.prototype.getBoxObject	= function()
{
	return this.$getContainer("box");
};

cXULElement.prototype.setBoxObjectParam	= function(sName, sValue)
{
	if (this.parentNode.attributes["orient"] == "vertical")
		this.getBoxObject().parentNode[sName]	= sValue;
	else
		this.getBoxObject()[sName]	= sValue;
};

cXULElement.prototype.getBoxObjectParam	= function(sName)
{
	if (this.parentNode.attributes["orient"] == "vertical")
		return this.getBoxObject().parentNode[sName];
	else
		return this.getBoxObject()[sName];
};

cXULElement.prototype.$getTag		= function()
{
	var aHtml	= [];

		if (this.viewType != cXULElement.VIEW_TYPE_VIRTUAL)
		aHtml[aHtml.length]	= this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(this.attributes.id || this.uniqueID)+ '"');

		if (this.viewType == cXULElement.VIEW_TYPE_BOXED || this instanceof cXULElement_grid)
		aHtml[aHtml.length]	= cXULElement.getBoxOpen(this);

	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
	{
				if (this.viewType == cXULElement.VIEW_TYPE_BOXED || this instanceof cXULElement_row)
			aHtml[aHtml.length]	= cXULElement.getBoxOpenChild(this.childNodes[nIndex]);

		aHtml[aHtml.length]	= this.childNodes[nIndex].$getTag();

				if (this.viewType == cXULElement.VIEW_TYPE_BOXED || this instanceof cXULElement_row)
			aHtml[aHtml.length]	= cXULElement.getBoxCloseChild(this.childNodes[nIndex]);
	}

		if (this.viewType == cXULElement.VIEW_TYPE_BOXED || this instanceof cXULElement_grid)
		aHtml[aHtml.length]	= cXULElement.getBoxClose(this);

		if (this.viewType != cXULElement.VIEW_TYPE_VIRTUAL)
		aHtml[aHtml.length]	= this.$getTagClose();

	return aHtml.join("");
};

cXULElement.getBoxOpen	= function(oElement)
{
    var aHtml   = ['<table cellpadding="0" cellspacing="0" border="0" id="' + (oElement instanceof cXULElement_box ? "" : "box_") + oElement.uniqueID + '"'];

    if (oElement.attributes["orient"] == "vertical")
    {
                if (oElement.attributes["width"])
			aHtml[aHtml.length]	= ' width="' + oElement.attributes["width"] + '"';
        else
        if (!oElement.attributes["align"] || oElement.attributes["align"] == "stretch")
			aHtml[aHtml.length]	= ' width="100%"';

                if (oElement.attributes["height"])
			aHtml[aHtml.length]	= ' height="' + oElement.attributes["height"] + '"';
    }
    else
    {
                if (oElement.attributes["height"])
			aHtml[aHtml.length]	= ' height="' + oElement.attributes["height"] + '"';
        else
        if (!oElement.attributes["align"] || oElement.attributes["align"] == "stretch")
			aHtml[aHtml.length]	= ' height="100%"';

                if (oElement.attributes["width"])
			aHtml[aHtml.length]	= ' width="' + oElement.attributes["width"] + '"';
    }
	aHtml[aHtml.length]	= ' class="xul-box xul-' +(oElement.attributes["orient"] == "vertical" ? 'v' : 'h')+ 'box"';
	aHtml[aHtml.length]	= '><tbody>';

    if (oElement.attributes["orient"] != "vertical")
		aHtml[aHtml.length]	= '<tr>';

    return aHtml.join('');
};

cXULElement.getBoxOpenChild = function(oElement)
{
    var aHtml   = [];
    if (oElement.parentNode.attributes["orient"] == "vertical")
    {
        aHtml.push('<tr style="');
		if (oElement.nodeType == AMLNode.ELEMENT_NODE)
		{
	        if (oElement.attributes["hidden"] == "true")
				aHtml[aHtml.length]	= 'display:none;';
	        if (oElement.viewType == cXULElement.VIEW_TYPE_VIRTUAL)
				aHtml[aHtml.length]	= 'position:absolute;height:0;top:0;left:0;z-index:1;';
		}
		aHtml[aHtml.length]	= '">';
    }
	aHtml[aHtml.length]	= '<td';
	if (oElement.nodeType == AMLNode.ELEMENT_NODE)
	{
	    	    var sHtml1  = "left";
	    var sHtml2  = "top";
	    if (oElement.attributes["orient"] == "vertical")
	    {
	        if (oElement.attributes["pack"])
	            sHtml2  = oElement.attributes["pack"]  == "start" ? "top"  : oElement.attributes["pack"]  == "end" ? "bottom" : "center";
	        if (oElement.attributes["align"])
	            sHtml1  = oElement.attributes["align"] == "start" ? "left" : oElement.attributes["align"] == "end" ? "right"  : "center";
	    }
	    else
	    {
	        if (oElement.attributes["align"])
	            sHtml2  = oElement.attributes["align"] == "start" ? "top"  : oElement.attributes["align"] == "end" ? "bottom" : "center";
	        if (oElement.attributes["pack"])
	            sHtml1  = oElement.attributes["pack"]  == "start" ? "left" : oElement.attributes["pack"]  == "end" ? "right"  : "center";
	    }
		aHtml[aHtml.length]	= ' valign="' + sHtml2 + '" align="' + sHtml1 + '"';

	    if (oElement.parentNode.attributes["orient"] != "vertical")
	    {
			aHtml[aHtml.length]	= ' style="';
	        if (oElement.attributes["hidden"] == "true")
				aHtml[aHtml.length]	= 'display:none;';
	        if (oElement.viewType == cXULElement.VIEW_TYPE_VIRTUAL)
				aHtml[aHtml.length]	= 'position:absolute;width:0;top:0;left:0;z-index:1;';
		    else
		    	aHtml[aHtml.length]	= 'height:100%;';
	        aHtml[aHtml.length]	= '"';
	    }
	}

        if (oElement.parentNode.attributes["debug"] == "true")
		aHtml[aHtml.length]	= ' class="xul-box-debug-true xul-' + (oElement.parentNode.attributes["orient"] != "vertical" ? "h" : "v") + 'box-debug-true"';

	aHtml[aHtml.length]	= '>';

    return aHtml.join('');
};

cXULElement.getBoxCloseChild    = function(oElement)
{
    return '</td>' +(oElement.parentNode.attributes["orient"] == "vertical" ? '</tr>' : '');
};

cXULElement.getBoxClose         = function(oElement)
{
    return (oElement.attributes["orient"] != "vertical" ? '</tr>' : '')+ '</tbody></table>';
};

oXULNamespace.setElement("#element", cXULElement);



var cXULPopupElement	= function(){};
cXULPopupElement.prototype	= new cXULElement;

cXULPopupElement.POPUP_TYPE_POPUP	= 0;
cXULPopupElement.POPUP_TYPE_TOOLTIP	= 1;
cXULPopupElement.POPUP_TYPE_MODAL	= 2;
cXULPopupElement.POPUP_TYPE_BUBBLE	= 3;

cXULPopupElement.prototype.popupType	= cXULPopupElement.POPUP_TYPE_POPUP;

cXULPopupElement.prototype.showPopup	= function(oElement, nLeft, nTop, nType, oAnchor, sAlign)
{
        if (this._fireEventOnPopup("showing") == false)
        return;

    this.popupType = nType;

        this.$getContainer().style.display	= "block";
	if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
		this.setCapture(true);

    if ((!isNaN(nLeft) && nLeft !=-1) || (!isNaN(nTop) && nTop != -1))
    {
    	var oPosition	= this.ownerDocument.documentElement.getBoundingClientRect();
    	var oPosition2	= this.getBoundingClientRect();
    	if (oPosition2.bottom - oPosition2.top + nTop > oPosition.bottom - oPosition.top)
    		nTop	-= oPosition2.bottom - oPosition2.top;
    	if (oPosition2.right - oPosition2.left + nLeft > oPosition.right - oPosition.left)
    		nLeft	-= oPosition2.right - oPosition2.left;
        this.moveTo(nLeft, nTop);
    }
    else
    if (oElement)
    {
        var oPosition  = oElement.getBoundingClientRect();
		switch (this.getAttribute("position"))
		{
			case "after_start":
	            	            this.moveTo(oPosition.left, oPosition.bottom);
	            break;

			case"after_end":
	            	            break;

			case"before_start":
	            	            break;

			case"before_end":
	            	            break;

			case"end_after":
	            	            break;

			case"end_before":
	            	            break;

			case"start_after":
	            	            break;

			case"start_before":
	            	            break;

			case"overlap":
	            	            break;
        }
    }

    if (navigator.userAgent.match(/MSIE ([\d\.]+)/)) {
    	if (RegExp.$1 < 7) {
    		var oPosition2	= this.getBoundingClientRect();
    		this.$getContainer("shadow-right").style.height	= (oPosition2.bottom - oPosition2.top - 3)+ "px";
    		this.$getContainer("shadow-bottom").style.width	= (oPosition2.right - oPosition2.left - 3)+ "px";
    	}
    }
    else {
	    		this.$getContainer().style.opacity	= "0";
		this.$play("opacity:1", 100, 1);
    }

	this.setAttribute("hidden", "false");

        this._fireEventOnPopup("shown");
};

cXULPopupElement.prototype.hidePopup	= function()
{
        if (this._fireEventOnPopup("hiding") == false)
        return;

	this.setAttribute("hidden", "true");

        this.$getContainer().style.display	= "none";

	if (this.popupType == cXULPopupElement.POPUP_TYPE_MODAL)
		this.releaseCapture();

        this._fireEventOnPopup("hidden");
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

cXULPopupElement.prototype._fireEventOnPopup	= function(sName)
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("popup" + sName, false, true);

    return this.dispatchEvent(oEvent);
};



var cXULSelectElement	= function(){};
cXULSelectElement.prototype	= new cXULElement;

cXULSelectElement.prototype.currentItem		= null; cXULSelectElement.prototype.selectedItems	= null;

cXULSelectElement.prototype.selectAll	= function()
{
        if (!this._fireEventOnBeforeSelect())
        return;

        if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
        return;

    this.selectedItems  = new AMLNodeList;
    for (var nIndex = 0; nIndex < this.items.length; nIndex++)
    {
        this.items[nIndex].setAttribute("selected", "true");
        this.selectedItems.$add(this.items[nIndex]);
    }

        this._fireEventOnSelect();
};

cXULSelectElement.prototype.clearSelection	= function()
{
        if (!this._fireEventOnBeforeSelect())
        return;

    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
        this.selectedItems[nIndex].setAttribute("selected", "false");
    this.selectedItems  = new AMLNodeList;

        this._fireEventOnSelect();
};

cXULSelectElement.prototype.selectItem	= function(oElement)
{
        if (!this._fireEventOnBeforeSelect())
        return;

    for (var nIndex = 0; nIndex < this.selectedItems.length; nIndex++)
        this.selectedItems[nIndex].setAttribute("selected", "false");
    this.selectedItems  = new AMLNodeList;

    oElement.setAttribute("selected", "true");

    this.selectedItems.$add(oElement);

    this.currentItem    = oElement;

    
        this._fireEventOnSelect();
};

cXULSelectElement.prototype.toggleItemSelection	= function(oElement)
{
        if (!this._fireEventOnBeforeSelect())
        return;

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

        this._fireEventOnSelect();
};

cXULSelectElement.prototype.addItemToSelection	= function(oElement)
{
        if (!this._fireEventOnBeforeSelect())
        return;

        if (this.getAttribute("type") == "radio" || this.getAttribute("seltype") == "single")
        if (this.selectedItems.length)
            return;

    oElement.setAttribute("selected", "true");
    this.selectedItems.$add(oElement);

        this._fireEventOnSelect();
};


cXULSelectElement.prototype.removeItemFromSelection	= function(oElement)
{
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

        this._fireEventOnSelect();
};

cXULSelectElement.prototype.selectItemRange	= function(oElement1, oElement2)
{
        if (!this._fireEventOnBeforeSelect())
        return;

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

cXULSelectElement.prototype._fireEventOnBeforeSelect	= function()
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("beforeselect", false, true);
    return this.dispatchEvent(oEvent);
};

cXULSelectElement.popup	= null;

cXULSelectElement.getSettingsPopup	= function(oInstance) {
	var oPopup	= cXULSelectElement.popup;
		if (!oPopup) {
		oPopup	= oInstance.ownerDocument.documentElement.appendChild(oInstance.ownerDocument.createElementNS(oInstance.namespaceURI, "xul:menupopup"));
				oPopup.addEventListener("DOMActivate", function(oEvent) {
			oPopup.opener.items[oEvent.target.parentNode.childNodes.$indexOf(oEvent.target)].setAttribute("hidden", oEvent.target.getAttribute("checked") == "true" ? "false" : "true");
		}, false);
		cXULSelectElement.popup	= oPopup;
	}
		if (oPopup.parentNode != oInstance) {
		oInstance.appendChild(oPopup);
				oInstance.$getContainer("container").appendChild(oPopup.$getContainer());
				oPopup.opener	= oInstance;

				while (oPopup.firstChild)
			oPopup.removeChild(oPopup.firstChild);

				for (var nIndex = 0, oItem; nIndex < oInstance.items.length; nIndex++) {
			oItem	= oInstance.ownerDocument.createElementNS(oInstance.namespaceURI, "xul:menuitem");
			oItem.setAttribute("type", "checkbox");
			oPopup.appendChild(oItem);
			oItem.setAttribute("label", oInstance.items[nIndex].getAttribute("label"));
			if (oInstance.items[nIndex].getAttribute("hidden") != "true")
				oItem.setAttribute("checked", "true");
			if (!oInstance.items[nIndex].hasAttribute("width"))
				oItem.setAttribute("disabled",  "true");
		}
	}

	return cXULSelectElement.popup;
};



var cXULElement_arrowscrollbox	= function()
{
        this._interval  = null;
};
cXULElement_arrowscrollbox.prototype	= new cXULElement;
cXULElement_arrowscrollbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_arrowscrollbox.attributes	= {};
cXULElement_arrowscrollbox.attributes.width	= "200";
cXULElement_arrowscrollbox.attributes.height	= "200";

cXULElement_arrowscrollbox.prototype._interval	= null;

cXULElement_arrowscrollbox.prototype.scrollByIndex	= function(nLines)
{
	throw new AMLException(AMLException.NOT_SUPPORTED_ERR);
};

cXULElement_arrowscrollbox.prototype._onInterval  = function(sName, nSign)
{
    this.$getContainer("gateway")[sName == "vertical" ? "scrollTop" : "scrollLeft"]+= 3 * nSign;
};

cXULElement_arrowscrollbox.prototype._onButtonOver    = function(oEvent, sName, nSign)
{
    var oSelf	= this;
    this._interval = setInterval(function() {
    	oSelf._onInterval(sName, nSign);
    }, 30);
};

cXULElement_arrowscrollbox.prototype._onButtonOut     = function(oEvent)
{
    this._interval = clearInterval(this._interval);
};

cXULElement_arrowscrollbox.prototype.$getTagOpen	= function()
{
    var sHtml = '<table cellpadding="0" cellspacing="0" border="0" class="xul-arrowscrollbox">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    if (this.attributes["orient"] == "vertical")
    {
        sHtml  += '<td height="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-up xul-arrowscrollbox-button-up-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'vertical\', -1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\'); ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
        sHtml  += '</tr><tr>';
    }
    else
        sHtml  += '<td width="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-left xul-arrowscrollbox-button-left-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'horizontal\', -1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\'); ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
    sHtml  += '<td>';
    sHtml  += '<div class="xul-arrowscrollbox--gateway" style="position:relative; height:' +(this.attributes["height"] -(this.attributes["orient"] == "vertical" ? 18 : 0))+ '; width:' +(this.attributes["width"] -(this.attributes["orient"] != "vertical" ? 18 : 0))+ '; overflow:hidden;">';

    return sHtml;
};

cXULElement_arrowscrollbox.prototype.$getTagClose	= function()
{
    var sHtml   = '</div>';
    sHtml  += '</td>';
    if (this.attributes["orient"] == "vertical")
    {
        sHtml  += '</tr><tr>';
        sHtml  += '<td height="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-down xul-arrowscrollbox-button-down-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'vertical\', 1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\');ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
    }
    else
        sHtml  += '<td width="1" class="xul-arrowscrollbox-button xul-arrowscrollbox-button-normal xul-arrowscrollbox-button-right xul-arrowscrollbox-button-right-normal" onmouseover="this.className=this.className.replace(/normal/g, \'hover\'); ample.$instance(this)._onButtonOver(event, \'horizontal\', 1);" onmouseout="this.className=this.className.replace(/hover/g, \'normal\');ample.$instance(this)._onButtonOut(event);"><div><br /></div></td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

oXULNamespace.setElement("arrowscrollbox", cXULElement_arrowscrollbox);



var cXULElement_box	= function(){};
cXULElement_box.prototype	= new cXULElement;
cXULElement_box.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_box.prototype.$getContainer	= function(sName)
{
	return sName == "gateway" ? this.$getContainer("box") : document.getElementById(this.uniqueID);
};

oXULNamespace.setElement("box", cXULElement_box);



var cXULElement_broadcaster	= function(){};
cXULElement_broadcaster.prototype    = new cXULElement;
cXULElement_broadcaster.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

cXULElement_broadcaster.prototype.setAttribute   = function(sName, sValue)
{
        if (sName != "id" && sName != "persist")
    {
    	var aElements	= this.ownerDocument.getElementsByAttribute("observes", this.getAttribute("id"));
        for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
        	aElements[nIndex].setAttribute(sName, sValue);
        this.AMLElement.setAttribute.call(this, sName, sValue);
    }
};

oXULNamespace.setElement("broadcaster", cXULElement_broadcaster);



var cXULElement_broadcasterset	= function(){};
cXULElement_broadcasterset.prototype	= new cXULElement;
cXULElement_broadcasterset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;


oXULNamespace.setElement("broadcasterset", cXULElement_broadcasterset);



var cXULElement_button	= function(){};
cXULElement_button.prototype	= new cXULElement;
cXULElement_button.prototype.tabIndex	= 0;

cXULElement_button.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "disabled")
    {
        this.$getContainer().disabled = sValue == "true";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_button.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"click":	function(oEvent) {
		this.doCommand();
	}
};

cXULElement_button.prototype.$getTagOpen	= function()
{
    var sHtml   = '<button class="xul-button' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '"';
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' style="';
    if (this.attributes["width"])
        sHtml  += 'width:'+this.attributes["width"]+';';
    if (this.attributes["height"])
        sHtml  += 'height:'+this.attributes["height"]+';';
    sHtml  += '">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

cXULElement_button.prototype.$getTagClose	= function()
{
    return '</button>';
};

oXULNamespace.setElement("button", cXULElement_button);



var cXULElement_caption	= function(){};
cXULElement_caption.prototype	= new cXULElement;
cXULElement_caption.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

cXULElement_caption.prototype.setAttribute	= function(sName, sValue)
{
        if (!(this.parentNode instanceof cXULElement_groupbox))
        return;

    if (sName == "label")
    {
        this.parentNode.$getContainer("caption").innerHTML =(oElement.attributes["image"] ? '<img src="' + oElement.attributes["image"] + '" align="absmiddle" /> ' : '')+ sValue;
    }
    else
    if (sName == "image")
    {
        this.parentNode.$getContainer("caption").innerHTML = '<img src="' + sValue + '" align="absmiddle" /> ' + (this.attributes["label"] ? this.attributes["label"] : '');
    }
    else
    if (sName == "hidden")
    {
        this.parentNode.$getContainer("caption").style.display = sValue == "true" ? "none" : "";
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_caption.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.parentNode.$getContainer("caption").innerHTML	= (this.hasAttribute("image") ? '<img src="' + this.getAttribute("image") + '" align="absmiddle" /> ' : '')+(this.hasAttribute("label") ? this.getAttribute("label") : '');
		if (this.getAttribute("hidden") != "true")
			this.parentNode.$getContainer("caption").style.display = "";
	}
};

oXULNamespace.setElement("caption", cXULElement_caption);



var cXULElement_checkbox	= function(){};
cXULElement_checkbox.prototype	= new cXULElement;
cXULElement_checkbox.prototype.tabIndex	= 0;


cXULElement_checkbox.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
    }
    else
    if (sName == "value")
    {
        this.$getContainer("input").checked  =(sValue == "on" ? true : false);
        this.attributes["checked"]      =(sValue == "on" ? "true" : "false");
    }
    else
    if (sName == "checked")
    {
        this.$getContainer("input").checked  =(sValue == "true" ? true : false);
        this.attributes["value"]        =(sValue == "true" ? "on" : "off");
    }
    else
    if (sName == "label")
    {
        this.$getContainer("label").innerHTML = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_checkbox.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

cXULElement_checkbox.prototype._onChange = function(oEvent)
{
    this.attributes["checked"]  = this.$getContainer("input").checked.toString();
    this.attributes["value"]    = this.attributes["checked"] == "true" ? "on" : "off";

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_checkbox.prototype.$getTagOpen		= function()
{
    var sHtml   = '<label class="xul-checkbox' + (this.attributes["disabled"] == "true" ? " xul-checkbox_disabled" : "") + '">';
    sHtml	+= '<input type="checkbox" name="' + this.attributes["name"] + '" class="xul-checkbox--input"';
    if (this.attributes["checked"] == "true" || this.attributes["value"] == "on")
    {
        sHtml  += ' checked="true"';
        this.attributes["checked"]  = "true";
        this.attributes["value"]    = "on";
    }
    else
    {
        this.attributes["checked"]  = "false";
        this.attributes["value"]    = "off";
    }
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' onclick="return ample.$instance(this)._onChange(event);" autocomplete="off" />';
    sHtml  += '<span class="xul-checkbox--label">' +(this.attributes["label"] ? this.attributes["label"] : '')+ '</span>';

    return sHtml;
};

cXULElement_checkbox.prototype.$getTagClose	= function()
{
    return '</label>';
};

oXULNamespace.setElement("checkbox", cXULElement_checkbox);



var cXULElement_colorpicker_pane  = function() {
        this.x  = 0;
    this.y  = 0;
    this.b  = 1;
};
cXULElement_colorpicker_pane.prototype	= new cXULPopupElement;

cXULElement_colorpicker_pane.attributes	= {};
cXULElement_colorpicker_pane.attributes.value	= "#FF0000";

cXULElement_colorpicker_pane.prototype.setAttribute	= function(sName, sValue)
{
	if (sName == "value") {
    	this._setColor(sValue);
    	this.$getContainer('value').value    = sValue;
	}

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_colorpicker_pane.prototype._moveTo	= function(sName, oPosition)
{
    if (oPosition.x)
        this.$getContainer(sName).style.left  = oPosition.x + "px";
    if (oPosition.y)
        this.$getContainer(sName).style.top   = oPosition.y + "px";
};

cXULElement_colorpicker_pane.prototype._setColor	= function(sColor)
{
    var oColor;
    if (oColor = cXULElement_colorpicker_pane._RGBtoXYB(sColor))
    {
        this.b  = oColor.b;
        this.x  = oColor.x;
        this.y  = oColor.y;

        this._moveTo('palette-pointer', {'x' : this.x - 9, 'y' : this.y - 9});

        this.$getContainer('color').style.backgroundColor   = sColor;

        this._setColorBrightness(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': 0}));
        this._setPaletteBrightness(this.b);

        this._moveTo('brightness-pointer',    {'y' : this.b * 255    - 2});
    }
};

cXULElement_colorpicker_pane.prototype._setColorBrightness	= function(sColor)
{
    this.$getContainer('brightness').style.backgroundColor   = sColor;
    this.$getContainer('brightness-shader').style.filter   = "progid:DXImageTransform.Microsoft.Gradient(startColorStr='" + sColor + "', endColorStr='#000000', gradientType='0');";
};

cXULElement_colorpicker_pane.prototype._setPaletteBrightness	= function(nBrightness)
{
        var oElementDOM	= this.$getContainer('palette-shader');
    oElementDOM.style.filter      = 'progid:DXImageTransform.Microsoft.alpha(opacity=' + nBrightness * 100 + ')';     oElementDOM.style.opacity     = nBrightness;     oElementDOM.style.MozOpacity  = nBrightness; };

cXULElement_colorpicker_pane.prototype._getComputedStyleByEvent	= function(oEvent, sName)
{
    var oPosition   = this.getBoundingClientRect(sName);
    var nPositionX  = oEvent.clientX - oPosition.left;
    var nPositionY  = oEvent.clientY - oPosition.top;

        nPositionX  = nPositionX < 0    ? 0 :(nPositionX > 255  ? 255   : nPositionX);
    nPositionY  = nPositionY < 0    ? 0 :(nPositionY > 255  ? 255   : nPositionY);

    return {'x' : nPositionX, 'y': nPositionY};
};

cXULElement_colorpicker_pane.prototype._setColorValue		= function(sColor)
{
    this.$getContainer('color').style.backgroundColor   = sColor;
    this.$getContainer('value').value = sColor;
};

cXULElement_colorpicker_pane.prototype._detachHandlers	= function()
{
	document.onmousemove  = null;
	document.onmouseup    = null;
};

cXULElement_colorpicker_pane.prototype._onInputChange	= function(oEvent, sValue)
{
    this._setColor(sValue);
};

cXULElement_colorpicker_pane.prototype._onPointersBrightnessMouseMove  = function(oEvent)
{
    var oPosition   = this._getComputedStyleByEvent(oEvent, 'brightness');
    this._moveTo('brightness-pointer', {'y' : oPosition.y - 3});

    this.b  = Math.round(100 * oPosition.y / 255) / 100;
    this._setPaletteBrightness(this.b);
    this._setColorValue(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': this.b}));
};

cXULElement_colorpicker_pane.prototype._onPointersBrightnessMouseDown  = function(oEvent)
{
	var oElement	= this;
	document.onmousemove  = function(e) {
		return oElement._onPointersBrightnessMouseMove(e || event)
	};
	document.onmouseup    = function() {
		oElement._detachHandlers();
	};
    this._onPointersBrightnessMouseMove(oEvent);
};

cXULElement_colorpicker_pane.prototype._onPointerPaletteMouseMove  = function(oEvent)
{
	var oPosition	= this._getComputedStyleByEvent(oEvent, "palette");
    this.x  = oPosition.x;
    this.y  = oPosition.y;

    this._moveTo('palette-pointer', {'x' : this.x - 9, 'y' : this.y - 9});
    this._setColorBrightness(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': 0}));
    this._setColorValue(cXULElement_colorpicker_pane._XYBtoRGB({'x': this.x, 'y': this.y, 'b': this.b}));
};

cXULElement_colorpicker_pane.prototype._onPointerPaletteMouseDown  = function(oEvent)
{
	var oElement	= this;
	document.onmousemove  = function(e) {
		return oElement._onPointerPaletteMouseMove(e || event)
	};
	document.onmouseup    = function() {
		oElement._detachHandlers();
	};
    this._onPointerPaletteMouseMove(oEvent);
};

cXULElement_colorpicker_pane.prototype.acceptDialog	= function()
{
    this.attributes.value  = this.$getContainer('value').value;

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("accept", false, false);
    this.dispatchEvent(oEvent);
};

cXULElement_colorpicker_pane.prototype.cancelDialog	= function()
{
	this.setAttribute(this.attributes.value);

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("cancel", false, false);
    this.dispatchEvent(oEvent);
};

cXULElement_colorpicker_pane.handlers	= {
	"DOMNodeInsertedIntoDocument":	function() {
		this._setColor(cXULElement_colorpicker_pane.attributes.value);
	}
};

cXULElement_colorpicker_pane.prototype.$getTagOpen	= function()
{
	return '<div class="xul-colorpicker-pane xul-menupopup' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<table cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td valign="top">\
							<div class="xul-colorpicker-pane--palette" style="position:relative;" onmousedown="ample.$instance(this)._onPointerPaletteMouseDown(event)">\
								<div class="xul-colorpicker-pane--palette-shader"><br /></div>\
								<div class="xul-colorpicker-pane--palette-pointer" style="position:absolute;"><br /></div>\
							</div>\
						</td>\
						<td align="center" valign="top" style="position:relative;display:block;">\
							<div style="width:39px" onmousedown="ample.$instance(this)._onPointersBrightnessMouseDown(event);">\
								<div class="xul-colorpicker-pane--brightness">\
									<div class="xul-colorpicker-pane--brightness-shader"><br /></div>\
								</div>\
								<div class="xul-colorpicker-pane--brightness-pointer" style="position:absolute;left:1px;"><br /></div>\
							</div>\
						</td>\
						<td valign="top">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">\
								<tbody>\
									<tr><td align="right"><div class="xul-colorpicker-pane--color"></div></td></tr>\
									<tr><td><br /></td></tr>\
									<tr><td><input autocomplete="no" type="text" value="#FF0000" maxlength="7" class="xul-colorpicker-pane--value" onchange="ample.$instance(this)._onInputChange(event, this.value)" onkeyup="ample.$instance(this)._onInputChange(event, this.value)" onselectstart="event.cancelBubble=true;" oncontextmenu="event.cancelBubble=true"/></td></tr>\
									<tr><td><br /></td></tr>\
									<tr><td><button type="button" onclick="ample.$instance(this).acceptDialog();" class="xul-colorpicker-pane--button-accept">OK</button></td></tr>\
									<tr><td height="3"></td></tr>\
									<tr><td><button type="button" onclick="ample.$instance(this).cancelDialog()" class="xul-colorpicker-pane--button-cancel">Cancel</button></td></tr>\
								</tbody>\
							</table>\
						</td>\
					</tr>\
				</tbody>\
			</table>\
		</div>';
};

cXULElement_colorpicker_pane.prototype.$getTagClose	= function()
{
	return '';
};

cXULElement_colorpicker_pane._XYBtoRGB = function(oXYB)
{
    var nH  = 360 / 256 * oXYB.x;
    var nS  = 1 - oXYB.y / 256;
    var nV  = 1 - oXYB.b;

    var nR, nG, nB;

    if (nS == 0)
        nR = nG = nB = nV;
    else
    {
        var nI  = Math.floor(nH / 60);
        var nF  = nH / 60 - nI;
        var nP  = nV *(1 - nS);
        var nQ  = nV *(1 - nS * nF);
        var nT  = nV *(1 - nS * (1 - nF));

		switch (nI)
		{
			case 0:		nR  = nV;	nG  = nT;	nB  = nP;	break;
			case 1:		nR  = nQ;	nG  = nV;	nB  = nP;	break;
			case 2:		nR  = nP;	nG  = nV;	nB  = nT;	break;
			case 3:		nR  = nP;	nG  = nQ;	nB  = nV;	break;
			case 4:		nR  = nT;	nG  = nP;	nB  = nV;	break;
        	default:	nR  = nV;	nG  = nP;	nB  = nQ;
        }
    }
    return '#' + this._toHex(nR * 256) + this._toHex(nG * 256) + this._toHex(nB * 256);
};

cXULElement_colorpicker_pane._RGBtoXYB = function(sColor)
{
    if (!sColor.match(/^#[0-9a-f]{6}$/i))
        return;

    var nR  = parseInt(sColor.substr(1, 2), 16);
    var nG  = parseInt(sColor.substr(3, 2), 16);
    var nB  = parseInt(sColor.substr(5, 2), 16);

    var nV  = Math.max(nR, nG, nB);
    var nX  = Math.min(nR, nG, nB);
    var nS  = (nV-nX) / nV;

    if (nS == 0)
        nH  = 0;

    var nRed    =(nV - nR) / (nV - nX);
    var nGreen  =(nV - nG) / (nV - nX);
    var nBlue   =(nV - nB) / (nV - nX);

    if (nR == nV)
        nH  =(nG == nX) ? 5 + nBlue   : 1 - nGreen;
    else
    if (nG == nV)
        nH  =(nB == nX) ? 1 + nRed    : 3 - nBlue;
    else
        nH  =(nR == nX) ? 3 + nGreen  : 5 - nRed;

    nH  /=  6;

    return {'x' : (nH * 255), 'y' : (255 - nS * 255), 'b' : 1 - nV / 255};
};

cXULElement_colorpicker_pane._toHex    = function(nValue)
{
    var sHexCharacters  = "0123456789ABCDEF";

    if (nValue < 0)
        return "00";
    if (nValue > 255)
        return "FF";
    else
        return sHexCharacters.charAt(Math.floor(nValue / 16)) + sHexCharacters.charAt(nValue % 16);
};

oXULNamespace.setElement("colorpicker-pane", cXULElement_colorpicker_pane);



var cXULElement_colorpicker	= function(){};
cXULElement_colorpicker.prototype	= new cXULElement;
cXULElement_colorpicker.prototype.tabIndex	= 0;

cXULElement_colorpicker.pane	= null;
cXULElement_colorpicker.hidden	= true;

cXULElement_colorpicker.attributes	= {};
cXULElement_colorpicker.attributes.value	= "";

cXULElement_colorpicker.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer("input").value = sValue;
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_colorpicker.prototype.toggle	= function(bState) {
	var oPane	= this.getPane();
	if (bState === true || (!arguments.length && cXULElement_colorpicker.hidden)) {
				oPane.setAttribute("value", this.getAttribute("value"));

				oPane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
		oPane.opener		= this;
	}
	else {
		oPane.hidePopup();
		oPane.opener		= null;
	}
};


cXULElement_colorpicker.prototype.getPane	= function() {
	var oPane	= cXULElement_colorpicker.pane;
	if (!oPane) {
				oPane	= this.ownerDocument.createElementNS(this.namespaceURI, "xul:colorpicker-pane");
		oPane.addEventListener("accept", function(oEvent) {
						this.hidePopup();

			this.opener.setAttribute("value", this.getAttribute("value"));

						var oEventChange	= this.ownerDocument.createEvent("UIEvent");
			oEventChange.initUIEvent("change", true, false, window, null);
			this.opener.dispatchEvent(oEventChange);

			this.opener	= null;
		}, false);
		oPane.addEventListener("cancel", function(oEvent) {
						this.hidePopup();

			this.opener	= null;
		}, false);
		oPane.addEventListener("popupshown", function(oEvent) {
			cXULElement_colorpicker.hidden	= false;
			this.ownerDocument.popupNode	= this;
		}, false);
		oPane.addEventListener("popuphidden", function(oEvent) {
			cXULElement_colorpicker.hidden	= true;
			this.ownerDocument.popupNode	= null;
		}, false);

		cXULElement_colorpicker.pane	= oPane;
	}
	if (oPane.parentNode != this)
		this.appendChild(oPane);
	return oPane;
};

cXULElement_colorpicker.prototype._onChange	= function(oEvent)
{
    this.attributes["value"]    = this.$getContainer("input").value;

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_colorpicker.prototype._onWidgetAccept	= function(oEvent)
{
	var oPopup	= this.getPane();

    oPopup.setAttribute("value", oEvent.target.getAttribute("value"));
    oPopup.focus();

        oPopup._fireEventOnChange();

		oPopup.toggle(false);
};

cXULElement_colorpicker.prototype._onWidgetCancel	= function(oEvent)
{
	var oPopup	= this.getPane();

		oPopup.toggle(false);
};

cXULElement_colorpicker.prototype._fireEventOnChange	= function()
{
        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_colorpicker.handlers	= {
	"mousedown":function(oEvent) {
		if (!this.$isAccessible())
			return;

				if (oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("button")) {
			this.toggle();
			if (this.ownerDocument.activeElement != this)
				this.focus();
			oEvent.preventDefault();
		}
	},
	"mouseenter":function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.$setPseudoClass("hover", true, "button");
	},
	"mouseleave":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.$setPseudoClass("hover", false, "button");
	},
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
    		case "Esc":
    		case "Tab":
            	this.toggle(false);
            	break;
    	}
	}
};

cXULElement_colorpicker.prototype.$getTagOpen	= function()
{
	return '<table class="xul-colorpicker' + (this.attributes["disabled"] == "true" ? " xul-colorpicker_disabled" : "") + '" cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-colorpicker--input" type="text" autocomplete="off" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] == "true" ? ' disabled="true"' : '') +' maxlength="7" onchange="ample.$instance(this)._onChange(event)" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" /></td>\
						<td valign="top"><div class="xul-colorpicker--button"/></td>\
					</tr>\
					<tr><td class="xul-colorpicker--gateway" colspan="2"></td></tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("colorpicker", cXULElement_colorpicker);



var cXULElement_column	= function(){};
cXULElement_column.prototype	= new cXULElement;


cXULElement_column.prototype.$getTagOpen	= function()
{
    return '<th class="xul-column">' +(this.attributes["label"] ? this.attributes["label"] : '');
};

cXULElement_column.prototype.$getTagClose	= function()
{
    return '</th>';
};

oXULNamespace.setElement("column", cXULElement_column);



var cXULElement_columns	= function(){};
cXULElement_columns.prototype	= new cXULElement;


cXULElement_columns.prototype.$getTagOpen	= function()
{
    return '<thead class="xul-columns">';
};

cXULElement_columns.prototype.$getTagClose	= function()
{
    return '</thead>';
};

oXULNamespace.setElement("columns", cXULElement_columns);



var cXULElement_command	= function(){};
cXULElement_command.prototype    = new cXULElement;
cXULElement_command.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

cXULElement_command.prototype.setAttribute   = function(sName, sValue)
{
        if (sName != "id" && sName != "persist")
    {
    	var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
        for (var nIndex = 0; nIndex < aElements.length; nIndex++)
            if (aElements[nIndex].attributes["command"] == this.getAttribute("id"))
                aElements[nIndex].setAttribute(sName, sValue);
        this.AMLElement.setAttribute.call(this, sName, sValue);
    }
};

oXULNamespace.setElement("command", cXULElement_command);



var cXULElement_commandset	= function(){};
cXULElement_commandset.prototype = new cXULElement;
cXULElement_commandset.prototype.viewType    = cXULElement.VIEW_TYPE_VIRTUAL;


oXULNamespace.setElement("commandset", cXULElement_commandset);



var cXULElement_datepicker_pane	= function() {
	var oDate	= new Date();
	this.current	= new Date(oDate.getFullYear(), oDate.getMonth(), oDate.getDate());
};

cXULElement_datepicker_pane.prototype	= new cXULPopupElement;

cXULElement_datepicker_pane.months	= [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];

cXULElement_datepicker_pane.prototype.current= null;	cXULElement_datepicker_pane.prototype.value	= null;
cXULElement_datepicker_pane.prototype.min	= null;
cXULElement_datepicker_pane.prototype.max	= null;

cXULElement_datepicker_pane.prototype.opener	= null;

cXULElement_datepicker_pane.prototype.refresh	= function() {
		this.$getContainer("days-pane").innerHTML	= cXULElement_datepicker_pane.$getTagDays(this, this.current);
	this.$getContainer("month").value	= this.current.getMonth();
	this.$getContainer("year").value	= this.current.getFullYear();
};

cXULElement_datepicker_pane.prototype._onSelectDay	= function(nDay) {
		this.current.setDate(nDay);
	var nMonth	= this.current.getMonth();
	var nYear	= this.current.getFullYear();

		var sValue	= nYear + '/' + (nMonth < 10 ? '0' : '') + (nMonth + 1) + '/' + (nDay < 10 ? '0' : '') + nDay;
	if (this.getAttribute("value") != sValue) {
		this.setAttribute("value", sValue);

				var oEvent	= ample.createEvent("UIEvent");
		oEvent.initUIEvent("change", true, false, window, null);
		this.dispatchEvent(oEvent);
	}
};

cXULElement_datepicker_pane.prototype._onSelectMonth	= function(nMonth) {
		this.current.setMonth(nMonth);

	this.$getContainer("days-pane").innerHTML	= cXULElement_datepicker_pane.$getTagDays(this, this.current);
};

cXULElement_datepicker_pane.prototype._onSelectYear	= function(nYear) {
		this.current.setYear(nYear);

	this.$getContainer("days-pane").innerHTML		= cXULElement_datepicker_pane.$getTagDays(this, this.current);
};

cXULElement_datepicker_pane.prototype._onDayOver	= function(oElement) {
	var nIndex	= oElement.className.indexOf("xul-datepicker-pane-day_hover");
	if (nIndex ==-1)
		oElement.className	= oElement.className + ' xul-datepicker-pane-day_hover';
};

cXULElement_datepicker_pane.prototype._onDayOut	= function(oElement) {
	var nIndex	= oElement.className.indexOf("xul-datepicker-pane-day_hover");
	if (nIndex !=-1)
		oElement.className	= oElement.className.substr(0, nIndex);
};

cXULElement_datepicker_pane.parseDateFromString	= function(sDate) {
	return new Date(sDate);
};

cXULElement_datepicker_pane.handlers	= {
	"click":		function(oEvent) {
		if (oEvent.target == this) {
			if (oEvent.$pseudoTarget == this.$getContainer("month-previous")) {
				var nYear	= this.current.getFullYear();
				this._onSelectMonth(this.current.getMonth() - 1);
				this.$getContainer("month").value	= this.current.getMonth();
				if (this.current.getFullYear() != nYear)
					this.$getContainer("year").value	= this.current.getFullYear();
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("month-next")) {
				var nYear	= this.current.getFullYear();
				this._onSelectMonth(this.current.getMonth() + 1);
				this.$getContainer("month").value	= this.current.getMonth();
				if (this.current.getFullYear() != nYear)
					this.$getContainer("year").value	= this.current.getFullYear();
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("year-previous")) {
				this._onSelectYear(this.current.getFullYear() - 1);
				this.$getContainer("year").value	= this.current.getFullYear();
			}
			else
			if (oEvent.$pseudoTarget == this.$getContainer("year-next")) {
				this._onSelectYear(this.current.getFullYear() + 1);
				this.$getContainer("year").value	= this.current.getFullYear();
			}
		}
	},
	"keydown":		function(oEvent) {
			},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			switch (oEvent.attrName) {
				case "min":
					if (oEvent.newValue)
						this.min	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
					else
						this.min	= null;
					this.refresh();
					break;

				case "max":
					if (oEvent.newValue)
						this.max	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
					else
						this.min	= null;
					this.refresh();
					break;

				case "value":
					if (oEvent.newValue) {
						this.value	= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
						this.current= cXULElement_datepicker_pane.parseDateFromString(oEvent.newValue);
					}
					else {
						this.value	= null;
					}
					this.refresh();
					break;
			}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
				var sValue	= this.getAttribute("value");
		if (sValue) {
			this.value	= cXULElement_datepicker_pane.parseDateFromString(sValue);
			this.current= cXULElement_datepicker_pane.parseDateFromString(sValue);
		}

		this.refresh();
	}
};

cXULElement_datepicker_pane.getWeekNum  = function(oDate) {
    var y = oDate.getFullYear();
    var m = oDate.getMonth() + 1;
    var d = 0;
        if (m < 3) {
      var a = y - 1;
      var b = (a / 4 | 0) - (a / 100 | 0) + (a / 400 | 0);
      var c = ( (a - 1) / 4 | 0) - ( (a - 1) / 100 | 0) + ( (a - 1) / 400 | 0);
      var s = b - c;
      var e = 0;
      var f = d - 1 + 31 * (m - 1);
    }
        else {
      var a = y;
      var b = (a / 4 | 0) - ( a / 100 | 0) + (a / 400 | 0);
      var c = ( (a - 1) / 4 | 0) - ( (a - 1) / 100 | 0) + ( (a - 1) / 400 | 0);
      var s = b - c;
      var e = s + 1;
      var f = d + ( (153 * (m - 3) + 2) / 5 | 0) + 58 + s;
    }
    var g = (a + b) % 7;
        var d = (f + g - e) % 7;
    var n = f + 3 - d;
    if (n < 0)
      var w = 53 - ( (g - s) / 5 | 0);
    else if (n > 364 + s)
      var w = 1;
    else
      var w = (n / 7 | 0) + 1;
    return w;
};



cXULElement_datepicker_pane.$getTagDays	= function(oInstance, oDate) {
	var aHtml  = [];

		aHtml.push('<table cellpadding="0" cellspacing="1" border="0">\
					<thead class="xul-datepicker-pane--header">\
						<tr>\
							 <td>W</td>\
							 <td class="xul-datepicker-pane-head-day">Mo</td>\
							 <td class="xul-datepicker-pane-head-day">Tu</td>\
							 <td class="xul-datepicker-pane-head-day">We</td>\
							 <td class="xul-datepicker-pane-head-day">Th</td>\
							 <td class="xul-datepicker-pane-head-day">Fr</td>\
							 <td class="xul-datepicker-pane-head-day">Sa</td>\
							 <td class="xul-datepicker-pane-head-day">Su</td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>');

	var nWeek   = cXULElement_datepicker_pane.getWeekNum(oDate, true);
		var nWeekDay	= new Date(oDate.getFullYear(), oDate.getMonth(), 1).getDay() - 1;
	if (nWeekDay < 0)
		nWeekDay	= 6;

	aHtml.push('<td align="center" valign="center"><div class="xul-datepicker-pane-week">' + nWeek + '</div></td>');
		for (var nIndex = 0; nIndex < nWeekDay; nIndex++)
		aHtml.push('<td><br /></td>');

	nWeek   = (nWeek >= 52) ? 0 : nWeek; 
	var nDays   = new Date(oDate.getFullYear(), oDate.getMonth() * 1 + 1, 0).getDate();

	for (var nIndex = 1, bDateDisabled, oDateCurrent; nIndex <= nDays; nIndex++)
	{
		oDateCurrent	= new Date(oDate.getFullYear(), oDate.getMonth(), nIndex);
		bDateDisabled	= (oInstance.min && oDateCurrent < oInstance.min) || (oInstance.max && oDateCurrent > oInstance.max);
		aHtml.push('	<td align="center" valign="center">\
							<div type="button"\
								class="' +(nWeekDay == 6 ? "xul-datepicker-pane-weekend" : 'xul-datepicker-pane-day') + (oInstance.value && oDateCurrent.getTime() == oInstance.value.getTime() ? ' xul-datepicker-pane-day_selected' : '') + '\
								' + (bDateDisabled ? ' xul-datepicker-pane-day_disabled" disabled="true"' : '" onclick="ample.$instance(this)._onSelectDay(' + nIndex + ')') + '" onmouseover="ample.$instance(this)._onDayOver(this)" onmouseout="ample.$instance(this)._onDayOut(this)"\
								>' + nIndex + '</div>\
						</td>');
		if ((nWeekDay == 6) && (nIndex < nDays))
		{
			nWeek++;
			if (nWeek == 53)
				nWeek   = (new Date(oDate.getFullYear(), 11, 31).getDay() < 3) ? 1 : nWeek;
			aHtml.push('</tr>\
						<tr>\
							<td align="center" valign="center"><div class="xul-datepicker-pane-week">' + nWeek + '</div></td>');
			nWeekDay  = 0;
		}
		else
			nWeekDay++;
	}

		for (var nIndex = nWeekDay; nIndex < 7; nIndex++)
		aHtml.push(			'<td><br /></td>');

	aHtml.push('		</tr>\
					</tbody>\
				</table>');

	return aHtml.join('');
};

cXULElement_datepicker_pane.prototype.$getTagOpen	= function() {
	var sHtml = '<div class="xul-datepicker-pane xul-menupopup' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + '">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<table cellpadding="0" cellspacing="0" border="0">\
				<thead>\
					<tr>\
						<td><div class="xul-datepicker-pane--month-previous">&lt;</div></td>\
						<td class="xul-datepicker-pane--months-pane" width="1">\
							<select onchange="ample.$instance(this)._onSelectMonth(this.value)" class="xul-datepicker-pane--month">';
	    for (var nIndex = 0; nIndex < 12; nIndex++)
        sHtml  += '<option value="' + nIndex + '">' + cXULElement_datepicker_pane.months[nIndex] + '</option>';

	sHtml+=	'						</select>\
						</td>\
						<td>\
							<table cellpadding="0" cellspacing="0" border="0" class="xul-datepicker-pane--years-pane">\
								<tbody>\
									<tr>\
										<td width="100%"><input type="text" autocomplete="off" style="border:0px solid white;width:100%;margin:0;" class="xul-datepicker-pane--year" onfocus="blur()"/></td>\
										<td valign="top"><div class="xul-datepicker-pane--year-previous" onmouseover="ample.$instance(this).$setPseudoClass(\'hover\', true, \'year-previous\')" onmouseout="ample.$instance(this).$setPseudoClass(\'hover\', false, \'year-previous\')"><br /></div><div class="xul-datepicker-pane--year-next" onmouseover="ample.$instance(this).$setPseudoClass(\'hover\', true, \'year-next\')" onmouseout="ample.$instance(this).$setPseudoClass(\'hover\', false, \'year-next\')"><br /></div></td>\
									</tr>\
								</tbody>\
							</table>\
						</td>\
						<td><div class="xul-datepicker-pane--month-next">&gt;</div></td>\
					</tr>\
				</thead>\
				<tbody>\
					<tr>\
						<td colspan="4" class="xul-datepicker-pane--days-pane"></td>\
					</tr>\
				</tbody>\
			</table>\
			</div>';

	return sHtml;
};

cXULElement_datepicker_pane.prototype.$getTagClose	= function() {
	return '';
};

oXULNamespace.setElement("datepicker-pane", cXULElement_datepicker_pane);



var cXULElement_datepicker	= function() {

};

cXULElement_datepicker.prototype  = new cXULElement;

cXULElement_datepicker.prototype.tabIndex	= 0;

cXULElement_datepicker.pane		= null;
cXULElement_datepicker.hidden	= true;

cXULElement_datepicker.prototype.getPane	= function() {
	var oPane	= cXULElement_datepicker.pane;
	if (!oPane) {
				oPane	= this.ownerDocument.createElementNS(this.namespaceURI, "xul:datepicker-pane");
		oPane.addEventListener("change", function(oEvent) {
						this.hidePopup();

			this.opener.setAttribute("value", this.getAttribute("value"));

						var oEventChange	= this.ownerDocument.createEvent("UIEvent");
			oEventChange.initUIEvent("change", true, false, window, null);
			this.opener.dispatchEvent(oEventChange);

			this.opener.focus();

			this.opener	= null;
		}, false);
		oPane.addEventListener("popupshown", function(oEvent) {
			cXULElement_datepicker.hidden	= false;
			this.ownerDocument.popupNode	= this;
		}, false);
		oPane.addEventListener("popuphidden", function(oEvent) {
			cXULElement_datepicker.hidden	= true;
			this.ownerDocument.popupNode	= null;
		}, false);

		cXULElement_datepicker.pane	= oPane;
	}

	if (oPane.parentNode != this)
		this.appendChild(oPane);

	return oPane;
};

cXULElement_datepicker.prototype.toggle	= function(bState) {
	var oPane	= this.getPane();
	if (bState === true || (!arguments.length && cXULElement_datepicker.hidden)) {
				oPane.setAttribute("min", this.getAttribute("min"));
		oPane.setAttribute("max", this.getAttribute("max"));
		oPane.setAttribute("value", this.getAttribute("value"));

				oPane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
		oPane.opener		= this;
	}
	else {
		oPane.hidePopup();
		oPane.opener		= null;
	}
};

cXULElement_datepicker.handlers	= {
	"mousedown":function(oEvent) {
		if (!this.$isAccessible())
			return;

				if (oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("button")) {
			this.toggle();
			if (this.ownerDocument.activeElement != this)
				this.focus();
			oEvent.preventDefault();
		}
	},
	"mouseenter":function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.$setPseudoClass("hover", true, "button");
	},
	"mouseleave":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.$setPseudoClass("hover", false, "button");
	},
	"keydown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (oEvent.keyIdentifier == "Esc")
			this.toggle(false);
	},
		"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			switch (oEvent.attrName) {
				case "value":
					this.$getContainer("input").value	= oEvent.newValue;
					break;

				case "min":
				case "max":
					break;

				case "disabled":
					this.$getContainer("input").disabled	= oEvent.newValue == "true";
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;
			}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.hasAttribute("accessKey"))
			this.accessKey	= this.getAttribute("accessKey");
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.hasAttribute("accessKey"))
			this.accessKey	= null;
	}
};

cXULElement_datepicker.prototype.$getTagOpen	= function() {
	return '<table class="xul-datepicker' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '') + (this.getAttribute('disabled') == "true" ? " xul-datepicker_disabled" : "") + '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ ' cellpadding="0" cellspacing="0" border="0">\
				<tbody>\
					<tr>\
						<td width="100%"><input type="text" maxlength="10" class="xul-datepicker--input"' + (this.hasAttribute("accessKey") ? ' accessKey="' + this.getAttribute("accessKey") + '"' : '')+ ' value="' + this.getAttribute("value") + '"' + (this.getAttribute('disabled') == "true" ? ' disabled="true"' : "") +' style="border:0px solid white;width:100%;" /></td>\
						<td valign="top"><div class="xul-datepicker--button"></div></td>\
					</tr>\
					<tr><td class="xul-datepicker--gateway" colspan="2"></td></tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("datepicker", cXULElement_datepicker);



var cXULElement_deck	= function(){};
cXULElement_deck.prototype	= new cXULElement;

cXULElement_deck.prototype.selectedIndex	=-1;
cXULElement_deck.prototype.selectedPanel	= null;

cXULElement_deck.attributes	= {};
cXULElement_deck.attributes.selectedIndex	= "0";

cXULElement_deck.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "selectedIndex")
    {
        if (this.childNodes.length > 0)
        {
            if (isNaN(sValue) || this.childNodes.length < sValue * 1)
                sValue  = "0";

            this.selectedIndex  = sValue * 1;
            this.selectedPanel  = this.childNodes[this.selectedIndex];

            for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
                this.childNodes[nIndex].setAttribute("hidden", this.selectedIndex == nIndex ? "false" : "true");

                        var oEvent  = this.ownerDocument.createEvent("Events");
            oEvent.initEvent("select", false, true);
            this.dispatchEvent(oEvent);
        }
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_deck.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (!isNaN(this.attributes["selectedIndex"]))
			this.setAttribute("selectedIndex", this.attributes["selectedIndex"]);
	}
};

cXULElement_deck.prototype.$getTagOpen	= function()
{
    return '<div class="xul-deck">';
};

cXULElement_deck.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("deck", cXULElement_deck);



var cXULElement_description	= function(){};
cXULElement_description.prototype    = new cXULElement;

cXULElement_description.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer().innerHTML    = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_description.prototype.$getTagOpen		= function()
{
    return '<div class="xul-description' +(this.attributes["class"] ? " " + this.attributes["class"] : '')+ '" style="width:100%;height:100%;">' + (this.attributes["value"] || "");
};

cXULElement_description.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("description", cXULElement_description);



var cXULElement_dialog	= function(){};
cXULElement_dialog.prototype	= new cXULElement;
cXULElement_dialog.prototype.$draggable	= true;
cXULElement_dialog.prototype.$resizable	= true;

cXULElement_dialog.attributes	= {};
cXULElement_dialog.attributes.orient	= "vertical";
cXULElement_dialog.attributes.buttons	= "accept" + "," + "cancel";
cXULElement_dialog.attributes.width		= "100%";
cXULElement_dialog.attributes.height	= "100%";

cXULElement_dialog.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
    {
        this.$getContainer("title").innerHTML = sValue;
    }
    else
    if (sName == "buttons")
    {
        this.$getContainer("button-help").style.display      = sValue.indexOf("help")    ==-1 ? "none" : "";
        this.$getContainer("button-cancel").style.display    = sValue.indexOf("cancel")  ==-1 ? "none" : "";
        this.$getContainer("button-accept").style.display    = sValue.indexOf("accept")  ==-1 ? "none" : "";
    }
    else
    if (sName == "buttonalign")
    {
        if (sValue == "start")
            this.$getContainer("foot").align  = "left";
        else
        if (sValue == "center")
            this.$getContainer("foot").align  = sValue;
        else
            this.$getContainer("foot").align  = "right";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_dialog.prototype.acceptDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogaccept", false, true);
    if (this.dispatchEvent(oEvent2))
        this.setAttribute("hidden", "true");
};

cXULElement_dialog.prototype.cancelDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogcancel", false, true);
    if (this.dispatchEvent(oEvent2))
        this.setAttribute("hidden", "true");
};

cXULElement_dialog.prototype.centerWindowOnScreen    = function()
{
	var oElementDOM	= this.$getContainer(),
    	oPosition	= this.getBoundingClientRect();
	oElementDOM.style.left	=(document.body.clientWidth - oPosition.right + oPosition.left) / 2;
	oElementDOM.style.top	=(document.body.clientHeight - oPosition.bottom + oPosition.top) / 2;
};

cXULElement_dialog.prototype._onButtonClick  = function(oEvent, sName)
{
    if (sName == "button-accept")
    {
        this.acceptDialog();
    }
    else
    if (sName == "button-cancel")
    {
        this.cancelDialog();
    }
    else
    if (sName == "button-help")
    {
        var oEvent2    = this.ownerDocument.createEvent("Events");
        oEvent2.initEvent("dialoghelp", false, true);
        this.dispatchEvent(oEvent2);
    }
};

cXULElement_dialog.handlers	= {
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();

	}
};

cXULElement_dialog.prototype.$getTagOpen	= function()
{
	return '<table class="xul-dialog'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0"' +
				(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '') +
				(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '') +
				(this.attributes["hidden"] == "true" ? ' style="display:none;"' : '') + '>\
				<thead ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<tr>\
						<th class="xul-dialog--head" height="1">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%">\
								<tbody>\
									<tr>\
										<td class="xul-dialog--title">' +(this.attributes["title"] || " ")+ '</td>\
									</tr>\
								</tbody>\
							</table>\
						</th>\
					</tr>\
				</thead>\
				<tbody>\
					<tr>\
						<td class="xul-dialog--body">';
};

cXULElement_dialog.prototype.$getTagClose	= function()
{
	return 				'</td>\
					</tr>\
				</tbody>\
				<tfoot>\
					<tr>\
						<td class="xul-dialog--foot" align="' +(this.attributes["buttonalign"] == "start" ? "left" : this.attributes["buttonalign"] == "center" ? "center" : "right")+ '">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%">\
								<tbody>\
									<tr>\
										<td width="100%"><button class="xul-dialog--button-help" style="' +(this.attributes["buttons"].indexOf("help") ==-1 ? 'display:none;' : '')+ '" onclick="ample.$instance(this)._onButtonClick(event, \'button-help\')">Help</button></td>\
										<td><button class="xul-dialog--button-accept" style="' +(this.attributes["buttons"].indexOf("accept") ==-1 ? 'display:none;' : '')+ '" onclick="ample.$instance(this)._onButtonClick(event, \'button-accept\')">OK</button></td>\
										<td><button class="xul-dialog--button-cancel" style="' +(this.attributes["buttons"].indexOf("cancel") ==-1 ? 'display:none;' : '')+ '" onclick="ample.$instance(this)._onButtonClick(event, \'button-cancel\')">Cancel</button></td>\
									</tr>\
								</tbody>\
							</table>\
						</td>\
					</tr>\
				</tfoot>\
			</table>';
};

oXULNamespace.setElement("dialog", cXULElement_dialog);



var cXULElement_dialogheader	= function(){};
cXULElement_dialogheader.prototype	= new cXULElement;

cXULElement_dialogheader.attributes	= {};
cXULElement_dialogheader.attributes.height	= "1";

cXULElement_dialogheader.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
        this.$getContainer("title").innerHTML = sValue || " ";
    else
    if (sName == "description")
        this.$getContainer("description").innerHTML = sValue || " ";
    else
        this._setAttribute(sName, sValue);

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_dialogheader.prototype.$getTagOpen	= function()
{
	return '<table cellpadding="0" cellspacing="0" border="0" width="100%">\
				<tbody>\
					<tr><td valign="top" class="xul-dialogheader"><div class="xul-dialogheader--title">' +(this.attributes["title"] || " ")+ '</div><div class="xul-dialogheader--description">' +(this.attributes["description"] || " ")+ '</div></td></tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("dialogheader", cXULElement_dialogheader);



var cXULElement_editor	= function(){};
cXULElement_editor.prototype = new cXULElement;
cXULElement_editor.prototype.tabIndex	= 0;

cXULElement_editor.attributes	= {};
cXULElement_editor.attributes.value	= "";

cXULElement_editor.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer("input").innerHTML = sValue;
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
    }
    else
    if (sName == "mode")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_editor.prototype._updatePanel= function(oEvent)
{

};

cXULElement_editor.prototype._onKeyDown  = function(oEvent)
{

};

cXULElement_editor.prototype._onChange   = function(oEvent)
{
    this.attributes["value"]   = this.$getContainer("input").innerHTML;

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_editor.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

cXULElement_editor.prototype.$getTagOpen	= function()
{
    var sHtml   = '<div class="xul-editor">';
    sHtml  += '<div contenteditable="'+'true" onclick="ample.$instance(this)._updatePanel(event)" onkeydown="ample.$instance(this)._onKeyDown(event)" onselectstart="event.cancelBubble=true;" style="';
    sHtml  += 'width:' + (this.attributes["width"] ? this.attributes["width"] : '100%') + ';';
    sHtml  += 'height:' + (this.attributes["height"] ? this.attributes["height"] : '100') + ';';
    sHtml  += 'overflow:scroll;" class="xul-editor--input">' + this.attributes["value"] + '</div>';
    sHtml  += '</div>';

    return sHtml;
};

cXULElement_editor.prototype.$getTagClose	= function()
{
    return '';
};

oXULNamespace.setElement("editor", cXULElement_editor);



var cXULElement_grid	= function()
{
    this.cols   = new AMLNodeList;
    this.rows   = new AMLNodeList;
};
cXULElement_grid.prototype	= new cXULElement;

cXULElement_grid.attributes	= {};
cXULElement_grid.attributes.orient	= "vertical";


oXULNamespace.setElement("grid", cXULElement_grid);



var cXULElement_groupbox	= function(){};
cXULElement_groupbox.prototype	= new cXULElement;

cXULElement_groupbox.attributes	= {};
cXULElement_groupbox.attributes.orient	= "vertical";


cXULElement_groupbox.prototype.$getTagOpen		= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '')+ '' +(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '')+ ' class="xul-groupbox' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
    sHtml  += '<thead>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-groupbox-head-left"></td>';
    sHtml  += '<td class="xul-groupbox-head"><span class="xul-groupbox--caption xul-caption" style="display:none;"></span></td>';
    sHtml  += '<td class="xul-groupbox-head-right"></td>';
    sHtml  += '</tr>';
    sHtml  += '</thead>';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-groupbox-body-left"></td>';
    sHtml  += '<td height="100%" class="xul-groupbox-body">';

    return sHtml;
};

cXULElement_groupbox.prototype.$getTagClose	= function()
{
    var sHtml   = '</td>';
    sHtml  += '<td class="xul-groupbox-body-right"></td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '<tfoot>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-groupbox-foot-left"></td>';
    sHtml  += '<td class="xul-groupbox-foot"></td>';
    sHtml  += '<td class="xul-groupbox-foot-right"></td>';
    sHtml  += '</tr>';
    sHtml  += '</tfoot>';
    sHtml  += '</table>';

    return sHtml;
};

oXULNamespace.setElement("groupbox", cXULElement_groupbox);



var cXULElement_hbox	= function(){};
cXULElement_hbox.prototype	= new cXULElement_box;

cXULElement_hbox.attributes	= {};
cXULElement_hbox.attributes.orient	= "horizontal";

oXULNamespace.setElement("hbox", cXULElement_hbox);



var cXULElement_iframe	= function(){};
cXULElement_iframe.prototype = new cXULElement;
cXULElement_iframe.prototype.tabIndex	= 0;

cXULElement_iframe.prototype.contentDocument	= null;
cXULElement_iframe.prototype.contentWindow		= null;


cXULElement_iframe.prototype._onLoad     = function(oEvent)
{
    this.contentWindow		= this.$getContainer().contentWindow;
    this.contentDocument	= this.$getContainer().contentDocument;

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("load", false, false);
    this.dispatchEvent(oEvent);
};

cXULElement_iframe.prototype._onUnLoad   = function(oEvent)
{
	this.contentWindow		= null;
	this.contentDocument	= null;

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("unload", false, false);
    this.dispatchEvent(oEvent);
};

cXULElement_iframe.prototype.$getTagOpen	= function()
{
    return '<iframe class="xul-iframe" height="' +(this.attributes["height"] || '100%')+ '" width="' +(this.attributes["width"] || '100%')+ '" src="' +(this.attributes["src"] || 'about:blank') + '" frameborder="0" border="0" scrolling="no" onload="ample.$instance(this)._onLoad(event)" onunload="ample.$instance(this)._onUnLoad(event)">';
};

cXULElement_iframe.prototype.$getTagClose	= function()
{
    return '</iframe>';
};

oXULNamespace.setElement("iframe", cXULElement_iframe);



var cXULElement_image	= function(){};
cXULElement_image.prototype  = new cXULElement;


cXULElement_image.prototype._onLoad  = function(oEvent)
{
        var oEvent2 = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("load", false, false);
    this.dispatchEvent(oEvent2);
};

cXULElement_image.prototype.$getTagOpen	= function()
{
    return '<img class="xul-image' +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '')+(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '')+(this.attributes["src"] ? ' src="' + this.attributes["src"] + '"' :'')+ ' onload="ample.$instance(this)._onLoad(event)"/>';
};

oXULNamespace.setElement("image", cXULElement_image);



var cXULElement_key	= function(){};
cXULElement_key.prototype	= new cXULElement;
cXULElement_key.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

cXULElement_key.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "keytext")
    {
    	var aElements	= this.ownerDocument.getElementsByAttribute("key", this.getAttribute("id"));
        for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
        	if (aElements[nIndex].namespaceURI == this.namespaceURI)
	        	aElements[nIndex].setAttribute("acceltext", sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_key._handleKeyDown	= function(oEvent, oElement)
{
		if (oElement.hasAttribute("modifiers"))
	{
		var aModifiers	= oElement.getAttribute("modifiers").replace(/,/g, " ").split(" ");
		for (var nIndex = 0; nIndex < aModifiers.length; nIndex++)
		{
			switch (aModifiers[nIndex])
			{
				case "shift":	if (!oEvent.shiftKey)	return;	break;
				case "alt":		if (!oEvent.altKey)		return;	break;
				case "meta":	if (!oEvent.metaKey)	return;	break;
				case "control":	if (!oEvent.ctrlKey)	return;	break;
			}
		}
	}

		if (oElement.hasAttribute("key"))
		if (oEvent.keyIdentifier != oElement.getAttribute("key"))
			return;

			if (oElement.hasAttribute("keycode"))
		if (oElement.getAttribute("keycode") != oEvent.keyCode)
			return;

		oElement.doCommand();
};

cXULElement_key.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oElement	= oEvent.target;
		this.ownerDocument.addEventListener("keydown", function(oEvent){cXULElement_key._handleKeyDown(oEvent, oElement)}, false);
	}
};

oXULNamespace.setElement("key", cXULElement_key);



var cXULElement_keyset	= function(){};
cXULElement_keyset.prototype	= new cXULElement;
cXULElement_keyset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;


oXULNamespace.setElement("keyset", cXULElement_keyset);



var cXULElement_label	= function(){};
cXULElement_label.prototype  = new cXULElement;

cXULElement_label.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer().innerText    = sValue;
    }
    else
    if (sName == "control")
    {
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_label.prototype.$getTagOpen	= function()
{
    return '<label class="xul-label' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '">' +(this.attributes["value"] ? this.attributes["value"] : '');
};

cXULElement_label.prototype.$getTagClose	= function()
{
    return '</label>';
};

oXULNamespace.setElement("label", cXULElement_label);



var cXULElement_listbody	= function(){};
cXULElement_listbody.prototype   = new cXULElement;


cXULElement_listbody.prototype._onScroll = function()
{
    if (this.parentNode.head)
        this.parentNode.head.$getContainer("area").scrollLeft  = this.$getContainer("area").scrollLeft;
};

cXULElement_listbody.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.body = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.body = null;
	}
};

cXULElement_listbody.prototype.$getTagOpen	= function()
{
	return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
				<td style="height:100%">\
					<div class="xul-listbody--area" style="height:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this)._onScroll(event)">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-listbody" style="position:absolute;' + (navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 == 7 ? 'border-left: solid 18px white;margin-left:-18px;' : '') + '">\
							<tbody class="xul-listbody--gateway">';
};

cXULElement_listbody.prototype.$getTagClose	= function()
{
    var sHtml   = '</tbody>';
    if (this.parentNode.firstChild instanceof cXULElement_listhead)
    {
        sHtml  += '<tfoot class="xul-listbody--foot">';
        sHtml  += '<tr>';
        if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
            sHtml  += '<td width="20"><div style="width:20px;"/></td>';
        for (var nIndex = 0, aItems = this.parentNode.firstChild.childNodes; nIndex < aItems.length; nIndex++)
            sHtml  += '<td' + (aItems[nIndex].attributes["width"] ? ' width="' + aItems[nIndex].attributes["width"] + '"' : '') + '><div style="height:1px;' + (aItems[nIndex].attributes["minwidth"] ? 'width:' + aItems[nIndex].attributes["minwidth"] + 'px' : '') + '"/></td>';
        sHtml  += '</tr>';
        sHtml  += '</tfoot>';
    }
    sHtml  += '</table>';
    sHtml  += '</div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';

    return sHtml;
};

oXULNamespace.setElement("listbody", cXULElement_listbody);



var cXULElement_listbox	= function()
{
        this.items  = new AMLNodeList;
	this.selectedItems	= new AMLNodeList;
};
cXULElement_listbox.prototype    = new cXULSelectElement;
cXULElement_listbox.prototype.tabIndex	= 0;
cXULElement_listbox.prototype.$selectable	= false;

cXULElement_listbox.prototype.head	= null; cXULElement_listbox.prototype.body	= null; 
cXULElement_listbox.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "disabled")
    {
            }
    else
    if (sName == "type")
    {
                    }
    else
    if (sName == "seltype")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_listbox.prototype.sort   = function(nCell, bDir)
{
        if (this.attributes["type"] != "radio" && this.attributes["type"] != "checkbox")
        nCell++;

    if (this.items.length)
    {
		var aElements	= [];
		for (var nIndex = 0; nIndex < this.items.length; nIndex++)
			aElements.push(this.items[nIndex]);
		aElements.sort(function(oElement1, oElement2){return oElement1.cells[nCell-1].attributes["label"] > oElement2.cells[nCell-1].attributes["label"] ? bDir ? 1 :-1 : oElement1.cells[nCell-1].attributes["label"] == oElement2.cells[nCell-1].attributes["label"] ? 0 : bDir ?-1 : 1;});
		this.items	= new AMLNodeList;
		for (var nIndex = 0; nIndex < aElements.length; nIndex++)
			this.items.$add(aElements[nIndex]);

        var oElementDOM	= this.body.$getContainer("gateway");
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        {
            oElementDOM.appendChild(this.items[nIndex].$getContainer());
            if (this.items[nIndex].attributes["selected"] == "true")
                this.items[nIndex].setAttribute("selected", "true");
        }
    }
        if (this.currentItem)
    	this.currentItem.focus();
};

cXULElement_listbox.handlers	= {
	"keydown":	function(oEvent) {
	    if (this.currentItem)
	    {
	        if (oEvent.keyIdentifier == "Up")
	        {
	            	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;
	            if (nIndex > 0)
	            {
	                if (oEvent.shiftKey)
	                {
	                    	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex > this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex++;

	                    this.toggleItemSelection(this.items[nIndex-1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex-1]);

	                	                this.scrollToIndex(nIndex-1);
	            }

	            	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Down")
	        {
	            	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;
	            if (nIndex < this.items.length-1)
	            {
	                if (oEvent.shiftKey)
	                {
	                    	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex < this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex--;

	                    this.toggleItemSelection(this.items[nIndex+1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex+1]);

	                	                this.scrollToIndex(nIndex+1);
	            }

	            	            oEvent.preventDefault();
	        }
    	}
	}
};

cXULElement_listbox.prototype.$getTagOpen		= function()
{
    return '<table class="xul-listbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0" height="' +(this.attributes["height"] ? this.attributes["height"] : '100%')+ '" width="' +(this.attributes["width"] ? this.attributes["width"] : '100%')+ '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '')+ '>\
    			<tbody class="xul-listbox--gateway">';
};

cXULElement_listbox.prototype.$getTagClose	= function()
{
    return 		'</tbody>\
    		</table>';
};

oXULNamespace.setElement("listbox", cXULElement_listbox);



var cXULElement_listcell	= function(){};
cXULElement_listcell.prototype	= new cXULElement;


cXULElement_listcell.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listitem)
			this.parentNode.cells.$add(oEvent.target);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listitem)
			this.parentNode.cells.$remove(oEvent.target);
	}
}

cXULElement_listcell.prototype.$getTagOpen	= function()
{
    var sHtml   = '<td class="xul-listcell"><div class="xul-listcell--gateway">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

cXULElement_listcell.prototype.$getTagClose	= function()
{
    return '</div></td>';
};

oXULNamespace.setElement("listcell", cXULElement_listcell);



var cXULElement_listcol	= function(){};
cXULElement_listcol.prototype    = new cXULElement;

cXULElement_listcol.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "sortDirection")
    {
            }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_listcol.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listcols)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listcols)
			this.parentNode.items.$remove(this);
	}
};

cXULElement_listcol.prototype.$getTagOpen	= function()
{
    return '<td class="xul-listcol"><img height="1"/></td>';
};

oXULNamespace.setElement("listcol", cXULElement_listcol);



var cXULElement_listcols	= function()
{
        this.items  = new AMLNodeList;
};
cXULElement_listcols.prototype	= new cXULElement;


cXULElement_listcols.prototype.$getTagOpen	= function()
{
    return '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-listcols">\
				<tbody>\
					<tr>';
};

cXULElement_listcols.prototype.$getTagClose	= function()
{
	return			'</tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("listcols", cXULElement_listcols);



var cXULElement_listhead	= function()
{
        this.items  = new AMLNodeList;
};
cXULElement_listhead.prototype   = new cXULElement;

cXULElement_listhead.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "hidden")
    {
            }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_listhead.prototype._getPrimaryColIndex   = function()
{
    for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        if (this.items[nIndex].attributes["primary"] == "true")
            return nIndex;
    return -1;
};

cXULElement_listhead.prototype._onCommandClick   = function(oEvent)
{
    if (this.parentNode.attributes["type"] == "checkbox")
    {
        if (this.$getContainer("command").checked)
            this.parentNode.selectAll();
        else
            this.parentNode.clearSelection();
    }
    else
    if (this.parentNode.attributes["type"] == "radio")
    {
        if (this.$getContainer("command").checked)
            this.parentNode.clearSelection();
    }
};

cXULElement_listhead.handlers	= {
	"click":	function(oEvent) {
		if (oEvent.button == 2 || (oEvent.button == 0 && oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("settings"))) {
			var oPopup	= cXULSelectElement.getSettingsPopup(this);
			oPopup.showPopup(this, 0, 0, cXULPopupElement.POPUP_TYPE_POPUP);

			if (oEvent.button == 2) {
								var oPositionPopup	= oPopup.getBoundingClientRect();
								oPopup.moveTo(	oEvent.clientX - oPositionPopup.left,
								oEvent.clientY - oPositionPopup.top);

								oEvent.preventDefault();
			}
			else {
								var oPositionPopup	= oPopup.getBoundingClientRect(),
					oPositionSelf	= this.getBoundingClientRect();
								oPopup.moveTo(	oPositionSelf.right - oPositionPopup.right,
			 					oPositionSelf.bottom - oPositionPopup.top);
			}

			this.ownerDocument.popupNode	= oPopup;
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.head = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.head = null;
	}
};

cXULElement_listhead.prototype.$getTagOpen	= function()
{
    return '<tr' + (this.attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>\
				<td class="xul-listhead--container">\
					<div class="xul-listheader" style="float:right"><div class="xul-listheader--label"><div class="xul-listhead--settings"><br /></div></div></div>\
					<div class="xul-listhead--area" style="height:18px;overflow:hidden;position:relative;">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" style="height:18px;position:absolute;" class="xul-listhead">\
							<thead>\
								<tr class="xul-listhead--gateway">' +
    								(this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio"
    								? ('<th class="xul-listheader" style="width:20px">' +
        								(this.parentNode.attributes["type"] == "checkbox"
        								? '<input type="checkbox" name="' + this.parentNode.uniqueID + '_cmd" class="xul-listheader--command" onclick="return ample.$instance(this)._onCommandClick(event)" autocomplete="off" />'
										: (this.parentNode.attributes["type"] == "radio"
											? '<input type="radio" name="' + this.parentNode.uniqueID + '_cmd" class="xul-listheader--command" checked="true" onclick="return ample.$instance(this)._onCommandClick(event)"/>'
											: ' ')) +
										'</th>')
									: '');
};

cXULElement_listhead.prototype.$getTagClose	= function()
{
	return 						'</tr>\
							</thead>\
						</table>\
					</div>\
				</td>\
			</tr>';
};

oXULNamespace.setElement("listhead", cXULElement_listhead);



var cXULElement_listheader	= function(){};
cXULElement_listheader.prototype	= new cXULElement;
cXULElement_listheader.prototype.$hoverable	= true;

cXULElement_listheader.prototype._sortDir	= "none";

cXULElement_listheader.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "hidden")
    {
    	var nCell	= this.parentNode.items.$indexOf(this);
    	this.$getContainer().style.display	= sValue == "true" ? "none" : "";
        for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
        	aItems[nIndex].cells[nCell].setAttribute(sName, sValue);
        this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + 1].style.display	= sValue == "true" ? "none" : "";
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_listheader.handlers	= {
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		this.$setPseudoClass("active", true);
	},
	"mouseup":		function(oEvent) {
		this.$setPseudoClass("active", false);
	},

	"click":		function(oEvent) {
	    if (oEvent.button < 2)
	    {
	        this._sortDir   = this._sortDir != "asc" ? "asc" : "desc";
	        this.parentNode.parentNode.sort(this.$getContainer().cellIndex, this._sortDir == "asc");
	    }
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listhead)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listhead)
			this.parentNode.items.$remove(this);
	}
};

cXULElement_listheader.prototype.$getTagOpen	= function()
{
	return '<th class="xul-listheader' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : "")+ ' align="left">\
    			<div class="xul-listheader--label"' + (this.attributes["minwidth"] ? ' style="width:' + this.attributes["minwidth"] + 'px"' : '') + '> ' + (this.attributes["label"] || "");
};

cXULElement_listheader.prototype.$getTagClose	= function()
{
	return		'</div>\
    		</th>';
};

oXULNamespace.setElement("listheader", cXULElement_listheader);



var cXULElement_listitem	= function()
{
        this.cells  = new AMLNodeList;
};
cXULElement_listitem.prototype   = new cXULElement;
cXULElement_listitem.prototype.$hoverable	= true;

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

cXULElement_listitem.handlers	= {
	"mousedown":	function(oEvent) {
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
		    		    if (this.parentNode.parentNode.selectedItems.$indexOf(this) !=-1)
			    this.parentNode.parentNode.removeItemFromSelection(this);

			this.parentNode.parentNode.items.$remove(this);
		}
	}
};

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

cXULElement_listitem.prototype.$getTagClose	= function()
{
	return '</tr>';
};

oXULNamespace.setElement("listitem", cXULElement_listitem);




var cXULElement_menu	= function(){};
cXULElement_menu.prototype	= new cXULElement;

cXULElement_menu.prototype.$hoverable	= true;

cXULElement_menu.prototype.$isAccessible	= function() {
	return true;
};

cXULElement_menu.prototype.menupopup	= null;	
cXULElement_menu.prototype.setAttribute	= function(sName, sValue)
{
	if (sName == "open")
	{
			}
	else
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
    	if (this.parentNode instanceof cXULElement_menupopup)
    		this.$setPseudoClass("selected", sValue == "true", "arrow");
    }
	else
    if (sName == "label")
    {
        this.$getContainer("label").innerHTML   = sValue;
	}
	else
	if (sName == "image")
	{
        if (this.parentNode instanceof cXULElement_menupopup)
            this.$getContainer("control").style.backgroundImage   = "url(" + sValue + ")";
	}
	else
	if (sName == "disabled")
	{
    	this.$setPseudoClass("disabled", sValue == "true");
    	if (this.parentNode instanceof cXULElement_menupopup)
    		this.$setPseudoClass("disabled", sValue == "true", "arrow");
	}
	else
    	this._setAttribute(sName, sValue);

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_menu.handlers	= {
	"mouseenter":	function(oEvent) {
		if (this.parentNode.selectedItem || this.parentNode instanceof cXULElement_menupopup)
	   		this.parentNode.selectItem(this);
	},
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (oEvent.target == this && oEvent.button == 0)
			this.$activate();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$remove(this);
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target.parentNode instanceof cXULElement_menubar)
   			this.parentNode.selectItem(this.parentNode.selectedItem == this ? null : this);
	}
};

cXULElement_menu.prototype.$getTagOpen	= function()
{
    if (this.parentNode instanceof cXULElement_menupopup)
        return '<tr class="xul-menu' + (this.attributes["disabled"] == "true" ? " xul-menu_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
        			<td width="18"><div class="xul-menu--control"' +(this.attributes["image"] ? ' style="background-image:url('+ this.attributes["image"] + ')"' : '')+ '></div></td>\
        			<td nowrap="nowrap" class="xul-menu--label">' + (this.attributes["label"] || ' ')+ '</td>\
        			<td valign="top" class="xul-menupopup--gateway">';
    else
        return '	<td nowrap="nowrap" valign="center" class="xul-menu' + (this.attributes["disabled"] == "true" ? " xul-menu_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">' +
        				'<div class="xul-menu--label">' + (this.attributes["label"] || ' ') + '</div>\
        				<div class="xul-menu--gateway">';
};

cXULElement_menu.prototype.$getTagClose	= function()
{
    if (this.parentNode instanceof cXULElement_menupopup)
        return 		'</td>\
        			<td width="16"><div class="xul-menu--arrow' + (this.getAttribute("disabled") == "true" ? ' xul-menu--arrow_disabled' : '')+ '"><br /></div></td>\
        		</tr>';
    else
        return '		</div>\
        			</td>';
};

oXULNamespace.setElement("menu", cXULElement_menu);



var cXULElement_menubar	= function()
{
        this.items  = new AMLNodeList;
};
cXULElement_menubar.prototype	= new cXULElement;
cXULElement_menubar.prototype.tabIndex		= 0;
cXULElement_menubar.prototype.$selectable	= false;

cXULElement_menubar.prototype.selectedItem	= null;

cXULElement_menubar.attributes	= {};
cXULElement_menubar.attributes.active	= "false";

cXULElement_menubar.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "hidden")
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_menubar.prototype.selectItem	= function(oItem)
{
	if (this.selectedItem != oItem)
	{
	    	    if (this.selectedItem) {
			this.attributes["active"]	= "false";

	        if (this.selectedItem.menupopup)
	            this.selectedItem.menupopup.hidePopup();
	        this.selectedItem.setAttribute("selected", "false");
	    }

	    	    if (oItem) {
		    if (oItem.menupopup && oItem.$isAccessible()) {
	            oItem.menupopup.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	        	oItem.menupopup.addEventListener("popuphidden", function() {
	        		if (this.opener.attributes["active"] == "true")	{
						this.opener.selectedItem.setAttribute("selected", "false");
						this.opener.selectedItem.$setPseudoClass("hover", false);
						this.opener.selectedItem	= null;
					}
				   	this.removeEventListener("popuphidden", arguments.callee, false);

				    this.opener	= null;
				    this.ownerDocument.popupNode	= null;
	        	}, false);
	        		        	oItem.menupopup.opener	= this;
		        this.ownerDocument.popupNode	= oItem.menupopup;
			}

			this.attributes["active"]	= "true";

			oItem.setAttribute("selected", "true");
		}

	    this.selectedItem = oItem;
	}
};

cXULElement_menubar.prototype.$getTagOpen		= function()
{
	return '<div class="xul-menubar">\
    			<table cellpadding="0" cellspacing="0" border="0" width="100%">\
    				<tbody>\
    					<tr class="xul-menubar--gateway">';
};

cXULElement_menubar.prototype.$getTagClose	= function()
{
	return 					'<td width="100%"><br /></td>\
						</tr>\
					</tbody>\
    			</table>\
			</div>';
};

oXULNamespace.setElement("menubar", cXULElement_menubar);



var cXULElement_menuitem	= function(){};
cXULElement_menuitem.prototype	= new cXULElement;

cXULElement_menuitem.prototype.$hoverable	= true;

cXULElement_menuitem.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
    }
    else
    if (sName == "label")
    {
    	var oCell	= this.$getContainer().cells[1];
    	        if (document.namespaces)
        	oCell.innerText   = sValue;
        else
        	oCell.innerHTML   = sValue;
    }
    else
    if (sName == "image")
    {
        this.$getContainer("image").style.backgroundImage   = "url(" + sValue + ")";
    }
    else
    if (sName == "type")
    {
            }
    else
    if (sName == "checked")
    {
        if (this.attributes["type"] == "radio" && sValue == "true")
        {
                        var oElement	= this.parentNode;
            for (var nIndex = 0; nIndex < oElement.items.length; nIndex++)
                if (oElement.items[nIndex] instanceof cXULElement_menuitem && oElement.items[nIndex].attributes["type"] == "radio")
                    if (oElement.items[nIndex] != this && oElement.items[nIndex].attributes["name"] == this.attributes["name"])
                        oElement.items[nIndex].setAttribute("checked", "false");
        }
       	this.$setPseudoClass("checked", sValue == "true", "image");
    }
    else
    if (sName == "disabled")
    {
       	this.$setPseudoClass("disabled", sValue == "true");
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_menuitem.handlers	= {
	"mouseenter":	function(oEvent) {
		this.parentNode.selectItem(this);
	},
	"mouseleave":	function(oEvent) {
		this.parentNode.selectItem(null);
	},
	"click":	function(oEvent) {
			    if (!this.$isAccessible())
	        return;

		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$add(this);
		var oMenuList	= oParent.parentNode;
		if (oMenuList instanceof cXULElement_menulist)
			oMenuList.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menupopup || oParent instanceof cXULElement_menubar)
			oParent.items.$remove(this);
		var oMenuList	= oParent.parentNode;
		if (oMenuList instanceof cXULElement_menulist)
			oMenuList.items.$remove(this);
	},
	"DOMActivate":	function(oEvent) {
	    if (this.attributes["type"] == "checkbox")
	        this.setAttribute("checked", this.attributes["checked"] == "true" ? "false" : "true");
	    else
	    if (this.attributes["type"] == "radio")
	        this.setAttribute("checked", "true");

			    this.doCommand();
	}
}

cXULElement_menuitem.prototype.scrollIntoView	= function()
{
	var oElementDOM	= this.$getContainer(),
		oParentDOM	= oElementDOM.parentNode;

	if (oParentDOM.scrollTop > oElementDOM.offsetTop)
		oParentDOM.scrollTop	= oElementDOM.offsetTop - 1;
	if (oParentDOM.scrollTop < oElementDOM.offsetTop - oParentDOM.offsetHeight + oElementDOM.offsetHeight)
		oParentDOM.scrollTop	= oElementDOM.offsetTop - oParentDOM.offsetHeight + oElementDOM.offsetHeight + 3;
};

cXULElement_menuitem.prototype.$getTagOpen		= function()
{
	return '<tr class="xul-menuitem' + (this.attributes["disabled"] == "true" ? " xul-menuitem_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
				<td width="18"><div class="xul-menuitem-type---image' + (this.attributes["type"] ? ' xul-menuitem-type-' + this.attributes["type"] + '--image' +(this.attributes["checked"] == "true" ? ' xul-menuitem--image_checked' : '') : '') + '"' +(this.attributes["image"] ? ' style="background-image:url('+ this.attributes["image"] + ')"' : '')+ '></div></td>\
				<td nowrap="nowrap" style="white-space:nowrap;">' +(this.attributes["label"] || ' ');
};

cXULElement_menuitem.prototype.$getTagClose		= function()
{
	return		'</td>\
				<td width="2"></td>\
				<td width="16"><div style="width:16px;"><br /></div></td>\
			</tr>';
};

oXULNamespace.setElement("menuitem", cXULElement_menuitem);



var cXULElement_menulist	= function()
{
		this.items	  	= new AMLNodeList;
};
cXULElement_menulist.prototype   = new cXULElement;
cXULElement_menulist.prototype.tabIndex	= 0;

cXULElement_menulist.attributes	= {
	"value":	""
};


cXULElement_menulist.prototype.menupopup	= null;

cXULElement_menulist.prototype.selectedIndex	=-1;
cXULElement_menulist.prototype.selectedText		= null;
cXULElement_menulist.prototype.selectedItem		= null;	
cXULElement_menulist.hidden	= true;

cXULElement_menulist.prototype.$getValue	= function()
{
	return this.$getContainer("input").value;
};

cXULElement_menulist.prototype.$setValue	= function(sValue)
{
	this.$getContainer("input").value	= sValue;
};

cXULElement_menulist.prototype.setAttribute  = function(sName, sValue)
{
	if (sName == "value")
	{
		this.$setValue(sValue);
	}
	else
	if (sName == "disabled")
	{
		this.$setPseudoClass("disabled", sValue != '');
		this.$getContainer("input").disabled = sValue != '';
	}

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_menulist.prototype.select	= function()
{
	this.$getContainer("input").select();
};

cXULElement_menulist.prototype.appendItem	= function(sLabel, sValue)
{
	return this.insertItemAt(this.items.length, sLabel, sValue);
};

cXULElement_menulist.prototype.insertItemAt  = function(nIndex, sLabel, sValue)
{
	if (nIndex <= this.items.length)
	{
				var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, "xul:menuitem");
		if (nIndex < this.items.length - 1)
			this.menupopup.insertBefore(oElement, this.items[nIndex]);
		else
			this.menupopup.appendChild(oElement);
				oElement.setAttribute("label", sLabel);
		oElement.setAttribute("value", sValue);

		return oElement;
	}
	else
		throw new AMLException(AMLException.NOT_FOUND_ERR);
};

cXULElement_menulist.prototype.removeItemAt  = function(nIndex)
{
	if (this.items[nIndex])
		return this.menupopup.removeChild(this.items[nIndex]);
	else
		throw new AMLException(AMLException.NOT_FOUND_ERR);
};

cXULElement_menulist.prototype.select	= function()
{
	this.$getContainer("input").select();
};

cXULElement_menulist.prototype.toggle	= function(bState) {
	var oPane	= this.menupopup;
	if (bState === true || (!arguments.length && cXULElement_menulist.hidden)) {
				oPane.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
		oPane.opener		= this;
		cXULElement_menulist.hidden	= false;
	}
	else {
		oPane.hidePopup();
		oPane.opener		= null;
		cXULElement_menulist.hidden	= true;
	}
};

cXULElement_menulist.prototype._onChange = function(oEvent)
{
	var oInput  = this.$getContainer("input");

};

cXULElement_menulist.handlers	= {
	"mousedown":	function(oEvent) {
		if (this.getAttribute("disabled") == "true")
			return;

				if (oEvent.target == this && oEvent.button == 0 && oEvent.$pseudoTarget == this.$getContainer("button")) {
			this.toggle();
		}
	},
	"mouseenter":	function(oEvent) {
				this.$setPseudoClass("hover", true, "button");
	},
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("hover", false, "button");
	},
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Up":
				if (cXULElement_menulist.hidden)
					this.toggle(true);
				else {
					var nIndex  = this.selectedIndex;
					while (nIndex--> 0) {
						if (this.items[nIndex].$getContainer().style.display != "none") {
							if (this.items[this.selectedIndex])
								this.items[this.selectedIndex].setAttribute("selected", "false");
							this.items[nIndex].setAttribute("selected", "true");
							this.items[nIndex].scrollIntoView();
							this.selectedIndex = nIndex;
							break;
						}
					}
				}
				oEvent.preventDefault();
				break;

			case "Down":
				if (cXULElement_menulist.hidden)
					this.toggle(true);
				else
				{
					var nIndex  = this.selectedIndex;
					while (++nIndex < this.items.length) {
						if (this.items[nIndex].$getContainer().style.display != "none") {
							if (this.items[this.selectedIndex])
								this.items[this.selectedIndex].setAttribute("selected", "false");
							this.items[nIndex].setAttribute("selected", "true");
							this.items[nIndex].scrollIntoView();
							this.selectedIndex = nIndex;
							break;
						}
					}
				}
				oEvent.preventDefault();
				break;

			case "Esc":
				this.toggle(false);
				break;

			case "Enter":   				if (!cXULElement_menulist.hidden) {
					if (this.items[this.selectedIndex]) {
						this.selectedText	= this.items[this.selectedIndex].getAttribute("label");
						this.$setValue(this.selectedText);
					}
					this.toggle(false);
				}

								var oEvent2  = this.ownerDocument.createEvent("Events");
				oEvent2.initEvent("change", true, false);
				this.dispatchEvent(oEvent2);

								oEvent.preventDefault();
		}
	},
	"keyup":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Esc":
			case "Enter":
			case "Tab":
				return;

			case "Up":
			case "Down":
			case "Left":
			case "Right":
				return;
		}

		var sSelectedText	= this.$getContainer("input").value;
		if (this.selectedText == sSelectedText)
			return;

				var nOptions	= 0,
			bFound;
		for (var nIndex = 0; nIndex < this.items.length; nIndex++)
		{
			bFound	= this.items[nIndex].getAttribute("label").substring(0, sSelectedText.length) == sSelectedText;
			if (this.attributes["filter"] == "true")
				this.items[nIndex].$getContainer().style.display	= bFound ? "block" : "none";

			if (this.items[nIndex].$getContainer().style.display != "none" && bFound)
			{
				if (!nOptions)
				{
					if (this.items[this.selectedIndex])
						this.items[this.selectedIndex].setAttribute("selected", "false");
					this.items[nIndex].setAttribute("selected", "true");
					this.items[nIndex].scrollIntoView();
						this.selectedIndex = nIndex;
				}
		   		nOptions++;
			}
		}

		if (nOptions)
			this.toggle(true);
		else
		{
			this.toggle(false);
		}

		this.selectedText   = sSelectedText;
	},
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
		this.toggle(false);
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_menuitem) {
			var sValue	= this.$getValue();
			this.$setValue(oEvent.target.getAttribute("label"));
		    this.toggle(false);

			if (sValue != this.$getValue())
			{
			    			    var oEvent2  = this.ownerDocument.createEvent("Events");
			    oEvent2.initEvent("change", true, false);
			    this.dispatchEvent(oEvent2);
			}
		}
	}
};

cXULElement_menulist.prototype.$getTagOpen		= function() {
	return	'<table cellpadding="0" cellspacing="0" border="0" class="xul-menulist' +(this.attributes["disabled"] ? " xul-menulist_disabled" : '') + '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '') +'>\
				<tbody>\
					<tr>\
						<td width="100%"><input class="xul-menulist--input" type="text" autocomplete="off" style="border:0px solid white;width:100%;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this)._onChange(event)" value="' + this.attributes["value"] + '"' + (this.attributes["disabled"] ? ' disabled="disabled"' : '') + (this.attributes["readonly"] ? ' readonly="readonly"' : '') + (this.attributes["name"] ? ' name="' + this.attributes["name"] + '"' : '') + '/></td>\
						<td valign="top"><div class="xul-menulist--button" onmouseout="ample.$instance(this).$setPseudoClass(\'active\', false, \'button\');" onmousedown="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'active\', true, \'button\'); return false;" onmouseup="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'active\', false, \'button\');" oncontextmenu="return false;"/></td>\
					</tr>\
					<tr>\
						<td colspan="2" class="xul-menulist--gateway">';
};

cXULElement_menulist.prototype.$getTagClose	= function() {
	return				'</td>\
					</tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("menulist", cXULElement_menulist);



var cXULElement_menupopup	= function()
{
        this.items  = new AMLNodeList;
};
cXULElement_menupopup.prototype	= new cXULPopupElement;

cXULElement_menupopup.prototype.selectedItem	= null;

cXULElement_menupopup.attributes	= {};
cXULElement_menupopup.attributes.hidden	= "true";

cXULElement_menupopup.prototype.setAttribute = function(sName, sValue)
{
  	this._setAttribute(sName, sValue);

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_menupopup.prototype.selectItem	= function(oItem)
{
		if (this.selectedItem && this.selectedItem != oItem) {
				if (this.selectedItem.menupopup) {
			var oMenuPopupOld	= this.selectedItem.menupopup;
			this._timeOutHide	= setTimeout(function() {
				oMenuPopupOld.hidePopup();
			}, 300);
		}
		        this.selectedItem.setAttribute("selected", "false");
	}

		if (this._timeOutShow)
		this._timeOutShow	= clearTimeout(this._timeOutShow);

	if (oItem) {
	    		if (oItem.menupopup && oItem.getAttribute("disabled") != "true") {
			var oMenuPopupNew	= oItem.menupopup;
			this._timeOutShow	= setTimeout(function() {
				oMenuPopupNew.showPopup(null, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
			}, 300);
		}
				oItem.setAttribute("selected", "true");
	}

		this.selectedItem	= oItem;
};



cXULElement_menupopup.handlers	= {
	"popuphidden":	function(oEvent) {
				if (this.selectedItem)
			this.selectItem(null);
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menulist || oParent instanceof cXULElement_menu)
			oParent.menupopup	= this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		var oParent	= this.parentNode;
		if (oParent instanceof cXULElement_menulist || oParent instanceof cXULElement_menu)
			oParent.menupopup	= null;
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_menuitem)
	   		this.hidePopup();
			   	if (this.ownerDocument.popupNode == this)
			this.ownerDocument.popupNode	= null;
	}
};

cXULElement_menupopup.prototype.$getTagOpen	= function()
{
	return '<div style="position:absolute;' + (this.attributes["hidden"] == "true" ? 'display:none;' : '') + '" class="xul-menupopup">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;font-size:1px;"></div>\
				<table cellpadding="0" cellspacing="0" border="0" cols="4">\
					<tbody class="ns-menupopup--gateway">';
};

cXULElement_menupopup.prototype.$getTagClose	= function()
{
	return 			'</tbody>\
				</table>\
			</div>';
};

oXULNamespace.setElement("menupopup", cXULElement_menupopup);



var cXULElement_menuseparator	= function(){};
cXULElement_menuseparator.prototype  = new cXULElement;


cXULElement_menuseparator.prototype.$getTagOpen	= function()
{
    return '<tr>\
    			<td colspan="4"><div class="xul-menuseparator"><br /></div></td>\
    		</tr>';
};

oXULNamespace.setElement("menuseparator", cXULElement_menuseparator);



var cXULElement_page	= function(){};
cXULElement_page.prototype	= new cXULElement;
cXULElement_page.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_page.attributes	= {};
cXULElement_page.attributes.orient	= "vertical";
cXULElement_page.attributes.width	= "100%";
cXULElement_page.attributes.height	= "100%";

cXULElement_page.prototype.$getTagOpen	= function()
{
    return '<div class="xul-page' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="width:100%;height:100%;overflow:hidden;">';
};

cXULElement_page.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("page", cXULElement_page);

var cXULElement_panel	= function(){};
cXULElement_panel.prototype	= new cXULPopupElement;
cXULElement_panel.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_panel.attributes	= {};
cXULElement_panel.attributes.orient	= "vertical";
cXULElement_panel.attributes.width	= "150";

cXULElement_panel.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "top")
    {
        if (!isNaN(sValue) && !isNaN(this.attributes["left"]))
            this.moveTo(this.attributes["left"] * 1, sValue * 1);
    }
    else
    if (sName == "left")
    {
        if (!isNaN(sValue) && !isNaN(this.attributes["top"]))
            this.moveTo(sValue * 1, this.attributes["top"] * 1);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_panel.prototype.$getTagOpen	= function()
{
    return '<div style="display:none;position:absolute;width:' + this.attributes["width"] + 'px;" class="xul-panel" onmousedown="event.cancelBubble=true;" oncontextmenu="return false">';
};

cXULElement_panel.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("panel", cXULElement_panel);


var cXULElement_popupset	= function(){};
cXULElement_popupset.prototype	= new cXULElement;
cXULElement_popupset.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;


oXULNamespace.setElement("popupset", cXULElement_popupset);



var cXULElement_progressmeter	= function(){};
cXULElement_progressmeter.prototype  = new cXULElement;

cXULElement_progressmeter.prototype._interval	= null;
cXULElement_progressmeter.prototype._left		= 0;

cXULElement_progressmeter.attributes	= {};
cXULElement_progressmeter.attributes.value	= "100";

cXULElement_progressmeter.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "value")
    {
        if (this.attributes["mode"] != "undetermined")
            this.$getContainer("units").style.width = sValue + '%';
    }
    else
    if (sName == "mode")
    {
        if (sValue == "undetermined")
        {
            if (!this._interval)
            {
            	var oElementDOM	= this.$getContainer("units");
                oElementDOM.style.width = '0%';
                oElementDOM.style.left  = '0%';

                this._left  = 0;
                var oSelf	= this;
                this._interval  = setInterval(function() {
                	oSelf._onInterval();
                }, 40);
            }
        }
        else
        {
            if (this._interval)
            {
                clearInterval(this._interval);
                this._interval  = null;
            }
           	var oElementDOM	= this.$getContainer("units");
            oElementDOM.style.width = this.attributes["value"] + '%';
            oElementDOM.style.left  = '0%';
        }
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_progressmeter.prototype._onInterval  = function()
{
    this._left  = this._left + 1 > 100 + 30 ? 0 : this._left + 1;

    this.$getContainer("units").style.left  =(this._left > 30 ? this._left - 30 : 0)+ '%';
    this.$getContainer("units").style.width =(this._left < 30 ? this._left : 100 + 30 - this._left < 30 ? 100 + 30 - this._left : 30)+ '%';
};

cXULElement_progressmeter.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
	    if (this.getAttribute("mode") == "undetermined") {
	        var oSelf	= this;
	        this._interval	= setInterval(function() {
	        	oSelf._onInterval();
	        }, 40);
	    }
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this._interval)
			clearInterval(this._interval);
	}
};

cXULElement_progressmeter.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" width="' + (this.attributes["width"] || "100%") + '" class="xul-progressmeter"' +(this.attributes["hidden"] == "true" ? ' style="display:none;"' : "")+ '>';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td class="xul-progressmeter-bar-left"><br /></td>';
    sHtml  += '<td class="xul-progressmeter-bar-middle" valign="center">';
    sHtml  += '<div style="position:relative;';
    if (this.attributes["value"])
        sHtml  += 'width:' + this.attributes["value"] + '%;';
    sHtml  += '" class="xul-progressmeter--units"><br><img width="1" height="1"/></br></div>';
    sHtml  += '</td>';
    sHtml  += '<td class="xul-progressmeter-bar-right"><br /></td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

oXULNamespace.setElement("progressmeter", cXULElement_progressmeter);



var cXULElement_radio	= function(){};
cXULElement_radio.prototype   = new cXULElement;

cXULElement_radio.prototype.group	= null;

cXULElement_radio.prototype.setAttribute = function(sName, sValue)
{
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
     }
    else
    if (sName == "value")
    {
        this.$getContainer("input").value    = sValue;
    }
    else
    if (sName == "selected")
    {
        if (sValue == "true")
        {
                        if (this.group.items[this.group.selectedIndex])
                this.group.items[this.group.selectedIndex].setAttribute("selected", "false");

            this.group.selectedIndex    = this.group.items.$indexOf(this);
            this.group.selectedItem     = this.group.items[this.group.selectedIndex];
            this.group.attributes["value"]  = this.attributes["value"];
        }
        else
        {
            this.group.selectedIndex    =-1;
            this.group.selectedItem     = null;
            this.group.attributes["value"]  = "";
        }
		this.$getContainer("input").checked  = sValue == "true";
    }
    else
    if (sName == "label")
    {
        this.$getContainer("label").innerHTML = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_radio.prototype.$isAccessible	= function()
{
	return this.getAttribute("disabled") != "true" && (this.group ? this.group.$isAccessible() : true);
};

cXULElement_radio.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
		this.setAttribute("selected", "true");
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		for (var oElement = this; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULElement_radiogroup)
				break;
		if (oElement) {
			this.$getContainer("input").name	= oElement.uniqueID + "_radio";
			oElement.items.$add(this);
			this.group   = oElement;
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		for (var oElement = this; oElement; oElement = oElement.parentNode)
			if (oElement instanceof cXULElement_radiogroup)
				break;
		if (oElement) {
			oElement.items.$remove(this);
			this.group   = null;
		}
	}
};

cXULElement_radio.prototype._onClick = function(oEvent)
{
    if (this.group)
    {
        this.group.selectedIndex    = this.group.items.$indexOf(this);
        this.group.selectedItem     = this.group.items[this.group.selectedIndex];
        this.group.attributes["value"] = this.attributes["value"];

	    	    var oEvent  = this.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", false, true);
	    this.group.dispatchEvent(oEvent);
    }
};

cXULElement_radio.prototype.$getTagOpen	= function()
{
    var sHtml   = '<label class="xul-radio' + ((this.group && this.group.attributes["disabled"] == "true") || this.attributes["disabled"] == "true" ? " xul-radio_disabled" : "")+ '">';
    sHtml	+= '<input type="radio" autocomplete="off"';
    if (this.attributes["value"])
        sHtml  += ' value="' + this.attributes["value"] + '"';
    if (this.attributes["selected"] == "true")
        sHtml  += ' checked="true"';
    if (this.attributes["disabled"] == "true")
        sHtml  += ' disabled="true"';
    sHtml  += ' onclick="ample.$instance(this)._onClick(event)" class="xul-radio--input" />';
    sHtml  += '<span class="xul-radio--label">' + (this.attributes["label"] ? this.attributes["label"] : '') + '</span>';


    return sHtml;
};

cXULElement_radio.prototype.$getTagClose	= function()
{
    return '</label>';
};

oXULNamespace.setElement("radio", cXULElement_radio);



var cXULElement_radiogroup	= function()
{
        this.items      = new AMLNodeList;
};
cXULElement_radiogroup.prototype	= new cXULElement;
cXULElement_radiogroup.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;
cXULElement_radiogroup.prototype.tabIndex	= 0;

cXULElement_radiogroup.prototype.selectedIndex	=-1;
cXULElement_radiogroup.prototype.selectedItem	= null;

cXULElement_radiogroup.attributes	= {};
cXULElement_radiogroup.attributes.orient	= "vertical";
cXULElement_radiogroup.attributes.value	= "";

cXULElement_radiogroup.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "value")
    {
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        {
            if (this.items[nIndex].attributes["value"] == sValue)
            {
                this.items[nIndex].setAttribute("selected", "true");
                break;
            }
        }
    }
    else
    if (sName == "disabled")
    {
    	var oElementDOM	= this.$getContainer();
    	this.$setPseudoClass("disabled", sValue == "true");
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
            this.items.setAttribute(sName, sValue);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_radiogroup.prototype.appendItem  = function(sName, sValue)
{

};

cXULElement_radiogroup.prototype.insertItemAt= function(nIndex, sName, sValue)
{

};

cXULElement_radiogroup.prototype.removeItemAt= function(nIndex)
{

};

cXULElement_radiogroup.prototype.$getTagOpen	= function()
{
    return '<div class="xul-radiogroup' + (this.attributes["disabled"] == "true" ? " xul-radiogroup_disabled" : "") + '">';
};

cXULElement_radiogroup.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("radiogroup", cXULElement_radiogroup);



var cXULElement_row	= function(){};
cXULElement_row.prototype	= new cXULElement;

cXULElement_row.attributes	= {};
cXULElement_row.attributes.orient	= "horizontal";

cXULElement_row.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		this.refresh();
	}
};

cXULElement_row.prototype.$getTagOpen		= function()
{
    return '<tr class="xul-row"' +(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '')+(this.attributes["hidden"] == "true" ? ' style="display:none"' : '')+'>';
};

cXULElement_row.prototype.$getTagClose	= function()
{
    return '</tr>';
};

oXULNamespace.setElement("row", cXULElement_row);



var cXULElement_rows	= function(){};
cXULElement_rows.prototype	= new cXULElement;


oXULNamespace.setElement("rows", cXULElement_rows);



var cXULElement_scale	= function(){};
cXULElement_scale.prototype	= new cXULElement;
cXULElement_scale.prototype.tabIndex	= 0;

cXULElement_scale.attributes	= {
	"min":		"0",
	"max":		"9",
	"step":		"1",
	"value":	"0"
};

cXULElement_scale.prototype.form	= null;

cXULElement_scale.prototype.$getValue	= function()
{
	return this.$getContainer("input").value;
};

cXULElement_scale.prototype.$setValue	= function(sValue)
{
    if (sValue * 1.0 < this.attributes["min"] * 1.0 || isNaN(sValue))
        sValue  = this.attributes["min"] * 1.0;
    else
    if (sValue * 1.0 > this.attributes["max"] * 1.0)
        sValue  = this.attributes["max"] * 1.0;

	var oPosition	= this.getBoundingClientRect();
    this.$getContainer("button").style.left   = Math.round((oPosition.right - oPosition.left - 17) * (sValue - this.attributes["min"] * 1.0) / (this.attributes["max"] * 1.0 - this.attributes["min"] * 1.0)) + "px";

        this.$getContainer("input").value	= sValue;
};

cXULElement_scale.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "value")
    {
		this.$setValue(sValue);
    }
    else
    if (sName == "type")
    {
            }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue != "");
        this.$getContainer("input").disabled = sValue != "";
        this.$getContainer().disabled	= sValue != "";
    }
    else
    if (sName == "step")
    {

    }
    else
    if (sName == "min")
    {

    }
    else
    if (sName == "max")
    {

    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_scale.prototype._onButtonMouseDown  = function(oEvent)
{
    if (this.getAttribute("disabled"))
        return false;

    this._mouseX    = oEvent.clientX;
    this._mouseY    = oEvent.clientY;

    this._buttonX   = parseInt(this.$getContainer("button").style.left);
    this._buttonY   = parseInt(this.$getContainer("button").style.top);

	cXULElement_scale._element	= this;
	this.ownerDocument.addEventListener("mousemove",	cXULElement_scale._onDocumentMouseMove,	false);
	this.ownerDocument.addEventListener("mouseup",		cXULElement_scale._onDocumentMouseUp,		false);

	this.$setPseudoClass("active", true, "button");

		return false;
};

cXULElement_scale.prototype._onButtonKeyDown    = function(oEvent)
{
    if (this.getAttribute("disabled"))
        return false;

    var sValue  = this.$getValue();
    if (oEvent.keyCode == 39 || oEvent.keyCode == 38)
        this.$setValue(sValue * 1.0 + this.attributes["step"] * 1.0);
    else
    if (oEvent.keyCode == 37 || oEvent.keyCode == 40)
        this.$setValue(sValue * 1.0 - this.attributes["step"] * 1.0);

    if (sValue != this.$getValue())
    {
	    	    var oEvent  = this.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", true, false);
	    this.dispatchEvent(oEvent);
    }
};

cXULElement_scale._onDocumentMouseUp    = function(oEvent)
{
	var oElement	= cXULElement_scale._element;

		delete cXULElement_scale._element;
	oElement.ownerDocument.removeEventListener("mousemove",	cXULElement_scale._onDocumentMouseMove,false);
	oElement.ownerDocument.removeEventListener("mouseup",	cXULElement_scale._onDocumentMouseUp,	false);

		oElement.$setPseudoClass("active", false, "button");

	var oPosition	= oElement.getBoundingClientRect();
	var sValue	= oElement.attributes["min"] * 1.0 + Math.round((oElement._buttonX  / (oPosition.right - oPosition.left - 17)) * (oElement.attributes["max"] * 1.0 - oElement.attributes["min"] * 1.0) / oElement.attributes["step"]) * oElement.attributes["step"];

	var sValueOld	= oElement.$getValue();
    oElement.$setValue(sValue);
	if (sValueOld != oElement.$getValue())
	{
	    	    var oEvent  = oElement.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", true, false);
	    oElement.dispatchEvent(oEvent);
	}
};

cXULElement_scale._onDocumentMouseMove     = function(oEvent)
{
	var oElement	= cXULElement_scale._element;
	var oPosition	= oElement.getBoundingClientRect(),
		nWidth		= oPosition.right - oPosition.left;

    oElement._buttonX  += oEvent.clientX - oElement._mouseX;
    oElement._buttonY  += oEvent.clientY - oElement._mouseY;

    oElement.$getContainer("button").style.left   =(oElement._buttonX < 0 ? 0 : oElement._buttonX < nWidth - 17 ? oElement._buttonX : nWidth - 17) + "px";

    oElement._mouseX    = oEvent.clientX;
    oElement._mouseY    = oEvent.clientY;
};

cXULElement_scale.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		
		this.$setValue(this.attributes["value"]);
	}
};

cXULElement_scale.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table tabindex="0"' +(this.attributes["disabled"] ? ' disabled="disabled"' : '') + ' cellpadding="0" cellspacing="0" border="0" class="xul-scale' + (this.attributes["disabled"] ? " xul-scale_disabled" : '') + '" ' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"': '') + ' onkeydown="return ample.$instance(this)._onButtonKeyDown(event);">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td><div style="width:3px" /></td>';
    sHtml  += '<td width="100%" class="xul-scale-orient-' +(this.attributes["orient"] == "vertical" ? "vertical" : "horizontal") + '">';
    sHtml  += '<div class="xul-scale--button" style="position:relative;left:0px;top:0px;" onmouseout="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button\')" onmouseover="if (!ample.$instance(this).attributes.disabled) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button\')" onmousedown="if (!ample.$instance(this).attributes.disabled) {return ample.$instance(this)._onButtonMouseDown(event);}"><br /></div>';
    sHtml  += '</td>';
    sHtml  += '<td><div style="width:3px"><input type="text" value="' + this.attributes["value"] + '" autocomplete="off"';
    if (this.attributes["name"])
        sHtml  += ' name="' + this.attributes["name"] + '"';
    if (this.attributes["disabled"])
        sHtml  += ' disabled="' + "disabled" + '"';
    sHtml  += ' style="display:none;width:1px;height:1px;" class="xul-scale--input"/></div></td>';
    sHtml  += '</tr>';
	sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

oXULNamespace.setElement("scale", cXULElement_scale);



var cXULElement_script	= function(){};
cXULElement_script.prototype	= new cXULElement;

cXULElement_script.attributes	= {};
cXULElement_script.attributes.hidden	= "true";


cXULElement_script.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.attributes["src"])
			this.setAttribute("src", this.attributes["src"]);
		else
		if (this.firstChild) {
			var oElement	= document.body.appendChild(document.createElement("script"));
			oElement.type	= "text/javascript";
			oElement.text	= this.firstChild.nodeValue;
		}
	}
};

cXULElement_script.prototype.$getTagOpen	= function()
{
    return '<script type="text/javascript">';
};

cXULElement_script.prototype.$getTagClose	= function()
{
    return '</script>';
};

oXULNamespace.setElement("script", cXULElement_script);



var cXULElement_scrollbox	= function(){};
cXULElement_scrollbox.prototype	= new cXULElement;
cXULElement_scrollbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;



cXULElement_scrollbox.prototype.$getTagOpen	= function()
{
    return '<div class="xul-scrollbox" style="overflow:hidden">';
};

cXULElement_scrollbox.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("scrollbox", cXULElement_scrollbox);



var cXULElement_separator	= function(){};
cXULElement_separator.prototype = new cXULElement;


cXULElement_separator.prototype.$getTagOpen	= function()
{
	return '<div class="xul-separator" style="height:1.5em;width:1.5em;"><img height="1" width="1" /></div>';
};

oXULNamespace.setElement("separator", cXULElement_separator);



var cXULElement_spacer	= function(){};
cXULElement_spacer.prototype = new cXULElement;


cXULElement_spacer.prototype.$getTagOpen	= function()
{
    var sHtml   = '<div class="xul-spacer" style="';
    sHtml  += 'width:'  +(this.attributes["width"] ? this.attributes["width"] : '0')+ 'px;';
    sHtml  += 'height:' +(this.attributes["height"]? this.attributes["height"]: '0')+ 'px;';
    sHtml  += '"><img height="1" width="1" /></div>';

    return sHtml;
};

oXULNamespace.setElement("spacer", cXULElement_spacer);



var cXULElement_spinbuttons	= function(){};
cXULElement_spinbuttons.prototype	= new cXULElement;
cXULElement_spinbuttons.prototype.tabIndex	= 0;

cXULElement_spinbuttons.attributes	= {
	"min":		"0",
	"max":		"9",
	"step":		"1",
	"value":	"0"
};

cXULElement_spinbuttons.prototype.form	= null;

cXULElement_spinbuttons.prototype.$getValue	= function()
{
	return this.$getContainer("input").value;
};

cXULElement_spinbuttons.prototype.$setValue	= function(sValue)
{
	if (isNaN(sValue))
        sValue  = this.attributes["min"] * 1.0;

    if (sValue < this.attributes["min"] * 1.0)
    {
    	if (this.attributes["cyclic"] == "true")
			sValue	= this.attributes["max"];
    	else
			sValue  = this.attributes["min"];
    }
    else
    if (sValue > this.attributes["max"] * 1.0)
    {
    	if (this.attributes["cyclic"] == "true")
			sValue	= this.attributes["min"];
    	else
        	sValue  = this.attributes["max"];
    }

        this.$getContainer("input").value = sValue;
};

cXULElement_spinbuttons.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "value")
    {
		this.$setValue(sValue);
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue != '');
        this.$getContainer("input").disabled = sValue != '';
    }
    else
    if (sName == "step")
    {

    }
    else
    if (sName == "min")
    {

    }
    else
    if (sName == "max")
    {

    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_spinbuttons.prototype.select	= function()
{
	this.$getContainer("input").select();
};

cXULElement_spinbuttons.prototype._onInterval    = function(bDir)
{
    var sValue  = this.$getValue();
    this.$setValue(bDir ? sValue * 1.0 + this.attributes["step"] * 1.0 : sValue * 1.0 - this.attributes["step"] * 1.0);
    if (this.$getValue() == sValue && this._interval)
        clearInterval(this._interval);
};

cXULElement_spinbuttons.prototype._onChange  = function(oEvent)
{
	var sValue	= this.$getValue();
	if (sValue == "" || isNaN(sValue))
		this.$setValue(this.attributes["min"]);

        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", true, false);
    this.dispatchEvent(oEvent);
};

cXULElement_spinbuttons._onDocumentMouseUp = function(oEvent)
{
	var oElement	= cXULElement_spinbuttons._element;

		delete cXULElement_spinbuttons._element;
	oElement.ownerDocument.removeEventListener("mouseup",	cXULElement_spinbuttons._onDocumentMouseUp,	false);

		oElement.$setPseudoClass("active", false, "button-up");
	oElement.$setPseudoClass("active", false, "button-down");

    if (oElement._interval)
        oElement._interval  = clearInterval(oElement._interval);

    if (oElement._oldvalue != oElement.$getValue())
    {
	    	    var oEvent  = oElement.ownerDocument.createEvent("Events");
	    oEvent.initEvent("change", true, false);
	    oElement.dispatchEvent(oEvent);
    }
};

cXULElement_spinbuttons.prototype._onButtonMouseDown = function(oEvent, bDir)
{
    if (oEvent.button == 2)
        return true;

	cXULElement_spinbuttons._element	= this;
	this.ownerDocument.addEventListener("mouseup",		cXULElement_spinbuttons._onDocumentMouseUp,	false);

        this._oldvalue  = this.$getValue();

    var oSelf	= this;
    this._interval  = setInterval(function() {
    	oSelf._onInterval(bDir);
    }, 100);

    return false;
};

cXULElement_spinbuttons.handlers	= {
	"keydown":	function(oEvent) {
	    	    var sValue  = this.$getValue();

	    if (oEvent.keyIdentifier == "Up")
	        this.$setValue(sValue * 1.0 + this.attributes["step"] * 1.0);
	    else
	    if (oEvent.keyIdentifier == "Down")
	        this.$setValue(sValue * 1.0 - this.attributes["step"] * 1.0);

	    if (sValue != this.$getValue())
	    {
		    		    var oEvent  = this.ownerDocument.createEvent("Events");
		    oEvent.initEvent("change", true, false);
		    this.dispatchEvent(oEvent);
	    }
	},
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

cXULElement_spinbuttons.prototype.$getTagOpen	= function()
{
    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" class="xul-spinbuttons' + (this.attributes["disabled"] ? ' xul-spinbuttons_disabled' : '')+ '">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td width="100%"><input type="text" autocomplete="off" style="border:0px solid white;width:100%;" value="' + this.attributes["value"] + '"';
    if (this.attributes["disabled"])
        sHtml  += ' disabled="true"';
    if (this.attributes["name"])
        sHtml  += ' name="' + this.attributes["name"] + '"';
    sHtml  += ' onchange="ample.$instance(this)._onChange(event)" onkeypress="if (event.keyCode == 38 || event.keyCode == 40) return false" class="xul-spinbuttons--input" onselectstart="event.cancelBubble=true;"/></td>';
    sHtml  += '<td valign="top">';
    sHtml  += '<div class="xul-spinbuttons--button-up" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-up\'); return ample.$instance(this)._onButtonMouseDown(event, true)}"><br/></div>';
    sHtml  += '<div class="xul-spinbuttons--button-down" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-down\'); return ample.$instance(this)._onButtonMouseDown(event, false)}"><br/></div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

oXULNamespace.setElement("spinbuttons", cXULElement_spinbuttons);



var cXULElement_splitter	= function(){};
cXULElement_splitter.prototype   = new cXULElement;

cXULElement_splitter.prototype._clientX	= 0;
cXULElement_splitter.prototype._clientY	= 0;
cXULElement_splitter.prototype._offsetX	= 0;
cXULElement_splitter.prototype._offsetY	= 0;

cXULElement_splitter.prototype.$hoverable	= true;
cXULElement_splitter.prototype.$selectable	= false;

cXULElement_splitter.captured	= false;
cXULElement_splitter.offset	= 0;
cXULElement_splitter.client	= 0;

cXULElement_splitter.handlers	= {
	"mousedown":	function(oEvent) {
				if (oEvent.button != 0)
			return;

		this.setCapture(true);
		this.$setPseudoClass("active", true);
		cXULElement_splitter.captured	= true;

				if (this.parentNode.getAttribute("orient") == "vertical")
			cXULElement_splitter.offset	= oEvent.clientY -(parseInt(this.$getContainer("image").style.top) || 0);
		else
			cXULElement_splitter.offset	= oEvent.clientX -(parseInt(this.$getContainer("image").style.left) || 0);
	},
	"mouseup":		function(oEvent) {
				if (oEvent.button != 0)
			return;

		this.releaseCapture();
		this.$setPseudoClass("active", false);
		cXULElement_splitter.captured	= false;
	},
	"mousemove":	function(oEvent) {
		var oElement	= this.$getContainer("image");
		if (this.parentNode.getAttribute("orient") == "vertical")
			oElement.style.top	=(oEvent.clientY - cXULElement_splitter.offset)+ "px";
		else
			oElement.style.left	=(oEvent.clientX - cXULElement_splitter.offset)+ "px";
	}
};

cXULElement_splitter.prototype._capture  = function(oEvent)
{
	if (!this.nextSibling || !this.previousSibling || this.parentNode.viewType != cXULElement.VIEW_TYPE_BOXED)
		return;

	cXULElement_splitter._element	= this;

	
		this.cursor	= document.body.style.cursor;

		this.ownerDocument.addEventListener("mousemove",	cXULElement_splitter._onDocumentMouseMove,	false);
	this.ownerDocument.addEventListener("mouseup",		cXULElement_splitter._onDocumentMouseUp,		false);

    if (this.parentNode.attributes["orient"] == "vertical")
        this.$getContainer().firstChild.style["top"]	= this._offsetY	= this._clientY = oEvent.clientY - 1;
    else
        this.$getContainer().firstChild.style["left"]	= this._offsetX	= this._clientX = oEvent.clientX - 1;

    	document.body.style.cursor	= this.parentNode.attributes["orient"] == "vertical" ? "n-resize" : "e-resize";
};

cXULElement_splitter._onDocumentMouseUp   = function(oEvent)
{
	var oElement	= cXULElement_splitter._element,
		sAttribute	= oElement.parentNode.attributes["orient"] == "vertical" ? "height" : "width";

	var oPosition1	= oElement.ownerDocument.$getContainerPosition(oElement.previousSibling.$getContainer().parentNode),
		oPosition2	= oElement.ownerDocument.$getContainerPosition(oElement.nextSibling.$getContainer().parentNode);

	if (sAttribute == "height")
	{
		var nOffset1	= (oElement._offsetY - oElement._clientY) / oPosition1.height;
		var nOffset2	= (oElement._offsetY - oElement._clientY) / oPosition2.height;
	}
	else
	{
		var nOffset1	= (oElement._offsetX - oElement._clientX) / oPosition1.width;
		var nOffset2	= (oElement._offsetX - oElement._clientX) / oPosition2.width;
	}
	oElement.previousSibling.getBoxObjectParam(sAttribute).match(/([0-9]+)(.*)/);
	oElement.previousSibling.setBoxObjectParam(sAttribute, (Math.round((1 + nOffset1) * RegExp.$1) || 1) + RegExp.$2);
	oElement.nextSibling.getBoxObjectParam(sAttribute).match(/([0-9]+)(.*)/);
	oElement.nextSibling.setBoxObjectParam(sAttribute, (Math.round((1 - nOffset2) * RegExp.$1) || 1) + RegExp.$2);

		oElement.$getContainer().firstChild.style[oElement.parentNode.attributes["orient"] == "vertical" ? "top" : "left"]	= "";

		document.body.style.cursor	= oElement.cursor;

	
		delete cXULElement_splitter._element;

		oElement.ownerDocument.removeEventListener("mousemove",		cXULElement_splitter._onDocumentMouseMove,	false);
	oElement.ownerDocument.removeEventListener("mouseup",		cXULElement_splitter._onDocumentMouseUp,		false);
};

cXULElement_splitter._onDocumentMouseMove     = function(oEvent)
{
	var oElement	= cXULElement_splitter._element;
	var oPosition1	= oElement.ownerDocument.$getContainerPosition(oElement.previousSibling.$getContainer().parentNode);
	var oPosition2	= oElement.ownerDocument.$getContainerPosition(oElement.nextSibling.$getContainer().parentNode);

    if (oElement.parentNode.attributes["orient"] == "vertical")
    {
    	if (oPosition1.top < oEvent.clientY && oEvent.clientY < oPosition2.top + oPosition2.height)
    		if (!(oElement.previousSibling.attributes["minheight"] && oElement.previousSibling.attributes["minheight"] > oEvent.clientY - oPosition1.top) && !(oElement.previousSibling.attributes["maxheight"] && oElement.previousSibling.attributes["maxheight"] < oEvent.clientY - oPosition1.top))
	    		if (!(oElement.nextSibling.attributes["minheight"] && oElement.nextSibling.attributes["minheight"] > oEvent.clientY - oPosition1.top) && !(oElement.nextSibling.attributes["maxheight"] && oElement.nextSibling.attributes["maxheight"] < oEvent.clientY - oPosition1.top))
    	 			oElement.$getContainer().firstChild.style["top"]		= oElement._offsetY	= oEvent.clientY - 1;
    }
    else
    	if (oPosition1.left < oEvent.clientX && oEvent.clientX < oPosition2.left + oPosition2.width)
    		if (!(oElement.previousSibling.attributes["minwidth"] && oElement.previousSibling.attributes["minwidth"] > oEvent.clientX - oPosition1.left) && !(oElement.previousSibling.attributes["maxwidth"] && oElement.previousSibling.attributes["maxwidth"] < oEvent.clientX - oPosition1.width))
	    		if (!(oElement.nextSibling.attributes["minwidth"] && oElement.nextSibling.attributes["minwidth"] > oEvent.clientX - oPosition1.left) && !(oElement.nextSibling.attributes["maxwidth"] && oElement.nextSibling.attributes["maxwidth"] < oEvent.clientX - oPosition1.width))
			        oElement.$getContainer().firstChild.style["left"]	= oElement._offsetX	= oEvent.clientX - 1;
};

cXULElement_splitter.prototype.$getTagOpen	= function()
{
    return '<div class="xul-splitter xul-splitter-' +(this.parentNode.attributes["orient"] == "vertical" ? "vertical" : "horizontal")+ '" style="line-height:1px"><div class="xul-splitter--image"></div>';
};

cXULElement_splitter.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("splitter", cXULElement_splitter);



var cXULElement_stack	= function(){};
cXULElement_stack.prototype  = new cXULElement;


cXULElement_stack.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
				var oElementDOM	= this.$getContainer();
		for (var nIndex = 0; nIndex < oElementDOM.childNodes.length; nIndex++)
			oElementDOM.childNodes[nIndex].style.position   = "absolute";
	}
};

cXULElement_stack.prototype.$getTagOpen	= function()
{
    return '<div class="xul-stack" style="position:relative">';
};

cXULElement_stack.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("stack", cXULElement_stack);



var cXULElement_statusbar	= function(){};
cXULElement_statusbar.prototype	= new cXULElement;
cXULElement_statusbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_statusbar.attributes	= {};
cXULElement_statusbar.attributes.width	= "100%";
cXULElement_statusbar.attributes.height	= "22";

cXULElement_statusbar.prototype.$selectable	= false;


cXULElement_statusbar.prototype.$getTagOpen	= function()
{
    return '<div class="xul-statusbar">';
};

cXULElement_statusbar.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("statusbar", cXULElement_statusbar);



var cXULElement_statusbarpanel	= function(){};
cXULElement_statusbarpanel.prototype = new cXULElement;

cXULElement_statusbarpanel.attributes	= {};
cXULElement_statusbarpanel.attributes.align	= "center";

cXULElement_statusbarpanel.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "image")
    {
        this.$getContainer().innerHTML    = '<img src="' + this.attributes["image"] + '" align="absmiddle"/>';
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_statusbarpanel.prototype.$getTagOpen	= function()
{
    var sHtml   = '<div class="xul-statusbarpanel">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle"/>';
    else
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];
    return sHtml;
};

cXULElement_statusbarpanel.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("statusbarpanel", cXULElement_statusbarpanel);



var cXULElement_tab	= function(){};
cXULElement_tab.prototype	= new cXULElement;
cXULElement_tab.prototype.$hoverable	= true;

cXULElement_tab.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_tab.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.parentNode.goTo(this.parentNode.items.$indexOf(this));
		this.doCommand();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabs)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabs)
			this.parentNode.items.$remove(this);
	}
};

cXULElement_tab.prototype.$getTagOpen	= function()
{
    var sHtml   = '<td class="xul-tab' + (this.attributes["disabled"] ? " xul-tab_disabled" : "") +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" border="0" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

cXULElement_tab.prototype.$getTagClose	= function()
{
    var sHtml   = '';
    sHtml  += '</td>';
    sHtml  += '<td class="xul-tab-separator"><img width="1" height="1" /></td>';

    return sHtml;
};

oXULNamespace.setElement("tab", cXULElement_tab);



var cXULElement_tabbox	= function(){};
cXULElement_tabbox.prototype	= new cXULElement;

cXULElement_tabbox.prototype.tabs		= null; cXULElement_tabbox.prototype.tabpanels	= null; 
cXULElement_tabbox.prototype.selectedIndex	= -1;
cXULElement_tabbox.prototype.selectedTab	= null; cXULElement_tabbox.prototype.selectedPanel	= null; 
cXULElement_tabbox.attributes	= {};
cXULElement_tabbox.attributes.orient	= "vertical";


cXULElement_tabbox.prototype.$getTagOpen	= function()
{
    return '<div class="xul-tabbox' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
};

cXULElement_tabbox.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("tabbox", cXULElement_tabbox);



var cXULElement_tabpanel	= function(){};
cXULElement_tabpanel.prototype	= new cXULElement;
cXULElement_tabpanel.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_tabpanel.attributes	= {};
cXULElement_tabpanel.attributes.hidden	= "true";
cXULElement_tabpanel.attributes.width	= "100%";



cXULElement_tabpanel.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabpanels) {
			this.parentNode.items.$add(this);

			var oTabBox	= this.parentNode.parentNode;
			if (oTabBox instanceof cXULElement_tabbox) {
				if (!isNaN(oTabBox.attributes["selectedIndex"]) && oTabBox.tabs.items.length > oTabBox.attributes["selectedIndex"] && this.parentNode.items.$indexOf(this) == oTabBox.attributes["selectedIndex"] * 1)
					oTabBox.tabs.goTo(oTabBox.attributes["selectedIndex"] * 1);
				else
				if (!this.nextSibling)
					oTabBox.tabs.goTo(0);
			}
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabpanels)
			this.parentNode.items.$remove(this);
	}
};

cXULElement_tabpanel.prototype.$getTagOpen	= function()
{
    return '<div class="xul-tabpanel"' +(this.attributes["hidden"] != "false" ? ' style="display:none"' : '')+ '>';
};

cXULElement_tabpanel.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("tabpanel", cXULElement_tabpanel);



var cXULElement_tabpanels	= function()
{
        this.items      = new AMLNodeList;
};
cXULElement_tabpanels.prototype  = new cXULElement;

cXULElement_tabpanels.prototype.selectedIndex	= null; cXULElement_tabpanels.prototype.selectedPanel	= null; 

cXULElement_tabpanels.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabpanels = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabpanels = null;
	}
};

cXULElement_tabpanels.prototype.$getTagOpen    = function()
{
	return '<div class="xul-tabpanels">\
				<table class="xul-tabpanels--table" cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">\
					<tbody>\
						<tr>\
							<td>';
};

cXULElement_tabpanels.prototype.$getTagClose	= function()
{
	return '				</td>\
						</tr>\
					</tbody>\
				</table>\
			</div>';
};

oXULNamespace.setElement("tabpanels", cXULElement_tabpanels);



var cXULElement_tabs	= function()
{
        this.items      = new AMLNodeList;
};
cXULElement_tabs.prototype   = new cXULElement;

cXULElement_tabs.prototype.tabIndex	= 0;
cXULElement_tabs.prototype.$selectable	= false;

cXULElement_tabs.prototype.selectedIndex	=-1;    cXULElement_tabs.prototype.selectedItem		= null; 
cXULElement_tabs.prototype.advanceSelectedTab    = function(nDir)
{
    if (nDir == 1)
        this.goTo(this.parentNode.selectedIndex + 1);
    else
    if (nDir ==-1)
        this.goTo(this.parentNode.selectedIndex - 1);
};

cXULElement_tabs.prototype.goTo      = function(nIndex)
{
        if (this.parentNode.selectedIndex != nIndex && this.items[nIndex])
    {
                var oEvent  = this.ownerDocument.createEvent("Events");
        oEvent.initEvent("beforeselect", false, true);
        if (this.dispatchEvent(oEvent) == false)
            return;

                if (this.parentNode.selectedTab)
            this.parentNode.selectedTab.setAttribute("selected", "false");
        if (this.parentNode.selectedPanel)
            this.parentNode.selectedPanel.setAttribute("hidden", "true");

                this.parentNode.selectedTab      = this.items[nIndex];
        this.parentNode.selectedTab.setAttribute("selected", "true");
        if (this.parentNode.tabpanels && this.parentNode.tabpanels.items[nIndex])
        {
            this.parentNode.selectedPanel    = this.parentNode.tabpanels.items[nIndex];
            this.parentNode.selectedPanel.setAttribute("hidden", "false");
        }

        this.parentNode.selectedIndex    = nIndex;

                var oEvent  = this.ownerDocument.createEvent("Events");
        oEvent.initEvent("select", false, true);
        this.dispatchEvent(oEvent);
    }
};

cXULElement_tabs.prototype.appendItem    = function(sLabel, sValue)
{
    this.insertItemAt(this.items.length, sLabel, sValue);
};

cXULElement_tabs.prototype.insertItemAt  = function(nIndex, sLabel, sValue)
{
    };

cXULElement_tabs.prototype.removeItemAt  = function(nIndex)
{
    };

cXULElement_tabs.handlers	= {
	"keydown":	function(oEvent) {
		switch (oEvent.keyIdentifier) {
			case "Left":
				var oTabBox	= this.parentNode;
				if (oTabBox.selectedTab && oTabBox.selectedTab.previousSibling)
					oTabBox.selectedTab.previousSibling.$activate();
				break;

			case "Right":
				var oTabBox	= this.parentNode;
				if (oTabBox.selectedTab && oTabBox.selectedTab.nextSibling)
					oTabBox.selectedTab.nextSibling.$activate();
				break;
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabs = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabbox)
			this.parentNode.tabs = null;
	}
};

cXULElement_tabs.prototype.$getTagOpen	= function()
{
	return '<div class="xul-tabs">\
    			<table class="xul-tabs--table" cellpadding="0" cellspacing="0" border="0">\
					<tbody>\
						<tr class="xul-tabs--gateway">\
							<td class="xul-tab-separator"><img width="1" height="1" /></td>';
};

cXULElement_tabs.prototype.$getTagClose	= function()
{
	return '				<td class="xul-tab-remainder"><img width="1" height="1" /></td>\
						</tr>\
					</tbody>\
				</table>\
			</div>';
};

oXULNamespace.setElement("tabs", cXULElement_tabs);



var cXULElement_textbox	= function(){};
cXULElement_textbox.prototype	= new cXULElement;
cXULElement_textbox.prototype.tabIndex	= 0;

cXULElement_textbox.attributes	= {};
cXULElement_textbox.attributes.value	= "";

cXULElement_textbox.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "value")
    {
        this.$getContainer("input").value    = sValue;
    }
    else
    if (sName == "disabled")
    {
    	this.$setPseudoClass("disabled", sValue == "true");
        this.$getContainer("input").disabled = sValue == "true";
    }
    else
    if (sName == "readonly")
    {
    	        this.$getContainer("input").readOnly	=(sValue == "true");
    }
    else
    if (sName == "type")
    {
                    }
    else
    if (sName == "multiline")
    {
                    }
    else
    if (sName == "maxlength")
    {

    }
    else
    if (sName == "rows")
    {
        if (this.attributes["multiline"] == "true")
            this.$getContainer("input").rows = sValue;
    }
    else
    if (sName == "cols")
    {
        if (this.attributes["multiline"] == "true")
            this.$getContainer("input").cols = sValue;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_textbox.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	},
	"keyup":	function(oEvent) {
    	this.attributes["value"]	= this.$getContainer("input").value;
	}
};

cXULElement_textbox.prototype._onChange  = function(oEvent)
{
        var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("change", false, true);
    this.dispatchEvent(oEvent);
};

cXULElement_textbox.prototype.$getTagOpen	= function(oElement)
{
	var bMultiline	= this.attributes["multiline"] == "true";
    return	'<div class="xul-textbox' + (bMultiline ? ' xul-textbox-multiline-true' : '') + (this.attributes["disabled"] == "true" ? " xul-textbox_disabled" : '')+ '" style="'+
				(this.attributes["height"] ? 'height:' + this.attributes["height"] + ';' : '')+
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + ';' : '')+ '">'+
				'<' +
				(bMultiline
					?("textarea" + (this.attributes["rows"] ? ' rows="' + this.attributes["rows"] + '"' : '')+(this.attributes["cols"] ? ' cols="' + this.attributes["cols"] + '"' : ''))
					: this.attributes["type"] == "password"
						? 'input type="password"'
						: 'input type="text"')+
					' class="xul-textbox--input" name="' + this.attributes["name"] + '" autocomplete="off" style="width:100%;' + (bMultiline ? 'height:100%;' : '') + 'margin:0;border:0px solid white;"'+
					' onblur="ample.$instance(this)._onChange(event)" onselectstart="event.cancelBubble=true;"'+
					(this.attributes["disabled"] == "true" ? ' disabled="true"' : '')+
					(this.attributes["readonly"] == "true" ? ' readonly="true"' : '')+
					(this.hasAttribute("maxlength") ? ' maxlength="' + this.getAttribute("maxlength") + '"' : '')+
				(bMultiline
					? '>' + this.attributes["value"] + '</textarea>'
					: ' value="' + this.attributes["value"] + '" />')+
			'</div>';
};

oXULNamespace.setElement("textbox", cXULElement_textbox);



var cXULElement_timepicker	= function(){};
cXULElement_timepicker.prototype	= new cXULElement;
cXULElement_timepicker.prototype.tabIndex	= 0;

cXULElement_timepicker.attributes	= {
	"mask":		'YYYY-MM-DDThh:mm:ss',
	"value":	'1970-01-01T00:00:00'
};


cXULElement_timepicker.prototype._onInputTimeChange    = function(oEvent, sName, sValue)
{
    this._setValue(sName, sValue);

        this._fireEventOnChange();
};

cXULElement_timepicker.prototype._onTimeKeyDown    = function(oEvent, sName)
{
    if (oEvent.keyIdentifier == "Up")	    {
        this._onInterval(1);
    }
    else
    if (oEvent.keyIdentifier == "Down")	    {
        this._onInterval(-1);
    }
};

cXULElement_timepicker.prototype._onSpinMouseDown	= function(oEvent, sName) {

};

cXULElement_timepicker.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("input").focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer("input").blur();
	}
};

cXULElement_timepicker.prototype.$getTagOpen		= function()
{
    var aTime    = this.attributes["value"].match(/([0-9]{2}):([0-9]{2}):([0-9]{2})$/);

    var sHtml   = '<table cellpadding="0" cellspacing="0" border="0" class="xul-timepicker' + (this.attributes["disabled"] ? " xul-timepicker_disabled" : '') + '">';
    sHtml  += '<tbody>';
    sHtml  += '<tr>';
    sHtml  += '<td width="100%"><input type="text" class="xul-timepicker--input" maxlength="8"' +(this.attributes["disabled"] ? ' disabled="true"' : '')+ ' style="border:0px solid white;width:100%;" value="' + (aTime ? aTime[1] : "00") + ':' + (aTime ? aTime[2] : "00") + ':' + (aTime ? aTime[3] : "00") + '" onchange="ample.$instance(this)._onInputTimeChange(event,  \'minutes\', this.value)" onkeydown="return ample.$instance(this)._onTimeKeyDown(event, \'minutes\')" onselectstart="event.cancelBubble=true" onkeypress="if (event.keyCode == 38 || event.keyCode == 40) return false" /></td>';
    sHtml  += '<td valign="top">';
    sHtml  += '<div class="xul-timepicker--button-up" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-up\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-up\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-up\'); ample.$instance(this)._onSpinMouseDown(event, \'up\')}"><br/></div>';
    sHtml  += '<div class="xul-timepicker--button-down" onmouseover="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', true, \'button-down\')" onmouseout="if (!ample.$instance(this).attributes[\'disabled\']) ample.$instance(this).$setPseudoClass(\'hover\', false, \'button-down\')" onmousedown="if (!ample.$instance(this).attributes[\'disabled\']) {ample.$instance(this).$setPseudoClass(\'active\', true, \'button-down\'); ample.$instance(this)._onSpinMouseDown(event, \'down\')}"><br/></div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';
    sHtml  += '</tbody>';
    sHtml  += '</table>';

    return sHtml;
};

cXULElement_timepicker.prototype.$getTagClose	= function()
{
    return '';
};

oXULNamespace.setElement("timepicker", cXULElement_timepicker);



var cXULElement_toolbar	= function(){};
cXULElement_toolbar.prototype	= new cXULElement;
cXULElement_toolbar.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_toolbar.prototype.$selectable	= false;


cXULElement_toolbar.prototype.$getTagOpen		= function()
{
    return '<div class="xul-toolbar">';
};

cXULElement_toolbar.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("toolbar", cXULElement_toolbar);



var cXULElement_toolbarbutton	= function(){};
cXULElement_toolbarbutton.prototype  = new cXULElement;

cXULElement_toolbarbutton.prototype.$hoverable	= true;
cXULElement_toolbarbutton.prototype.tabIndex	= 0;

cXULElement_toolbarbutton.prototype.setAttribute = function(sName, sValue)
{
	if (sName == "open")
	{
		var oElement	= this.getElementsByTagNameNS(this.namespaceURI, "menupopup")[0];
		if (oElement)
		{
			if (sValue == "true")
			{
	            var that	= this;
	            oElement.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
	        	oElement.addEventListener("popuphidden", function(oEvent) {
				   	oElement.removeEventListener("popuphidden", arguments.callee, false);
				    				    that.$setPseudoClass("active", false);
				    that.setAttribute("open", "false");
				}, false);

	            	            this.ownerDocument.popupNode	= oElement;
			}
			else
			{
	            oElement.hidePopup();

	            	            this.ownerDocument.popupNode	= null;
	        }
		}
	}
	else
    if (sName == "disabled")
    {
            }
    else
    if (sName == "type")
    {
            }
    else
    if (sName == "label")
    {
        var sHtml   = '';
        if (this.attributes["image"])
            sHtml  += '<img src="' + this.attributes["image"] + '" align="absmiddle" />';
        sHtml  += ' ' + sValue;
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    if (sName == "image")
    {
        var sHtml   = '';
        sHtml  += '<img src="' + sValue + '" align="absmiddle" />';
        if (this.attributes["label"])
            sHtml  += ' ' + this.attributes["label"];
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_toolbarbutton.handlers	= {
	"mouseout":		function(oEvent) {
		if (this.getAttribute("open") != "true")
		   	this.$setPseudoClass("active", false);
	},
	"mouseup":		function(oEvent) {
		if (this.getAttribute("open") != "true")
		   	this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (this.getAttribute("type") == "menu-button") {
						if (oEvent.$pseudoTarget == this.$getContainer("arrow")) {
			    if (this.getAttribute("open") == "true")
			        this.setAttribute("open", "false");
			    else {
			        this.setAttribute("open", "true");
				   	this.$setPseudoClass("active", true);
			    }
			}
			else
	        if (this.getAttribute("open") == "true")
	            return;
		}
		else
	    if (this.getAttribute("type") == "menu") {
	    	if (this.getAttribute("open") != "true")
            	this.setAttribute("open", "true");
            else
            	return;
	    }
			   	this.$setPseudoClass("active", true);
	}
};

cXULElement_toolbarbutton.prototype.$getTagOpen	= function()
{
	var sType	= this.getAttribute("type");
    return '<table cellpadding="0" cellspacing="0" border="0" class="xul-toolbarbutton' + (this.attributes["disabled"] == "true" ? " xul-toolbarbutton_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
				<tbody>\
					<tr height="3">\
						<td width="3" rowspan="3" class="xul-toolbarbutton-left"><div style="width:3px"/></td>\
						<td class="xul-toolbarbutton-top"></td>'+
					(sType == "menu-button"
					 ? '<td width="3" rowspan="3" class="xul-toolbarbutton-right"></td>'
					 : '')+
					(sType == "menu" || sType == "menu-button"
					 ? '<td class="xul-toolbarbutton-top"></td>'
					 : '')+ '\
						<td width="3" rowspan="3" class="xul-toolbarbutton-right"><div style="width:3px"/></td>\
					</tr>\
					<tr>\
						<td class="xul-toolbarbutton--gateway">' +
					(this.getAttribute("image")
						? '<img src="' + this.getAttribute("image") + '" align="absmiddle"/>'
						: '')+
					(this.getAttribute("label")
						? ' ' + this.getAttribute("label")
						: '');

    return sHtml;
};

cXULElement_toolbarbutton.prototype.$getTagClose	= function()
{
	var sType	= this.getAttribute("type");
	return 				'</td>'+
    				(sType == "menu" || sType == "menu-button"
    				 ? '<td class="xul-toolbarbutton-arrow"><div class="xul-toolbarbutton--arrow"><br /></div></td>'
    				 : '') + '\
					</tr>\
					<tr height="3">\
						<td class="xul-toolbarbutton-bottom"></td>'+
					(sType == "menu" || sType == "menu-button"
					 ? '<td class="xul-toolbarbutton-bottom"></td>'
					 : '')+ '\
					</tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("toolbarbutton", cXULElement_toolbarbutton);



var cXULElement_toolbargrippy	= function(){};
cXULElement_toolbargrippy.prototype  = new cXULElement;


cXULElement_toolbargrippy.prototype.$getTagOpen	= function()
{
    return (this.parentNode instanceof cXULElement_menubar ? "<td>" : "") + '<div class="xul-toolbargrippy"><br /></div>';
};

cXULElement_toolbargrippy.prototype.$getTagClose	= function()
{
	return this.parentNode instanceof cXULElement_menubar ? "</td>" : "";
};

oXULNamespace.setElement("toolbargrippy", cXULElement_toolbargrippy);



var cXULElement_toolbarseparator	= function(){};
cXULElement_toolbarseparator.prototype	= new cXULElement;


cXULElement_toolbarseparator.prototype.$getTagOpen	= function()
{
    return '<div class="xul-toolbarseparator"><br /></div>';
};

oXULNamespace.setElement("toolbarseparator", cXULElement_toolbarseparator);



var cXULElement_toolbox	= function(){};
cXULElement_toolbox.prototype	= new cXULElement;
cXULElement_toolbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_toolbox.attributes	= {};
cXULElement_toolbox.attributes.orient	= "vertical";


cXULElement_toolbox.prototype.$getTagOpen		= function()
{
    return '<div class="xul-toolbox">';
};

cXULElement_toolbox.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("toolbox", cXULElement_toolbox);



var cXULElement_tooltip_pane	= function(){};
cXULElement_tooltip_pane.prototype	= new cXULPopupElement;

cXULElement_tooltip_pane.prototype.setText	= function(sValue)
{
	this.$getContainer("gateway").innerHTML	= sValue;
};

cXULElement_tooltip_pane.prototype.$getTagOpen	= function()
{
    return '<div class="xul-tooltip-pane" style="position:absolute;display:none;">\
				<div class="xul-menupopup--shadow-right" style="position:absolute;"></div>\
				<div class="xul-menupopup--shadow-bottom" style="position:absolute;"></div>\
				<div class="xul-tooltip-pane--gateway">';
};

cXULElement_tooltip_pane.prototype.$getTagClose	= function()
{
	return '	</div>\
			</div>';
};

oXULNamespace.setElement("tooltip-pane", cXULElement_tooltip_pane);



var cXULElement_tooltip	= function(){};
cXULElement_tooltip.prototype	= new cXULPopupElement;
cXULElement_tooltip.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_tooltip.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "top")
    {
        if (!isNaN(sValue) && !isNaN(this.attributes["left"]))
            this.moveTo(this.attributes["left"] * 1, sValue * 1);
    }
    else
    if (sName == "left")
    {
        if (!isNaN(sValue) && !isNaN(this.attributes["top"]))
            this.moveTo(sValue * 1, this.attributes["top"] * 1);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_tooltip.prototype.$getTagOpen		= function()
{
    return '<div style="display:none;position:absolute;" class="xul-tooltip">';
};

cXULElement_tooltip.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("tooltip", cXULElement_tooltip);



var cXULElement_tree	= function()
{
        this.items  = new AMLNodeList;
	this.selectedItems	= new AMLNodeList;
};
cXULElement_tree.prototype	= new cXULSelectElement;
cXULElement_tree.prototype.tabIndex		= 0;
cXULElement_tree.prototype.$selectable	= false;

cXULElement_tree.prototype.head	= null;
cXULElement_tree.prototype.body	= null;

cXULElement_tree.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "disabled")
    {
            }
    else
    if (sName == "seltype")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_tree.prototype.changeOpenState		= function(oRow, bState)
{
	if (oRow && oRow instanceof cXULElement_treerow)
	{
		if (arguments.length < 2)
			bState	= oRow.parentNode.getAttribute("open") != "true";
		oRow.setAttribute("open", bState ? "true" : "false");
	}
};

cXULElement_tree.prototype.ensureRowIsVisible    = function(nIndex)
{
    var oElement    = this.items[nIndex];
    do {
        if (oElement.parentNode.attributes["hidden"] == "true")
            return false;
        oElement    = oElement.parentNode.parentNode;
    } while (oElement != this.body);

        return true;
};

cXULElement_tree.prototype.refresh   = function()
{
    if (this.body && this.body.children)
        this.body.children.refresh();
};

cXULElement_tree.handlers	= {
	"keydown":	function(oEvent) {
	    if (this.currentItem)
	    {
	        if (oEvent.keyIdentifier == "Up")
	        {
	            	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;

	            	            while (nIndex - 1 > 0 && this.ensureRowIsVisible(nIndex - 1) == false)
	                nIndex--;

	            if (nIndex > 0)
	            {
	                if (oEvent.shiftKey)
	                {
	                    	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex > this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex++;

	                    this.toggleItemSelection(this.items[nIndex-1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex-1]);

	                	                this.scrollToIndex(nIndex-1);
	            }
	            	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Down")
	        {
	            	            var nIndex  = this.selectedItems[this.selectedItems.length-1].$getContainer().rowIndex;

	            	            while (nIndex + 1 < this.items.length && this.ensureRowIsVisible(nIndex + 1) == false)
	                nIndex++;

	            if (nIndex < this.items.length - 1)
	            {
	                if (oEvent.shiftKey)
	                {
	                    	                    if (this.selectedItems.length > 1)
	                        if (this.currentItem.$getContainer().rowIndex < this.selectedItems[0].$getContainer().rowIndex)
	                            nIndex--;

	                    this.toggleItemSelection(this.items[nIndex+1]);
	                }
	                else
	                    this.selectItem(this.items[nIndex+1]);

	                	                this.scrollToIndex(nIndex+1);
	            }
	            	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Right")
	        {
	            	            if (this.currentItem.children)
	            {
	                if (this.currentItem.attributes["open"] == "true")
	                    this.selectItem(this.currentItem.children.items[0]);
	                else
	                    this.currentItem.setAttribute("open", "true");
	            }

	            	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Left")
	        {
	            	            if (this.currentItem.children && this.currentItem.attributes["open"] == "true")
	                this.currentItem.setAttribute("open", "false");
	            else
	            if (this.currentItem.parentNode.parentNode != this.body)
	                this.selectItem(this.currentItem.parentNode.parentNode);

	            	            oEvent.preventDefault();
	        }
	        else
	        if (oEvent.keyIdentifier == "Enter")
	        {
	            	            if (this.currentItem.children)
	                this.currentItem.setAttribute("open", this.currentItem.attributes["open"] == "true" ? "false" : "true");
	        }
	    }
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_treebody)
			this.body = oEvent.target;
		else
		if (oEvent.target instanceof cXULElement_treecols)
			this.head = oEvent.target;
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target instanceof cXULElement_treebody)
			this.body = null;
		else
		if (oEvent.target instanceof cXULElement_treecols)
			this.head = null;
	}
};

cXULElement_tree.prototype.$getTagOpen		= function()
{
    return '<table class="xul-tree' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0" height="' +(this.attributes["height"] ? this.attributes["height"] : '100%')+ '" width="' +(this.attributes["width"] ? this.attributes["width"] : '100%')+ '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"' : '')+ '>\
    			<tbody class="xul-tree--gateway">';
};

cXULElement_tree.prototype.$getTagClose	= function()
{
    return 		'</tbody>\
    		</table>';
};

oXULNamespace.setElement("tree", cXULElement_tree);



var cXULElement_treebody	= function(){};
cXULElement_treebody.prototype   = new cXULElement;

cXULElement_treebody.prototype.children	= null;


cXULElement_treebody.prototype._onScroll     = function()
{
    if (this.parentNode.head)
        this.parentNode.head.$getContainer("area").scrollLeft  = this.$getContainer("area").scrollLeft;
};

cXULElement_treebody.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= this.parentNode;

								this.children  = oEvent.target;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= null;

								this.children  = null;
			}
	}
};

cXULElement_treebody.prototype.$getTagOpen	= function()
{
    return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
				<td style="height:100%">\
					<div class="xul-treebody--area" style="height:100%;width:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this)._onScroll(event)">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-treebody' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="position:absolute;' + (navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 == 7 ? 'border-left: solid 18px white;margin-left:-18px;' : '') + '">\
							<tbody class="xul-treebody--gateway">';
};

cXULElement_treebody.prototype.$getTagClose	= function()
{
    var sHtml   = '</tbody>';
    if (this.parentNode.head)
    {
        sHtml  += '<tfoot class="xul-treebody--foot">';
        sHtml  += '<tr>';
        if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
            sHtml  += '<td width="20" style="width:20px"><div style="width:20px" /></td>';
        for (var nIndex = 0, aItems = this.parentNode.head.items; nIndex < aItems.length; nIndex++)
            sHtml  += '<td' + (aItems[nIndex].attributes["width"] ? ' width="' + aItems[nIndex].attributes["width"] + '"' : '') + '><div style="height:1px;' + (aItems[nIndex].attributes["minwidth"] ? 'width:' + aItems[nIndex].attributes["minwidth"] + 'px' : '') + '"/></td>';
        sHtml  += '</tr>';
        sHtml  += '</tfoot>';
    }
    sHtml  += '</table>';
    sHtml  += '</div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';

    return sHtml;
};

oXULNamespace.setElement("treebody", cXULElement_treebody);



var cXULElement_treecell	= function(){};
cXULElement_treecell.prototype   = new cXULElement;

cXULElement_treecell.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "label")
    {
        var sHtml   = '';
        if (this.attributes["src"])
            sHtml  += '<img src="' + this.attributes["src"] + '" align="absmiddle" /> ';
        sHtml  += sValue;
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    if (sName == "src")
    {
        var sHtml   = '';
        sHtml  += '<img src="' + sValue + '" align="absmiddle" /> ';
        if (this.attributes["label"])
            sHtml  += this.attributes["label"];
        this.$getContainer("gateway").innerHTML  = sHtml;
    }
    else
    if (sName == "editable")
    {
        if (sValue == "true")
        {
        	var oElementDOM	= this.$getContainer("gateway");
            oElementDOM.innerHTML  = '<input style="border:none; margin:0px; margin-left: 2px; padding-left: 2px; padding-top:1px; width:100px;" onselectstart="event.cancelBubble=true;" onchange="ample.$instance(this).setAttribute(\'label\', this.value)" onblur="this.onchange();" onkeydown="if (event.keyCode == 13) this.onchange(); else if (event.keyCode == 27) ample.$instance(this).setAttribute(\'editable\', \'false\')"/>';
            oElementDOM.firstChild.focus();
            oElementDOM.firstChild.value   = this.attributes["label"];
        }
        else
            this.setAttribute("label", this.attributes["label"]);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_treecell.prototype._onNodeClick	= function(oEvent)
{
	this.parentNode.parentNode.setAttribute("open", this.parentNode.parentNode.getAttribute("open") == "true" ? "false" : "true");
};

cXULElement_treecell.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oChildren	= this.parentNode.parentNode.parentNode;
		if (oChildren.tree.head && oChildren.tree.head._getPrimaryColIndex() == this.parentNode.childNodes.$indexOf(this))
			oChildren.refresh();
	}
};

cXULElement_treecell.prototype.$getTagOpen	= function()
{
    var sHtml   = '<td class="xul-treecell">';

	var oChildren	= this.parentNode.parentNode.parentNode;
    if (oChildren.tree && oChildren.tree.head && this.parentNode.cells && (oChildren.tree.head._getPrimaryColIndex() == this.parentNode.cells.$indexOf(this)))
    {
        var oElementCurrent = this;
        do {
            if (oElementCurrent instanceof cXULElement_treeitem)
                sHtml  += '<div onmousedown="return ample.$instance(this)._onNodeClick(event);" class="xul-treecell-line"><br /></div>';
            else
            if (oElementCurrent instanceof cXULElement_tree)
                break;
        } while(oElementCurrent = oElementCurrent.parentNode);
    }

    sHtml  += '<div class="xul-treecell--gateway">';
    if (this.attributes["src"])
        sHtml  += '<img src="' + this.attributes["src"] + '" align="absmiddle"/> ';
    sHtml  += this.attributes["label"] ? this.attributes["label"] : '';

    return sHtml;
};

cXULElement_treecell.prototype.$getTagClose	= function()
{
    return '</div></td>';
};

oXULNamespace.setElement("treecell", cXULElement_treecell);



var cXULElement_treechildren	= function()
{
        this.items  = new AMLNodeList;
};
cXULElement_treechildren.prototype	= new cXULElement;

cXULElement_treechildren.prototype.tree	= null;

cXULElement_treechildren.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "hidden")
    {
        for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        {
            this.items[nIndex].setAttribute("hidden", sValue);
            if (this.items[nIndex].children && this.items[nIndex].getAttribute("open") != "false")
                this.items[nIndex].children.setAttribute("hidden", sValue);
        }
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};



cXULElement_treechildren.prototype.refresh	= function()
{
    var nPrimaryCol = this.tree.head._getPrimaryColIndex();
    if (nPrimaryCol ==-1)
        return;

	var aStack	= [];
	for (var oElement = this; !(oElement instanceof cXULElement_tree); oElement = oElement.parentNode.parentNode)
		aStack.unshift(oElement);
	this._refresh(aStack, nPrimaryCol);
};

cXULElement_treechildren.prototype._refresh	= function(aStack, nPrimaryCol)
{
    var nDepth		= aStack.length,
    	oChildren   = aStack[nDepth - 1],
    	nItems 		= oChildren.items.length;

    for (var nItem = 0, oItem, oElementDOM; nItem < nItems; nItem++)
    {
                oItem		= oChildren.items[nItem];
        oElementDOM	= oItem.row.cells[nPrimaryCol].$getContainer();

                for (var nIndex = 0; nIndex < nDepth - 1; nIndex++)
            oElementDOM.childNodes[nIndex].className = "xul-treecell-line" +(aStack[nIndex + 1].parentNode == aStack[nIndex + 1].parentNode.parentNode.items[aStack[nIndex + 1].parentNode.parentNode.items.length - 1] ? "" : " xul-treecell-line-regular");

                oElementDOM.childNodes[nDepth - 1].className  = "xul-treecell-line xul-treecell-line-" +(nItem == nItems - 1 ? "last" : "next");

                if (oItem.getAttribute("container") == "true") {
                        if (oItem.children)
	            this._refresh(aStack.concat(oItem.children), nPrimaryCol);

                        oElementDOM.childNodes[nDepth - 1].className = "xul-treecell--toc" +(oChildren.items[nItem].attributes["open"] == "true" ? " xul-treecell--toc_open" : "");
        }
    }
};

cXULElement_treechildren.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treeitem) {
				this.items.$add(oEvent.target);
				this.tree.items.$add(oEvent.target);
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treeitem) {
			    if (this.tree.selectedItems.$indexOf(oEvent.target) !=-1)
				    this.tree.removeItemFromSelection(oEvent.target);

				this.items.$remove(oEvent.target);
				this.tree.items.$remove(oEvent.target);
			}
	}
};

cXULElement_treechildren.prototype.$getContainer	= function(sName) {
	return sName == "gateway" ? this.parentNode.$getContainer("gateway") : null;
};

oXULNamespace.setElement("treechildren", cXULElement_treechildren);



var cXULElement_treecol	= function(){};
cXULElement_treecol.prototype	= new cXULElement;
cXULElement_treecol.prototype.$hoverable	= true;

cXULElement_treecol.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "label")
    {
        this.$getContainer("label").innerHTML	= sValue;
    }
    else
    if (sName == "hidden" || sName == "hideheader")
    {
    	var nCell	= this.parentNode.items.$indexOf(this);
    	this.$getContainer().style.display	= sValue == "true" ? "none" : "";
        for (var nIndex = 0, aItems = this.parentNode.parentNode.items; nIndex < aItems.length; nIndex++)
        	if (aItems[nIndex].row)
        		aItems[nIndex].row.cells[nCell].setAttribute(sName, sValue);
        this.parentNode.parentNode.body.$getContainer("foot").rows[0].cells[nCell + 1].style.display	= sValue == "true" ? "none" : "";
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_treecol.handlers	= {
	"mouseleave":	function(oEvent) {
		this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		this.$setPseudoClass("active", true);
	},
	"mouseup":		function(oEvent) {
		this.$setPseudoClass("active", false);
	}

};

cXULElement_treecol.prototype.$getTagOpen	= function()
{
	return '<th class="xul-treecol' +(this.attributes["class"] ? " " + this.attributes["class"] : "")+ '"' +(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : "")+(this.attributes["hideheader"] == "true" ? ' style="display:none"' : "")+ ' align="left">\
    			<div class="xul-treecol--label"' + (this.attributes["minwidth"] ? ' style="width:' + this.attributes["minwidth"] + 'px"' : '') + '> ' +(this.attributes["label"] || "");
};

cXULElement_treecol.prototype.$getTagClose	= function()
{
    return		'</div>\
			</th>';
};

oXULNamespace.setElement("treecol", cXULElement_treecol);



var cXULElement_treecols	= function()
{
        this.items  = new AMLNodeList;
};
cXULElement_treecols.prototype   = new cXULElement;


cXULElement_treecols.prototype._getPrimaryColIndex   = function()
{
    for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        if (this.items[nIndex].attributes["primary"] == "true")
            return nIndex;
    return -1;
};

cXULElement_treecols.prototype._onCommandClick   = function(oEvent)
{
    if (this.parentNode.attributes["type"] == "checkbox")
    {
        if (this.$getContainer("command").checked)
            this.parentNode.selectAll();
        else
            this.parentNode.clearSelection();
    }
    else
    if (this.parentNode.attributes["type"] == "radio")
    {
        if (this.$getContainer("command").checked)
            this.parentNode.clearSelection();
    }
};

cXULElement_treecols.handlers	= {
	"click":	function(oEvent) {
		if (oEvent.button == 2 || (oEvent.button == 0 && oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("settings"))) {
			var oPopup	= cXULSelectElement.getSettingsPopup(this);
			oPopup.showPopup(this, 0, 0, cXULPopupElement.POPUP_TYPE_POPUP);

			if (oEvent.button == 2) {
								var oPositionPopup	= oPopup.getBoundingClientRect();
								oPopup.moveTo(	oEvent.clientX - oPositionPopup.left,
								oEvent.clientY - oPositionPopup.top);

								oEvent.preventDefault();
			}
			else {
								var oPositionPopup	= oPopup.getBoundingClientRect(),
					oPositionSelf	= this.getBoundingClientRect();
								oPopup.moveTo(	oPositionSelf.right - oPositionPopup.right,
			 					oPositionSelf.bottom - oPositionPopup.top);
			}

			this.ownerDocument.popupNode	= oPopup;
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecol)
				this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecol)
				this.items.$remove(oEvent.target);
	}
};

cXULElement_treecols.prototype.$getTagOpen	= function()
{
    return '<tr' + (this.attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>\
				<td class="xul-treecols--container" valign="top" height="1">\
					<div class="xul-treecol" style="float:right"><div class="xul-treecol--label"><div class="xul-treecols--settings"><br /></div></div></div>\
					<div class="xul-treecols--area" style="height:18px;overflow:hidden;position:relative;">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" style="height:18px;position:absolute;" class="xul-treecols">\
							<thead>\
								<tr class="xul-treecols--gateway">' +
    								(this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio"
    								? ('<th class="xul-listheader" style="width:20px">' +
        								(this.parentNode.attributes["type"] == "checkbox"
        								? '<input type="checkbox" name="' + this.parentNode.uniqueID + '_cmd" class="xul-treecol--command" onclick="return ample.$instance(this)._onCommandClick(event)" autocomplete="off" />'
										: (this.parentNode.attributes["type"] == "radio"
											? '<input type="radio" name="' + this.parentNode.uniqueID + '_cmd" class="xul-treecol--command" checked="true" onclick="return ample.$instance(this)._onCommandClick(event)"/>'
											: ' ')) +
										'</th>')
									: '');
};

cXULElement_treecols.prototype.$getTagClose	= function()
{
	return 						'</tr>\
							</thead>\
						</table>\
					</div>\
				</td>\
			</tr>';
};

oXULNamespace.setElement("treecols", cXULElement_treecols);



var cXULElement_treeitem	= function(){};
cXULElement_treeitem.prototype   = new cXULElement;

cXULElement_treeitem.prototype.row		= null; cXULElement_treeitem.prototype.children	= null; 
cXULElement_treeitem.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
        if (this.parentNode.tree.attributes["type"] == "checkbox" || this.parentNode.tree.attributes["type"] == "radio")
            this.$getContainer("command").checked = sValue == "true";
    }
    else
    if (sName == "open")
    {
        if (this.children)
        {
                        this.children.setAttribute("hidden", sValue == "true" ? "false" : "true");

                        if (this.parentNode.tree.head)
            {
                var nDepth  = this._getNodeDepth();
                var nIndex  = this.parentNode.tree.head._getPrimaryColIndex();
                if (nIndex !=-1 && this.row.cells[nIndex])
                {
                	                	this.row.cells[nIndex].$setPseudoClass("open", sValue == "true", "toc");

										this.AMLElement.setAttribute.call(this, sName, sValue);

					var oEvent = this.ownerDocument.createEvent("Events");
					oEvent.initEvent("OpenStateChange", true, false);
					this.dispatchEvent(oEvent);

					return;
                }
            }
        }
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_treeitem.prototype._getNodeDepth = function()
{
	var oElement= this.parentNode;
    var nDepth  = 0;
    while (oElement = oElement.parentNode.parentNode)
        if (oElement instanceof cXULElement_tree)
            break;
        else
            nDepth++;
    return nDepth;
};

cXULElement_treeitem.handlers	= {
	"mousedown":	function(oEvent) {
				if (oEvent.target.parentNode != this && oEvent.target.parentNode.parentNode != this)
			return;

	    	    if (oEvent.button == 2 && this.parentNode.tree.selectedItems.$indexOf(this) !=-1)
	        return;

	    if (oEvent.shiftKey)
	    {
			if (this.parentNode.tree.currentItem)
				this.parentNode.tree.selectItemRange(this, this.parentNode.tree.currentItem);
	    }
		else
	    {
	        if (oEvent.ctrlKey)
	            this.parentNode.tree.toggleItemSelection(this);
	        else
	            this.parentNode.tree.selectItem(this);
	    }
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treerow)
				this.row		= oEvent.target;
			else
			if (oEvent.target instanceof cXULElement_treechildren) {
				this.children	= oEvent.target;
				oEvent.target.tree	= this.parentNode.tree;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treerow)
				this.row		= null;
			else
			if (oEvent.target instanceof cXULElement_treechildren) {
				this.children	= null;
				oEvent.target.tree	= null;
			}
	}
};

cXULElement_treeitem.prototype.$getContainer	= function(sName) {
	return sName == "gateway" ? this.parentNode.$getContainer("gateway") : this.row ? this.row.$getContainer(sName) : null;
};

oXULNamespace.setElement("treeitem", cXULElement_treeitem);



var cXULElement_treerow	= function()
{
        this.cells      = new AMLNodeList;
};
cXULElement_treerow.prototype	= new cXULElement;
cXULElement_treerow.prototype.$hoverable	= true;


cXULElement_treerow.prototype._onCommandClick   = function(oEvent)
{
	var oTree	= this.parentNode.parentNode.tree;
    if (this.$getContainer("command").checked)
    {
        if (oTree.attributes["type"] == "radio")
            oTree.selectItem(this.parentNode);
        else
        if (oTree.attributes["type"] == "checkbox")
            oTree.addItemToSelection(this.parentNode);
    }
    else
    {
        oTree.removeItemFromSelection(this.parentNode);
    }
};

cXULElement_treerow.handlers	= {
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

cXULElement_treerow.prototype.$getTagOpen	= function()
{
	var oTree	= this.parentNode.parentNode.tree;
    if (this.parentNode.parentNode.parentNode.attributes["open"] == "false")
        this.parentNode.parentNode.attributes["hidden"] = "true";

	return '<tr class="xul-treerow' + (this.attributes["class"] ? " xul-treerow_" + this.attributes["class"] : '') + '"' + (this.parentNode.parentNode.parentNode.attributes["open"] == "false" ? ' style="display:none"' : '')+ '>' +
	    	(this.parentNode.attributes["label"] || (oTree && (oTree.attributes["type"] == "checkbox" || oTree.attributes["type"] == "radio"))
			? ('<td style="padding:0" align="center" onmousedown="event.cancelBubble=true" class="xul-treecell">' +
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

cXULElement_treerow.prototype.$getTagClose	= function()
{
    return '</tr>';
};

oXULNamespace.setElement("treerow", cXULElement_treerow);



var cXULElement_vbox	= function(){};
cXULElement_vbox.prototype	= new cXULElement_box;

cXULElement_vbox.attributes	= {};
cXULElement_vbox.attributes.orient	= "vertical";

oXULNamespace.setElement("vbox", cXULElement_vbox);



var cXULElement_window	= function(){};
cXULElement_window.prototype	= new cXULElement;
cXULElement_window.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;
cXULElement_window.prototype.$draggable	= true;
cXULElement_window.prototype.$resizable	= true;

cXULElement_window.attributes	= {};
cXULElement_window.attributes.orient	= "vertical";
cXULElement_window.attributes.width		= "100%";
cXULElement_window.attributes.height	= "100%";

cXULElement_window.handlers	= {
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
	}
};

cXULElement_window.prototype.$getTagOpen	= function()
{
	return '<table class="xul-window'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0"' +
				(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '') +
				(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '') +
				(this.attributes["hidden"] == "true" ? ' style="display:none;"' : '') + '>\
				<thead ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<tr>\
						<th class="xul-window--head" height="1">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%">\
								<tbody>\
									<tr>\
										<td class="xul-window--title">' +(this.attributes["title"] ? this.attributes["title"] : " ")+ '</td>\
										<td width="1"><div class="xul-window--button-close xul-window--button-close_normal" onclick="ample.$instance(this).setAttribute(\'hidden\', \'true\')" onmouseover="this.className=this.className.replace(\'normal\', \'hover\')" onmouseout="this.className=this.className.replace(/hover|active/, \'normal\')" onmousedown="this.className=this.className.replace(\'hover\', \'active\')" onmouseup="this.className=this.className.replace(\'active\', \'normal\')"><br /></div></td>\
									</tr>\
								</tbody>\
							</table>\
						</th>\
					</tr>\
				</thead>\
				<tbody>\
					<tr>\
						<td class="xul-window--body" height="100%">';
};

cXULElement_window.prototype.$getTagClose	= function()
{
	return 				'</td>\
					</tr>\
				</tbody>\
			</table>';
};

oXULNamespace.setElement("window", cXULElement_window);



var cXULElement_wizard	= function()
{
        this._buttons   = {};       this._actions   = [];   
        this.wizardPages= new AMLNodeList;
};
cXULElement_wizard.prototype = new cXULElement;
cXULElement_wizard.prototype.currentPage	= null;
cXULElement_wizard.prototype.$draggable	= true;
cXULElement_wizard.prototype.$resizable	= true;

cXULElement_wizard.attributes	= {};
cXULElement_wizard.attributes.width		= "100%";
cXULElement_wizard.attributes.height	= "100%";

cXULElement_wizard.prototype.setAttribute    = function(sName, sValue)
{
    if (sName == "title")
    {
        this.$getContainer("title").innerHTML   = sValue;
    }
    else
    if (sName == "pagestep")
    {
        if (this.wizardPages[sValue])
            this.goTo(this.wizardPages[sValue]);
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_wizard.prototype.advance = function(sId)
{
    if (this.currentPage)
    {
    	if (!this.currentPage._fireEventOnPage("hide"))
        	return;

	    if (!this.currentPage._fireEventOnPage("advanced"))
	        return;
	}

    if (!this._fireEventOnWizard("next"))
        return;

    if (this.currentPage && (sId = sId || this.currentPage.attributes["next"]))
    {
               	this._actions.push(this.currentPage);

        this.goTo(sId);
    }
};

cXULElement_wizard.prototype.rewind  = function()
{
    if (this.currentPage)
    {
    	if (!this.currentPage._fireEventOnPage("hide"))
        	return;

	    if (!this.currentPage._fireEventOnPage("rewound"))
	        return;
    }

    if (!this._fireEventOnWizard("back"))
        return;

    var oElement    = this._actions.pop();
    if (oElement)
        this.goTo(oElement.attributes["pageid"]);
};

cXULElement_wizard.prototype.cancel  = function()
{
    if (this._fireEventOnWizard("cancel"))
        this.setAttribute("hidden", "true");

};

cXULElement_wizard.prototype.finish  = function()
{
    if (this._fireEventOnWizard("finish"))
        this.setAttribute("hidden", "true");

};

cXULElement_wizard.prototype.goTo    = function(sId)
{
    var oElement;
    if (oElement = this.getPageById(sId))
    {
        if (this.currentPage)
            this.currentPage.setAttribute("hidden", "true");

        this.currentPage    = oElement;

        this.currentPage.setAttribute("hidden", "false");
        this.$getContainer("label").innerHTML	= this.currentPage.attributes["label"] || " ";
        this.$getContainer("description").innerHTML	= this.currentPage.attributes["description"] || " ";

        
      	this.$getContainer("button-back").disabled	= this.attributes["firstpage"] == sId;
        this.$getContainer("button-next").style.display	= this.attributes["lastpage"]    == sId ? "none" :"";
        this.$getContainer("button-finish").style.display	= this.attributes["lastpage"]    == sId ? "": "none";

        this.currentPage._fireEventOnPage("show");
    }
};

cXULElement_wizard.prototype.getPageById = function(sId)
{
    for (var nIndex = 0; nIndex < this.wizardPages.length; nIndex++)
        if (this.wizardPages[nIndex].attributes["pageid"] == sId)
            return this.wizardPages[nIndex];

    return null;
};

cXULElement_wizard.prototype.getButton   = function(sName)
{
    return this._buttons[sName];
};

cXULElement_wizard.prototype._fireEventOnWizard  = function(sName)
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("wizard" + sName, false, true);

    return this.dispatchEvent(oEvent);
};

cXULElement_wizard.prototype._onButtonClick  = function(oEvent, sName)
{
    if (sName == "button-back")
        this.rewind();
    else
    if (sName == "button-next")
        this.advance();
    else
    if (sName == "button-finish")
        this.finish();
    else
    if (sName == "button-cancel")
        this.cancel();
};

cXULElement_wizard.handlers	= {
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_wizardpage)
				this.wizardPages.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_wizardpage)
				this.wizardPages.$remove(oEvent.target);
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.attributes["pagestep"] &&(this.wizardPages.length > this.attributes["pagestep"]))
			this.goTo(this.wizardPages[this.attributes["pagestep"]].attributes["pageid"]);
		else
		if (this.attributes["firstpage"])
			this.goTo(this.attributes["firstpage"]);
		else
		if (this.wizardPages.length)
			this.goTo(this.wizardPages[0].attributes["pageid"]);
	}
};

cXULElement_wizard.prototype.$getTagOpen    = function()
{
	return '<table class="xul-wizard'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" cellpadding="0" cellspacing="0" border="0"' +
				(this.attributes["width"] ? ' width="' + this.attributes["width"] + '"' : '') +
				(this.attributes["height"] ? ' height="' + this.attributes["height"] + '"' : '') +
				(this.attributes["hidden"] == "true" ? ' style="display:none;"' : '') + '>\
				<thead ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<tr>\
						<th class="xul-wizard--head" height="1">\
							<table cellpadding="0" cellspacing="0" border="0" width="100%">\
								<tbody>\
									<tr><td class="xul-wizard--title">' +(this.attributes["title"] ? this.attributes["title"] : " ")+ '</td></tr>\
								</tbody>\
							</table>\
						</th>\
					</tr>\
				</thead>\
				<tbody>\
				<tr><td class="xul-wizardheader xul-wizard--header" valign="top"><div class="xul-wizardheader--title xul-wizard--label"></div><div class="xul-wizardheader--description xul-wizard--description"></div></td></tr>\
				<tr><td class="xul-wizard--body" valign="top" height="100%">';
};

cXULElement_wizard.prototype.$getTagClose  = function()
{
	return '<br /></td></tr>\
				</tbody>\
				<tfoot>\
					<tr>\
						<td align="right" class="xul-wizard--foot">\
							<table cellpadding="0" cellspacing="0" border="0">\
								<tbody>\
									<tr>\
										<td><button class="xul-wizard--button-back" onclick="ample.$instance(this)._onButtonClick(event, \'button-back\')" disabled="true">&lt; Back</button></td>\
										<td><button class="xul-wizard--button-next" onclick="ample.$instance(this)._onButtonClick(event, \'button-next\')" style="display:none">Next &gt;</button></td>\
										<td><button class="xul-wizard--button-finish" onclick="ample.$instance(this)._onButtonClick(event, \'button-finish\')">Finish</button></td>\
										<td width="8"><br /></td>\
										<td><button class="xul-wizard--button-cancel" onclick="ample.$instance(this)._onButtonClick(event, \'button-cancel\')">Cancel</button></td>\
									</tr>\
								</tbody>\
							</table>\
						</td>\
					</tr>\
				</tfoot>\
	    	</table>';
};

oXULNamespace.setElement("wizard", cXULElement_wizard);



var cXULElement_wizardpage	= function(){};
cXULElement_wizardpage.prototype = new cXULElement;
cXULElement_wizardpage.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

cXULElement_wizardpage.attributes	= {};
cXULElement_wizardpage.attributes.hidden	= "true";

cXULElement_wizardpage.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "label")
    {
        if (this.parentNode.currentPage == this)
            this.parentNode.$getContainer("label").innerHTML		= sValue;
    }
    else
    if (sName == "description")
    {
        if (this.parentNode.currentPage == this)
            this.parentNode.$getContainer("description").innerHTML	= sValue;
    }
    else
    if (sName == "next")
    {

    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cXULElement_wizardpage.prototype._fireEventOnPage    = function(sName)
{
    var oEvent  = this.ownerDocument.createEvent("Events");
    oEvent.initEvent("page" + sName, false, true);

    return this.dispatchEvent(oEvent);
};

cXULElement_wizardpage.prototype.$getTagOpen	= function()
{
    return '<div class="xul-wizardpage"' +(this.attributes["hidden"] == "true" ? ' style="display:none"' : '')+ '>';
};

cXULElement_wizardpage.prototype.$getTagClose	= function()
{
    return '</div>';
};

oXULNamespace.setElement("wizardpage", cXULElement_wizardpage);


})()
