<?
    $aFiles		= array();
    $aFiles[]		= "mobile.js";
    $aFiles[]		= "classes/cMobileElement.js";

	// data
	$aFiles[]		= "elements/data/image.js";
	$aFiles[]		= "elements/data/scroll.js";
	$aFiles[]		= "elements/data/tablecell.js";
	$aFiles[]		= "elements/data/text.js";
	$aFiles[]		= "elements/data/web.js";

	// input
	$aFiles[]		= "elements/input/activity.js";
	$aFiles[]		= "elements/input/page.js";
	$aFiles[]		= "elements/input/progress.js";
	$aFiles[]		= "elements/input/roundrect.js";
	$aFiles[]		= "elements/input/segmented.js";
	$aFiles[]		= "elements/input/slider.js";
	$aFiles[]		= "elements/input/switch.js";
	$aFiles[]		= "elements/input/textfield.js";

	// windows
	$aFiles[]		= "elements/windows/barbutton.js";
	$aFiles[]		= "elements/windows/fixedspace.js";
	$aFiles[]		= "elements/windows/flexiblespace.js";
	$aFiles[]		= "elements/windows/navigationbar.js";
	$aFiles[]		= "elements/windows/navigationitem.js";
	$aFiles[]		= "elements/windows/search.js";
	$aFiles[]		= "elements/windows/tabbar.js";
	$aFiles[]		= "elements/windows/tabbaritem.js";
	$aFiles[]		= "elements/windows/toolbar.js";
	$aFiles[]		= "elements/windows/view.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>