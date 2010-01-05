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
	// Draw grid
	var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 50) + ",50 V250 z ");
	for (var y = 1; y < 4; y++)
		d.push("M50," + (250 - y * 50) + "H550 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));

	// Draw horizontal axis labels
	var oParent	= this.$getContainer("xAxisItems"),
		oElement,
		d	= [];
	for (var x = 0, l = oParent.childNodes.length; x < l; x++)
		oParent.removeChild(oParent.childNodes[x]);
	for (var x = 0; x < 10; x++) {
		oElement	= oParent.appendChild(oParent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg:text"));
		oElement.textContent	= "x" + x;
		oElement.setAttribute("x", 50 + x * 50);
		oElement.setAttribute("y", 270 - 4);
		d.push("M" +(50 + x * 50)+ "," + 250 + "v5 z");
	}
	this.$getContainer("xAxisMarks").setAttribute("d", d.join(' '));

	// Draw vertical axis labels
	var oParent	= this.$getContainer("yAxisItems"),
		oElement,
		d	= [];
	for (var x = 0, l = oParent.childNodes.length; x < l; x++)
		oParent.removeChild(oParent.childNodes[x]);
	for (var x = 0; x < 8; x++) {
		oElement	= oParent.appendChild(oParent.ownerDocument.createElementNS("http://www.w3.org/2000/svg", "svg:text"));
		oElement.setAttribute("text-anchor", "end");
		oElement.textContent	= "y" + x * 100;
		oElement.setAttribute("x", 50 - 10);
		oElement.setAttribute("y", 250 - 25 * x);
		d.push("M" + 50 + "," +(250 - 25 * x)+ "h-5 z");
	}
	this.$getContainer("yAxisMarks").setAttribute("d", d.join(' '));

	// Draw lines
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		var	aValues	= [],
			nItem, nItems;

		// Get series' values
		if (oGroup.hasAttribute("values")) {
			var aValuesRaw	= oGroup.getAttribute("values").split(';');
			for (nItem = 0, nItems = aValuesRaw.length; nItem < nItems; nItem++)
				aValues.push(aValuesRaw[nItem]);
		}
		else {
			for (nItem = 0, nItems = oGroup.childNodes.length; nItem < nItems; nItem++)
				aValues.push(oGroup.childNodes[nItem].getAttribute("value"));
		}

		var nMax	= 50,
			nOffsetItem		= 2,
			nOffsetGroup	= 5;

		// Draw columns
		var d,
			nValue,
			nWeightGroup, nWeightItem;
		for (var nItem = 0, nItems = aValues.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++) {
			if (this.getAttribute("orient") == "horizontal") {
				nWeightGroup	=(200 - nItems * nOffsetGroup) / nItems;
				nWeightItem	=(nWeightGroup - nGroups * nOffsetItem) / nGroups;
				nValue	= 500 * aValues[nItem] / nMax;
				// Bars
				d	=	"M50," + (250-(nWeightGroup + nOffsetGroup) * nItem - (nWeightItem + nOffsetItem) * nGroup) + " " +
						"h" +  nValue + " " +
						"v-" +  nWeightItem + " " +
						"h-" + nValue + " " +
						"v" + nWeightItem + " z";
				// Text labels
				oItem.$getContainer("textPath").setAttribute("d", "M" + (50 + nValue + 5) + "," + (250 - (nWeightGroup + nOffsetGroup) * nItem - (nWeightItem + nOffsetItem) * nGroup - 8) +
																	"h100 "+ "z");
			}
			else {
				nWeightGroup	=(500 - nItems * nOffsetGroup) / nItems;
				nWeightItem	=(nWeightGroup - nGroups * nOffsetItem) / nGroups;
				nValue	= 200 * aValues[nItem] / nMax;
				// Bars
				d	=	"M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nWeightItem + nOffsetItem) * nGroup) + ",250 " +
						"v-" + nValue + " " +
						"h" +  nWeightItem + " " +
						"v" + nValue + " " +
						"h-" + nWeightItem + " z";
				// Text labels
				oItem.$getContainer("textPath").setAttribute("d", "M" + (50 + (nWeightGroup + nOffsetGroup) * nItem + (nWeightItem + nOffsetItem) * nGroup + 16) + "," + (250 - nValue - 3) +
																	"v-200 "+ "z");
			}

			oItem.$getContainer("value").setAttribute("d", d);
			oItem.$getContainer("shadow").setAttribute("d", d);
		}
	}
};

cChartElement_bar.prototype.$getTagOpen	= function() {
	return '<div class="c-bar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-bar--canvas" viewBox="0 0 600 300" width="600px" height="300px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
					<svg:text class="c-bar--label" y="30" x="300">' + this.getAttribute("label")+ '</svg:text>\
					<svg:path class="c-grid c-bar--grid"/>\
					<svg:g class="c-xAxis">\
						<svg:path class="c-bar--xAxis" d="m50,250 h500,0" style="fill:none"/>\
						<svg:path id="x' + this.uniqueID + '" d="m300,280 h500,0" style="fill:none;stroke:none"/>\
						<svg:text class="c-xAxis--label c-bar--xAxisLabel"><svg:textPath xlink:href="#x' + this.uniqueID + '">' + this.getAttribute("xAxisLabel")+ '</svg:textPath></svg:text>\
						<svg:path class="c-xAxis--marks c-bar--xAxisMarks" transform="translate(0,2)"/>\
						<svg:g class="c-xAxis--scale c-bar--xAxisItems" style="stroke:none" transform="translate(-4,0)"/>\
					</svg:g>\
					<svg:g class="c-yAxis">\
						<svg:path class="c-bar--yAxis" d="m50,250 v0,-200" style="fill:none"/>\
						<svg:path id="y' + this.uniqueID + '" d="m20,200 v0,-200" style="fill:none;stroke:none"/>\
						<svg:text class="c-yAxis--label c-bar--yAxisLabel"><svg:textPath xlink:href="#y' + this.uniqueID + '">' + this.getAttribute("yAxisLabel")+ '</svg:textPath></svg:text>\
						<svg:path class="c-yAxis--marks c-bar--yAxisMarks" transform="translate(-2,0)" />\
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