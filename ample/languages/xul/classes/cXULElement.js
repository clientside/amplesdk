/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement	= function(sLocalName) {
	this.localName	= sLocalName;
};

// Constants
cXULElement.VIEW_TYPE_VIRTUAL	= 0;	// Element is not rendered [keyset, key, stringset, string]
cXULElement.VIEW_TYPE_BOXED		= 1;	// Element is rendered as boxed
cXULElement.VIEW_TYPE_NORMAL	= 2;	// Element is rendered as not boxed

cXULElement.prototype	= new ample.classes.Element;
cXULElement.prototype.namespaceURI	= "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";
cXULElement.prototype.localName		= "#element";
cXULElement.prototype.viewType		= cXULElement.VIEW_TYPE_NORMAL;

cXULElement.prototype.$getStyle	= function(sName) {
	var sValue;
	switch (sName) {
		case "-moz-box-flex":
		case "-moz-box-orient":
		case "-moz-box-pack":
		case "-moz-box-align":
		case "width":
		case "height":
			// 1) first check if style specified
			if (sValue = this.getAttribute("style"))
				if (sValue.match(new RegExp(sName + "\\s*:\\s*[\'\"]?\\s*([^;\'\"]+)\\s*[\'\"]?")))
					return RegExp.$1;

			// 2) second check if attribute specified
			if (sValue = this.getAttribute(sName.match(/\w+$/)))
				return sValue;

			return '';

		default:
			return ample.classes.Element.prototype.$getStyle.call(this, sName);
	}
};

cXULElement.prototype.$setStyle	= function(sName, sValue) {
	switch (sName) {
		case "-moz-box-flex":
		case "-moz-box-orient":
		case "-moz-box-pack":
		case "-moz-box-align":
		case "width":
		case "height":
			this.$mapAttribute(sName.match(/\w+$/)[0], sValue);
			break;

		default:
			ample.classes.Element.prototype.$setStyle.call(this, sName, sValue);
	}
};

