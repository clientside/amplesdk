/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */
//->Source
var cAMLRange	= function(){};

// Constants
cAMLRange.START_TO_START	= 0;
cAMLRange.START_TO_END		= 1;
cAMLRange.END_TO_END		= 2;
cAMLRange.END_TO_START		= 3;

//
cAMLRange.prototype.startContainer	= null;
cAMLRange.prototype.startOffset		= null;
cAMLRange.prototype.endContainer	= null;
cAMLRange.prototype.endOffset		= null;
cAMLRange.prototype.collapsed		= null;
cAMLRange.prototype.commonAncestorContainer	= null;

//
function fAMLRange_setStart(oRange, oNode, nOffset) {
	oRange.startContainer	= oNode;
	oRange.startOffset		= nOffset;
};

cAMLRange.prototype.setStart	= function(oNode, nOffset) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode],
		["offset",	cNumber]
	]);
//<-Guard

	fAMLRange_setStart(this, oNode, nOffset);
};

function fAMLRange_setEnd(oRange, oNode, nOffset) {
	oRange.endContainer	= oNode;
	oRange.endOffset		= nOffset;
};

cAMLRange.prototype.setEnd		= function(oNode, nOffset) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode],
		["offset",	cNumber]
	]);
//<-Guard

	fAMLRange_setEnd(this, oNode, nOffset);
};

cAMLRange.prototype.setStartBefore	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.setStartAfter	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.setEndBefore	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.setEndAfter		= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.collapse	= function(bStart) {
//->Guard
	fGuard(arguments, [
		["toStart",	cBoolean]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.selectNode	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.selectNodeContents	= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

//
cAMLRange.prototype.compareBoundaryPoints	= function(nHow, oRange) {
//->Guard
	fGuard(arguments, [
		["how",			cNumber],
		["sourceRange",	cAMLRange]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.deleteContents	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.extractContents	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.cloneContents	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.insertNode		= function(oNode) {
//->Guard
	fGuard(arguments, [
		["node",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.surroundContents= function(oParent) {
//->Guard
	fGuard(arguments, [
		["parent",	cAMLNode]
	]);
//<-Guard

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.cloneRange	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.detach		= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.toString	= function() {
	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};
//<-Source