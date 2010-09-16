<?php
	$aFiles		= array();
	//

    $sOutput	= "@namespace xul \"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul\";\n\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	echo $sOutput;
?>