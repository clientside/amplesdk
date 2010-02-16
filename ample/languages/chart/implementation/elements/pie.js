/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_pie	= function(){};
cChartElement_pie.prototype	= new cChartElement;

cChartElement_pie.handlers	= {
	'DOMNodeInsertedIntoDocument':	function(oEvent) {
		this.refresh();
	}
};

cChartElement_pie.prototype.refresh	= function() {
	// Calculate accumulated value
	var nSumAll	= 0;
	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++)
		nSumAll	+= oElement.getAttribute("value") * 1;

	var nSumUp	= 0,
		cX	= 150,
		cY	= 150,
		nWidth	= 100;

	for (var nIndex = 0, oElement; oElement = this.childNodes[nIndex]; nIndex++) {
		// pie origin
		var	nAngleFrom	=-Math.PI / 2 + 2 * Math.PI * nSumUp / nSumAll,
			nAngleTo	=-Math.PI / 2 + 2 * Math.PI *(nSumUp + oElement.getAttribute("value") * 1) / nSumAll;

		var d	= [];
		// Set start point on the inner circle
		d.push("M" + cX + "," + cY);
		// Draw line to the outer circle
		d.push("L" + (cX + nWidth * Math.cos(nAngleFrom)) + "," +(cY + nWidth * Math.sin(nAngleFrom)));
		// Draw arc on the outer circle
		d.push("A" + nWidth + "," + nWidth + " 0 " + (nAngleTo - nAngleFrom >= Math.PI ? 1 : 0)+ ",1 " + (cX + nWidth * Math.cos(nAngleTo)) + "," +(cY + nWidth * Math.sin(nAngleTo)));
		// Draw line to the inner circle
		d.push("L" + cX + "," + cY);

		cChartElement.setPath(oElement.$getContainer("path"), d.join('') + "z");
//		oElement.$getContainer("path").setAttribute("d", d.join('') + "z");
		//oElement.$getContainer("shadow").setAttribute("d", d.join('') + "z");
/*
		// Text label
		var nTextR	= nWidth - 5,
			nAngleFromText	= nAngleFrom + Math.PI / 90;
		oElement.$getContainer("path").setAttribute("d", "M" + (cX + nTextR * Math.cos(nAngleFromText)) + "," +(cY - nTextR * Math.sin(nAngleFromText)) + ' ' +
														"A" + nTextR + "," + nTextR + " 0 " + (nAngleTo - nAngleFrom > Math.PI ? 1 : 0) + ",0 " + (cX + nTextR * Math.cos(nAngleTo)) + "," +(cY - nTextR * Math.sin(nAngleTo))+
														"z");
*/
		var nAngleHalf	= (nAngleFrom + nAngleTo) / 2,
			bLeft	= nAngleHalf + Math.PI / 2 >= Math.PI;
		cChartElement.setTextPosition(oElement.$getContainer("label"),
										cX + (bLeft ? -10 : 10) + (nWidth + 10) * Math.cos(nAngleHalf),
										cY - 5 + (nWidth + 10) * Math.sin(nAngleHalf));
		oElement.$getContainer("label").setAttribute("text-anchor", bLeft ? "end" : "start");

		//
		nSumUp	+= oElement.getAttribute("value") * 1;
	}
};

if (!cChartElement.useVML) {
	cChartElement_pie.prototype.$getTagOpen	= function() {
		return '<div class="c-pie' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="' + this.getAttribute("style") + '">\
					<svg:svg class="c-pie--canvas" viewBox="0 0 300 300" width="300px" height="300px" xmlns:svg="http://www.w3.org/2000/svg">\
						<svg:text class="c-doughnut--title" y="30" x="150">' + this.getAttribute("title")+ '</svg:text>\
						<svg:g class="c-pie--gateway">';
	};

	cChartElement_pie.prototype.$getTagClose	= function() {
		return '		</svg:g>\
					</svg:svg>\
				</div>';
	};
}
else {
	// Redefine handler
	(function() {
		var fHandler	= cChartElement_pie.handlers['DOMNodeInsertedIntoDocument'];
		cChartElement_pie.handlers['DOMNodeInsertedIntoDocument']	= function(oEvent) {
			fHandler.call(this, oEvent);
			//
			cChartElement_pie.recalcCSS(this);
			// Delay displaying
			var that	= this;
			setTimeout(function() {
				var oCanvas	= that.$getContainer("canvas");
				if (oCanvas)
					oCanvas.style.display	= "";
			});
		};
	})();

	cChartElement_pie.recalcCSS	= function(oElement) {
		cChartElement.applyCSS(oElement.$getContainer("title"));
	};

	cChartElement_pie.prototype.$getTagOpen	= function() {
		return '<div class="c-pie' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" style="overflow:hidden;width:300px;height:300px;' + this.getAttribute("style") + '">\
					<chart2vml:group class="c-pie--canvas" style="position:absolute;width:300px;height:300px;display:none;" coordOrigin="0 0" coordSize="300 300">\
						<chart2vml:shape class="c-pie--title" path="m0,0 l300,0" fillcolor="black" stroked="false" allowoverlap="true" style="position:absolute;width:100%;height:100%;top:30px;xleft:150px">\
							<chart2vml:path textpathok="true" />\
							<chart2vml:textpath on="true" string="' + this.getAttribute("title")+ '" style="v-text-align:center"/>\
						</chart2vml:shape>\
						<chart2vml:group class="c-pie--gateway" style="position:absolute;width:100%;height:100%">';
	};

	cChartElement_pie.prototype.$getTagClose	= function() {
		return '		</chart2vml:group>\
					</chart2vml:group>\
				</div>';
	};
}

// Register Element with language
oChartNamespace.setElement("pie", cChartElement_pie);