/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Elements
	files.push("elements/acronym.js");
	files.push("elements/applet.js");
	files.push("elements/basefont.js");
	files.push("elements/big.js");
	files.push("elements/center.js");
	files.push("elements/dir.js");
	files.push("elements/font.js");
	files.push("elements/isindex.js");
	files.push("elements/s.js");
	files.push("elements/strike.js");
	files.push("elements/t.js");
	files.push("elements/tt.js");
	files.push("elements/u.js");

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