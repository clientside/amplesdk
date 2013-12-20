/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cMutationEvent	= function(sType) {
	fMutationEvent_init(this, sType, arguments[1]);
};
cMutationEvent.prototype	= new cEvent('#' + "MutationEvent");

// nsIDOMMutationEvent
cMutationEvent.MODIFICATION	= 1;
cMutationEvent.ADDITION		= 2;
cMutationEvent.REMOVAL		= 3;

cMutationEvent.prototype.relatedNode= null;
cMutationEvent.prototype.prevValue	= null;
cMutationEvent.prototype.newValue	= null;
cMutationEvent.prototype.attrName	= null;
cMutationEvent.prototype.attrChange	= null;

function fMutationEvent_getDictionary(bBubbles, bCancelable, oRelatedNode, sOldValue, sNewValue, sAttrName, nAttrChange) {
	var oValue	= fEvent_getDictionary(bBubbles, bCancelable);
	//
	oValue.relatedNode	= oRelatedNode;
	oValue.prevValue	= sOldValue;
	oValue.newValue		= sNewValue;
	oValue.attrName		= sAttrName;
	oValue.attrChange	= nAttrChange;

	return oValue;
};

function fMutationEvent_init(oEvent, sType, oValue) {
	fEvent_init(oEvent, sType, oValue);
	//
	if (oValue) {
		if ("relatedNode" in oValue)
			oEvent.relatedNode	= oValue.relatedNode;
		if ("prevValue" in oValue)
			oEvent.prevValue	= oValue.prevValue;
		if ("newValue" in oValue)
			oEvent.newValue	= oValue.newValue;
		if ("attrName" in oValue)
			oEvent.attrName	= oValue.attrName;
		if ("attrChange" in oValue)
			oEvent.attrChange	= oValue.attrChange;
	}
};

//
cMutationEvent.prototype.initMutationEvent	= function(sType, bBubbles, bCancelable, oRelatedNode, sOldValue, sNewValue, sAttrName, nAttrChange) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["bubbles",		cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	fMutationEvent_init(this, sType, fMutationEvent_getDictionary(bBubbles, bCancelable, oRelatedNode, sOldValue, sNewValue, sAttrName, nAttrChange));
};