cXULElement.prototype.$mapAttribute	= function(sName, sValue) {
	var oElementDOM	= this.$getContainer();
	switch (sName) {
		case "hidden":
			// hide boxed container
			if (this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED) {
				if (this.parentNode.getAttribute("orient") != "vertical")
					oElementDOM.parentNode.style.display	=(sValue == "true" ? "none" : "");
				else
					oElementDOM.parentNode.parentNode.style.display	=(sValue == "true" ? "none" : "");

				// Update self if box and showing
				if (sValue != "true" && this.viewType == cXULElement.VIEW_TYPE_BOXED)
					oXULReflowManager.schedule(this);
				// Update parent box
				if (this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
					oXULReflowManager.schedule(this.parentNode);
			}
			// hide the container
			oElementDOM.style.display	=(sValue == "true" ? "none" : "");
			break;

		case "debug":
			break;

		case "flex":
			if (this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
				oXULReflowManager.schedule(this.parentNode);
			break;

		case "orient":
			// TODO
			break;

		case "pack":
			// TODO
			break;

		case "align":
			// TODO
			break;

		case "width":
		case "height":
			if (this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED)
				oElementDOM.parentNode[sName] = sValue;
			oElementDOM.style[sName]	= sValue ? isNaN(sValue) ? sValue : sValue + "px" : '';
			break;
	}
};

// Public methods
cXULElement.prototype.$isAccessible	= function() {
	return this.getAttribute("disabled") != "true";
};

cXULElement.prototype.reflow	= function() {
	// No need to reflow either self or children if hidden
	if (this.getAttribute("hidden") == "true")
		return;

	//
	var nLength	= this.childNodes.length;
	if (nLength && this.viewType == cXULElement.VIEW_TYPE_BOXED) {
		var oElement;
		var nFlex		= 0,
			nPixels		= 0,
			nPercents	= 0,
			nElementFirst	=-1,
			nElementLast	=-1,
			bVertical	= this.getAttribute("orient") == "vertical",
			sMeasure	= bVertical ? "height" : "width",
			sMeasureAlt	= bVertical ? "width" : "height",
			nElements	= 0,
			nVirtual	= 0;

		// Count the amount of elements and their cumulative flex
		for (var nIndex = 0; nIndex < nLength; nIndex++) {
			oElement	= this.childNodes[nIndex];
			if (oElement.nodeType == ample.classes.Node.ELEMENT_NODE && oElement.viewType != cXULElement.VIEW_TYPE_VIRTUAL) {
				nElements++;
				if (oElement.hasAttribute(sMeasure) && oElement.getAttribute(sMeasure).match(/([0-9\.]+)(%?)/)) {
					if (RegExp.$2 == "%") {
						nPercents	+= RegExp.$1 * 1;
						if (nElementFirst ==-1)
							nElementFirst	= nIndex;
						nElementLast= nIndex;
					}
					else
						nPixels		+= RegExp.$1 * 1;
				}
				else
				if (oElement.hasAttribute("flex") && !isNaN(oElement.getAttribute("flex"))) {
					nFlex	+= oElement.getAttribute("flex") * 1;
					if (nElementFirst ==-1)
						nElementFirst	= nIndex;
					nElementLast= nIndex;
				}
				else {
					var oElementRect	= oElement.getBoundingClientRect();
					nPixels	+= bVertical ? oElementRect.bottom - oElementRect.top : oElementRect.right - oElementRect.left;
				}
			}
		}

		// Refresh flexible elements
		if (nElements) {
			var oElementBox	=(this instanceof cXULElement_row || this instanceof cXULElement_rows) ? this.$getContainer() : this.$getContainer("box-container"),
				oElementDOM,
				oCell;

			if (this instanceof cXULElement_row)
				oElementBox	= oElementBox.parentNode.parentNode;

			//
			if (nFlex) {
				oElementBox.setAttribute(sMeasure, "100%");
				this.$getContainer().style[sMeasure]	= this.hasAttribute(sMeasure) ? (isNaN(this.getAttribute(sMeasure)) ? this.getAttribute(sMeasure) : this.getAttribute(sMeasure) + "px") : "100%";
			}

			var oElementRect	= this.getBoundingClientRect(),
				nPixelsAvailable= bVertical ? oElementRect.bottom - oElementRect.top : oElementRect.right - oElementRect.left,
				nFlexInPercents	= 100 * (1 - nPixels / nPixelsAvailable) - nPercents,
				nFlexInPixels	= nPixelsAvailable * (1 - nPercents / 100) - nPixels,
				nUsedFlex	= 0,
				nUsedPixels	= 0,
				nElementFlex,
				nElementPixels;

			for (nIndex = 0; nIndex < nLength; nIndex++) {
				oElement	= this.childNodes[nIndex];
				if (oElement.nodeType != ample.classes.Node.ELEMENT_NODE)
					nVirtual++;
				else
				if (oElement.viewType != cXULElement.VIEW_TYPE_VIRTUAL) {
					oElementDOM	= oElement.$getContainer();
					oCell	= oElementBox.tBodies[0].rows[bVertical ? nIndex - nVirtual : 0].cells[bVertical ? 0 : nIndex - nVirtual];
					if (oElement.hasAttribute("flex") && !isNaN(oElement.getAttribute("flex"))) {
						nElementFlex	= Math.ceil(nFlexInPercents * oElement.getAttribute("flex") / nFlex);
						nElementPixels	= nFlexInPixels * oElement.getAttribute("flex") / nFlex;
						oCell.setAttribute(sMeasure, (nElementLast == nIndex ? (document.namespaces ? nFlexInPercents - nUsedFlex : Math.ceil(nFlexInPercents - nUsedFlex)) : nElementFlex) + "%");
//						oCell.style[sMeasure]	=(nElementLast == nIndex ? nFlexInPixels - nUsedPixels : nElementPixels) + "px";
						nUsedFlex	+= nElementFlex;
						nUsedPixels	+= nElementPixels;
						if (!(oElement instanceof cXULElement_row) && oElementDOM)
							oElementDOM.style[sMeasure]	= "100%";	// Needed?
					}
					if ((this.getAttribute("align") == "stretch") && oElementDOM)
						oElementDOM.style[sMeasureAlt]	= "100%";
				}
			}
		}
	}

	// Reflow children
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++)
		if (oElement instanceof cXULElement)
			oElement.reflow();
};
/*
cXULElement.prototype.getBoxObject	= function() {
	return this.$getContainer("box-child");
};

cXULElement.prototype.setBoxObjectParam	= function(sName, sValue) {
	if (this.parentNode.getAttribute("orient") == "vertical")
		this.getBoxObject().parentNode[sName]	= sValue;
	else
		this.getBoxObject()[sName]	= sValue;
};

cXULElement.prototype.getBoxObjectParam	= function(sName) {
	if (this.parentNode.getAttribute("orient") == "vertical")
		return this.getBoxObject().parentNode[sName];
	else
		return this.getBoxObject()[sName];
};
*/
cXULElement.prototype.$getTag		= function() {
	var aHtml		= [],
		bBoxContainer	= this instanceof cXULElement && this.viewType == cXULElement.VIEW_TYPE_BOXED &&!(this instanceof cXULElement_row),
		bBoxChild		= this.parentNode && this.parentNode.viewType == cXULElement.VIEW_TYPE_BOXED &&!(this.parentNode instanceof cXULElement_rows) || this.parentNode instanceof cXULElement_row;

	// Output Box Child Header
	if (bBoxChild)
		aHtml[aHtml.length]	= cXULElement.getBoxOpenChild(this);

	// Output Element Header
	if (this.viewType != cXULElement.VIEW_TYPE_VIRTUAL) {
		aHtml[aHtml.length]	= this.$getTagOpen().replace(/^(\s*<[\w:]+)/, '$1 id="' +(this.getAttribute("id") || this.uniqueID)+ '"');
		// Output Box Container Header
		if (bBoxContainer)
			aHtml[aHtml.length]	= cXULElement.getBoxOpen(this);
	}

	for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
		aHtml[aHtml.length]	= this.childNodes[nIndex].$getTag();

	// Output Box Container Footer
	if (this.viewType != cXULElement.VIEW_TYPE_VIRTUAL) {
		if (bBoxContainer)
			aHtml[aHtml.length]	= cXULElement.getBoxClose(this);

		// Output Element Footer
		aHtml[aHtml.length]	= this.$getTagClose();
	}

	// Output Box Child Footer
	if (bBoxChild)
		aHtml[aHtml.length]	= cXULElement.getBoxCloseChild(this);

	return aHtml.join('');//.length ? (bBoxChild ? cXULElement.getBoxOpenChild(this) : '') + aHtml.join('') + (bBoxChild ? cXULElement.getBoxCloseChild(this) : '') : '';
};

/* Hack. This enables using non-XUL elements as children of XUL elements */
var fElement_prototype_$getTag	= ample.classes.Element.prototype.$getTag;
ample.classes.Element.prototype.$getTag	= function() {
	if (this.parentNode instanceof cXULElement)
		return cXULElement.prototype.$getTag.call(this);
	else
		return fElement_prototype_$getTag.call(this);
};

// Static methods
cXULElement.getBoxOpen	= function(oElement) {
	var aHtml	= ['<table cellpadding="0" cellspacing="0" border="0"'],
		sAlign	= oElement.getAttribute("align"),
		sHeight	= oElement.getAttribute("height"),
		sWidth	= oElement.getAttribute("width");
	if (oElement.getAttribute("orient") == "vertical") {
		// Set width
		if (!sAlign || sAlign == "stretch")
			aHtml[aHtml.length]	= ' width="100%"';

		// Set height
		if (!(oElement instanceof cXULElement_window || oElement instanceof cXULElement_dialog || oElement instanceof cXULElement_wizardpage))
//			aHtml[aHtml.length]	= ' height="100%"';
//		else
		if (!sAlign && sHeight)
			aHtml[aHtml.length]	= ' height="' + sHeight + '"';
	}
	else {
		// Set height
		if (!sAlign || sAlign == "stretch")
			aHtml[aHtml.length]	= ' height="100%"';

		// Set width
		if (!(oElement instanceof cXULElement_window || oElement instanceof cXULElement_dialog || oElement instanceof cXULElement_wizardpage))
//			aHtml[aHtml.length]	= ' width="100%"';
//		else
		if (!sAlign && sWidth)
			aHtml[aHtml.length]	= ' width="' + sWidth + '"';
	}

	if (oElement instanceof cXULElement_rows)
		aHtml[aHtml.length]	= ' class="xul-' + oElement.localName + '" id="' + (oElement.getAttribute("id") || oElement.uniqueID) + '"';
	else
		aHtml[aHtml.length]	= ' class="xul-box---box-container"';
	aHtml[aHtml.length]	= '><tbody';

	if (oElement.getAttribute("orient") != "vertical")
		aHtml[aHtml.length]	= '><tr';

	aHtml[aHtml.length]	= ' class="xul-' + oElement.localName + '--gateway">';

	return aHtml.join('');
};

cXULElement.getBoxOpenChild	= function(oElement) {
	var aHtml	= [],
		oContainer	= oElement.parentNode,
		sAlign	= oElement.getAttribute("align"),
		sPack	= oElement.getAttribute("pack"),
		sHeight	= oElement.getAttribute("height"),
		sWidth	= oElement.getAttribute("width");
	if (oContainer.getAttribute("orient") == "vertical") {
		aHtml.push('<tr style="');
		if (oElement.nodeType == ample.classes.Node.ELEMENT_NODE) {
			if (oElement.getAttribute("hidden") == "true")
				aHtml[aHtml.length]	= 'display:none;';
			if (oElement.viewType == cXULElement.VIEW_TYPE_VIRTUAL)
				aHtml[aHtml.length]	= 'position:absolute;height:0;top:0;left:0;z-index:1;';
		}
		aHtml[aHtml.length]	= '">';
	}
	aHtml[aHtml.length]	= '<td';

	if (oElement.nodeType == ample.classes.Node.ELEMENT_NODE) {
		if (oContainer.getAttribute("orient") == "vertical") {
			if (sHeight)
				aHtml[aHtml.length]	= ' height="' + sHeight + '"';
		}
		else {
			aHtml[aHtml.length]	= ' style="';
			if (oElement.getAttribute("hidden") == "true")
				aHtml[aHtml.length]	= 'display:none;';
			if (oElement.viewType == cXULElement.VIEW_TYPE_VIRTUAL)
				aHtml[aHtml.length]	= 'position:absolute;width:0;top:0;left:0;z-index:1;';
			else
			if (!(oContainer instanceof cXULElement_row))
				aHtml[aHtml.length]	= 'height:' + (sHeight || '100%');
			aHtml[aHtml.length]	= '"';
			if (sWidth)
				aHtml[aHtml.length]	= ' width="' + sWidth + '"';
		}

		// Aligning
		var sHtml1	= "left";
		var sHtml2	= "top";
		if (oElement.getAttribute("orient") == "vertical") {
			if (sPack)
				sHtml2	= sPack	== "start" ? "top"	: sPack	== "end" ? "bottom" : "center";
			if (sAlign)
				sHtml1	= sAlign == "start" ? "left" : sAlign == "end" ? "right"	: "center";
		}
		else {
			if (sAlign)
				sHtml2	= sAlign == "start" ? "top"	: sAlign == "end" ? "bottom" : "center";
			if (sPack)
				sHtml1	= sPack	== "start" ? "left" : sPack	== "end" ? "right"	: "center";
		}
		aHtml[aHtml.length]	= ' valign="' + sHtml2 + '" align="' + sHtml1 + '"';
	}

	aHtml[aHtml.length]	= ' class="xul-box---box-child';
	// Debug Grid
	if (oContainer.getAttribute("debug") == "true")
		aHtml[aHtml.length]	= ' xul-box-debug-true xul-' + (oContainer.getAttribute("orient") != "vertical" ? "h" : "v") + 'box-debug-true';
	aHtml[aHtml.length]	= '">';

	return aHtml.join('');
};

cXULElement.getBoxCloseChild	= function(oElement) {
	var oContainer	= oElement.parentNode;
	return '</td>' +(oContainer.getAttribute("orient") == "vertical" ? '</tr>' : '');
};

cXULElement.getBoxClose		= function(oElement) {
	return (oElement.getAttribute("orient") != "vertical" ? '</tr>' : '')+ '</tbody></table>';
};

// Register Element
ample.extend(cXULElement);
