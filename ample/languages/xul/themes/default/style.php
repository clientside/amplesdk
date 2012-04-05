<?php
	$aFiles		= array();
	$aFiles[]	= "debug.css";
	$aFiles[]	= "markup.css";
	$aFiles[]	= "input.css";
	$aFiles[]	= "interaction.css";
	$aFiles[]	= "menu.css";
	$aFiles[]	= "tabbox.css";
	$aFiles[]	= "toolbox.css";
	$aFiles[]	= "treelist.css";
	$aFiles[]	= "windowed.css";
	$aFiles[]	= "editor.css";
	//
	$aFiles[]	= "datepicker-pane.css";
	$aFiles[]	= "colorpicker-pane.css";
	$aFiles[]	= "tooltip-pane.css";
	// css3 goodies
	$aFiles[]	= "css3.css";

	$sOutput	= "@namespace xul \"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul\";\n\n";
	for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
		$sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	//
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