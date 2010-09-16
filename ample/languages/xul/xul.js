/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Classes
	files.push("classes/cXULElement.js");
	files.push("classes/cXULController.js");
	files.push("classes/cXULInputElement.js");
	files.push("classes/cXULSelectElement.js");
	files.push("classes/cXULPopupElement.js");
	files.push("classes/cXULWindowElement.js");

	// Managers
	files.push("managers/oXULCommandDispatcher.js");
	files.push("managers/oXULPopupManager.js");
	files.push("managers/oXULReflowManager.js");
	files.push("managers/oXULWindowManager.js");
	files.push("managers/oXULLocaleManager.js");

	// Locales
	files.push("locale/en-us.js");
	files.push("locale/fr-fr.js");
	files.push("locale/it-it.js");

	// Elements
	// windowing
	files.push("elements/dialog.js");
	files.push("elements/dialogheader.js");
	files.push("elements/page.js");
	files.push("elements/window.js");
	files.push("elements/wizard.js");
	files.push("elements/wizardpage.js");
	// resource
	files.push("elements/script.js");
	// commands
	files.push("elements/broadcaster.js");
	files.push("elements/broadcasterset.js");
	files.push("elements/command.js");
	files.push("elements/commandset.js");
	files.push("elements/key.js");
	files.push("elements/keyset.js");
	// layout
	files.push("elements/box.js");
	files.push("elements/caption.js");
	files.push("elements/deck.js");
	files.push("elements/description.js");
	files.push("elements/hbox.js");
	files.push("elements/image.js");
	files.push("elements/iframe.js");
	files.push("elements/groupbox.js");
	files.push("elements/label.js");
	files.push("elements/separator.js");
	files.push("elements/spacer.js");
	files.push("elements/stack.js");
	files.push("elements/vbox.js");
	// grid
	files.push("elements/column.js");
	files.push("elements/columns.js");
	files.push("elements/grid.js");
	files.push("elements/row.js");
	files.push("elements/rows.js");
	//
	files.push("elements/arrowscrollbox.js");
	files.push("elements/button.js");
	files.push("elements/panel.js");
	files.push("elements/popupset.js");
	files.push("elements/progressmeter.js");
//	files.push("elements/scrollbox.js");
	files.push("elements/splitter.js");
	files.push("elements/statusbar.js");
	files.push("elements/statusbarpanel.js");
	files.push("elements/tooltip.js");
	// menu
	files.push("elements/menu.js");
	files.push("elements/menubar.js");
	files.push("elements/menuitem.js");
	files.push("elements/menupopup.js");
	files.push("elements/menuseparator.js");
	// tabbox
	files.push("elements/tabbox.js");
	files.push("elements/tab.js");
	files.push("elements/tabs.js");
	files.push("elements/tabpanel.js");
	files.push("elements/tabpanels.js");
	// toolbar
	files.push("elements/toolbar.js");
	files.push("elements/toolbarbutton.js");
	files.push("elements/toolbarseparator.js");
	files.push("elements/toolbargrippy.js");
	files.push("elements/toolbox.js");
	// listbox
	files.push("elements/listbox.js");
	files.push("elements/listcol.js");
	files.push("elements/listcols.js");
	files.push("elements/listitem.js");
	files.push("elements/listbody.js");
	files.push("elements/listcell.js");
	files.push("elements/listhead.js");
	files.push("elements/listheader.js");
	// treebox
	files.push("elements/tree.js");
	files.push("elements/treebody.js");
	files.push("elements/treechildren.js");
	files.push("elements/treecell.js");
	files.push("elements/treecol.js");
	files.push("elements/treecols.js");
	files.push("elements/treerow.js");
	files.push("elements/treeitem.js");
	// input
	files.push("elements/checkbox.js");
	files.push("elements/colorpicker.js");
	files.push("elements/datepicker.js");
	files.push("elements/editor.js");
	files.push("elements/menulist.js");
	files.push("elements/radio.js");
	files.push("elements/radiogroup.js");
	files.push("elements/scale.js");
	files.push("elements/spinbuttons.js");
	files.push("elements/textbox.js");
	files.push("elements/timepicker.js");
	// panes
	files.push("elements/datepicker-pane.js");
	files.push("elements/colorpicker-pane.js");
	files.push("elements/tooltip-pane.js");

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