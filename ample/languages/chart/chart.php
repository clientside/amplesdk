<?
    $aFiles		= array();
    $aFiles[]		= "classes/cChartElement.js";

    //
    $aFiles[]		= "elements/bar.js";
    $aFiles[]		= "elements/bubble.js";
    $aFiles[]		= "elements/chart.js";
    $aFiles[]		= "elements/funnel.js";
    $aFiles[]		= "elements/line.js";
    $aFiles[]		= "elements/map.js";
    $aFiles[]		= "elements/doughnut.js";
    $aFiles[]		= "elements/pie.js";
    $aFiles[]		= "elements/radar.js";
    $aFiles[]		= "elements/stream.js";
    //
    $aFiles[]		= "elements/item.js";
    $aFiles[]		= "elements/group.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>