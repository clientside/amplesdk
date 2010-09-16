/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Classes
	files.push("classes/cMobileElement.js");

	// Elements
	// data
	files.push("elements/data/image.js");
	files.push("elements/data/scroll.js");
	files.push("elements/data/tablecell.js");
	files.push("elements/data/text.js");
	files.push("elements/data/web.js");
	// input
	files.push("elements/input/activity.js");
	files.push("elements/input/page.js");
	files.push("elements/input/progress.js");
	files.push("elements/input/roundrect.js");
	files.push("elements/input/segmented.js");
	files.push("elements/input/slider.js");
	files.push("elements/input/switch.js");
	files.push("elements/input/textfield.js");
	// windows
	files.push("elements/windows/barbutton.js");
	files.push("elements/windows/fixedspace.js");
	files.push("elements/windows/flexiblespace.js");
	files.push("elements/windows/navigationbar.js");
	files.push("elements/windows/navigationitem.js");
	files.push("elements/windows/search.js");
	files.push("elements/windows/tabbar.js");
	files.push("elements/windows/tabbaritem.js");
	files.push("elements/windows/toolbar.js");
	files.push("elements/windows/view.js");

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