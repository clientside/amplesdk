<?
    $aFiles		= array();
    $aFiles[]	= "classes/cAUIElement.js";

    // elements
    $aFiles[]	= "elements/sound.js";
	$aFiles[]	= "elements/xhtml.js";

	$aFiles[]	= "elements/pager.js";

    $aFiles[]	= "elements/filepicker.js";

	$aFiles[]	= "elements/map.js";
	$aFiles[]	= "elements/marker.js";

	$aFiles[]	= "elements/sidebar.js";

	$aFiles[]	= "elements/panelset.js";
	$aFiles[]	= "elements/panel.js";

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