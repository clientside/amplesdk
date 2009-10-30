<?
	$aFiles		= array();
    $aFiles[]	= "elements.css";

    $sOutput	= "@namespace aml \"http://www.amplesdk.com/ns/aml\";\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	echo $sOutput;
?>