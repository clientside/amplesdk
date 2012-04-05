/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_item	= function(){};
cChartElement_item.prototype	= new cChartElement("item");
cChartElement_item.prototype.$hoverable	= true;

cChartElement_item.handlers	= {

};

if (!cChartElement.useVML) {
	cChartElement_item.prototype.$getTagOpen	= function() {
		return '<svg:g class="c-item c-item_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:path class="c-item--shadow" style="stroke-linejoin:round" transform="translate(2,2)"/>\
					<svg:path class="c-item--path"/>\
					<svg:path class="c-item--textPath" d="m0,0 h600" id="p' + this.uniqueID + '" style="fill:none;stroke:none"/>\
					<svg:text class="c-item--label" style="stroke:none;"><svg:textPath xlink:href="#p' + this.uniqueID + '">' + ample.$encodeXMLCharacters(this.getAttribute("value")) + '</svg:textPath></svg:text>\
				</svg:g>';
	};
}
else {
	cChartElement_item.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("label"));
		cChartElement.applyCSS(oElement.$getContainer("path"));
		cChartElement.applyCSS(oElement.$getContainer("shadow"));
	};

	cChartElement_item.handlers['DOMNodeInsertedIntoDocument']	=
	cChartElement_item.handlers['mouseenter']	=
	cChartElement_item.handlers['mouseleave']	= function(oEvent) {
		cChartElement_item.recalcCSS(this);
	};

	cChartElement_item.prototype.$getTagOpen	= function() {
		return '<chart2vml:group class="c-item c-item_nth-child-' + this.parentNode.childNodes.$indexOf(this) +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="position:absolute;width:100%;height:100%">\
					<chart2vml:shape class="c-item--shadow" style="position:absolute;width:100%;height:100%;margin-top:2px;margin-left:2px;"/>\
					<chart2vml:shape class="c-item--path" fillcolor="black" style="position:absolute;height:100%;width:100%"/>\
					<chart2vml:shape class="c-item--textPath c-item--label" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%">\
						<chart2vml:path textpathok="true" />\
						<chart2vml:textpath on="true" string="' + ample.$encodeXMLCharacters(this.getAttribute("value")) + '" style="v-text-align:left"/>\
					</chart2vml:shape>\
				</chart2vml:group>';
	};
}

// Register Element
ample.extend(cChartElement_item);