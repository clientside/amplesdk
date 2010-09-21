/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_option	= function(){};
cXHTMLElement_option.prototype	= new cXHTMLElement("option");
cXHTMLElement_option.prototype.$selectable	= false;
cXHTMLElement_option.prototype.$hoverable	= true;

// Static Methods
cXHTMLElement_option.ensureRowIsVisible	= function(oInstance) {
	for (var oElement = oInstance; oElement = oElement.parentNode;)
		if (oElement instanceof cXHTMLElement_select) {
			var oScroll	= oElement.$getContainer("popup"),
				oInput	= oInstance.$getContainer(),
				nDiffTop	= oInput.offsetTop - oScroll.offsetTop,
				nDiffHeight	= oInput.offsetHeight - oScroll.offsetHeight;
			if (oScroll.scrollTop < nDiffTop + nDiffHeight)
				oScroll.scrollTop	= nDiffTop + nDiffHeight;
			else
			if (oScroll.scrollTop > nDiffTop)
				oScroll.scrollTop	= nDiffTop;
			break;
		}
};

// Class Events Handlers
cXHTMLElement_option.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			switch (oEvent.attrName) {
				case "selected":
					this.$setPseudoClass("selected", oEvent.newValue != null && oEvent.newValue != "false");
					break;

				default:
					cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
			}
	}
};

// Register Element
ample.extend(cXHTMLElement_option);
