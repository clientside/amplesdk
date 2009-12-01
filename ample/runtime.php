<?
	$aFiles		= array();

	//
	$aFiles[]	= "runtime/import.js";

	// DOM-Events
	$aFiles[]	= "runtime/classes/events/AMLEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLCustomEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLUIEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLMutationEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLMouseEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLMouseWheelEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLKeyboardEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLTextEvent.js";

	// DOM-Core
	$aFiles[]	= "runtime/classes/core/AMLStringList.js";
	$aFiles[]	= "runtime/classes/core/AMLConfiguration.js";
	$aFiles[]	= "runtime/classes/core/AMLImplementation.js";
	$aFiles[]	= "runtime/classes/core/AMLException.js";
	$aFiles[]	= "runtime/classes/core/AMLError.js";
	$aFiles[]	= "runtime/classes/core/AMLNode.js";
	$aFiles[]	= "runtime/classes/core/AMLNodeList.js";
	$aFiles[]	= "runtime/classes/core/AMLAttr.js";
	$aFiles[]	= "runtime/classes/core/AMLElement.js";
	$aFiles[]	= "runtime/classes/core/AMLEntityReference.js";
	$aFiles[]	= "runtime/classes/core/AMLDocument.js";
	$aFiles[]	= "runtime/classes/core/AMLProcessingInstruction.js";
	$aFiles[]	= "runtime/classes/core/AMLDocumentFragment.js";
	$aFiles[]	= "runtime/classes/core/AMLCharacterData.js";
	$aFiles[]	= "runtime/classes/core/AMLText.js";
	$aFiles[]	= "runtime/classes/core/AMLCDATASection.js";
	$aFiles[]	= "runtime/classes/core/AMLComment.js";

	// Selectors API
	$aFiles[]	= "runtime/classes/selectors/AMLNodeSelector.js";

	// Extensions
	// Animation
	$aFiles[]	= "runtime/classes/animation/AMLElementAnimation.js";

	// AML addons
	$aFiles[]	= "runtime/classes/AMLNamespace.js";
	$aFiles[]	= "runtime/classes/AMLSerializer.js";

	// XML APIs
	$aFiles[]	= "runtime/classes/DOMParser.js";
	$aFiles[]	= "runtime/classes/XMLSerializer.js";
	$aFiles[]	= "runtime/classes/XMLHttpRequest.js";
	$aFiles[]	= "runtime/classes/XSLTProcessor.js";
//	$aFiles[]	= "runtime/classes/RPCProxy.js";

	//
	$aFiles[]	= "runtime/classes/JSON.js";

	// Runtime
	$aFiles[]	= "runtime/browser.js";
	$aFiles[]	= "runtime/ample.js";

	// Processors
//	$aFiles[]	= "runtime/processors/rex10/rex10.js";
	// SMIL 3.0
	$aFiles[]	= "runtime/processors/smil30/smil30.js";
	$aFiles[]	= "runtime/processors/smil30/smil30-timing.js";
	$aFiles[]	= "runtime/processors/smil30/smil30-animation.js";
//	$aFiles[]	= "runtime/processors/smil30/classes/cAMLTimeEvent.js";
	// XBL 2.0
//	$aFiles[]	= "runtime/processors/xbl20/xbl20.js";
	// XInclude 1.0
	$aFiles[]	= "runtime/processors/xinclude10/xinclude10.js";
	// XML Events 1.0
	$aFiles[]	= "runtime/processors/xmlevents10/xmlevents10.js";
	// XML Schema 1.1
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSConstants.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSException.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSObject.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSModel.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSNamedMap.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSNamespaceItem.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSNamespaceItemList.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSObjectList.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/cAMLXSTypeDefinition.js";
	$aFiles[]	= "runtime/processors/xmlschema11/xmlschema11.js";
	// XML Schema 1.1 (Data Types)
	$aFiles[]	= "runtime/processors/xmlschema11/classes/datatypes/cAMLXSFacet.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/datatypes/cAMLXSMultiValueFacet.js";
	$aFiles[]	= "runtime/processors/xmlschema11/classes/datatypes/cAMLXSSimpleTypeDefinition.js";
	$aFiles[]	= "runtime/processors/xmlschema11/xmlschema11-datatypes.js";
	// XML Schema 1.1 (Built-in Data Types)
	$aFiles[]	= "runtime/processors/xmlschema11/builtin/xmlschema11-builtin.js";

	// Modules
	$aFiles[]	= "runtime/managers/mAMLFocus.js";
	$aFiles[]	= "runtime/managers/mAMLResize.js";
	$aFiles[]	= "runtime/managers/mAMLDragAndDrop.js";
	$aFiles[]	= "runtime/managers/mAMLSelection.js";
	$aFiles[]	= "runtime/managers/mAMLUI.js";
	$aFiles[]	= "runtime/managers/mAMLCapture.js";
	$aFiles[]	= "runtime/managers/mAMLHistory.js";

	//
	$aFiles[]	= "runtime/export.js";

	$sOutput	= "";
	for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
		$sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	if (isset($_REQUEST["build"])) {
		// include minifier
		include("../build/resources/compiler/cJSCompiler.php");

		function fStripTags($sInput, $sTagName)	{
        	return preg_replace('/\/\/\->' . $sTagName . '.+\/\/<\-' . $sTagName . '/Us', "", $sInput);
		}

		// Strip "Source"/"Debug" version tags
		$sOutput	= fStripTags($sOutput, "Source");
		if ($_REQUEST["build"] != "dev")
			$sOutput	= fStripTags($sOutput, "Debug");

		$oJSCompiler	= new cJSCompiler;
		$oJSCompiler->keyword	= "ampled";
		$oJSCompiler->readFromString($sOutput);

		//
		$oJSCompiler->stripComments();
		$oJSCompiler->stripSpaces();

		$oJSCompiler->obfuscateStrings();
		$oJSCompiler->obfuscateVariables();
		$oJSCompiler->obfuscatePrivates();
		$oJSCompiler->obfuscate();

		echo	$oJSCompiler->getOutput();
	}
	else {
		// Add function names
		$sOutput = preg_replace("/([a-z0-9\$_]+)(\.)" . "(prototype)?(\.)?" . "([a-z0-9\$_]+)" . "[ \t]*=[ \t]*function[ \t]*\(/i", "$1$2$3$4$5=function $1_$3_$5(", $sOutput);

		echo 	"" .
				"(function(){" .
					$sOutput .
				"})();".
				"";
	}
?>