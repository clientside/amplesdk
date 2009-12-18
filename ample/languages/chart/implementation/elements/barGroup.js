/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_barGroup	= function(){};
cChartElement_barGroup.prototype	= new cChartElement;

cChartElement_barGroup.handlers	= {
	'DOMNodeInsertedIntoDocument':	function() {
		this.refresh();
	}
};

cChartElement_barGroup.prototype.refresh	= function() {
	var	aValues	= [],
		nIndex, nLength;

	// Get series' values
	if (this.hasAttribute("values")) {
		var aValuesRaw	= this.getAttribute("values").split(';');
		for (nIndex = 0, nLength = aValuesRaw.length; nIndex < nLength; nIndex++)
			aValues.push(aValuesRaw[nIndex]);
	}
	else {
		for (nIndex = 0, nLength = this.childNodes.length; nIndex < nLength; nIndex++)
			aValues.push(this.childNodes[nIndex].getAttribute("value"));
	}

	var nMax	= 50,
		nOffsetItem		= 2,
		nOffsetGroup	= 10;

	// Draw columns
	var d,
		nWidth, nHeight,
		nWidthGroup, nWidthItem,
		nGroups	= this.parentNode.childNodes.length,
		nGroup	= this.parentNode.childNodes.$indexOf(this);
	for (nIndex = 0, nLength = aValues.length; nIndex < nLength; nIndex++) {
		nWidthGroup	=(500 - nLength * nOffsetGroup) / nLength;
		nWidthItem	=(nWidthGroup - nGroups * nOffsetItem) / nGroups;
		nHeight	= 200 * aValues[nIndex] / nMax;
		d	=	"M" + (50 + (nWidthGroup + nOffsetGroup) * nIndex + (nWidthItem + nOffsetItem) * nGroup) + ",250 " +
				"v-" + nHeight + " "+
				"h" +  nWidthItem + " "+
				"v" + nHeight + " "+
				"h-" + nWidthItem + " z";
		this.childNodes[nIndex].$getContainer("value").setAttribute("d", d);
		this.childNodes[nIndex].$getContainer("shadow").setAttribute("d", d);
		this.childNodes[nIndex].$getContainer("textPath").setAttribute("d", "M" + (50 + (nWidthGroup + nOffsetGroup) * nIndex + (nWidthItem + nOffsetItem) * nGroup + 16) + "," + (250 - nHeight - 3) +
																			"v-200 "+ "z");
	}
};
//
cChartElement_barGroup.prototype.$getTagOpen	= function() {
	return '<svg:g class="c-barGroup' +(this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '" xmlns:svg="http://www.w3.org/2000/svg" \
				style="' + (this.hasAttribute("fill") ? 'fill:' + this.getAttribute("fill") + ';' : '') + (this.hasAttribute("fill") ? 'stroke:' + this.getAttribute("fill") + ';' : '') + 'stroke-width:1;' + this.getAttribute("style") + '">\
				<svg:g class="c-barGroup--gateway" stroke-width="1" style="stroke:white;">';
};

cChartElement_barGroup.prototype.$getTagClose	= function() {
	return '	</svg:g>\
			</svg:g>';
};

// Register Element with language
oChartNamespace.setElement("barGroup", cChartElement_barGroup);