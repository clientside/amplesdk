/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_group	= function(){};
cChartElement_group.prototype	= new cChartElement("group");
cChartElement_group.prototype.$hoverable	= true;

cChartElement_group.handlers	= {
	'DOMAttrModified':	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "selected":
					this.$setPseudoClass("selected", oEvent.newValue == "true");
			}
		}
	},
	'click':	function(oEvent) {
		this.setAttribute("selected", this.getAttribute("selected") == "true" ? "false" : "true");
	}
};

if (!cChartElement.useVML) {
	cChartElement_group.prototype.$getTagOpen	= function() {
		return '<svg:g class="c-group c-group_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') +'>\
					<svg:path class="c-group--path" />\
					<svg:path class="c-group--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
					<svg:path class="c-group--line" style="fill:none;stroke-linejoin:round"/>\
					<svg:path class="c-group--area" style="stroke:none"/>\
					<svg:text class="c-group--label" style="stroke:none">' + (this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : '') + '</svg:text>\
					<svg:g class="c-group--gateway">';
	};

	cChartElement_group.prototype.$getTagClose	= function() {
		return '	</svg:g>\
				</svg:g>';
	};
}
else {
	// Redefine handler
	(function() {
		var fHandler	= cChartElement_group.handlers['DOMAttrModified'];
		cChartElement_group.handlers['DOMAttrModified']	= function(oEvent) {
			fHandler.call(this, oEvent);
			//
			if (oEvent.target == this && oEvent.attrName == "selected") {
				cChartElement_group.recalcCSS(this);
				// recalc children
				for (var nIndex = 0, nLength = this.childNodes.length; nIndex < nLength; nIndex++)
					cChartElement_item.recalcCSS(this.childNodes[nIndex]);
			}
		};
	})();

	cChartElement_group.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("label"));
		cChartElement.applyCSS(oElement.$getContainer("path"));
		cChartElement.applyCSS(oElement.$getContainer("shadow"));
		cChartElement.applyCSS(oElement.$getContainer("line"));
		cChartElement.applyCSS(oElement.$getContainer("area"));
	};

	cChartElement_group.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
		cChartElement_group.recalcCSS(this);
	};

	cChartElement_group.handlers['mouseenter']	=
	cChartElement_group.handlers['mouseleave']	= function(oEvent) {
		cChartElement_group.recalcCSS(this);
		// recalc children
		for (var nIndex = 0, nLength = this.childNodes.length; nIndex < nLength; nIndex++)
			cChartElement_item.recalcCSS(this.childNodes[nIndex]);
	};

	cChartElement_group.prototype.$getTagOpen	= function() {
		return '<chart2vml:group class="c-group c-group_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" \
					style="position:absolute;width:100%;height:100%;' + (this.getAttribute("style") || '') + '">\
					<chart2vml:shape class="c-group--shadow" filled="false" style="position:absolute;width:100%;height:100%;margin-left:2px;margin-top:2px;"/>\
					<chart2vml:shape class="c-group--path" style="position:absolute;width:100%;height:100%" />\
					<chart2vml:shape class="c-group--line" filled="false" style="position:absolute;width:100%;height:100%"/>\
					<chart2vml:shape class="c-group--area" stroked="false" fillcolor="black" style="position:absolute;width:100%;height:100%"/>\
					<chart2vml:shape path="m0,0 l100,0" class="c-group--label" stroked="false" fillcolor="black" allowoverlap="true" style="position:absolute;width:100%;height:100%;margin-left:0;margin-top:0">\
						<chart2vml:path textpathok="true" />\
						<chart2vml:textpath on="true" string="' + (this.hasAttribute("label") ? ample.$encodeXMLCharacters(this.getAttribute("label")) : '') + '" style="v-text-align:left" />\
					</chart2vml:shape>\
					<chart2vml:group class="c-group--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_group.prototype.$getTagClose	= function() {
		return '	</chart2vml:group>\
				</chart2vml:group>';
	};
}

// Register Element
ample.extend(cChartElement_group);