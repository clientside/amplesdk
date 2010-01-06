/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_bar	= function(){};
cChartElement_bar.prototype	= new cChartElement;

cChartElement_bar.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_bar.prototype.refresh	= function() {
	var bColumn	= this.getAttribute("orient") == "horizontal";

	// Collect and pre-analyze data
	var aData	= [],
		nSumMax	=-Infinity,
		nSumMin	= Infinity,
		nGroupMax	=-Infinity,
		nGroupMin	= Infinity;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup, aGroup, nSum; oGroup = this.childNodes[nGroup]; nGroup++) {
		aGroup	= [];
		nSum	= 0;
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem, nValue; oItem = oGroup.childNodes[nItem]; nItem++) {
			nValue	= oItem.getAttribute("value") * 1;
			nSum	+= nValue;
			if (nValue > nGroupMax)
				nGroupMax	= nValue;
			if (nValue < nGroupMin)
				nGroupMin	= nValue;
			aGroup.push(nValue);
		}
		if (nSum > nSumMax)
			nSumMax	= nSum;
		if (nSum < nSumMin)
			nSumMin	= nSum;
		aData.push(aGroup);
	}
/*
	// Draw grid
	var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 50) + ",50 V250 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "H550 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));
*/

	if (bColumn) {
		// Draw horizontal axis labels (values)
		var oParent	= this.$getContainer("xAxisItems"),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = 10; nIndex < nLength + 1; nIndex++) {
			oElement	= oParent.appendChild(oParent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg:text"));
			oElement.textContent	= nIndex * nGroupMax / nLength;
			oElement.setAttribute("x", 50 + 400 * nIndex / nLength);
			oElement.setAttribute("y", 270 - 4);
			d.push("M" +(50 + 400 * nIndex / nLength)+ "," + 250 + "v5 z");
		}
		this.$getContainer("xAxisMarks").setAttribute("d", d.join(' '));

		// Draw vertical axis labels (labels)
		var oParent	= this.$getContainer("yAxisItems"),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = aData[0].length; nIndex < nLength + 1; nIndex++) {
			if (nIndex != nLength) {
				oElement	= oParent.appendChild(oParent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg:text"));
				oElement.setAttribute("text-anchor", "end");
				oElement.textContent	= nIndex;
				oElement.setAttribute("x", 50 - 10);
				oElement.setAttribute("y", 250 - 200 * (nIndex + 1/2) / nLength);
			}
			d.push("M" + 50 + "," + (250 - 200 * nIndex / nLength)+ "h-5 z");
		}
		this.$getContainer("yAxisMarks").setAttribute("d", d.join(' '));
	}
	else {
		// Draw horizontal axis labels (labels)
		var oParent	= this.$getContainer("xAxisItems"),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = aData[0].length; nIndex < nLength + 1; nIndex++) {
			if (nIndex != nLength) {
				oElement	= oParent.appendChild(oParent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg:text"));
				oElement.textContent	= nIndex;
				oElement.setAttribute("x", 50 + 400 * (nIndex + 1/2) / nLength);
				oElement.setAttribute("y", 270 - 4);
			}
			d.push("M" +(50 + 400 * nIndex / nLength)+ "," + 250 + "v5 z");
		}
		this.$getContainer("xAxisMarks").setAttribute("d", d.join(' '));

		// Draw vertical axis labels (values)
		var oParent	= this.$getContainer("yAxisItems"),
			oElement,
			d	= [];
		for (var x = 0, l = oParent.childNodes.length; x < l; x++)
			oParent.removeChild(oParent.childNodes[x]);
		for (var nIndex = 0, nLength = 10; nIndex < nLength + 1; nIndex++) {
			oElement	= oParent.appendChild(oParent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg:text"));
			oElement.setAttribute("text-anchor", "end");
			oElement.textContent	= nIndex * nGroupMax / nLength;
			oElement.setAttribute("x", 50 - 10);
			oElement.setAttribute("y", 250 - 200 * nIndex / nLength);
			d.push("M" + 50 + "," + (250 - 200 * nIndex / nLength)+ "h-5 z");
		}
		this.$getContainer("yAxisMarks").setAttribute("d", d.join(' '));
	}

	//
	var nOffsetItem		= 2,
		nOffsetGroup	= 4;

	// Draw lines
	for (var nGroup = 0, nGroups = aData.length, oGroup; nGroup < nGroups; nGroup++) {
		// Get DOM element
		oGroup = this.childNodes[nGroup];

		// Draw columns
		var d,
			nValue,
			nWeightGroup, nWeightItem;
/*
		// Get max/min/sum in series
		var nSumUp	= 0,
			nSumAll	= 0,
			nItemMax	=-Infinity,
			nItemMin	= Infinity;
		for (var nItem = 0, nItems = aData[nGroup].length, oItem, nValue; nItem < nItems; nItem++) {
			nValue	= aData[nGroup][nItem];
			if (nValue < nItemMin)
				nItemMin	= nValue;
			if (nValue > nItemMax)
				nItemMax	= nValue;
			nSumAll	+= nValue;
		}
*/
		for (var nItem = 0, nItems = aData[nGroup].length, oItem; nItem < nItems; nItem++) {
			// Get DOM element
			oItem = oGroup.childNodes[nItem];

			// Column chart
			if (bColumn) {
				if (this.getAttribute("type") == "stack") {

				}
				else
				if (this.getAttribute("type") == "percentage") {

				}
				else {
					nWeightGroup	= 200 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup / nGroups - nOffsetItem;
					nValue	= 400 * aData[nGroup][nItem] / nGroupMax;
					// Bars
					d	=	"M50," + (250 - (nWeightGroup + nOffsetGroup) * nItem - (nOffsetItem + nOffsetGroup) / 2 - (nWeightItem + nOffsetItem) * nGroup) + " " +
							"h" + nValue + " " +
							"v-" + nWeightItem + " " +
							"h-" + nValue + " " +
							"v" + nWeightItem + " z";
					// Text labels
					oItem.$getContainer("textPath").setAttribute("d", "M" + (50 + nValue + 5) + "," + (250 - (nWeightGroup + nOffsetGroup) * nItem - (nWeightItem + nOffsetItem) * nGroup - 8) +
																		"h100 "+ "z");
				}
			}
			// Bar chart
			else {
				if (this.getAttribute("type") == "stack") {/*
					nWeightGroup	= 400 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup - nOffsetItem;
					nValue	= 200 * aData[nGroup][nItem] / nSumMax;
					// Bars
					d	=	"M" + (50 + (nWeightGroup + nOffsetGroup) * nItem) + "," + (250) +
							"v-" + nValue + " " +
							"h" +  nWeightItem + " " +
							"v" + nValue + " " +
							"h-" + nWeightItem + " z";*/
				}
				else
				if (this.getAttribute("type") == "percentage") {

				}
				else {
					nWeightGroup	= 400 / nItems - nOffsetGroup;
					nWeightItem		= nWeightGroup / nGroups - nOffsetItem;
					nValue	= 200 * aData[nGroup][nItem] / nGroupMax;
					// Bars
					d	=	"M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nOffsetItem + nOffsetGroup) / 2 + (nWeightItem + nOffsetItem) * nGroup) + ",250 " +
							"v-" + nValue + " " +
							"h" + nWeightItem + " " +
							"v" + nValue + " " +
							"h-" + nWeightItem + " z";
					// Text labels
					oItem.$getContainer("textPath").setAttribute("d", "M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nWeightItem + nOffsetItem) * nGroup + 16) + "," + (250 - nValue - 3) +
																		"v-200 "+ "z");
				}
			}

			oItem.$getContainer("value").setAttribute("d", d);
			oItem.$getContainer("shadow").setAttribute("d", d);
/*
			nSumUp	+= aData[nGroup][nItem];
*/
		}
	}
};

