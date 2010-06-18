/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLMutationEvent	= function(){};
cAMLMutationEvent.prototype	= new cAMLEvent;

// nsIDOMMutationEvent
cAMLMutationEvent.MODIFICATION	= 1;
cAMLMutationEvent.ADDITION		= 2;
cAMLMutationEvent.REMOVAL		= 3;

cAMLMutationEvent.prototype.relatedNode	= null;
cAMLMutationEvent.prototype.prevValue	= null;
cAMLMutationEvent.prototype.newValue	= null;
cAMLMutationEvent.prototype.attrName	= null;
cAMLMutationEvent.prototype.attrChange	= null;

cAMLMutationEvent.prototype.initMutationEvent	= function(sType, bCanBubble, bCancelable, oRelatedNode, sOldValue, sNewValue, sAttrName, nAttrChange)
{
/*
	// Validate arguments
	fAML_validate(arguments, [
		["type",		cString],
		["canBubble",	cBoolean],
		["cancelable",	cBoolean]
	]);
*/
	this.initEvent(sType, bCanBubble, bCancelable);

	this.relatedNode	= oRelatedNode;
	this.prevValue		= sOldValue;
	this.newValue		= sNewValue;
	this.attrName		= sAttrName;
	this.attrChange		= nAttrChange;
};
