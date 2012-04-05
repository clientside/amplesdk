/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cMutationEvent	= function(){};
cMutationEvent.prototype	= new cEvent;
cMutationEvent.prototype.eventInterface	= "MutationEvent";

// nsIDOMMutationEvent
cMutationEvent.MODIFICATION	= 1;
cMutationEvent.ADDITION		= 2;
cMutationEvent.REMOVAL		= 3;

cMutationEvent.prototype.relatedNode= null;
cMutationEvent.prototype.prevValue	= null;
cMutationEvent.prototype.newValue	= null;
cMutationEvent.prototype.attrName	= null;
cMutationEvent.prototype.attrChange	= null;

cMutationEvent.prototype.initMutationEvent	= function(sType, bCanBubble, bCancelable, oRelatedNode, sOldValue, sNewValue, sAttrName, nAttrChange) {
/*
//->Guard
	fGuard(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
//<-Guard
*/
	this.initEvent(sType, bCanBubble, bCancelable);

	this.relatedNode	= oRelatedNode;
	this.prevValue		= sOldValue;
	this.newValue		= sNewValue;
	this.attrName		= sAttrName;
	this.attrChange		= nAttrChange;
};
