/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cChartElement_chart	= function(){};
cChartElement_chart.prototype	= new cChartElement("chart");
cChartElement_chart.prototype.from	= 0;
cChartElement_chart.prototype.to	= 1;

cChartElement_chart.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	},
	'mousewheel':	function(oEvent) {
		var nOffset	= oEvent.wheelDelta / 300;
		if (this.from - nOffset >= 0)
			this.from	-= nOffset;
		else
			this.from	= 0;
		if (this.to + nOffset <= 1)
			this.to		+= nOffset;
		else
			this.to	= 1;
		//
		this.zoom();
		//
		oEvent.preventDefault();
	},
	'keydown':	function(oEvent) {
		var sKey	= oEvent.key;
		if (sKey == "Left" || sKey == "Right") {
			var nOffset	=(sKey == "Left" ? -1 : 1) * (this.to - this.from) / 100;
			if (this.from + nOffset >= 0)
				this.from	+= nOffset;
			else
				this.from	= 0;
			if (this.to + nOffset <= 1)
				this.to		+= nOffset;
			else
				this.to	= 1;
			//
			this.zoom();
			//
			oEvent.preventDefault();
		}
	}
};

cChartElement_chart.prototype.zoom	= function() {
	// Draw grid
	var d	= [];
	for (var x = 1; x < 10; x++)
		d.push("M" + (50 + x * 100 * (1 - (this.to - this.from))) + ",50 v200 z ");
	for (var y = 1; y < 10; y++)
		d.push("M50," + (250 - y * 100 * (1 - (this.to - this.from))) + "h400 z ");
	this.$getContainer("grid").setAttribute("d", d.join(''));
	this.$getContainer("throbber").style.width	= (this.to - this.from) * 500 + "px";
	this.$getContainer("throbber").style.left	= (this.from * 500) + "px";

	// Draw view
	var aValue	=(this.getAttribute("data") || '').split(";"),
		aData	= [];
	for (var nItem = 0; nItem < aValue.length; nItem++)
		aData.push(aValue[nItem].split(","));

	var d	= [];
	for (var nItem = 0, nFrom = Math.floor(this.from * aData.length), nTo = Math.floor(this.to * aData.length); nItem < nTo - nFrom + 1; nItem++)
		d.push("L" + (50 + 500 * nItem / (nTo - nFrom)) + "," + 3 * (100 - (aData[nFrom + nItem] ? aData[nFrom + nItem][1] : 0)));
	this.$getContainer("view").setAttribute("d", "M50,300" + d.join("") + " L550,300" + "z");
	this.$getContainer("fragment").setAttribute("d", "M" + (50 + this.from * 500) + ",0 h" + ((this.to - this.from) * 500) + " v100 h-" + ((this.to - this.from) * 500) + " z");
};

cChartElement_chart.prototype.refresh	= function() {
	var aValue	=(this.getAttribute("data") || '').split(";"),
		aData	= [];
	for (var nItem = 0; nItem < aValue.length; nItem++)
		aData.push(aValue[nItem].split(","));

	// Draw preview
	var d	= [];
//	for (var nItem = 0, nLength = aData.length; nItem < nLength; nItem++)
//		d.push("L" + (50 + 500 * nItem / nLength) + "," + (100 - aData[nItem][1]));
	for (var nItem = 0, nLength = aData.length; nItem < 500; nItem++)
		d.push("L" + (50 + nItem) + "," + (100 - aData[Math.floor(nLength * nItem / 500)][1]));

	this.$getContainer("preview").setAttribute("d", "M50,100" + d.join("") + " L550,100" + "z");

	// Draw Fragment
};

// Throbber
cChartElement_chart.prototype._mouseX	= 0;
cChartElement_chart.prototype._throbberLeft	= 0;
cChartElement_chart.prototype._throbberWidth= 0;

cChartElement_chart.prototype._onThrobberDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._throbberLeft	= parseInt(this.$getContainer("throbber").style.left);
	this._throbberWidth	= parseInt(this.$getContainer("throbber").style.width);

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onThrobberMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onThrobberMove);
	});
};

cChartElement_chart.prototype._onThrobberMove	= function(oEvent) {
	var oThrobber	= this.$getContainer("throbber"),
		nLeft		= this._throbberLeft + oEvent.clientX - this._mouseX;
	if (nLeft < 0)
		nLeft	= 0;
	else
	if (nLeft > 500 - this._throbberWidth)
		nLeft	= 500 - this._throbberWidth;

	//
	this.from	= nLeft / 500;
	this.to		=(this._throbberWidth + nLeft) / 500;
	this.zoom();
};

// Left Grippy
cChartElement_chart.prototype._onLeftGrippyDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._throbberLeft	= parseInt(this.$getContainer("throbber").style.left);
	this._throbberWidth	= parseInt(this.$getContainer("throbber").style.width);

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onLeftGrippyMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onLeftGrippyMove);
	});

	// Prevent throbber action
	if (oEvent.stopPropagation)
		oEvent.stopPropagation();
	else
		oEvent.cancelBubble	= true;
};

