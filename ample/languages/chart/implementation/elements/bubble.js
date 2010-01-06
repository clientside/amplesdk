/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_bubble	= function(){};
cChartElement_bubble.prototype	= new cChartElement;

cChartElement_bubble.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_bubble.prototype.refresh	= function() {
	// Collect and pre-analyze data
	var aData	= [],
		nXMax	=-Infinity,
		nXMin	= Infinity,
		nYMax	=-Infinity,
		nYMin	= Infinity,
		nZMax	=-Infinity,
		nZMin	= Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, aValue, nX, nY; oItem = oGroup.childNodes[nItem]; nItem++) {
			aValue	= oItem.getAttribute("value").split(',');
			nX	= aValue[0] * 1;
			nY	= aValue[1] * 1;
			nZ	= aValue[2] * 1;
			if (nX > nXMax)
				nXMax	= nX;
			if (nX < nXMin)
				nXMin	= nX;
			if (nY > nYMax)
				nYMax	= nY;
			if (nY < nYMin)
				nYMin	= nY;
			if (nZ > nZMax)
				nZMax	= nZ;
			if (nZ < nZMin)
				nZMin	= nZ;
			aGroup.push([nX, nY, nZ]);
		}
		aData.push(aGroup);
	}

	// Draw grid
	var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 50) + ",50 V250 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "H550 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));

	// Draw lines
	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
		// Get DOM element
		oGroup = this.childNodes[nGroup];

		// Draw items
		var nX, nY, nSize,
			d;
		for (var nItem = 0, nItems = aData[nGroup].length; nItem < nItems; nItem++) {
			nX	= 50 + 500 * (nXMax - aData[nGroup][nItem][0]) / (nXMax - nXMin);
			nY	= 250 - 200 * (nYMax - aData[nGroup][nItem][1]) / (nYMax - nYMin);
			nSize	= 10 + 20 * aData[nGroup][nItem][2] / (nZMax - nZMin);
			d	= "M" + (nX - nSize) + "," + nY +
					"a" + nSize + "," + nSize + " 0 0,0 " + nSize * 2 + ",0 " +
					"a" + nSize + "," + nSize + " 0 0,0-" + nSize * 2 + ",0 " +
					"z";

			oGroup.childNodes[nItem].$getContainer("value").setAttribute("d", d);
			oGroup.childNodes[nItem].$getContainer("shadow").setAttribute("d", d);

			oGroup.childNodes[nItem].$getContainer("label").setAttribute("x", 50 + 500 * (nXMax - aData[nGroup][nItem][0]) / (nXMax - nXMin));
			oGroup.childNodes[nItem].$getContainer("label").setAttribute("y", 250 - 200 * (nYMax - aData[nGroup][nItem][1]) / (nYMax - nYMin) + 6);
		}
	}
};

cChartElement_bubble.prototype.$getTagOpen	= function() {
	return '<div class="c-bubble' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-bubble--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:text class="c-bubble--label" y="30" x="300">' + this.getAttribute("label")+ '</svg:text>\
					<svg:path class="c-grid c-bubble--grid"/>\
					<svg:g class="c-xAxis">\
						<svg:path class="c-bubble--xAxis" d="M50,250 h500,0" style="fill:none"/>\
						<svg:path id="x' + this.uniqueID + '" d="M300,280 h500,0" style="fill:none;stroke:none"/>\
						<svg:text class="c-xAxis--label c-bubble--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
					</svg:g>\
					<svg:g class="c-yAxis">\
						<svg:path class="c-bubble--yAxis" d="M50,250 v0,-200" style="fill:none"/>\
						<svg:path id="y' + this.uniqueID + '" d="M30,200 v0,-200" style="fill:none;stroke:none"/>\
						<svg:text class="c-yAxis--label c-bubble--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
					</svg:g>\
					<svg:g class="c-bubble--gateway">';
};

cChartElement_bubble.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("bubble", cChartElement_bubble);