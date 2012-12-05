/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function fExporter_toStringFunction(sName, sOrigin) {
	return cFunction('return "' + "function" + ' ' + sName + '()' + ' ' + '{' + ' ' + '[' + (sOrigin || "ample") + ' ' + "code" + ']' + ' ' + '}"');
};
function fExporter_toStringObject(sName) {
	return cFunction('return "[' + "object" + ' ' + sName + ']"');
};
var fExporter_toString	= fExporter_toStringFunction("toString");
fExporter_toString.toString	= fExporter_toString;
function fExporter_toStringMember(vObject, fToString) {
	if (!vObject.hasOwnProperty("toString")) {
		vObject.toString	= fToString;
		vObject.toString.toString	= fExporter_toString;
	}
};
function fExporter_sign(vObject, sName, sOrigin) {
	fExporter_toStringMember(vObject, (vObject instanceof cFunction ? fExporter_toStringFunction : fExporter_toStringObject)(sName, sOrigin));
	fExporter_signMembers(vObject, sOrigin);
	if (vObject.prototype)
		fExporter_sign(vObject.prototype, sName, sOrigin);
};
function fExporter_signMembers(oObject, sOrigin) {
	// Sign only own members
	for (var sName in oObject)
		if (oObject.hasOwnProperty(sName) && oObject[sName] instanceof cFunction)
			fExporter_toStringMember(oObject[sName], fExporter_toStringFunction(sName, sOrigin));
};

function fExporter_export(cObject, sName, oObject, sOrigin) {
	// Class
	fExporter_sign(cObject, sName, sOrigin);

	// Publish
	(oObject || hClasses)[sName]	= cObject;
};

// publish classes to window
// DOM-Events
fExporter_export(cEvent,			"Event");
fExporter_export(cCustomEvent,		"CustomEvent");
fExporter_export(cUIEvent,			"UIEvent");
fExporter_export(cTextEvent,		"TextEvent");
fExporter_export(cKeyboardEvent,	"KeyboardEvent");
fExporter_export(cMouseEvent,		"MouseEvent");
fExporter_export(cWheelEvent,		"WheelEvent");
fExporter_export(cFocusEvent,		"FocusEvent");
fExporter_export(cMutationEvent,	"MutationEvent");
// Touch/Gesture
fExporter_export(cGestureEvent,		"GestureEvent");
fExporter_export(cTouchEvent,		"TouchEvent");

// DOM-Core
fExporter_export(cDOMStringList,	"DOMStringList");
fExporter_export(cNamedNodeMap,		"NamedNodeMap");
fExporter_export(cNode,				"Node");
fExporter_export(cAttr,				"Attr");
fExporter_export(cCDATASection,		"CDATASection");
fExporter_export(cCharacterData,	"CharacterData");
fExporter_export(cComment,			"Comment");
fExporter_export(cDOMConfiguration,	"DOMConfiguration");
fExporter_export(cDocument,			"Document");
fExporter_export(cDocumentFragment,	"DocumentFragment");
fExporter_export(cElement,			"Element");
fExporter_export(cEntityReference,	"EntityReference");
fExporter_export(cDOMException,		"DOMException");
fExporter_export(cDOMError,			"DOMError");
fExporter_export(cDOMImplementation,"DOMImplementation");
fExporter_export(cNodeList,			"NodeList");
fExporter_export(cProcessingInstruction,	"ProcessingInstruction");
fExporter_export(cText,				"Text");
// Touch/Gesture
fExporter_export(cTouch,			"Touch");
fExporter_export(cTouchList,		"TouchList");
// Drag&Drop
fExporter_export(cDataTransfer,		"DataTransfer");
fExporter_export(cDragEvent,		"DragEvent");
// Resize
fExporter_export(cResizeEvent,		"ResizeEvent");
// History
fExporter_export(cHashChangeEvent,	"HashChangeEvent");
// Selectors
fExporter_export(cNodeSelector,		"NodeSelector");
// Ample SDK objects
fExporter_export(cAmpleException,	"AmpleException");
fExporter_export(cQuery,			"Query");

//->Source
//Range
fExporter_export(cRange,			"Range");
//<-Source

// Special virtual types
fExporter_sign(cArguments,		"Arguments");
fExporter_sign(cXMLNode,		"Node");
fExporter_sign(cXMLElement,		"Element");
fExporter_sign(cXMLDocument,	"Document");
// Tweaks and tricks
fExporter_sign(oAmple.prefixes,	"prefixes");
fExporter_sign(oAmple.classes,	"classes");
fExporter_sign(oAmple.easing,	"easing");
fExporter_sign(oAmple.locale,	"locale");
fExporter_sign(cNodeSelector.pseudoClass,	"pseudoClass");
fExporter_sign(oAmple_root.$getContainer,	"$getContainer");
//
fExporter_signMembers(oAmple, "ample");
//
window["ample"]	= oAmple;
