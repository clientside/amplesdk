<?
    $aFiles		= array();
    $aFiles[]	= "aml.js";
    $aFiles[]	= "classes/cAMLElement.js";

    // elements
    $aFiles[]	= "elements/handler.js";
    $aFiles[]	= "elements/sound.js";
    $aFiles[]	= "elements/timer.js";
	$aFiles[]	= "elements/xhtml.js";

	$aFiles[]	= "elements/data.js";
	$aFiles[]	= "elements/repeater.js";
	$aFiles[]	= "elements/pager.js";

    $aFiles[]	= "elements/filepicker.js";

	$aFiles[]	= "elements/map.js";
	$aFiles[]	= "elements/marker.js";

	$aFiles[]	= "elements/sidebar.js";

	$aFiles[]	= "elements/panelset.js";
	$aFiles[]	= "elements/panel.js";
/*
 	// grid
	$aFiles[]	= "elements/grid.js";
	$aFiles[]	= "elements/gridHead.js";
	$aFiles[]	= "elements/gridHeadCell.js";
	$aFiles[]	= "elements/gridBody.js";
	// Body of grid
	$aFiles[]	= "elements/gridGroup.js";
	$aFiles[]	= "elements/gridRow.js";
	$aFiles[]	= "elements/gridCell.js";
	// Editor
	$aFiles[]	= "elements/gridEdit.js";
	$aFiles[]	= "elements/gridEditRow.js";
	$aFiles[]	= "elements/gridEditCell.js";
*/
	// attributes
    $aFiles[]	= "attributes/draggable.js";
    $aFiles[]	= "attributes/droppable.js";
    $aFiles[]	= "attributes/resizable.js";
    $aFiles[]	= "attributes/resize-edges.js";
    $aFiles[]	= "attributes/selectable.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo
			"(function(){" .
				$sOutput .
			"})();".
			"";
?>