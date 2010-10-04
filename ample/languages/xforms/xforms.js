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
//	files.push("elements/submission.js");	// Defined in "11 XForms Submission Module"
	// 3.4 XForms Extension Module
	files.push("elements/extension.js");
	// 8 Core Form Controls
	// 8.1 Core Form Controls Module
	files.push("elements/controls/input.js");
	files.push("elements/controls/secret.js");
	files.push("elements/controls/textarea.js");
	files.push("elements/controls/output.js");
	files.push("elements/controls/upload.js");
	files.push("elements/controls/range.js");
	files.push("elements/controls/trigger.js");
	files.push("elements/controls/submit.js");
	files.push("elements/controls/select.js");
	files.push("elements/controls/select1.js");
	// 8.2 Common support elements
	files.push("elements/controls/label.js");
	files.push("elements/controls/help.js");
	files.push("elements/controls/hint.js");
	files.push("elements/controls/alert.js");
	// 8.3 Common markup for selection controls
	files.push("elements/controls/choices.js");
	files.push("elements/controls/item.js");
	files.push("elements/controls/value.js");
	// 9 Container Form Controls
	// 9.1 XForms Group Module
	files.push("elements/container/group.js");
	// 9.2 XForms Switch Module
	files.push("elements/container/switch.js");
	files.push("elements/container/case.js");
	// 9.3 XForms Repeat Module
	files.push("elements/container/repeat.js");
//	files.push("elements/container/setindex.js");	// Defined in "10 XForms Actions"
	files.push("elements/container/itemset.js");
	files.push("elements/container/copy.js");
	// 10 XForms Actions
	files.push("elements/actions/action.js");
	files.push("elements/actions/setvalue.js");
	files.push("elements/actions/insert.js");
	files.push("elements/actions/delete.js");
	files.push("elements/actions/setindex.js");
	files.push("elements/actions/toggle.js");
	files.push("elements/actions/setfocus.js");
	files.push("elements/actions/dispatch.js");
	files.push("elements/actions/rebuild.js");
	files.push("elements/actions/recalculate.js");
	files.push("elements/actions/revalidate.js");
	files.push("elements/actions/refresh.js");
	files.push("elements/actions/reset.js");
	files.push("elements/actions/load.js");
	files.push("elements/actions/send.js");
	files.push("elements/actions/message.js");
	// 11 XForms Submission Module
	files.push("elements/submission/submission.js");
	files.push("elements/submission/method.js");
	files.push("elements/submission/header.js");
	files.push("elements/submission/resource.js");

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