cChartElement_bar.prototype.$getTagOpen	= function() {
	return '<div class="c-bar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-bar--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:text class="c-bar--label" y="30" x="300">' + this.getAttribute("label")+ '</svg:text>\
					<svg:path class="c-grid c-bar--grid"/>\
					<svg:g class="c-xAxis">\
						<svg:path class="c-bar--xAxis" d="m50,250 h400,0" style="fill:none"/>\
						<svg:path id="x' + this.uniqueID + '" d="m300,280 h400,0" style="fill:none;stroke:none"/>\
						<svg:text class="c-xAxis--label c-bar--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("xAxisLabel")+ '</svg:textPath></svg:text>\
						<svg:path class="c-xAxis--marks c-bar--xAxisMarks" xtransform="translate(0,2)"/>\
						<svg:g class="c-xAxis--scale c-bar--xAxisItems" style="stroke:none" transform="translate(-3,0)"/>\
					</svg:g>\
					<svg:g class="c-yAxis">\
						<svg:path class="c-bar--yAxis" d="m50,250 v0,-200" style="fill:none"/>\
						<svg:path id="y' + this.uniqueID + '" d="m20,200 v0,-200" style="fill:none;stroke:none"/>\
						<svg:text class="c-yAxis--label c-bar--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
						<svg:path class="c-yAxis--marks c-bar--yAxisMarks" xtransform="translate(-2,0)" />\
						<svg:g class="c-yAxis--scale c-bar--yAxisItems" style="stroke:none" transform="translate(0,3)"/>\
					</svg:g>\
					<svg:g class="c-bar--gateway">';
};

cChartElement_bar.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("bar", cChartElement_bar);