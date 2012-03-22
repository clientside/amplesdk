/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */
//->Source
var cRange	= function(){};

// Constants
cRange.START_TO_START	= 0;
cRange.START_TO_END		= 1;
cRange.END_TO_END		= 2;
cRange.END_TO_START		= 3;

//
cRange.prototype.startContainer	= null;
cRange.prototype.startOffset	= null;
cRange.prototype.endContainer	= null;
cRange.prototype.endOffset		= null;
cRange.prototype.collapsed		= null;
cRange.prototype.commonAncestorContainer	= null;

//
function fRange_setStart(oRange, oNode, nOffset) {
	oRange.startContainer	= oNode;
	oRange.startOffset		= nOffset;
};

cRange.prototype.setStart	= function(oNode, nOffset) {
//->Guard
	fGuard(arguments, [
		["node",	cNode],
		["offset",	cNumber]
	]);
//<-Guard

	fRange_setStart(this, oNode, nOffset);
};

function fRange_setEnd(oRange, oNode, nOffset) {
	oRange.endContainer	= oNode;
	oRange.endOffset		= nOffset;
};

cRange.prototype.setEnd		= function(oNode, nOffset) {
//->Guard
	fGuard(arguments, [
		["node",	cNode],
		["offset",	cNumber]
	]);
//<-Guard

	fRange_setEnd(this, oNode, nOffset);
};

cRange.prototype.setStartBefore	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.setStartAfter	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.setEndBefore	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.setEndAfter		= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.collapse	= function(bStart) {
//->Guard
	fGuard(arguments, [
		["toStart",	cBoolean]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.selectNode	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.selectNodeContents	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

//
cRange.prototype.compareBoundaryPoints	= function(nHow, oRange) {
//->Guard
	fGuard(arguments, [
		["how",			cNumber],
		["sourceRange",	cRange]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.deleteContents	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.extractContents	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.cloneContents	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.insertNode		= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.surroundContents= function(oParent) {
//->Guard
	fGuard(arguments, [
		["parent",	cNode]
	]);
//<-Guard

	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.cloneRange	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.detach		= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};

cRange.prototype.toString	= function() {
	throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
};
//<-Source