cChartElement_chart.prototype._onLeftGrippyMove	= function(oEvent) {
	var oThrobber	= this.$getContainer("throbber"),
		nWidth		= this._throbberWidth -(oEvent.clientX - this._mouseX);
	if (nWidth < 3)
		nWidth	= 3;
	else
	if (nWidth > this._throbberWidth + this._throbberLeft)
		nWidth	= this._throbberWidth + this._throbberLeft;

	//
	this.from	= (this._throbberWidth + this._throbberLeft - nWidth) / 500;
	this.zoom();
};

// Right Grippy
cChartElement_chart.prototype._onRightGrippyDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._throbberLeft	= parseInt(this.$getContainer("throbber").style.left);
	this._throbberWidth	= parseInt(this.$getContainer("throbber").style.width);

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onRightGrippyMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onRightGrippyMove);
	});

	// Prevent throbber action
	if (oEvent.stopPropagation)
		oEvent.stopPropagation();
	else
		oEvent.cancelBubble	= true;
};

cChartElement_chart.prototype._onRightGrippyMove	= function(oEvent) {
	var oThrobber	= this.$getContainer("throbber"),
		nWidth		= this._throbberWidth +(oEvent.clientX - this._mouseX);
	if (nWidth < 3)
		nWidth	= 3;
	else
	if (nWidth > 500 - this._throbberLeft)
		nWidth	= 500 - this._throbberLeft;

	//
	this.to	= (this._throbberLeft + nWidth) / 500;
	this.zoom();
};

// Left Button
cChartElement_chart._onLeftButtonDown	= function() {
	this.setCapture(true);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
	});
};

// Right Button
cChartElement_chart._onRightButtonDown	= function() {
	this.setCapture(true);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
	});
};

// View
cChartElement_chart.prototype._from	= 0;
cChartElement_chart.prototype._to	= 1;
cChartElement_chart.prototype._onViewDown	= function(oEvent) {
	this._mouseX	= oEvent.clientX;
	this._from	= this.from;
	this._to	= this.to;

	this.setCapture(true);
	this.addEventListener("mousemove", cChartElement_chart.prototype._onViewMove);
	this.addEventListener("mouseup", function(oEvent) {
		this.releaseCapture();
		this.removeEventListener(oEvent.type, arguments.callee);
		this.removeEventListener("mousemove", cChartElement_chart.prototype._onViewMove);
	});
};

cChartElement_chart.prototype._onViewMove	= function(oEvent) {
	var nOffset	= (this._to - this._from) * (oEvent.clientX - this._mouseX) / 500;
	if (this._from - nOffset > 0)
		this.from	= this._from - nOffset;
	else
		this.from	= 0;
	if (this._to - nOffset < 1)
		this.to		= this._to - nOffset;
	else
		this.to		= 1;
	//
	this.zoom();
};

cChartElement_chart.prototype.$getTagOpen	= function() {
	return '<div class="c-chart' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '>\
				<div onmousedown="ample.$instance(this)._onViewDown(event); return false" style="height:300px">\
					<svg:svg class="c-chart--canvas" viewBox="0 0 600 300" style="width:inherit;height:inherit" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:text class="c-chart--title" y="30" x="300">' + (this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : '') + '</svg:text>\
						<svg:path class="c-grid c-chart--grid"/>\
						<svg:path class="c-chart--view" style="fill:lightblue;fill-opacity:0.5;"/>\
					</svg:svg>\
				</div>';
};

cChartElement_chart.prototype.$getTagClose	= function() {
	return '	<div class="c-scrollbar" style="position:relative; background-color: silver; height:20px; width:600px;">\
					<div class="c-scrollbar--button-left" style="position:absolute; left: 10px; width:20px; height:20px; background-color: brown"></div>\
					<div class="c-scrollbar--button-right" style="position:absolute; right: 10px; width:20px; height:20px; background-color: brown"></div>\
					<div class="c-scrollbar--throbber" style="position:absolute; left:0; width:500px; height:20px; padding-left:20px; padding-right:20px; margin-left:30px; background-color: white;" onmousedown="ample.$instance(this)._onThrobberDown(event); return false">\
						<div class="c-scrollbar--grippy-left" style="position:absolute; left: 0px; width:20px; height:20px; background-color: green" onmousedown="ample.$instance(this)._onLeftGrippyDown(event); return false"></div>\
						<div class="c-scrollbar--grippy-right" style="position:absolute; right: 0px; width:20px; height:20px; background-color: green" onmousedown="ample.$instance(this)._onRightGrippyDown(event); return false"></div>\
					</div>\
				</div>\
				<div>\
					<svg:svg class="c-chart--canvas2" viewBox="0 0 600 100" width="600px" height="100px" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">\
						<svg:path class="c-chart--preview" style="fill:gray"/>\
						<svg:path class="c-chart--fragment" style="fill:lightblue;opacity:0.5"/>\
					</svg:svg>\
				</div>\
			</div>';
};

// Register Element
ample.extend(cChartElement_chart);