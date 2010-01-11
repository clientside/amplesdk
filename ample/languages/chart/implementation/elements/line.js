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
	var bArea	= this.getAttribute("area") == "true";

	// Collect and pre-analyze data
	var aData	= [],
		nXMax	=-Infinity,
		nXMin	= Infinity,
		nYMax	=-Infinity,
		nYMin	= Infinity,
		aYSumAll	= [],
		nYSumMax	=-Infinity,
		nYSumMin	=-Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, aValue, nX, nY; oItem = oGroup.childNodes[nItem]; nItem++) {
			aValue	= oItem.getAttribute("value").split(',');
			nX	= aValue[0] * 1;
			nY	= aValue[1] * 1;
			if (nX > nXMax)
				nXMax	= nX;
			if (nX < nXMin)
				nXMin	= nX;
			if (nY > nYMax)
				nYMax	= nY;
			if (nY < nYMin)
				nYMin	= nY;
			aGroup.push([nX, nY]);
			//
			if (aYSumAll.length < nItem + 1)
				aYSumAll[nItem]	= 0;
			aYSumAll[nItem]	+= nY;
			//
			if (aYSumAll[nItem] > nYSumMax)
				nYSumMax	= aYSumAll[nItem];
			if (aYSumAll[nItem] < nYSumMin)
				nYSumMin	= aYSumAll[nItem];
		}
		aData.push(aGroup);
	}

	// Draw grid
	var d	= [];
	for (var x = 1; x < 8; x++)
		d.push("M" + (50 + x * 50) + ",50 v200 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "h400 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));

	var aYSumUp	=[],
		nYFromPrev = 250, nYToPrev = 250, dPrev = [];
	// Draw lines
	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
		// Get DOM element
		oGroup = this.childNodes[nGroup];

		// Draw points
		var nXFrom, nYFrom,
			nXTo, nYTo,
			nX, nY,	d = [];
		for (var nItem = 0, nItems = aData[nGroup].length; nItem < nItems; nItem++) {
			//
			if (aYSumUp.length < nItem + 1)
				aYSumUp[nItem]	= 0;
			//
			aYSumUp[nItem]	+= aData[nGroup][nItem][1];

			if (this.getAttribute("type") == "stack") {
				nX	= 50 + aData[nGroup][nItem][0] * 400 / nXMax;
				nY	= 250- aYSumUp[nItem] * 200 / nYSumMax;
			}
			else
			if (this.getAttribute("type") == "percentage") {
				nX	= 50 + aData[nGroup][nItem][0] * 400 / nXMax;
				nY	= 250- 200 * aYSumUp[nItem] / aYSumAll[nItem];
			}
			else {
				nX	= 50 + aData[nGroup][nItem][0] * 400 / nXMax;
				nY	= 250- aData[nGroup][nItem][1] * 200 / nYMax;
			}

			//
			if (!bArea)
				oGroup.childNodes[nItem].$getContainer("value").setAttribute("d", cChartElement_line.getMarkerPath(nX, nY, nGroup));
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
		if (bArea)
			oGroup.$getContainer("area").setAttribute("d", "M" + nXFrom + "," + nYFromPrev + " L" + d.join('') + (this.hasAttribute("type") ? dPrev.reverse().join('') : '') + " L" + nXTo + "," + nYToPrev + "z");

		// Draw legend
		var nXPath	= 480,
			nYPath	=(50 + (nGroups - nGroup - 1) * 20),
			sLine	= this.getAttribute("area") == "true" ? "h20" : " h7 z M" + (nXPath + 10) + "," + nYPath + " h-7";
		oGroup.$getContainer("path").setAttribute("d", "M" + (nXPath - 10) + "," + nYPath + sLine + "z" + (this.getAttribute("area") == "true" ? '' : cChartElement_line.getMarkerPath(nXPath, nYPath, nGroup)));
		oGroup.$getContainer("label").setAttribute("x", nXPath + 20);
		oGroup.$getContainer("label").setAttribute("y", nYPath + 5);

		//
		if (this.hasAttribute("type")) {
			nYFromPrev	= nYFrom;
			nYToPrev	= nYTo;
			dPrev	= d;
		}
	}
};

cChartElement_line.prototype.$getTagOpen	= function() {
	return '<div class="c-line' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-line--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:text class="c-line--title" y="30" x="300">' + this.getAttribute("title")+ '</svg:text>\
					<svg:path class="c-grid c-line--grid"/>\
					<svg:g class="c-xAxis">\
						<svg:path class="c-line--xAxis" d="m50,250 h400,0" style="fill:none"/>\
						<svg:path id="x' + this.uniqueID + '" d="m300,280 h400,0" style="fill:none;stroke:none"/>\
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

// Static members
cChartElement_line.getMarkerPath	= function(nX, nY, nType) {
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
		case 4:
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
		case 2:
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

// Register Element with language
oChartNamespace.setElement("line", cChartElement_line);