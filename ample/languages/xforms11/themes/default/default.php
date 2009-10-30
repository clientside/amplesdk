<?
	$aFiles		= array();
//    $aFiles[]	= "elements.css";

    $sOutput	= "@namespace xforms \"http://www.w3.org/2002/xforms\";\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	echo $sOutput;
?>