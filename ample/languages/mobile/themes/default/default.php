<?
	$aFiles		= array();

    $sOutput	= "@namespace mob \"http://www.amplesdk.com/ns/mobile\";\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	echo $sOutput;
?>