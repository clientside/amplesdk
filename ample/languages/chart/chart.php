<?
    $aFiles		= array();
    $aFiles[]		= "implementation/chart.js";
    $aFiles[]		= "implementation/classes/cChartElement.js";

    //
    $aFiles[]		= "implementation/elements/bar.js";
    $aFiles[]		= "implementation/elements/barItem.js";
    $aFiles[]		= "implementation/elements/barGroup.js";
    $aFiles[]		= "implementation/elements/bubble.js";
    $aFiles[]		= "implementation/elements/bubbleItem.js";
    $aFiles[]		= "implementation/elements/bubbleGroup.js";
    $aFiles[]		= "implementation/elements/funnel.js";
    $aFiles[]		= "implementation/elements/funnelItem.js";
    $aFiles[]		= "implementation/elements/line.js";
    $aFiles[]		= "implementation/elements/lineItem.js";
    $aFiles[]		= "implementation/elements/lineGroup.js";
    $aFiles[]		= "implementation/elements/map.js";
    $aFiles[]		= "implementation/elements/mapItem.js";
    $aFiles[]		= "implementation/elements/pie.js";
    $aFiles[]		= "implementation/elements/pieGroup.js";
    $aFiles[]		= "implementation/elements/pieItem.js";
    $aFiles[]		= "implementation/elements/radar.js";
    $aFiles[]		= "implementation/elements/radarItem.js";
    $aFiles[]		= "implementation/elements/radarGroup.js";
    $aFiles[]		= "implementation/elements/stream.js";
    $aFiles[]		= "implementation/elements/streamItem.js";
    $aFiles[]		= "implementation/elements/streamGroup.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>