/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_lineGroup	= function(){};
cChartElement_lineGroup.prototype	= new cChartElement;
cChartElement_lineGroup.prototype.$hoverable	= true;

cChartElement_lineGroup.getMarkerPath	= function(nX, nY, nType) {
	var nSize	= 3,
		nSize2	= nSize * 2;
	switch (nType) {
		// Square
		case 1:
			return	"M" +(nX - nSize)+ "," +(nY - nSize)+
					"h" + nSize2 +
					"v" + nSize2 +
					"h-" + nSize2 +
					"v-" + nSize2 +
					"z";
		// Triangle
		case 2:
			var nOffset	= nSize2 / Math.sqrt(3);
			return	"M" +(nX - nOffset)+ "," +(nY - nSize)+
					"h" + nOffset * 2 +
					"l-" + nOffset + "," + nSize2 +
					"l-" + nOffset + ",-" + nSize2 +
					"z";
		// Square 45%
		case 3:
			return "M" + nX + "," +(nY - nSize)+
					"l" + nSize + "," + nSize +
					"l-" + nSize + "," + nSize +
					"l-" + nSize + ",-" + nSize +
					"l" + nSize + ",-" + nSize +
					"z";
		// Triangle 60%
		case 4:
			var nOffset	= nSize2 / Math.sqrt(3);
			return	"M" + nX + "," +(nY - nSize)+
					"l" + nOffset + "," + nSize2 +
					"h-" + nOffset * 2 +
					"l" + nOffset + ",-" + nSize2 +
					"z";
		// Circle
		default:
			return	"M" + (nX - nSize) + "," + nY +
					"a" + nSize + "," + nSize + " 0 0,0 " + nSize2 + ",0 " +
					"a" + nSize + "," + nSize + " 0 0,0 -" + nSize2 + ",0 " +
					"z";
	}
};

cChartElement_lineGroup.prototype.refresh	= function() {
	var xAxisRange	= this.parentNode.getAttribute("xAxisRange").split(';'),
		yAxisRange	= this.parentNode.getAttribute("yAxisRange").split(';'),
		nGroup	= this.parentNode.childNodes.$indexOf(this),
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
		oElementDOM.setAttribute("d", cChartElement_lineGroup.getMarkerPath(nX, nY, nGroup));
		//
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
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		var that	= this;
		that.refresh();
		setTimeout(function() {
			that.$play("opacity:1", 500, 1);
		}, this.parentNode.childNodes.$indexOf(this) * 500);
	}
};

cChartElement_lineGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-lineGroup c-lineGroup_nth-child-' + this.parentNode.childNodes.$indexOf(this) + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + this.getAttribute("style") + '">\
				<svg:g>\
					<svg:path class="c-lineGroup--path" />\
					<svg:text class="c-lineGroup--label" x="100" y="100" style="stroke:none">' + this.getAttribute("label")+ '</svg:text>\
				</svg:g>\
				<svg:path class="c-lineGroup--shadow" style="fill:none;stroke-linejoin:round" transform="translate(2, 2)"/>\
				<svg:path class="c-lineGroup--line" style="fill:none;stroke-linejoin:round"/>\
				<svg:path class="c-lineGroup--area" style="stroke:none"/>\
				<svg:g class="c-lineGroup--gateway">';
};

cChartElement_lineGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("lineGroup", cChartElement_lineGroup);