/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_splitter	= function(){};
cXULElement_splitter.prototype   = new cXULElement;

// Private properties
cXULElement_splitter.prototype._clientX	= 0;
cXULElement_splitter.prototype._clientY	= 0;
cXULElement_splitter.prototype._offsetX	= 0;
cXULElement_splitter.prototype._offsetY	= 0;

cXULElement_splitter.prototype.$hoverable	= true;
cXULElement_splitter.prototype.$selectable	= false;

cXULElement_splitter.captured	= false;
cXULElement_splitter.offset	= 0;
cXULElement_splitter.client	= 0;

// Public Methods
cXULElement_splitter.handlers	= {
	"mousedown":	function(oEvent) {
		// handle left-click only
		if (oEvent.button != 0)
			return;

		this.setCapture(true);
		this.$setPseudoClass("active", true);
		cXULElement_splitter.captured	= true;

		//
		if (this.parentNode.getAttribute("orient") == "vertical")
			cXULElement_splitter.offset	= oEvent.clientY -(parseInt(this.$getContainer("image").style.top) || 0);
		else
			cXULElement_splitter.offset	= oEvent.clientX -(parseInt(this.$getContainer("image").style.left) || 0);
	},
	"mouseup":		function(oEvent) {
		// handle left-click only
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
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

// Private Methods
cXULElement_splitter.prototype._capture  = function(oEvent) {
	if (!this.nextSibling || !this.previousSibling || this.parentNode.viewType != cXULElement.VIEW_TYPE_BOXED)
		return;

	cXULElement_splitter._element	= this;

	// Show transparent layer
//	this.ownerDocument.$getContainer("popup").style.display	= "";

	// Save cursor type
	this.cursor	= document.body.style.cursor;

	// Attach event listeners
	this.ownerDocument.addEventListener("mousemove",	cXULElement_splitter._onDocumentMouseMove,	false);
	this.ownerDocument.addEventListener("mouseup",		cXULElement_splitter._onDocumentMouseUp,		false);

    if (this.parentNode.attributes["orient"] == "vertical")
        this.$getContainer().firstChild.style["top"]	= this._offsetY	= this._clientY = oEvent.clientY - 1;
    else
        this.$getContainer().firstChild.style["left"]	= this._offsetX	= this._clientX = oEvent.clientX - 1;

    // set persistant cursor
	document.body.style.cursor	= this.parentNode.attributes["orient"] == "vertical" ? "n-resize" : "e-resize";
};

// Static Methods
cXULElement_splitter._onDocumentMouseUp   = function(oEvent) {
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

	// Move the line to automatic location
	oElement.$getContainer().firstChild.style[oElement.parentNode.attributes["orient"] == "vertical" ? "top" : "left"]	= "";

	// Restore cursor type
	document.body.style.cursor	= oElement.cursor;

	// Hide transparent layer
//	oElement.ownerDocument.$getContainer("popup").style.display	= "none";

	// Detach element
	delete cXULElement_splitter._element;

	// Detach event listeners
	oElement.ownerDocument.removeEventListener("mousemove",		cXULElement_splitter._onDocumentMouseMove,	false);
	oElement.ownerDocument.removeEventListener("mouseup",		cXULElement_splitter._onDocumentMouseUp,		false);
};

cXULElement_splitter._onDocumentMouseMove     = function(oEvent) {
	var oElement	= cXULElement_splitter._element;
	var oPosition1	= oElement.ownerDocument.$getContainerPosition(oElement.previousSibling.$getContainer().parentNode);
	var oPosition2	= oElement.ownerDocument.$getContainerPosition(oElement.nextSibling.$getContainer().parentNode);

    if (oElement.parentNode.attributes["orient"] == "vertical") {
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

// Element Render: open
cXULElement_splitter.prototype.$getTagOpen	= function() {
    return '<div class="xul-splitter xul-splitter-' +(this.parentNode.attributes["orient"] == "vertical" ? "vertical" : "horizontal")+ '" style="line-height:1px"><div class="xul-splitter--image"></div>';
};

// Element Render: close
cXULElement_splitter.prototype.$getTagClose	= function() {
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("splitter", cXULElement_splitter);
