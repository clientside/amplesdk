<?
    $aFiles		= array();

	// elements
	$aFiles[]		= "elements/acronym.js";
	$aFiles[]		= "elements/applet.js";
	$aFiles[]		= "elements/basefont.js";
	$aFiles[]		= "elements/big.js";
	$aFiles[]		= "elements/center.js";
	$aFiles[]		= "elements/dir.js";
	$aFiles[]		= "elements/font.js";
	$aFiles[]		= "elements/isindex.js";
	$aFiles[]		= "elements/s.js";
	$aFiles[]		= "elements/strike.js";
	$aFiles[]		= "elements/t.js";
	$aFiles[]		= "elements/tt.js";
	$aFiles[]		= "elements/u.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>