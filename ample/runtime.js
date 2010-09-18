/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	//
	files.push("runtime/import.js");
	// DOM-Events
	files.push("runtime/classes/events/AMLEvent.js");
	files.push("runtime/classes/events/AMLCustomEvent.js");
	files.push("runtime/classes/events/AMLUIEvent.js");
	files.push("runtime/classes/events/AMLMutationEvent.js");
	files.push("runtime/classes/events/AMLMouseEvent.js");
	files.push("runtime/classes/events/AMLMouseWheelEvent.js");
	files.push("runtime/classes/events/AMLKeyboardEvent.js");
	files.push("runtime/classes/events/AMLTextEvent.js");
	// Touches
	files.push("runtime/classes/events/AMLGestureEvent.js");
	files.push("runtime/classes/events/AMLTouchEvent.js");
	// DOM-Core
	files.push("runtime/classes/core/AMLStringList.js");
	files.push("runtime/classes/core/AMLConfiguration.js");
	files.push("runtime/classes/core/AMLImplementation.js");
	files.push("runtime/classes/core/AMLException.js");
	files.push("runtime/classes/core/AMLError.js");
	files.push("runtime/classes/core/AMLNode.js");
	files.push("runtime/classes/core/AMLNodeList.js");
	files.push("runtime/classes/core/AMLAttr.js");
	files.push("runtime/classes/core/AMLElement.js");
	files.push("runtime/classes/core/AMLEntityReference.js");
	files.push("runtime/classes/core/AMLDocument.js");
	files.push("runtime/classes/core/AMLProcessingInstruction.js");
	files.push("runtime/classes/core/AMLDocumentFragment.js");
	files.push("runtime/classes/core/AMLCharacterData.js");
	files.push("runtime/classes/core/AMLText.js");
	files.push("runtime/classes/core/AMLCDATASection.js");
	files.push("runtime/classes/core/AMLComment.js");
	// Touches
	files.push("runtime/classes/core/AMLTouch.js");
	files.push("runtime/classes/core/AMLTouchList.js");
	// Selectors API
	files.push("runtime/classes/selectors/AMLNodeSelector.js");
	// Animation
	files.push("runtime/classes/misc/AMLNodeAnimation.js");
	files.push("runtime/classes/misc/AMLNodeLoader.js");
	// Range
	files.push("runtime/classes/range/AMLRange.js");
	// AML addons
//	files.push("runtime/classes/AMLNamespace.js");
//	files.push("runtime/classes/AMLSerializer.js");
	files.push("runtime/classes/AMLQuery.js");
	// XML APIs
	files.push("runtime/classes/DOMParser.js");
	files.push("runtime/classes/XMLSerializer.js");
	files.push("runtime/classes/XMLHttpRequest.js");
	files.push("runtime/classes/XSLTProcessor.js");
//	files.push("runtime/classes/RPCProxy.js");
	//
	files.push("runtime/classes/JSON.js");
	// Runtime
	files.push("runtime/utilities.js");
	files.push("runtime/guard.js");
	files.push("runtime/browser.js");
	files.push("runtime/ample.js");
	// XML Events 1.0
	files.push("runtime/processors/xmlevents/classes/XMLEventsElement.js");
	files.push("runtime/processors/xmlevents/elements/listener.js");
	// XLink
	files.push("runtime/processors/xlink/classes/XLAttr.js");
	files.push("runtime/processors/xlink/attributes/href.js");
	// AML
	files.push("runtime/processors/aml/classes/cAMLAttr.js");
	files.push("runtime/processors/aml/classes/cAMLElement.js");
	files.push("runtime/processors/aml/attributes/draggable.js");
	files.push("runtime/processors/aml/attributes/droppable.js");
	files.push("runtime/processors/aml/attributes/resizable.js");
	files.push("runtime/processors/aml/attributes/selectable.js");
	files.push("runtime/processors/aml/attributes/resize-edges.js");
	files.push("runtime/processors/aml/elements/data.js");
	files.push("runtime/processors/aml/elements/handler.js");
	files.push("runtime/processors/aml/elements/repeater.js");
	// SMIL 3.0
	files.push("runtime/processors/smil/classes/SMILElement.js");
	files.push("runtime/processors/smil/classes/SMILTimeElement.js");
	files.push("runtime/processors/smil/classes/SMILAnimationElement.js");
	files.push("runtime/processors/smil/classes/SMILTimeEvent.js");
	files.push("runtime/processors/smil/elements/animate.js");
	files.push("runtime/processors/smil/elements/animateColor.js");
	files.push("runtime/processors/smil/elements/animateMotion.js");
	files.push("runtime/processors/smil/elements/animateTransform.js");
	files.push("runtime/processors/smil/elements/excl.js");
	files.push("runtime/processors/smil/elements/par.js");
	files.push("runtime/processors/smil/elements/seq.js");
	files.push("runtime/processors/smil/elements/set.js");
	// REX 1.0
//	files.push("runtime/processors/rex/rex.js");
	// XBL 2.0
//	files.push("runtime/processors/xbl/xbl.js");
	// Managers
	files.push("runtime/managers/mAMLFocus.js");
	files.push("runtime/managers/mAMLResize.js");
	files.push("runtime/managers/mAMLDragAndDrop.js");
	files.push("runtime/managers/mAMLSelection.js");
	files.push("runtime/managers/mAMLCapture.js");
	files.push("runtime/managers/mAMLTouch.js");
	// Modules
	files.push("runtime/modules/ajax.js");
	files.push("runtime/modules/attributes.js");
	files.push("runtime/modules/css.js");
	files.push("runtime/modules/data.js");
	files.push("runtime/modules/dimensions.js");
	files.push("runtime/modules/effects.js");
	files.push("runtime/modules/event.js");
	files.push("runtime/modules/history.js");
	files.push("runtime/modules/manipulation.js");
	files.push("runtime/modules/offset.js");
	files.push("runtime/modules/traversing.js");
	//
	files.push("runtime/export.js");

	// load files
	var source = [],
		scripts	= document.getElementsByTagName("script"),
		base	= scripts[scripts.length-1].src.replace(/\/?[^\/]+$/, '');
	for (var n = 0; n < files.length; n++) {
		var oRequest = new (window.XMLHttpRequest ? XMLHttpRequest : ActiveXObject("Microsoft.XMLHTTP"));
		oRequest.open("GET", base + '/' + files[n], false);
		oRequest.send(null);
		source[source.length]	= oRequest.responseText;
	}
	var oScript	= document.getElementsByTagName("head")[0].appendChild(document.createElement("script"));
	oScript.type	= "text/javascript";
	oScript.text	= "(function(){" + source.join("\n") + "})()";
	oScript.parentNode.removeChild(oScript);
})();