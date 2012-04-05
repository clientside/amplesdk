/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_scale	= function(){};

cXULElement_scale.prototype	= new cXULInputElement("scale");

cXULElement_scale.attributes	= {
	"min":	"0",
	"max":	"100",
	"value":"0"
};

// Static Properties
cXULElement_scale.captured	= false;
cXULElement_scale.button	=-1;
cXULElement_scale.clientRect= null;
cXULElement_scale.prevValue	= "";

cXULElement_scale.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.$pseudoTarget && oEvent.$pseudoTarget.className.match(/xul-scale--button/)) {
			cXULElement_scale.startSession(this, oEvent.$pseudoTarget);
		}
	},
	"mouseup":		function(oEvent) {
		if (cXULElement_scale.captured) {
			cXULElement_scale.finishSession(this);
			//
			if (cXULElement_scale.prevValue != this.getAttribute("value"))
				cXULInputElement.dispatchChange(this);
		}
	},
	"keydown":	function(oEvent) {
		if (cXULElement_scale.captured && oEvent.keyIdentifier == "U+001B") {	// Esc
			cXULElement_scale.finishSession(this);
			this.setAttribute("value", cXULElement_scale.prevValue);
		}
	},
	"mousemove":	function(oEvent) {
		if (cXULElement_scale.captured) {
			var oElement= this.$getContainer("bar").getElementsByTagName("div")[cXULElement_scale.button],
				aValues	= this.getAttribute("value").split(","),
				nMin	= this.getAttribute("min") * 1,
				nMax	= this.getAttribute("max") * 1,
				bOrient	= this.getAttribute("orient") == "vertical",
				nSize	= bOrient
							? 100 * (oEvent.clientY - cXULElement_scale.clientRect.top) / (cXULElement_scale.clientRect.bottom - cXULElement_scale.clientRect.top)
							: 100 * (oEvent.clientX - cXULElement_scale.clientRect.left) / (cXULElement_scale.clientRect.right - cXULElement_scale.clientRect.left),
				nValue	= nMin + nSize	* (nMax - nMin) / 100;

			// Check lower boundary
			if (cXULElement_scale.button > 0)
				if (nValue < aValues[cXULElement_scale.button - 1] * 1)
					nValue	= aValues[cXULElement_scale.button - 1] * 1;
			// Check upper boundary
			if (cXULElement_scale.button < aValues.length - 1)
				if (nValue > aValues[cXULElement_scale.button + 1] * 1)
					nValue	= aValues[cXULElement_scale.button + 1] * 1;
			// Account for min/max
			nValue	= Math.min(nMax, Math.max(nMin, nValue));

			aValues[cXULElement_scale.button]	= nValue;
			// Update value
			this.setAttribute("value", aValues.join(","));
			// Update position
			oElement.style[bOrient ? "top" : "left"]	= 100 * (nValue - nMin) / (nMax - nMin) + "%";

			// TODO: Dispatch continuous change event
		}
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		cXULElement_scale.redraw(this);
	}
};

cXULElement_scale.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "value") {
		if (!cXULElement_scale.captured)
			cXULElement_scale.redraw(this);
	}
	else
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
		cXULInputElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Static methods
cXULElement_scale.startSession	= function(oInstance, oThumb) {
	var oRect	= oInstance.getBoundingClientRect();
	cXULElement_scale.captured	= true;
	for (var nIndex = 0, aElements = oInstance.$getContainer("bar").getElementsByTagName("div"), oElement; oElement = aElements[nIndex]; nIndex++)
		if (oElement == oThumb)
			break;
	cXULElement_scale.button	= nIndex;
	cXULElement_scale.clientRect	= oRect;
	cXULElement_scale.prevValue	= oInstance.getAttribute("value");
	oInstance.setCapture(true);
	//
	oElement.className	+= ' xul-scale--button_active';
};

cXULElement_scale.finishSession	= function(oInstance) {
	var oElement	= oInstance.$getContainer("bar").getElementsByTagName("div")[cXULElement_scale.button];
	cXULElement_scale.captured	= false;
	cXULElement_scale.button	=-1;
	cXULElement_scale.clientRect	= null;
	oInstance.releaseCapture();
	//
	oElement.className	= oElement.className.replace(/ xul-scale--button_active/, '');
};

cXULElement_scale.redraw	= function(oInstance) {
	var aValue	= oInstance.getAttribute("value").split(","),
		nMin	= oInstance.getAttribute("min") * 1,
		nMax	= oInstance.getAttribute("max") * 1,
		bOrient	= oInstance.getAttribute("orient") == "vertical",
		aHtml	= [];
	for (var nIndex = 0, nValue; nIndex < aValue.length; nIndex++) {
		nValue	= Math.min(nMax, Math.max(nMin, aValue[nIndex]));
		aHtml.push('<div class="xul-scale--button" style="position:absolute;' + (bOrient ? "top" : "left")+ ':' + (100 * (nValue - nMin) / (nMax - nMin)) + '%" onmouseover="if (ample.$instance(this).$isAccessible()) this.className += \' xul-scale--button_hover\'" onmouseout="if (ample.$instance(this).$isAccessible()) if (!this.className.match(/_disabled/)) this.className = this.className.replace(\' xul-scale--button_hover\', \'\')"></div>');
	}
	oInstance.$getContainer("bar").innerHTML	= aHtml.join('');
};

// Element Render: open
cXULElement_scale.prototype.$getTagOpen	= function() {
	return '<div class="xul-scale' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + (!this.$isAccessible() ? " xul-scale_disabled" : '') + (" xul-scale-orient-" +(this.attributes["orient"] == "vertical" ? "vertical" : "horizontal")) + '"' + (this.attributes["style"] ? ' style="' + this.attributes["style"] + '"': '') + '>\
				<div class="xul-scale--before" style="float:left"></div>\
				<div class="xul-scale--after" style="float:right"></div>\
				<div class="xul-scale--bar" onmousedown="return false" style="position:relative"></div>\
				<input type="text" value="' + this.attributes["value"] + '" autocomplete="off" style="display:none;width:1px;height:1px;" class="xul-scale--input"/>\
			</div>';
};

// Register Element
ample.extend(cXULElement_scale);
