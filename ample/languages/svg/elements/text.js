/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_text	= function(){};
cSVGElement_text.prototype	= new cSVGElement("text");

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_text.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			// Remove text elements from view
			for (var oElement = this.$getContainer(), i = 0; oElement.childNodes[i]; i++)
				if (oElement.childNodes[i].tagName != "shape")
					oElement.removeChild(oElement.childNodes[i--]);

			if (this.firstChild instanceof ample.classes.CharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '');

			var sValue;

			// Apply gradients
			if ((sValue = this.$getStyleComputed("fill")) && sValue.substr(0, 3) == "url")
				this.$setStyle("fill", sValue);

			// Apply transformations
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			if (oEvent.target.parentNode == this)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '');
		}
	};

	cSVGElement_text.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "x" || sName == "y" || sName == "dx" || sName == "dy") {
			var nLeft	=(this.getAttribute("x").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
				nTop	=(this.getAttribute("y").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0);
			this.$getContainer().getElementsByTagName("shape")[0].path	= 'm ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x';
		}
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
	};

	//
	cSVGElement_text.prototype.$setStyle	= function(sName, sValue) {
		for (var nIndex = 0, oChild; oChild = this.childNodes[nIndex]; nIndex++)
			if (oChild.nodeType == 1 && !oChild.$getStyle(sName))
				oChild.$setStyle(sName, sValue);
		//
		cSVGElement.prototype.$setStyle.call(this, sName, sValue);
	};

	// presentation
	cSVGElement_text.prototype.$getTagOpen	= function() {
		var sFontFamily	= this.$getStyleComputed("font-family") || "Times New Roman",
			sFontWeight	= this.$getStyleComputed("font-weight"),
			sFontSize	= this.$getStyleComputed("font-size"),
			sFontStyle	= this.$getStyleComputed("font-style"),
			sTextAnchor	= this.$getStyleComputed("text-anchor"),
//			sTextSpacing= this.$getStyleComputed("letter-spacing") || "0",
			nLeft	=(this.getAttribute("x").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
			nTop	=(this.getAttribute("y").match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0),
			// Font size calculations
			aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:group class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;top:0;left:0;width:100%;height:100%;">\
					<svg2vml:shape \
						style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
						path="m ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x" allowoverlap="true"\
					>' + cSVGElement.getTagStyle(this) + '\
						<svg2vml:path textpathok="true" />\
						<svg2vml:textpath on="true" xscale="true"\
							style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + (sFontStyle ? 'font-style:' + sFontStyle + ';' : '') + '" />\
					</svg2vml:shape>';
//	v-text-spacing-mode:tracking;' + (sTextSpacing ? 'v-text-spacing:' + (1 + sTextSpacing / nFontSizeValue) +';' : '') + ';
	};

	cSVGElement_text.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element
ample.extend(cSVGElement_text);
