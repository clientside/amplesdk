/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Classes
	files.push("classes/cXFElement.js");

	// Elements
	// 3.3 XForms Core Module
	files.push("elements/model.js");
	files.push("elements/instance.js");
	files.push("elements/instanceData.js");
	files.push("elements/bind.js");
	files.push("elements/submission.js");
	// 3.4 XForms Extension Module
	files.push("elements/extension.js");
	// 8 Core Form Controls
	// 8.1 Core Form Controls Module
	files.push("elements/input.js");
	files.push("elements/secret.js");
	files.push("elements/textarea.js");
	files.push("elements/output.js");
	files.push("elements/upload.js");
	files.push("elements/range.js");
	files.push("elements/trigger.js");
	files.push("elements/submit.js");
	files.push("elements/select.js");
	files.push("elements/select1.js");
	// 8.2 Common support elements
	files.push("elements/label.js");
	files.push("elements/help.js");
	files.push("elements/hint.js");
	files.push("elements/alert.js");
	// 8.3 Common markup for selection controls
	files.push("elements/choices.js");
	files.push("elements/item.js");
	files.push("elements/value.js");
	// 9 Container Form Controls
	// 9.1 XForms Group Module
	files.push("elements/group.js");
	// 9.2 XForms Switch Module
	files.push("elements/switch.js");
	files.push("elements/case.js");
	// 9.3 XForms Repeat Module
	files.push("elements/repeat.js");
//	files.push("elements/setindex.js");	// Defined in "10 XForms Actions"
	files.push("elements/itemset.js");
	files.push("elements/copy.js");
	// 10 XForms Actions
	files.push("elements/action.js");
	files.push("elements/setvalue.js");
	files.push("elements/insert.js");
	files.push("elements/delete.js");
	files.push("elements/setindex.js");
	files.push("elements/toggle.js");
	files.push("elements/setfocus.js");
	files.push("elements/dispatch.js");
	files.push("elements/rebuild.js");
	files.push("elements/recalculate.js");
	files.push("elements/revalidate.js");
	files.push("elements/refresh.js");
	files.push("elements/reset.js");
	files.push("elements/load.js");
	files.push("elements/send.js");
	files.push("elements/message.js");
	// 11 XForms Submission Module
//	files.push("elements/submission.js");	// Defined in "11 XForms Submission Module"
	files.push("elements/method.js");
	files.push("elements/header.js");
	files.push("elements/resource.js");

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