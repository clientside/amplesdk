/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_text	= function(){};
cSVGElement_text.prototype	= new cSVGElement;

if (cSVGElement.useVML) {
	// Implementation for IE
	cSVGElement_text.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				switch (oEvent.attrName) {
					case "x":
					case "y":
						this.$getContainer("shape").path	= 'm ' + [this.getAttribute("x") || 0, this.getAttribute("y") || 0].map(Math.round) + ' r 1000,0 x';
						break;
					//
					case "transform":
						cSVGElement.applyTransform(this);
						break;
					//
					default:
						cSVGElement.setStyle(this, oEvent.attrName, oEvent.newValue);
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			// Remove text elements from view
			for (var oElement = this.$getContainer(), i = 0; oElement.childNodes[i]; i++)
				if (oElement.childNodes[i].tagName != "shape")
					oElement.removeChild(oElement.childNodes[i--]);

			if (this.firstChild instanceof AMLCharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;

			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformations
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			this.$getContainer().getElementsByTagName("textpath")[0].string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;
		}
	};

	// presentation
	cSVGElement_text.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sFontStyle	= cSVGElement.getStyle(this, "font-style"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
//			sTextSpacing= cSVGElement.getStyle(this, "letter-spacing") || "0",
			// Font size calculations
			aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getAspectRatio(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:group class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;top:0;left:0;width:100%;height:100%;">\
					<svg2vml:shape class="svg-text--shape"\
						style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
						path="m ' + [this.getAttribute("x") || 0, this.getAttribute("y") || 0].map(Math.round) + ' r 1000,0 x" allowoverlap="true"\
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

// Register Element with language
oSVGNamespace.setElement("text", cSVGElement_text);
