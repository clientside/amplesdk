/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULWindowElement	= function() {
	cXULElement.apply(this, arguments);
};
cXULWindowElement.prototype	= new cXULElement;
cXULWindowElement.prototype.localName	= "#element-window";

cXULWindowElement.prototype.$draggable	= true;
cXULWindowElement.prototype.$resizable	= true;

cXULWindowElement.prototype.open	= function (nTop, nLeft) {
	var that	= this,
		oContainer	= that.$getContainer(),
		oBody	= that.$getContainer("body"),
		oHead	= that.$getContainer("head"),
		oComputedStyle	= oContainer.currentStyle || window.getComputedStyle(oContainer, null);

	// If top/left not passed, open centered
	var nWidth	= this.getAttribute("width") * 1 || parseInt(oComputedStyle.width),
		nHeight	= this.getAttribute("height") * 1 || parseInt(oComputedStyle.height);
	if (isNaN(nTop) || isNaN(nLeft)) {
		if (this.hasAttribute("top") && this.hasAttribute("left")) {
			nTop	= this.getAttribute("top") * 1;
			nLeft	= this.getAttribute("left") * 1;
		}
		else {
			nLeft	=((document.documentElement.clientWidth || document.body.clientWidth) - nWidth) / 2;
			nTop	=((document.documentElement.clientHeight || document.body.clientHeight) - nHeight) / 2;
		}

		nLeft	+= document.documentElement.scrollLeft;
		nTop	+= document.documentElement.scrollTop;
	}

	oContainer.style.opacity= 0;
	oContainer.style.width	= 1 + "px";
	oContainer.style.height	= 1 + "px";
	oContainer.style.top	=(nTop + nHeight / 2) + "px";
	oContainer.style.left	=(nLeft + nWidth / 2) + "px";

	// Hide head and body
	if (this.getAttribute("hidechrome") != "true")
		oHead.style.display	= "none";
	oBody.style.display	= "none";
	// Show window
	oContainer.style.display	= "";
	// Play effect
	ample.query(that).animate(
		{	"opacity":"1",
			"width": nWidth + "px",
			"height": nHeight + "px",
			"top": nTop + "px",
			"left": nLeft + "px"},
		"fast",
		"ease-in",
		function() {
			// Show head and body
			if (that.getAttribute("hidechrome") != "true")
				oHead.style.display	= "";
			oBody.style.display	= "";
			// Restore sizes if not specified as attributes
			if (!that.getAttribute("width"))
				oContainer.style.width	= '';
			if (!that.getAttribute("height"))
				oContainer.style.height	= '';

			// Focus
			var sButtonFocus	= that.getAttribute("defaultButton");
			if (sButtonFocus != "")
				if (that.getAttribute("buttons").split(/\s*,\s*/).indexOf(sButtonFocus) != -1)
					that.buttons[sButtonFocus].focus();

			var oEvent  = that.ownerDocument.createEvent("CustomEvent");
			oEvent.initCustomEvent("open", true, false, null);
			that.dispatchEvent(oEvent);
		}
	);
};

cXULWindowElement.prototype.close = function() {
	var that	= this,
		oContainer	= that.$getContainer(),
		oBody	= that.$getContainer("body"),
		oHead	= that.$getContainer("head"),
		oRect	= that.getBoundingClientRect();

	var nWidth	= oRect.right - oRect.left,
		nHeight	= oRect.bottom - oRect.top,
		nLeft	= document.documentElement.scrollLeft + oRect.left;
		nTop	= document.documentElement.scrollTop + oRect.top;

	// Hide head and body
	if (this.getAttribute("hidechrome") != "true")
		oHead.style.display	= "none";
	oBody.style.display	= "none";
	// Play effect
	ample.query(that).animate(
		{	"opacity":"0",
			"width": 1 + "px",
			"height": 1 + "px",
			"top": (nTop + nHeight / 2) + "px",
			"left": (nLeft + nWidth / 2) + "px"},
		"fast",
		"ease-out",
		function() {
			// Hide window
			oContainer.style.display	= "none";

			// show head and body
			if (that.getAttribute("hidechrome") != "true")
				oHead.style.display	= "";
			oBody.style.display	= "";

			var oEvent  = that.ownerDocument.createEvent("CustomEvent");
			oEvent.initCustomEvent("close", true, false, null);
			that.dispatchEvent(oEvent);
		}
	);
};

//
cXULWindowElement.interactionstart	= function(oEvent) {
	var that	= oEvent.currentTarget;
	if (oEvent.target == that) {
		if (oEvent.type == "dragstart" && oEvent.$pseudoTarget != that.$getContainer("title"))
			oEvent.preventDefault();
		else {
			that.$getContainer("body").style.visibility	= "hidden";
			ample.query(that).animate({opacity:0.75});
		}
	}
};

cXULWindowElement.interactionend	= function(oEvent) {
	var that	= oEvent.currentTarget;
	if (oEvent.target == that) {
		that.$getContainer("body").style.visibility	= "";
		ample.query(that).animate({opacity:1.0});
	}
};

// Register Element
ample.extend(cXULWindowElement);
