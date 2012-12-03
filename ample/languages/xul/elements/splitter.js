/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_splitter	= function(){};
cXULElement_splitter.prototype	= new cXULElement("splitter");

// Private properties
cXULElement_splitter.prototype._clientX	= 0;
cXULElement_splitter.prototype._clientY	= 0;
cXULElement_splitter.prototype._offsetX	= 0;
cXULElement_splitter.prototype._offsetY	= 0;

cXULElement_splitter.prototype.$hoverable	= true;
cXULElement_splitter.prototype.$selectable	= false;

cXULElement_splitter.offset	= 0;
cXULElement_splitter.client	= 0;
cXULElement_splitter.active	= false;

// Public Methods
cXULElement_splitter.handlers	= {
	"mousedown":	function(oEvent) {
		// handle left-click only
		if (oEvent.button != 0)
			return;

		this.setCapture(true);
		this.$setPseudoClass("active", true);
		cXULElement_splitter.active	= true;

		//
		var oElementDOM	= this.$getContainer("image"),
			oRectImage	= this.getBoundingClientRect("image"),
			oRectParent	= this.parentNode.getBoundingClientRect();
		if (this.parentNode.getAttribute("orient") == "vertical") {
			cXULElement_splitter.offset	= oRectImage.top;
			cXULElement_splitter.client	= oEvent.clientY;
			oElementDOM.style.width	=(oRectParent.right - oRectParent.left - 2)+ "px";
		}
		else {
			cXULElement_splitter.offset	= oRectImage.left;
			cXULElement_splitter.client	= oEvent.clientX;
			oElementDOM.style.height	=(oRectParent.bottom - oRectParent.top - 2)+ "px";
		}
	},
	"mouseup":		function(oEvent) {
		// handle left-click only
		if (oEvent.button != 0)
			return;

		this.releaseCapture();
		this.$setPseudoClass("active", false);
		cXULElement_splitter.active	= false;

		var oElementDOM	= this.$getContainer("image"),
			bVertical	= this.parentNode.getAttribute("orient") == "vertical",
			sMeasure	= bVertical ? "height" : "width",
			nOffset		= oEvent[bVertical ? "clientY" : "clientX"] - cXULElement_splitter.client,
			nValue,
			nValue2,
			nMin,
			nMax;

		// Reset position
		if (this.parentNode.getAttribute("orient") == "vertical") {
			oElementDOM.style.width	= "";
			oElementDOM.style.top	= "";
		}
		else {
			oElementDOM.style.height= "";
			oElementDOM.style.left	= "";
		}

		// check previous sibling
		if (this.previousSibling &&(nValue = this.previousSibling.getAttribute(sMeasure) * 1)) {
			nValue2	= nValue + nOffset;
			if (nMin = this.previousSibling.getAttribute("min" + sMeasure))
				nValue2	= Math.max(nMin, nValue2);
			if (nMax = this.previousSibling.getAttribute("max" + sMeasure))
				nValue2	= Math.min(nMax, nValue2);
			this.previousSibling.setAttribute(sMeasure, nValue2);
		}
		// check next sibling
		if (this.nextSibling &&(nValue = this.nextSibling.getAttribute(sMeasure) * 1)) {
			nValue2	= nValue - nOffset;
			if (nMin = this.nextSibling.getAttribute("min" + sMeasure))
				nValue2	= Math.max(nMin, nValue2);
			if (nMax = this.nextSibling.getAttribute("max" + sMeasure))
				nValue2	= Math.min(nMax, nValue2);
			this.nextSibling.setAttribute(sMeasure, nValue2);
		}

		// Spawn reflow
		oXULReflowManager.schedule(this.parentNode);
	},
	"mousemove":	function(oEvent) {
		if (cXULElement_splitter.active) {
			var oElementDOM	= this.$getContainer("image"),
				bVertical	= this.parentNode.getAttribute("orient") == "vertical",
				sMeasure	= bVertical ? "height" : "width",
				nOffset		= oEvent[bVertical ? "clientY" : "clientX"] - cXULElement_splitter.client,
				nValue,
				nMin,
				nMax;

			// Check previous sibling
			if (this.previousSibling &&(nValue = this.previousSibling.getAttribute(sMeasure) * 1))
				if (!((nMin = this.previousSibling.getAttribute("min" + sMeasure)) && nMin > nValue + nOffset) && !((nMax = this.previousSibling.getAttribute("max" + sMeasure)) && nMax < nValue + nOffset))
					oElementDOM.style[this.parentNode.getAttribute("orient") == "vertical" ? "top" : "left"]	=(cXULElement_splitter.offset + nOffset)+ "px";
			// check next sibling
			if (this.nextSibling &&(nValue = this.nextSibling.getAttribute(sMeasure) * 1))
				if (!((nMin = this.nextSibling.getAttribute("min" + sMeasure)) && nMin > nValue - nOffset) && !((nMax = this.nextSibling.getAttribute("max" + sMeasure)) && nMax < nValue - nOffset))
					oElementDOM.style[this.parentNode.getAttribute("orient") == "vertical" ? "top" : "left"]	=(cXULElement_splitter.offset + nOffset)+ "px";
		}
	}
};

// Element Render: open
cXULElement_splitter.prototype.$getTagOpen	= function() {
	return '<div class="xul-splitter' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + ' xul-splitter-' +(this.parentNode.getAttribute("orient") == "vertical" ? "vertical" : "horizontal")+ '" style="line-height:1px"><div class="xul-splitter--image"></div>';
};

// Element Render: close
cXULElement_splitter.prototype.$getTagClose	= function() {
	return '</div>';
};

// Register Element
ample.extend(cXULElement_splitter);
