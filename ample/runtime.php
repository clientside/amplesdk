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
	// Touches
	$aFiles[]	= "runtime/classes/events/AMLGestureEvent.js";
	$aFiles[]	= "runtime/classes/events/AMLTouchEvent.js";

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
	// Touches
	$aFiles[]	= "runtime/classes/core/AMLTouch.js";
	$aFiles[]	= "runtime/classes/core/AMLTouchList.js";

	// Selectors API
	$aFiles[]	= "runtime/classes/selectors/AMLNodeSelector.js";

	// Animation
	$aFiles[]	= "runtime/classes/animation/AMLNodeAnimation.js";

	// Range
	$aFiles[]	= "runtime/classes/range/AMLRange.js";

	// AML addons
//	$aFiles[]	= "runtime/classes/AMLNamespace.js";
//	$aFiles[]	= "runtime/classes/AMLSerializer.js";
	$aFiles[]	= "runtime/classes/AMLQuery.js";

	// XML APIs
	$aFiles[]	= "runtime/classes/DOMParser.js";
	$aFiles[]	= "runtime/classes/XMLSerializer.js";
	$aFiles[]	= "runtime/classes/XMLHttpRequest.js";
	$aFiles[]	= "runtime/classes/XSLTProcessor.js";
//	$aFiles[]	= "runtime/classes/RPCProxy.js";

	//
	$aFiles[]	= "runtime/classes/JSON.js";

	// Runtime
	$aFiles[]	= "runtime/utilities.js";
	$aFiles[]	= "runtime/guard.js";
	$aFiles[]	= "runtime/browser.js";
	$aFiles[]	= "runtime/locale.js";
	$aFiles[]	= "runtime/ample.js";

	// XML Events 1.0
	$aFiles[]	= "runtime/processors/xmlevents/classes/XMLEventsElement.js";
	$aFiles[]	= "runtime/processors/xmlevents/elements/listener.js";

	// AML
	$aFiles[]	= "runtime/processors/aml/classes/cAMLAttr.js";
	$aFiles[]	= "runtime/processors/aml/classes/cAMLElement.js";
	$aFiles[]	= "runtime/processors/aml/attributes/draggable.js";
	$aFiles[]	= "runtime/processors/aml/attributes/droppable.js";
	$aFiles[]	= "runtime/processors/aml/attributes/resizable.js";
	$aFiles[]	= "runtime/processors/aml/attributes/selectable.js";
	$aFiles[]	= "runtime/processors/aml/attributes/resize-edges.js";
	$aFiles[]	= "runtime/processors/aml/elements/data.js";
	$aFiles[]	= "runtime/processors/aml/elements/handler.js";
	$aFiles[]	= "runtime/processors/aml/elements/repeater.js";
	$aFiles[]	= "runtime/processors/aml/elements/timer.js";

	// SMIL 3.0
	$aFiles[]	= "runtime/processors/smil/classes/SMILElement.js";
	$aFiles[]	= "runtime/processors/smil/classes/SMILTimeElement.js";
	$aFiles[]	= "runtime/processors/smil/classes/SMILAnimationElement.js";
	$aFiles[]	= "runtime/processors/smil/classes/SMILTimeEvent.js";
	$aFiles[]	= "runtime/processors/smil/elements/animate.js";
	$aFiles[]	= "runtime/processors/smil/elements/animateColor.js";
	$aFiles[]	= "runtime/processors/smil/elements/animateMotion.js";
	$aFiles[]	= "runtime/processors/smil/elements/excl.js";
	$aFiles[]	= "runtime/processors/smil/elements/par.js";
	$aFiles[]	= "runtime/processors/smil/elements/seq.js";
	$aFiles[]	= "runtime/processors/smil/elements/set.js";

	// REX 1.0
//	$aFiles[]	= "runtime/processors/rex/rex.js";

	// XBL 2.0
//	$aFiles[]	= "runtime/processors/xbl/xbl.js";

	// Managers
	$aFiles[]	= "runtime/managers/mAMLFocus.js";
	$aFiles[]	= "runtime/managers/mAMLResize.js";
	$aFiles[]	= "runtime/managers/mAMLDragAndDrop.js";
	$aFiles[]	= "runtime/managers/mAMLSelection.js";
	$aFiles[]	= "runtime/managers/mAMLCapture.js";
	$aFiles[]	= "runtime/managers/mAMLHistory.js";
	$aFiles[]	= "runtime/managers/mAMLTouch.js";
/*
	// Modules
	$aFiles[]	= "runtime/modules/ajax.js";
	$aFiles[]	= "runtime/modules/attributes.js";
	$aFiles[]	= "runtime/modules/collection.js";
	$aFiles[]	= "runtime/modules/css.js";
	$aFiles[]	= "runtime/modules/data.js";
	$aFiles[]	= "runtime/modules/dimensions.js";
	$aFiles[]	= "runtime/modules/effects.js";
	$aFiles[]	= "runtime/modules/event.js";
	$aFiles[]	= "runtime/modules/manipulation.js";
	$aFiles[]	= "runtime/modules/offset.js";
*/
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