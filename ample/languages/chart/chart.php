<?
    $aFiles		= array();
    $aFiles[]		= "implementation/chart.js";
    $aFiles[]		= "implementation/classes/cChartElement.js";

    //
    $aFiles[]		= "implementation/elements/bar.js";
    $aFiles[]		= "implementation/elements/bubble.js";
    $aFiles[]		= "implementation/elements/chart.js";
    $aFiles[]		= "implementation/elements/funnel.js";
    $aFiles[]		= "implementation/elements/line.js";
    $aFiles[]		= "implementation/elements/map.js";
    $aFiles[]		= "implementation/elements/doughnut.js";
    $aFiles[]		= "implementation/elements/pie.js";
    $aFiles[]		= "implementation/elements/radar.js";
    $aFiles[]		= "implementation/elements/stream.js";
    //
    $aFiles[]		= "implementation/elements/item.js";
    $aFiles[]		= "implementation/elements/group.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>