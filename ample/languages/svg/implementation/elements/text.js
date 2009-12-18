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

if (!!document.namespaces) {
	// Implementation for IE
	cSVGElement_text.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer("shape");
				switch (oEvent.attrName) {
					case "x":
						oElement.style.left	= oEvent.newValue + 'px';
						break;

					case "y":
						oElement.style.top	= oEvent.newValue + 'px';
						break;
					//
					case "transform":
						cSVGElement.setTransform(this, oEvent.newValue);
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

			var oLabel	= this.$getContainer("label");
			if (this.firstChild instanceof AMLCharacterData)
				oLabel.string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;

			var sValue;

			// Apply gradients
			if ((sValue = cSVGElement.getStyle(this, "fill")) && sValue.substr(0, 3) == "url")
				cSVGElement.setStyle(this, "fill", sValue);

			// Apply transformations
			if (sValue = this.getAttribute("transform"))
				cSVGElement.setTransform(this, sValue);

			// Apply CSS
			cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			this.$getContainer("label").string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;
		}
	};

	// presentation
	cSVGElement_text.prototype.$getTagOpen	= function() {
		var sFontFamily	= cSVGElement.getStyle(this, "font-family") || "Times New Roman",
			sFontWeight	= cSVGElement.getStyle(this, "font-weight"),
			sFontSize	= cSVGElement.getStyle(this, "font-size"),
			sTextAnchor	= cSVGElement.getStyle(this, "text-anchor"),
//			sTextSpacing= cSVGElement.getStyle(this, "letter-spacing") || "0",
			// Font size calculations
			aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 0,
			nFontSize	= Math.round(nFontSizeValue * this.getAspectValue()),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:group class="svg-text' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="top:0;left:0;width:100%;height:100%;position:absolute;">\
					<svg2vml:shape class="svg-text--shape"\
						style="position:absolute;margin-top:' + nMarginTop + 'px;left:' + (this.getAttribute("x") || "0") + 'px;top:' + (this.getAttribute("y") || "0") + 'px;width:100%;height:100%;"\
						path="m 0,0 l 100,0 xe" allowoverlap="true"\
					>' + cSVGElement.getTagStyle(this) + '\
						<svg2vml:path textpathok="true" />\
						<svg2vml:textpath on="true" xscale="true" class="svg-text--label"\
							style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + '" />\
					</svg2vml:shape>';
//	v-text-spacing-mode:tracking;' + (sTextSpacing ? 'v-text-spacing:' + (1 + sTextSpacing / nFontSizeValue) +';' : '') + ';
	};

	cSVGElement_text.prototype.$getTagClose	= function() {
		return '</svg2vml:group>';
	};
};

// Register Element with language
oSVGNamespace.setElement("text", cSVGElement_text);
