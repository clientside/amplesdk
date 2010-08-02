<?
	$aFiles		= array();

	//
	$aFiles[]	= "aquery/aquery.js";
	$aFiles[]	= "aquery/modules/collection.js";
	$aFiles[]	= "aquery/modules/css.js";
	$aFiles[]	= "aquery/modules/dom.js";
	$aFiles[]	= "aquery/modules/events.js";
	$aFiles[]	= "aquery/modules/effects.js";

	$sOutput	= "";
	for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
		$sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo $sOutput;
?>