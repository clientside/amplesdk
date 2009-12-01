<?
	header("Content-type: text/plain");

	include("cJSCompiler.php");

	function fStripTags($sInput, $sTagName)
	{
        return preg_replace('/\/\/\->' . $sTagName . '.+\/\/<\-' . $sTagName . '/Us', "", $sInput);
	}

	$sInputFile		= $_SERVER["argv"][1];
	$sOutputFile	= $_SERVER["argv"][2];

	$sInput		= join('', file($sInputFile));
	$sOutput	= $sInput;

	echo "Reading: " . $sInputFile . "\n";

	// Strip "Source" version tags
	if (in_array("--strip-Source", $_SERVER["argv"])) {
		echo "Stripping 'Source' code\n";
		$sOutput	= fStripTags($sOutput, "Source");
	}
	// Strip "Debug" version tags
	if (in_array("--strip-Debug", $_SERVER["argv"])) {
		echo "Stripping 'Debug' code\n";
		$sOutput	= fStripTags($sOutput, "Debug");
	}

	if (in_array("--obfuscate", $_SERVER["argv"])) {

		$oCompiler	= new cJSCompiler;
		$oCompiler->keyword	= "ampled";
		$oCompiler->readFromString($sOutput);

		echo "Obfuscating contents\n";

		//
		$oCompiler->stripComments();
		$oCompiler->stripSpaces();

		$oCompiler->obfuscateStrings();
		$oCompiler->obfuscateVariables();
		$oCompiler->obfuscatePrivates();
		$oCompiler->obfuscate();

		$sOutput	= $oCompiler->getOutput();
	}
	else {
		echo "Wrapping contents\n";

		$oCompiler	= new cJSCompiler;
		$oCompiler->readFromString($sOutput);
		$oCompiler->stripComments();
		$sOutput	= $oCompiler->output;

		$sOutput	= 	"".
						"(function () {\n" .
							$sOutput . "\n" .
						"})()" .
						"";
	}

	echo "Writing: " . $sOutputFile ."\n";

	$fOutputFile	= fopen($sOutputFile, "w+");
	fwrite($fOutputFile, $sOutput);
	fclose($fOutputFile);
?>