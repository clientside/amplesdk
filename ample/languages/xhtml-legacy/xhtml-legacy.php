<?
    $aFiles		= array();

	// elements
	$aFiles[]		= "implementation/elements/applet.js";
	$aFiles[]		= "implementation/elements/basefont.js";
	$aFiles[]		= "implementation/elements/center.js";
	$aFiles[]		= "implementation/elements/dir.js";
	$aFiles[]		= "implementation/elements/embed.js";
	$aFiles[]		= "implementation/elements/font.js";
	$aFiles[]		= "implementation/elements/iframe.js";
	$aFiles[]		= "implementation/elements/isindex.js";
	$aFiles[]		= "implementation/elements/menu.js";
	$aFiles[]		= "implementation/elements/s.js";
	$aFiles[]		= "implementation/elements/strike.js";
	$aFiles[]		= "implementation/elements/t.js";
	$aFiles[]		= "implementation/elements/u.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>