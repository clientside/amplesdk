<?
    $aFiles		= array();
    $aFiles[]	= "implementation/aml.js";
    $aFiles[]	= "implementation/classes/cAMLElement.js";

    // elements
    $aFiles[]	= "implementation/elements/handler.js";
    $aFiles[]	= "implementation/elements/sound.js";
    $aFiles[]	= "implementation/elements/timer.js";
	$aFiles[]	= "implementation/elements/xhtml.js";

	$aFiles[]	= "implementation/elements/data.js";
	$aFiles[]	= "implementation/elements/repeater.js";
	$aFiles[]	= "implementation/elements/pager.js";

    $aFiles[]	= "implementation/elements/filepicker.js";

	$aFiles[]	= "implementation/elements/map.js";
	$aFiles[]	= "implementation/elements/marker.js";

	$aFiles[]	= "implementation/elements/sidebar.js";

	$aFiles[]	= "implementation/elements/panelset.js";
	$aFiles[]	= "implementation/elements/panel.js";
/*
 	// grid
	$aFiles[]	= "implementation/elements/grid.js";
	$aFiles[]	= "implementation/elements/gridHead.js";
	$aFiles[]	= "implementation/elements/gridHeadCell.js";
	$aFiles[]	= "implementation/elements/gridBody.js";
	// Body of grid
	$aFiles[]	= "implementation/elements/gridGroup.js";
	$aFiles[]	= "implementation/elements/gridRow.js";
	$aFiles[]	= "implementation/elements/gridCell.js";
	// Editor
	$aFiles[]	= "implementation/elements/gridEdit.js";
	$aFiles[]	= "implementation/elements/gridEditRow.js";
	$aFiles[]	= "implementation/elements/gridEditCell.js";
*/
	// attributes
    $aFiles[]	= "implementation/attributes/draggable.js";
    $aFiles[]	= "implementation/attributes/droppable.js";
    $aFiles[]	= "implementation/attributes/resizable.js";
    $aFiles[]	= "implementation/attributes/resize-edges.js";
    $aFiles[]	= "implementation/attributes/selectable.js";

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