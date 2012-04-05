/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_tspan	= function(){};
cSVGElement_tspan.prototype	= new cSVGElement("tspan");

if (cSVGElement.useVML) {

	// Implementation for IE
	cSVGElement_tspan.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			if (this.firstChild instanceof ample.classes.CharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '');

			var sValue;

			// Apply gradients
			if ((sValue = this.$getStyleComputed("fill")) && sValue.substr(0, 3) == "url")
				this.$setStyle("fill", sValue);

			// Apply transform
			cSVGElement.applyTransform(this);

			// Apply CSS
			cSVGElement.applyCSS(this);
		},
		'DOMCharacterDataModified':	function(oEvent) {
			if (oEvent.target.parentNode == this)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= oEvent.target.data.replace(/^\s+/, '').replace(/\s+$/, '');
		}
	};

	cSVGElement_tspan.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "x" || sName == "y" || sName == "dx" || sName == "dy") {
			var nLeft	=((this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
				nTop	=((this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0);
			this.$getContainer().path	= 'm ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x';
		}
		else
		if (sName == "transform") {
			// no implementation
		}
		else
			cSVGElement.prototype.$mapAttribute.call(this, sName, sValue);
	};

	// presentation
	cSVGElement_tspan.prototype.$getTagOpen	= function() {
		var sFontFamily	= this.$getStyleComputed("font-family") || "Times New Roman",
			sFontWeight	= this.$getStyleComputed("font-weight"),
			sFontSize	= this.$getStyleComputed("font-size"),
			sFontStyle	= this.$getStyleComputed("font-style"),
			sTextAnchor	= this.$getStyleComputed("text-anchor"),
			nLeft	=((this.getAttribute("x") || (this.parentNode ? this.parentNode.getAttribute("x") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dx") * 1 || 0),
			nTop	=((this.getAttribute("y") || (this.parentNode ? this.parentNode.getAttribute("y") : "0")).match(/([0-9\.]+)?/)[1] * 1 || 0) + (this.getAttribute("dy") * 1 || 0),
			// Font size calculations
			aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-tspan' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
					path="m ' + [nLeft, nTop].map(Math.round) + ' r 1000,0 x" allowoverlap="false"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true" xscale="true"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + (sFontStyle ? 'font-style:' + sFontStyle + ';' : '') + '" />\
					<span style="display:none">';
	};

	cSVGElement_tspan.prototype.$getTagClose	= function() {
		return '	</span>\
				</svg2vml:shape>';
	};
};

// Register Element
ample.extend(cSVGElement_tspan);
