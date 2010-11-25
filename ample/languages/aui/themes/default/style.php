<?php
	$aFiles		= array();
    $aFiles[]	= "elements.css";

    $sOutput	= "@namespace aml \"http://www.amplesdk.com/ns/aml\";\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	//
	include("../../../../../resources/compiler/cCSSCompiler.php");

	$oCSSCompiler	= new cCSSCompiler;
	$oCSSCompiler->readFromString($sOutput);
	$oCSSCompiler->stripComments();
	$oCSSCompiler->stripSpaces();
	$oCSSCompiler->obfuscate();
	$sOutput	= $oCSSCompiler->getOutput();

	echo $sOutput;
?>