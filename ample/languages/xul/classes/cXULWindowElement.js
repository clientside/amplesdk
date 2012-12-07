/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
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

cXULWindowElement.modalWindow	= null;

cXULWindowElement.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "title")
		this.$getContainer("title").innerHTML	= ample.$encodeXMLCharacters(sValue || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

cXULWindowElement.prototype.show	= function (nLeft, nTop) {
	var that	= this,
		oContainer	= that.$getContainer(),
		oHead	= that.$getContainer("head"),
		oBody	= that.$getContainer("body"),
		bHeader	= that instanceof cXULElement_wizard ||(that instanceof cXULElement_dialog && cXULElement_dialog.firstChild instanceof cXULElement_dialogheader),
		oHeader	= that.$getContainer("header"),
		oFooter	= that.$getContainer("footer"),
		oComputedStyle	= oContainer.currentStyle || window.getComputedStyle(oContainer, null);

	//
	that.addEventListener("keydown", cXULWindowElement.onkeydown, true);

	// If top/left not passed, open centered
	var nWidth	= this.getAttribute("width") * 1 || parseInt(oComputedStyle.width),
		nHeight	= this.getAttribute("height") * 1 || parseInt(oComputedStyle.height);
	if (isNaN(nTop) || isNaN(nLeft)) {
		if (this.hasAttribute("screenX") && this.hasAttribute("screenY")) {
			nTop	= this.getAttribute("screenY") * 1;
			nLeft	= this.getAttribute("screenX") * 1;
		}
		else {
			nLeft	=((document.documentElement.clientWidth || document.body.clientWidth) - nWidth) / 2;
			nTop	=((document.documentElement.clientHeight || document.body.clientHeight) - nHeight) / 2;
		}

		nLeft	+= document.documentElement.scrollLeft;
		nTop	+= document.documentElement.scrollTop;
	}

	ample.query(that).css("opacity", "0");
	oContainer.style.width	= 1 + "px";
	oContainer.style.height	= 1 + "px";
	oContainer.style.top	=(nTop + nHeight / 2) + "px";
	oContainer.style.left	=(nLeft + nWidth / 2) + "px";
	//
	oContainer.style.minWidth	= 1 + "px";
	oContainer.style.minHeight	= 1 + "px";

	// Hide head and body
	if (this.getAttribute("hidechrome") != "true")
		oHead.style.display	= "none";
	if (bHeader)
		oHeader.style.display	= "none";
	if (oFooter)
		oFooter.style.display	= "none";
	oBody.style.display	= "none";
	// Show window
	that.setAttribute("hidden", "false");
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
			if (bHeader)
				oHeader.style.display	= "";
			if (oFooter)
				oFooter.style.display	= "";
			oBody.style.display	= "";
			// Restore opacity
			ample.query(that).css("opacity", null);
			// Restore sizes if not specified as attributes
			if (!that.getAttribute("width"))
				oContainer.style.width	= '';
			if (!that.getAttribute("height"))
				oContainer.style.height	= '';
			//
			oContainer.style.minWidth	= "";
			oContainer.style.minHeight	= "";
			// Reflow
			oXULReflowManager.schedule(that);

			// Focus
			var sButtonFocus	= that.getAttribute("defaultButton");
			if (sButtonFocus != "" && that.hasAttribute("buttons"))
				if (that.getAttribute("buttons").split(/\s*,\s*/).indexOf(sButtonFocus) != -1)
					that.buttons[sButtonFocus].focus();
			//
			var oEvent	= that.ownerDocument.createEvent("CustomEvent");
			oEvent.initCustomEvent("windowshown", true, false, null);
			that.dispatchEvent(oEvent);
		}
	);
};

cXULWindowElement.prototype.showModal	= function (nTop, nLeft) {
	// set modal
	cXULWindowElement.modalWindow	= this;
	this.addEventListener("modal", cXULWindowElement.oncapture, true);
	ample.modal(this);
	//
	this.show(nTop, nLeft);
};

cXULWindowElement.prototype.hide	= function() {
	var that	= this,
		oContainer	= that.$getContainer(),
		oHead	= that.$getContainer("head"),
		oBody	= that.$getContainer("body"),
		bHeader	= that instanceof cXULElement_wizard ||(that instanceof cXULElement_dialog && cXULElement_dialog.firstChild instanceof cXULElement_dialogheader),
		oHeader	= that.$getContainer("header"),
		oFooter	= that.$getContainer("footer"),
		oRect	= that.getBoundingClientRect();

	// unset modal
	if (cXULWindowElement.modalWindow == this) {
		cXULWindowElement.modalWindow	= null;
		this.removeEventListener("modal", cXULWindowElement.oncapture, true);
		ample.modal(null);
	}
	//
	that.removeEventListener("keydown", cXULWindowElement.onkeydown, true);

	var nWidth	= oRect.right - oRect.left,
		nHeight	= oRect.bottom - oRect.top,
		nLeft	= document.documentElement.scrollLeft + oRect.left,
		nTop	= document.documentElement.scrollTop + oRect.top;

	// Hide head and body
	if (this.getAttribute("hidechrome") != "true")
		oHead.style.display	= "none";
	if (bHeader)
		oHeader.style.display	= "none";
	if (oFooter)
		oFooter.style.display	= "none";
	oBody.style.display	= "none";
	//
	oContainer.style.minWidth	= 1 + "px";
	oContainer.style.minHeight	= 1 + "px";
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
			that.setAttribute("hidden", "true");

			// show head and body
			if (that.getAttribute("hidechrome") != "true")
				oHead.style.display	= "";
			if (bHeader)
				oHeader.style.display	= "";
			if (oFooter)
				oFooter.style.display	= "";
			oBody.style.display	= "";
			//
			oContainer.style.minWidth	= "";
			oContainer.style.minHeight	= "";
			//
			var oEvent	= that.ownerDocument.createEvent("CustomEvent");
			oEvent.initCustomEvent("windowhidden", true, false, null);
			that.dispatchEvent(oEvent);
		}
	);
};

// Static methods
cXULWindowElement.snooze	= function(oElement) {
	var aQuery	= ample.query(oElement);
	aQuery.animate({"border-color": "#fff"}, 500, function(n) {return Math.sin(Math.PI*6*n)}, function() {
		aQuery.css("border-color", "");
	});
};

cXULWindowElement.oncapture	= function(oEvent) {
	cXULWindowElement.snooze(oEvent.target);
};

cXULWindowElement.onkeydown	= function(oEvent) {
	if (oEvent.target == oEvent.currentTarget)
		if (oEvent.keyIdentifier == "U+001B")	// Esc
			oEvent.target.hide();
};

// Register Element
ample.extend(cXULWindowElement);
