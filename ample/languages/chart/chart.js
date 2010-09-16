/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Classes
	files.push("classes/cChartElement.js");

	// Elements
	//
	files.push("elements/bar.js");
	files.push("elements/bubble.js");
	files.push("elements/chart.js");
	files.push("elements/funnel.js");
	files.push("elements/line.js");
	files.push("elements/map.js");
	files.push("elements/doughnut.js");
	files.push("elements/pie.js");
	files.push("elements/radar.js");
	files.push("elements/stream.js");
	//
	files.push("elements/item.js");
	files.push("elements/group.js");

	// load files
	var source = [],
		scripts	= document.getElementsByTagName("script"),
		base	= scripts[scripts.length-1].src.replace(/\/?[^\/]+$/, '');
	for (var n = 0; n < files.length; n++) {
		var oRequest = new (window.XMLHttpRequest ? XMLHttpRequest : ActiveXObject("Microsoft.XMLHTTP"));
		oRequest.open("GET", base + '/' + files[n], false);
		oRequest.send(null);
		source[source.length]	= oRequest.responseText;
	}
	var oScript	= document.getElementsByTagName("head")[0].appendChild(document.createElement("script"));
	oScript.type	= "text/javascript";
	oScript.text	= "(function(){" + source.join("\n") + "})()";
	oScript.parentNode.removeChild(oScript);
})();