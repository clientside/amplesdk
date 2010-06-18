/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement	= function(){};

// Constants
cXULElement.VIEW_TYPE_VIRTUAL	= 0;    // Element is not rendered [keyset, key, stringset, string]
cXULElement.VIEW_TYPE_BOXED		= 1;    // Element is rendered as boxed
cXULElement.VIEW_TYPE_NORMAL	= 2;    // Element is rendered as not boxed

cXULElement.prototype	= new AMLElement;
cXULElement.prototype.viewType		= cXULElement.VIEW_TYPE_NORMAL;

// Private Methods
cXULElement.prototype.$mapAttribute	= function(sName, sValue)
{
	var oElementDOM	= this.$getContainer();
	switch (sName)
	{
		case "hidden":
	        // hide boxed container
	        if (this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
	        {
	            if (this.parentNode.attributes["orient"] != "vertical")
	                oElementDOM.parentNode.style.display   =(sValue == "true" ? "none" : "");
	            else
	                oElementDOM.parentNode.parentNode.style.display    =(sValue == "true" ? "none" : "");

	            // Update flexible parameters
	            this.parentNode.refresh();
	        }
	        // hide the container
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
			// TODO
			break;

		case "align":
			// TODO
			break;

		case "width":
		case "height":
	    	if (this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
	    		oElementDOM.parentNode[sName] = sValue;
	    	else
		        oElementDOM.style[sName]  = sValue;
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

// Public methods
cXULElement.prototype.doCommand		= function()
{
    // Fire Event
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

        // Count the amount of elements and their cumulative flex
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

        // Refresh flexible elements
        if (nElements)
        {
            var oElementDOM	= this.$getContainer("xul-box"),
            	oCell;
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
                        // set heights
                    	oCell	= oElementDOM.rows[nIndex - nVirtual].cells[0];
                        if (!isNaN(oElement.attributes["flex"]))
                        	oCell.setAttribute("height", oElement.attributes["flex"] * 100 / nFlex + "%");
                        else
                        if (oElement.attributes["height"])
                        	oCell.setAttribute("height", oElement.attributes["height"]);
                    }
                    else
                    {
                        // set widths
                    	oCell	= oElementDOM.rows[0].cells[nIndex - nVirtual];
                        if (!isNaN(oElement.attributes["flex"]))
                        	oCell.setAttribute("width", oElement.attributes["flex"] * 100 / nFlex + "%");
                        else
                        if (oElement.attributes["width"])
                        	oCell.setAttribute("width", oElement.attributes["width"]);
                    }
                }
            }
            //
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

	if (this.parentNode && (this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED || this.parentNode instanceof cXULElement_row))
		aHtml[aHtml.length]	= cXULElement.getBoxOpenChild(this);

	// Output Element Header
	if (this.viewType != cXULElement.VIEW_TYPE_VIRTUAL) {
		aHtml[aHtml.length]	= this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(this.attributes.id || this.uniqueID)+ '"');
		// Output Box Header
		if (this.viewType == cXULElement.VIEW_TYPE_BOXED || this instanceof cXULElement_grid)
			aHtml[aHtml.length]	= cXULElement.getBoxOpen(this);
	}

	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
		aHtml[aHtml.length]	= this.childNodes[nIndex].$getTag();

	// Output Element Footer
	if (this.viewType != cXULElement.VIEW_TYPE_VIRTUAL) {
		// Output Box Footer
		if (this.viewType == cXULElement.VIEW_TYPE_BOXED || this instanceof cXULElement_grid)
			aHtml[aHtml.length]	= cXULElement.getBoxClose(this);
		aHtml[aHtml.length]	= this.$getTagClose();
	}
	if (this.parentNode && (this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED || this.parentNode instanceof cXULElement_row))
		aHtml[aHtml.length]	= cXULElement.getBoxCloseChild(this);

	return aHtml.join("");
};

// Static methods
cXULElement.getBoxOpen	= function(oElement)
{
    var aHtml   = ['<table cellpadding="0" cellspacing="0" border="0"' + (oElement instanceof cXULElement_box || oElement instanceof cXULElement_grid ? ' id="' + (oElement.attributes.id || oElement.uniqueID) + '"' : '')];

    if (oElement.attributes["orient"] == "vertical")
    {
        // Set width
        if (oElement.attributes["width"] && oElement.localName != "window" && oElement.localName != "dialog")
			aHtml[aHtml.length]	= ' width="' + oElement.attributes["width"] + '"';
        else
        if (!oElement.attributes["align"] || oElement.attributes["align"] == "stretch")
			aHtml[aHtml.length]	= ' width="100%"';

        // Set height
        if (oElement.attributes["height"])
			aHtml[aHtml.length]	= ' height="' + oElement.attributes["height"] + '"';
    }
    else
    {
        // Set height
        if (oElement.attributes["height"] && oElement.localName != "window" && oElement.localName != "dialog")
			aHtml[aHtml.length]	= ' height="' + oElement.attributes["height"] + '"';
        else
        if (!oElement.attributes["align"] || oElement.attributes["align"] == "stretch")
			aHtml[aHtml.length]	= ' height="100%"';

        // Set width
        if (oElement.attributes["width"])
			aHtml[aHtml.length]	= ' width="' + oElement.attributes["width"] + '"';
    }
    if (oElement instanceof cXULElement_box || oElement instanceof cXULElement_grid)
    	aHtml[aHtml.length]	= ' class="xul-' + oElement.localName + '"';
	aHtml[aHtml.length]	= '><tbody class="xul-box--xul-box';

    if (oElement.attributes["orient"] == "vertical")
    	aHtml[aHtml.length]	= ' xul-box--gateway">';
    else
		aHtml[aHtml.length]	= '"><tr class="xul-box--gateway">';

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
	    // Aligning
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

    // Debug Grid
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

// Register Element with language
oXULNamespace.setElement("#element", cXULElement);
