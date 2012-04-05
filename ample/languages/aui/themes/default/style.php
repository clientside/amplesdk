<?php
	$aFiles		= array();
	$aFiles[]	= "elements.css";

	$sOutput	= "@namespace aui \"http://www.amplesdk.com/ns/aui\";\n";
	for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
		$sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	if (isset($_GET["prod"]) && $_GET["prod"] == "true") {
		include("../../../../../resources/compiler/cCSSCompiler.php");

		$oCSSCompiler	= new cCSSCompiler;
		$oCSSCompiler->readFromString($sOutput);
		$oCSSCompiler->stripComments();
		$oCSSCompiler->stripSpaces();
		$oCSSCompiler->obfuscate();
		$sOutput	= $oCSSCompiler->getOutput();
	}

	echo $sOutput;
?>