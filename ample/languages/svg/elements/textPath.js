/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cSVGElement_textPath	= function(){};
cSVGElement_textPath.prototype	= new cSVGElement("textPath");

if (cSVGElement.useVML) {
	// Implementation for IE
	// handlers
	cSVGElement_textPath.handlers	= {
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var sValue;
			// path
			if (sValue = this.getAttribute("xlink:href"))
				this.$mapAttribute("xlink:href", sValue);

			// text
			if (this.firstChild instanceof ample.classes.CharacterData)
				this.$getContainer().getElementsByTagName("textpath")[0].string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '');

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

	cSVGElement_textPath.prototype.$mapAttribute	= function(sName, sValue) {
		if (sName == "xlink:href") {
			var oTextPath	= this.ownerDocument.getElementById(sValue.substr(1));
			if (oTextPath)
				this.$getContainer().path	= cSVGElement_path.convert(oTextPath.getAttribute("d") || '');
		}
	};

	// presentation
	cSVGElement_textPath.prototype.$getTagOpen	= function() {
		var sFontFamily	= this.$getStyleComputed("font-family") || "Times New Roman",
			sFontWeight	= this.$getStyleComputed("font-weight"),
			sFontSize	= this.$getStyleComputed("font-size"),
			sFontStyle	= this.$getStyleComputed("font-style"),
			sTextAnchor	= this.$getStyleComputed("text-anchor"),
			// Font size calculations
			aFontSize	= sFontSize.match(/(^[\d.]*)(.*)$/),
			sFontSizeUnit	= aFontSize[2] || "px",
			nFontSizeValue	= aFontSize[1] || 16,
			nFontSize	= Math.round(nFontSizeValue * cSVGElement.getScaleFactor(this)),
			nMarginTop	= -(sFontSizeUnit == "pt" ? Math.round(nFontSizeValue * 0.35) : nFontSizeValue * 0.35);

		return '<svg2vml:shape class="svg-textPath' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"\
					style="position:absolute;width:100%;height:100%;margin-top:' + nMarginTop + 'px;left:0px;top:0px;"\
					path="m 0,0 l 1000,0 x" allowoverlap="true"\
				>' + cSVGElement.getTagStyle(this) + '\
					<svg2vml:path textpathok="true" />\
					<svg2vml:textpath on="true"\
						style="v-text-align:' + cSVGElement.textAnchorToVTextAlign(sTextAnchor) + ';font-size:' + nFontSize + sFontSizeUnit + ';' + (sFontFamily ? 'font-family:\'' + sFontFamily + '\';' : '') + (sFontWeight ? 'font-weight:' + sFontWeight + ';' : '') + (sFontStyle ? 'font-style:' + sFontStyle + ';' : '') + '" />\
					<span style="display:none">';
	};

	cSVGElement_textPath.prototype.$getTagClose	= function() {
		return '	</span>\
				</svg2vml:shape>';
	};
};

// Register Element
ample.extend(cSVGElement_textPath);
