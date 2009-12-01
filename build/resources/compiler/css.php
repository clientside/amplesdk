<?
	header("Content-type: text/plain");

	include("cCSSCompiler.php");

	$sInputFile		= $_SERVER["argv"][1];
	$sOutputFile	= $_SERVER["argv"][2];

	$sInput		= join('', file($sInputFile));
	$sOutput	= $sInput;

	echo "Reading: " . $sInputFile . "\n";

	if (in_array("--obfuscate", $_SERVER["argv"])) {

		$oCompiler	= new cCSSCompiler;
		$oCompiler->readFromString($sOutput);

		echo "Obfuscating contents\n";

		//
		$oCompiler->stripComments();
		$oCompiler->stripSpaces();

		$oCompiler->obfuscate();

		$sOutput	= $oCompiler->getOutput();
	}

	echo "Writing: " . $sOutputFile ."\n";

	$fOutputFile	= fopen($sOutputFile, "w+");
	fwrite($fOutputFile, $sOutput);
	fclose($fOutputFile);
?>