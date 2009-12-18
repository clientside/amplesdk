/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_lineGroup	= function(){};
cChartElement_lineGroup.prototype	= new cChartElement;

cChartElement_lineGroup.prototype.refresh	= function() {
	var xAxisRange	= this.parentNode.getAttribute("xAxisRange").split(';'),
		yAxisRange	= this.parentNode.getAttribute("yAxisRange").split(';'),
		aValues	= [],
		nIndex, nLength;

	// Get series' values
	if (this.hasAttribute("values")) {
		var aValuesRaw	= this.getAttribute("values").split(';');
		for (nIndex = 0, nLength = aValuesRaw.length; nIndex < nLength; nIndex++)
			aValues.push(aValuesRaw[nIndex].split(','));
	}
	else {
		for (nIndex = 0, nLength = this.childNodes.length; nIndex < nLength; nIndex++)
			aValues.push(this.childNodes[nIndex].getAttribute("value").split(','));
	}

	// Draw points
	var nXFrom, nYFrom,
		nXTo, nYTo,
		nX, nY,
		d	= [],
		oElementDOM;
	for (nIndex = 0, nLength = aValues.length; nIndex < nLength; nIndex++) {
		oElementDOM	= this.childNodes[nIndex].$getContainer();
		nX	= 50 + aValues[nIndex][0] * 500 / (xAxisRange[1] - xAxisRange[0]);
		nY	= 250- aValues[nIndex][1] * 200 / (yAxisRange[1] - yAxisRange[0]);
		oElementDOM.setAttribute("cx", nX);
		oElementDOM.setAttribute("cy", nY);
		d.push(nX + "," + nY + " ");
		if (!nIndex) {
			nXFrom	= nX;
			nYFrom	= nY;
		}
		else
		if (nIndex == nLength - 1) {
			nXTo	= nX;
			nYTo	= nY;
		}
	}
	// Draw line
	this.$getContainer("line").setAttribute("d", "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
	this.$getContainer("shadow").setAttribute("d", "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
	if (this.parentNode.getAttribute("area") == "true")
		this.$getContainer("area").setAttribute("d", "M" + nXFrom + "," + 250 + " L" + d.join('') + " L" + nXTo + "," + 250 + "z");
};

cChartElement_lineGroup.handlers	= {
	'mouseenter':	function(oEvent) {
		this.$getContainer("line").setAttribute("stroke-width", 3);
		this.$getContainer("gateway").setAttribute("stroke-width", 1);
	},
	'mouseleave':	function(oEvent) {
		this.$getContainer("line").setAttribute("stroke-width", 1);
		this.$getContainer("gateway").setAttribute("stroke-width", 0);
	},
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		var that	= this;
		that.refresh();
		setTimeout(function() {
			that.$play("opacity:1", 500, 1);
		}, this.parentNode.childNodes.$indexOf(this) * 500);
	}
};

cChartElement_lineGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-lineGroup' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + (this.hasAttribute("fill") ? 'fill:' + this.getAttribute("fill") + ';' : '') + (this.hasAttribute("fill") ? 'stroke:' + this.getAttribute("fill") + ';' : '') + 'stroke-width:1;opacity:0;' + this.getAttribute("style") + '">\
				<svg:path class="c-lineGroup--shadow" stroke-width="3" style="fill:none;opacity:0.2" stroke-linejoin="round" transform="translate(2, 2)"/>\
				<svg:path class="c-lineGroup--line" stroke-width="1" style="fill:none;stroke-linejoin:round"/>\
				<svg:path class="c-lineGroup--area" style="xfill:none;stroke:none;opacity:0.2"/>\
				<svg:g class="c-lineGroup--gateway" stroke-width="0" style="stroke:white;">';
};

cChartElement_lineGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("lineGroup", cChartElement_lineGroup);