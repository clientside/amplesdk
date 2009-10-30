<?
    $aFiles		= array();
    $aFiles[]	= "implementation/xul.js";
    $aFiles[]	= "implementation/classes/cXULElement.js";
	$aFiles[]	= "implementation/classes/cXULController.js";
	$aFiles[]	= "implementation/classes/cXULCommandDispatcher.js";

    // base classes
    $aFiles[]	= "implementation/classes/cXULSelectElement.js";
    $aFiles[]	= "implementation/classes/cXULPopupElement.js";

    // elements
    // windowing
    $aFiles[]	= "implementation/elements/dialog.js";
    $aFiles[]	= "implementation/elements/dialogheader.js";
    $aFiles[]	= "implementation/elements/page.js";
    $aFiles[]	= "implementation/elements/window.js";
    $aFiles[]	= "implementation/elements/wizard.js";
    $aFiles[]	= "implementation/elements/wizardpage.js";

    // resource
    $aFiles[]	= "implementation/elements/script.js";

    // commands
    $aFiles[]	= "implementation/elements/broadcaster.js";
    $aFiles[]	= "implementation/elements/broadcasterset.js";
    $aFiles[]	= "implementation/elements/command.js";
    $aFiles[]	= "implementation/elements/commandset.js";
    $aFiles[]	= "implementation/elements/key.js";
    $aFiles[]	= "implementation/elements/keyset.js";

    // layout
    $aFiles[]	= "implementation/elements/box.js";
    $aFiles[]	= "implementation/elements/caption.js";
    $aFiles[]	= "implementation/elements/deck.js";
    $aFiles[]	= "implementation/elements/description.js";
    $aFiles[]	= "implementation/elements/hbox.js";
    $aFiles[]	= "implementation/elements/image.js";
    $aFiles[]	= "implementation/elements/iframe.js";
    $aFiles[]	= "implementation/elements/groupbox.js";
    $aFiles[]	= "implementation/elements/label.js";
    $aFiles[]	= "implementation/elements/separator.js";
    $aFiles[]	= "implementation/elements/spacer.js";
    $aFiles[]	= "implementation/elements/stack.js";
    $aFiles[]	= "implementation/elements/vbox.js";

    // grid
    $aFiles[]	= "implementation/elements/column.js";
    $aFiles[]	= "implementation/elements/columns.js";
    $aFiles[]	= "implementation/elements/grid.js";
    $aFiles[]	= "implementation/elements/row.js";
    $aFiles[]	= "implementation/elements/rows.js";

    //
    $aFiles[]	= "implementation/elements/arrowscrollbox.js";
    $aFiles[]	= "implementation/elements/button.js";
    $aFiles[]	= "implementation/elements/popup.js";
    $aFiles[]	= "implementation/elements/popupset.js";
    $aFiles[]	= "implementation/elements/progressmeter.js";
    $aFiles[]	= "implementation/elements/scrollbox.js";
    $aFiles[]	= "implementation/elements/splitter.js";
    $aFiles[]	= "implementation/elements/statusbar.js";
    $aFiles[]	= "implementation/elements/statusbarpanel.js";
    $aFiles[]	= "implementation/elements/tooltip.js";

    // menu
    $aFiles[]	= "implementation/elements/menu.js";
    $aFiles[]	= "implementation/elements/menubar.js";
    $aFiles[]	= "implementation/elements/menuitem.js";
    $aFiles[]	= "implementation/elements/menupopup.js";
    $aFiles[]	= "implementation/elements/menuseparator.js";

    // tabbox
    $aFiles[]	= "implementation/elements/tabbox.js";
    $aFiles[]	= "implementation/elements/tab.js";
    $aFiles[]	= "implementation/elements/tabs.js";
    $aFiles[]	= "implementation/elements/tabpanel.js";
    $aFiles[]	= "implementation/elements/tabpanels.js";

    // toolbar
    $aFiles[]	= "implementation/elements/toolbar.js";
    $aFiles[]	= "implementation/elements/toolbarbutton.js";
    $aFiles[]	= "implementation/elements/toolbarseparator.js";
    $aFiles[]	= "implementation/elements/toolbargrippy.js";
    $aFiles[]	= "implementation/elements/toolbox.js";

    // listbox
    $aFiles[]	= "implementation/elements/listbox.js";
    $aFiles[]	= "implementation/elements/listcol.js";
    $aFiles[]	= "implementation/elements/listcols.js";
    $aFiles[]	= "implementation/elements/listitem.js";
    $aFiles[]	= "implementation/elements/listbody.js";
    $aFiles[]	= "implementation/elements/listcell.js";
    $aFiles[]	= "implementation/elements/listhead.js";
    $aFiles[]	= "implementation/elements/listheader.js";

    // treebox
    $aFiles[]	= "implementation/elements/tree.js";
    $aFiles[]	= "implementation/elements/treebody.js";
    $aFiles[]	= "implementation/elements/treechildren.js";
    $aFiles[]	= "implementation/elements/treecell.js";
    $aFiles[]	= "implementation/elements/treecol.js";
    $aFiles[]	= "implementation/elements/treecols.js";
    $aFiles[]	= "implementation/elements/treerow.js";
    $aFiles[]	= "implementation/elements/treeitem.js";

    // input
    $aFiles[]	= "implementation/elements/checkbox.js";
    $aFiles[]	= "implementation/elements/colorpicker.js";
    $aFiles[]	= "implementation/elements/datepicker.js";
    $aFiles[]	= "implementation/elements/editor.js";
    $aFiles[]	= "implementation/elements/menulist.js";
    $aFiles[]	= "implementation/elements/radio.js";
    $aFiles[]	= "implementation/elements/radiogroup.js";
    $aFiles[]	= "implementation/elements/scale.js";
    $aFiles[]	= "implementation/elements/spinbuttons.js";
    $aFiles[]	= "implementation/elements/textbox.js";
    $aFiles[]	= "implementation/elements/timepicker.js";

   	// panes
    $aFiles[]	= "implementation/elements/datepicker-pane.js";
    $aFiles[]	= "implementation/elements/colorpicker-pane.js";
    $aFiles[]	= "implementation/elements/tooltip-pane.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo	"".
			"(function(){" .
				$sOutput .
			"})();".
			"";
?>