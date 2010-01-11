/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_radar	= function(){};
cChartElement_radar.prototype	= new cChartElement;

cChartElement_radar.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_radar.prototype.refresh	= function() {
	// Draw Grid
	var d	= [];
	// circles
	for (var n = 0, l = 5; n < l; n++) {
		d.push(	"M150," + (150 - 100 * (n + 1) / l) +
				"A" + 100 * (n + 1) / l + "," + 100 * (n + 1) / l + " 0 0,0 150," + (150 + 100 * (n + 1) / l) +
				"A" + 100 * (n + 1) / l + "," + 100 * (n + 1) / l + " 0 0,0 150," + (150 - 100 * (n + 1) / l) +
				"z");
	}
	// lines
	for (var n = 0, l = 5; n < l; n++)
		d.push(	"M150,150" +
				"L" + (150 - 100 * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 - 100 * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"z");
	this.$getContainer("grid").setAttribute("d", d.join(''));
	// marks
	var d	= [];
	for (var n = 0, l = 5; n < l; n++)
		d.push(	"M" + (150 - 100 * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 - 100 * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"L" + (150 -(100 + 5) * Math.cos(Math.PI / 2 + 2 * Math.PI * n / l)) + "," + (150 -(100 + 5) * Math.sin(Math.PI / 2 + 2 * Math.PI * n / l))+
				"z");
	this.$getContainer("rAxisMarks").setAttribute("d", d.join(''));

	// Draw values
	var nSize	= 3;
	for (var nGroup = 0, nGroups = this.childNodes.length, oGroup; oGroup = this.childNodes[nGroup]; nGroup++) {
		d	= [];
		for (var nItem = 0, nItems = oGroup.childNodes.length, oItem; oItem = oGroup.childNodes[nItem]; nItem++) {
			var nValue	= oItem.getAttribute("value") * 1 * 2,
				nX	= (150 - nValue * Math.cos(Math.PI / 2 + 2 * Math.PI * nItem / nItems)),
				nY	= (150 - nValue * Math.sin(Math.PI / 2 + 2 * Math.PI * nItem / nItems));
			// Set point
			oItem.$getContainer("value").setAttribute("d", "M" + (nX - nSize) + "," + nY +
													"a" + nSize + "," + nSize + " 0 0,0 " + nSize * 2 + ",0 " +
													"a" + nSize + "," + nSize + " 0 0,0-" + nSize * 2 + ",0 " +
													"z");
			//
			d.push((nItem ? "L" : "M") + nX + "," + nY);
		}
		oGroup.$getContainer("line").setAttribute("d", d.join(" ") + "z");
		oGroup.$getContainer("shadow").setAttribute("d", d.join(" ") + "z");
		oGroup.$getContainer("area").setAttribute("d", d.join(" ") + "z");

		// Draw legend
		var nXPath	= 280,
			nYPath	=(50 + (nGroups - nGroup - 1) * 20);
		oGroup.$getContainer("path").setAttribute("d", "M" + (nXPath - 5) + "," + (nYPath - 5) + "h10 v10 h-10 v-10 z");
		oGroup.$getContainer("label").setAttribute("x", nXPath + 20);
		oGroup.$getContainer("label").setAttribute("y", nYPath + 5);
	}
};

cChartElement_radar.prototype.$getTagOpen	= function() {
	return '<div class="c-radar' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
				<svg:svg class="c-radar--canvas" viewBox="0 0 400 300" width="400px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
					<svg:text class="c-radar--title" y="30" x="150">' + this.getAttribute("title")+ '</svg:text>\
					<svg:path class="c-grid c-radar--grid" style="fill:none"/>\
					<svg:g class="c-rAxis">\
						<svg:path class="c-radar--rAxis" d="m150,150 v-100" style="fill:none"/>\
						<svg:path class="c-rAxis--marks c-radar--rAxisMarks" />\
					</svg:g>\
					<svg:g class="c-radar--gateway">';
};

cChartElement_radar.prototype.$getTagClose	= function() {
	return '		</svg:g>\
				</svg:svg>\
			</div>';
};

// Register Element with language
oChartNamespace.setElement("radar", cChartElement_radar);