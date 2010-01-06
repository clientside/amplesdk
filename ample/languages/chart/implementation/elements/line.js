/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_line	= function(){};
cChartElement_line.prototype	= new cChartElement;

cChartElement_line.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_line.prototype.refresh	= function() {
	// Draw grid
	var xAxisRange	= this.getAttribute("xAxisRange").split(';'),
		yAxisRange	= this.getAttribute("yAxisRange").split(';');
	var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 50) + ",50 V250 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "H550 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));

	var xAxisRange	= this.getAttribute("xAxisRange").split(';'),
		yAxisRange	= this.getAttribute("yAxisRange").split(';'),
		aValues;

	// Draw lines
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aValues	= [];

		// Get series' values
		if (oGroup.hasAttribute("values")) {
			var aValuesRaw	= oGroup.getAttribute("values").split(';');
			for (var nItem = 0, nItems = aValuesRaw.length; nItem < nItems; nItem++)
				aValues.push(aValuesRaw[nItem].split(','));
		}
		else {
			for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; nItem < nItems; nItem++)
				aValues.push(oGroup.childNodes[nItem].getAttribute("value").split(','));
		}

		// Draw points
		var nXFrom, nYFrom,
			nXTo, nYTo,
			nX, nY,
			d	= [];
		for (var nItem = 0, nItems = aValues.length; nItem < nItems; nItem++) {
			nX	= 50 + aValues[nItem][0] * 500 / (xAxisRange[1] - xAxisRange[0]);
			nY	= 250- aValues[nItem][1] * 200 / (yAxisRange[1] - yAxisRange[0]);
			//
			oGroup.childNodes[nItem].$getContainer().setAttribute("d", cChartElement_lineGroup.getMarkerPath(nX, nY, nGroup));
			//
			d.push(nX + "," + nY + " ");
			if (!nItem) {
				nXFrom	= nX;
				nYFrom	= nY;
			}
			else
			if (nItem == nItems - 1) {
				nXTo	= nX;
				nYTo	= nY;
			}
		}

		// Draw line
		oGroup.$getContainer("line").setAttribute("d", "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
		oGroup.$getContainer("shadow").setAttribute("d", "M" + nXFrom + "," + nYFrom + " L" + d.join(''));
		if (oGroup.parentNode.getAttribute("area") == "true")
			oGroup.$getContainer("area").setAttribute("d", "M" + nXFrom + "," + 250 + " L" + d.join('') + " L" + nXTo + "," + 250 + "z");
/*
		oGroup.$play("opacity:0", 0, 1);
		setTimeout(function() {
			oGroup.$play("opacity:1", 500, 1);
		}, nGroup * 500);*/
	}
};

cChartElement_line.prototype.$getTagOpen	= function() {
	return '<div class="c-line' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-line--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:text class="c-line--label" y="30" x="300">' + this.getAttribute("label")+ '</svg:text>\
					<svg:path class="c-grid c-line--grid"/>\
					<svg:g class="c-xAxis">\
						<svg:path class="c-line--xAxis" d="m50,250 h500,0" style="fill:none"/>\
						<svg:path id="x' + this.uniqueID + '" d="m300,280 h500,0" style="fill:none;stroke:none"/>\
						<svg:text class="c-xAxis--label c-line--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("xAxisLabel")+ '</svg:textPath></svg:text>\
					</svg:g>\
					<svg:g class="c-yAxis">\
						<svg:path class="c-line--yAxis" d="m50,250 v0,-200" style="fill:none"/>\
						<svg:path id="y' + this.uniqueID + '" d="m30,200 v0,-200" style="fill:none;stroke:none"/>\
						<svg:text class="c-yAxis--label c-line--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
					</svg:g>\
					<svg:g class="c-line--gateway">';
};

cChartElement_line.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("line", cChartElement_line);