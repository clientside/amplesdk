<?php
    $aFiles		= array();

    // Classes
//    $aFiles[]	= "classes/cXSElement.js";

	// Elements
//    $aFiles[]	= "elements/schema.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>