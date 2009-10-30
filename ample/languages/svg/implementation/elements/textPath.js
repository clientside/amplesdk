/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cSVGElement_textPath	= function(){};
cSVGElement_textPath.prototype	= new cSVGElement;

if (!!document.namespaces) {
	// Implementation for IE
	// handlers
	cSVGElement_textPath.handlers	= {
		'DOMAttrModified':	function(oEvent) {
			if (oEvent.target == this) {
				var oElement	= this.$getContainer();
				switch (oEvent.attrName) {
					case "xlink:href":
						oElement.setAttribute(oEvent.attrName, oEvent.newValue);
						break;
				}
			}
		},
		'DOMNodeInsertedIntoDocument':	function(oEvent) {
			var oText	= this.parentNode,
				sValue;
			if (oText instanceof cSVGElement_text) {
				// path
				var oTextPath = this.ownerDocument.getElementById(this.getAttribute("xlink:href").substr(1));
				if (oTextPath) {
					oText.$getContainer("shape").path	= cSVGElement_path.convert(oTextPath.getAttribute("d"));

					// Apply fill/stroke etc
					if (!oText.getAttribute("fill"))
						if (sValue = (this.getAttribute("fill") || oText.getAttribute("fill")))
							oText.setAttribute("fill", sValue);

					if (!oText.getAttribute("stroke"))
						if (sValue = (this.getAttribute("stroke") || oText.getAttribute("stroke")))
							oText.setAttribute("stroke", sValue);
				}
				// text
				if (this.firstChild instanceof AMLCharacterData)
					oText.$getContainer("label").string	= this.firstChild.data.replace(/^\s+/, '').replace(/\s+$/, '').replace(/&gt;/g, '>').replace(/&lt;/g, '<').replace(/&amp;/g, '&');;
			}
		}
	};

	// presentation
	cSVGElement_textPath.prototype.$getTagOpen	= function() {
		return '<span class="svg-textPath' + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="display:none">';
	};

	cSVGElement_textPath.prototype.$getTagClose	= function() {
		return '</span>';
	};
};

// Register Element with language
oSVGNamespace.setElement("textPath", cSVGElement_textPath);
