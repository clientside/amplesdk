<?
    $aFiles		= array();
    $aFiles[]	= "xul.js";
    $aFiles[]	= "classes/cXULElement.js";
	$aFiles[]	= "classes/cXULController.js";

    // base classes
    $aFiles[]	= "classes/cXULInputElement.js";
    $aFiles[]	= "classes/cXULSelectElement.js";
    $aFiles[]	= "classes/cXULPopupElement.js";
    $aFiles[]	= "classes/cXULWindowElement.js";

	// managers
	$aFiles[]	= "managers/oXULCommandDispatcher.js";
    $aFiles[]	= "managers/oXULPopupManager.js";
    $aFiles[]	= "managers/oXULReflowManager.js";
    $aFiles[]	= "managers/oXULWindowManager.js";

    // elements
    // windowing
    $aFiles[]	= "elements/dialog.js";
    $aFiles[]	= "elements/dialogheader.js";
    $aFiles[]	= "elements/page.js";
    $aFiles[]	= "elements/window.js";
    $aFiles[]	= "elements/wizard.js";
    $aFiles[]	= "elements/wizardpage.js";

    // resource
    $aFiles[]	= "elements/script.js";

    // commands
    $aFiles[]	= "elements/broadcaster.js";
    $aFiles[]	= "elements/broadcasterset.js";
    $aFiles[]	= "elements/command.js";
    $aFiles[]	= "elements/commandset.js";
    $aFiles[]	= "elements/key.js";
    $aFiles[]	= "elements/keyset.js";

    // layout
    $aFiles[]	= "elements/box.js";
    $aFiles[]	= "elements/caption.js";
    $aFiles[]	= "elements/deck.js";
    $aFiles[]	= "elements/description.js";
    $aFiles[]	= "elements/hbox.js";
    $aFiles[]	= "elements/image.js";
    $aFiles[]	= "elements/iframe.js";
    $aFiles[]	= "elements/groupbox.js";
    $aFiles[]	= "elements/label.js";
    $aFiles[]	= "elements/separator.js";
    $aFiles[]	= "elements/spacer.js";
    $aFiles[]	= "elements/stack.js";
    $aFiles[]	= "elements/vbox.js";

    // grid
    $aFiles[]	= "elements/column.js";
    $aFiles[]	= "elements/columns.js";
    $aFiles[]	= "elements/grid.js";
    $aFiles[]	= "elements/row.js";
    $aFiles[]	= "elements/rows.js";

    //
    $aFiles[]	= "elements/arrowscrollbox.js";
    $aFiles[]	= "elements/button.js";
    $aFiles[]	= "elements/panel.js";
    $aFiles[]	= "elements/popupset.js";
    $aFiles[]	= "elements/progressmeter.js";
//    $aFiles[]	= "elements/scrollbox.js";
    $aFiles[]	= "elements/splitter.js";
    $aFiles[]	= "elements/statusbar.js";
    $aFiles[]	= "elements/statusbarpanel.js";
    $aFiles[]	= "elements/tooltip.js";

    // menu
    $aFiles[]	= "elements/menu.js";
    $aFiles[]	= "elements/menubar.js";
    $aFiles[]	= "elements/menuitem.js";
    $aFiles[]	= "elements/menupopup.js";
    $aFiles[]	= "elements/menuseparator.js";

    // tabbox
    $aFiles[]	= "elements/tabbox.js";
    $aFiles[]	= "elements/tab.js";
    $aFiles[]	= "elements/tabs.js";
    $aFiles[]	= "elements/tabpanel.js";
    $aFiles[]	= "elements/tabpanels.js";

    // toolbar
    $aFiles[]	= "elements/toolbar.js";
    $aFiles[]	= "elements/toolbarbutton.js";
    $aFiles[]	= "elements/toolbarseparator.js";
    $aFiles[]	= "elements/toolbargrippy.js";
    $aFiles[]	= "elements/toolbox.js";

    // listbox
    $aFiles[]	= "elements/listbox.js";
    $aFiles[]	= "elements/listcol.js";
    $aFiles[]	= "elements/listcols.js";
    $aFiles[]	= "elements/listitem.js";
    $aFiles[]	= "elements/listbody.js";
    $aFiles[]	= "elements/listcell.js";
    $aFiles[]	= "elements/listhead.js";
    $aFiles[]	= "elements/listheader.js";

    // treebox
    $aFiles[]	= "elements/tree.js";
    $aFiles[]	= "elements/treebody.js";
    $aFiles[]	= "elements/treechildren.js";
    $aFiles[]	= "elements/treecell.js";
    $aFiles[]	= "elements/treecol.js";
    $aFiles[]	= "elements/treecols.js";
    $aFiles[]	= "elements/treerow.js";
    $aFiles[]	= "elements/treeitem.js";

    // input
    $aFiles[]	= "elements/checkbox.js";
    $aFiles[]	= "elements/colorpicker.js";
    $aFiles[]	= "elements/datepicker.js";
    $aFiles[]	= "elements/editor.js";
    $aFiles[]	= "elements/menulist.js";
    $aFiles[]	= "elements/radio.js";
    $aFiles[]	= "elements/radiogroup.js";
    $aFiles[]	= "elements/scale.js";
    $aFiles[]	= "elements/spinbuttons.js";
    $aFiles[]	= "elements/textbox.js";
    $aFiles[]	= "elements/timepicker.js";

   	// panes
    $aFiles[]	= "elements/datepicker-pane.js";
    $aFiles[]	= "elements/colorpicker-pane.js";
    $aFiles[]	= "elements/tooltip-pane.js";

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