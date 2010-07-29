<?
	$aFiles		= array();

	//
	$aFiles[]	= "aquery/aquery.js";
	$aFiles[]	= "aquery/plugins/dom.js";
	$aFiles[]	= "aquery/plugins/events.js";
	$aFiles[]	= "aquery/plugins/effects.js";

	$sOutput	= "";
	for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
		$sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo $sOutput;
?>