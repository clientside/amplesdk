<?
    $aFiles		= array();
    $aFiles[]		= "implementation/mobile.js";
    $aFiles[]		= "implementation/classes/cMobileElement.js";

	// data
	$aFiles[]		= "implementation/elements/data/image.js";
	$aFiles[]		= "implementation/elements/data/scroll.js";
	$aFiles[]		= "implementation/elements/data/tablecell.js";
	$aFiles[]		= "implementation/elements/data/text.js";
	$aFiles[]		= "implementation/elements/data/web.js";

	// input
	$aFiles[]		= "implementation/elements/input/activity.js";
	$aFiles[]		= "implementation/elements/input/page.js";
	$aFiles[]		= "implementation/elements/input/progress.js";
	$aFiles[]		= "implementation/elements/input/roundrect.js";
	$aFiles[]		= "implementation/elements/input/segmented.js";
	$aFiles[]		= "implementation/elements/input/slider.js";
	$aFiles[]		= "implementation/elements/input/switch.js";
	$aFiles[]		= "implementation/elements/input/textfield.js";

	// windows
	$aFiles[]		= "implementation/elements/windows/barbutton.js";
	$aFiles[]		= "implementation/elements/windows/fixedspace.js";
	$aFiles[]		= "implementation/elements/windows/flexiblespace.js";
	$aFiles[]		= "implementation/elements/windows/navigationbar.js";
	$aFiles[]		= "implementation/elements/windows/navigationitem.js";
	$aFiles[]		= "implementation/elements/windows/search.js";
	$aFiles[]		= "implementation/elements/windows/tabbar.js";
	$aFiles[]		= "implementation/elements/windows/tabbaritem.js";
	$aFiles[]		= "implementation/elements/windows/toolbar.js";
	$aFiles[]		= "implementation/elements/windows/view.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>