/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Classes
	files.push("classes/cXHTMLElement.js");
	files.push("classes/cXHTMLInputElement.js");

	// Managers
	files.push("managers/oXHTMLAccessKeyManager.js");

	// Elements
	// 4.1 The root element
	files.push("elements/root/html.js");
	// 4.2 Document metadata
	files.push("elements/metadata/base.js");
	files.push("elements/metadata/head.js");
	files.push("elements/metadata/link.js");
	files.push("elements/metadata/meta.js");
	files.push("elements/metadata/style.js");
	files.push("elements/metadata/title.js");
	// 4.3 Scripting
	files.push("elements/scripting/eventsource.js");	// HTML5
	files.push("elements/scripting/noscript.js");
	files.push("elements/scripting/script.js");
	// 4.4 Sections
	files.push("elements/sections/address.js");
	files.push("elements/sections/article.js");	// HTML5
	files.push("elements/sections/aside.js");		// HTML5
	files.push("elements/sections/body.js");
	files.push("elements/sections/footer.js");	// HTML5
	files.push("elements/sections/h1.js");
	files.push("elements/sections/h2.js");
	files.push("elements/sections/h3.js");
	files.push("elements/sections/h4.js");
	files.push("elements/sections/h5.js");
	files.push("elements/sections/h6.js");
	files.push("elements/sections/header.js");	// HTML5
	files.push("elements/sections/nav.js");		// HTML5
	files.push("elements/sections/section.js");	// HTML5
	// 4.5 Grouping
	files.push("elements/grouping/blockquote.js");
	files.push("elements/grouping/dd.js");
	files.push("elements/grouping/div.js");
	files.push("elements/grouping/dl.js");
	files.push("elements/grouping/dt.js");
	files.push("elements/grouping/figure.js");
	files.push("elements/grouping/figcaption.js");
	files.push("elements/grouping/hr.js");
	files.push("elements/grouping/li.js");
	files.push("elements/grouping/ol.js");
	files.push("elements/grouping/p.js");
	files.push("elements/grouping/pre.js");
	files.push("elements/grouping/ul.js");
	// 4.6 Text-level semantics
	files.push("elements/text/a.js");
	files.push("elements/text/abbr.js");
	files.push("elements/text/b.js");
	files.push("elements/text/bdo.js");
	files.push("elements/text/br.js");
	files.push("elements/text/cite.js");
	files.push("elements/text/code.js");
	files.push("elements/text/dfn.js");
	files.push("elements/text/em.js");
	files.push("elements/text/i.js");
	files.push("elements/text/kbd.js");
	files.push("elements/text/mark.js");			// HTML5
	files.push("elements/text/q.js");
	files.push("elements/text/rp.js");			// HTML5
	files.push("elements/text/rt.js");			// HTML5
	files.push("elements/text/ruby.js");			// HTML5
	files.push("elements/text/samp.js");
	files.push("elements/text/small.js");
	files.push("elements/text/span.js");
	files.push("elements/text/strong.js");
	files.push("elements/text/sub.js");
	files.push("elements/text/sup.js");
	files.push("elements/text/time.js");			// HTML5
	files.push("elements/text/var.js");
	files.push("elements/text/wbr.js");			// HTML5
	// 4.7 Edits
	files.push("elements/edits/ins.js");
	files.push("elements/edits/del.js");
	// 4.8 Embedded content
	files.push("elements/embedded/audio.js");		// HTML5
	files.push("elements/embedded/area.js");
	files.push("elements/embedded/canvas.js");	// HTML5
	files.push("elements/embedded/embed.js");		// HTML5
	files.push("elements/embedded/figure.js");	// HTML5
	files.push("elements/embedded/iframe.js");
	files.push("elements/embedded/img.js");
	files.push("elements/embedded/map.js");
	files.push("elements/embedded/object.js");
	files.push("elements/embedded/param.js");
	files.push("elements/embedded/source.js");	// HTML5
	files.push("elements/embedded/video.js");		// HTML5
	// 4.9 Tabular data
	files.push("elements/tabular/caption.js");
	files.push("elements/tabular/col.js");
	files.push("elements/tabular/colgroup.js");
	files.push("elements/tabular/table.js");
	files.push("elements/tabular/tbody.js");
	files.push("elements/tabular/td.js");
	files.push("elements/tabular/tfoot.js");
	files.push("elements/tabular/th.js");
	files.push("elements/tabular/thead.js");
	files.push("elements/tabular/tr.js");
	// 4.10 Forms
	files.push("elements/forms/button.js");
	files.push("elements/forms/datalist.js");		// HTML5
	files.push("elements/forms/fieldset.js");
	files.push("elements/forms/form.js");
	files.push("elements/forms/input.js");
	files.push("elements/forms/keygen.js");
	files.push("elements/forms/label.js");
	files.push("elements/forms/legend.js");
	files.push("elements/forms/meter.js");
	files.push("elements/forms/optgroup.js");
	files.push("elements/forms/option.js");
	files.push("elements/forms/output.js");		// HTML5
	files.push("elements/forms/progress.js");
	files.push("elements/forms/select.js");
	files.push("elements/forms/textarea.js");
	// 4.11 Interactive elements
	files.push("elements/interactive/command.js");	// HTML5
	files.push("elements/interactive/details.js");	// HTML5
	files.push("elements/interactive/menu.js");		// HTML5
	files.push("elements/interactive/summary.js");	// HTML5
	// Other
	files.push("elements/other/dialog.js");		// HTML5

	// SMIL mapping
	files.push("xhtml-smil.js");
	// CSS Selectors
	files.push("xhtml-selectors.js");

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