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
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["offset",	cNumber]
	]);

	fAMLRange_setStart(this, oNode, nOffset);
};

function fAMLRange_setEnd(oRange, oNode, nOffset) {
	oRange.endContainer	= oNode;
	oRange.endOffset		= nOffset;
};

cAMLRange.prototype.setEnd		= function(oNode, nOffset) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode],
		["offset",	cNumber]
	]);

	fAMLRange_setEnd(this, oNode, nOffset);
};

cAMLRange.prototype.setStartBefore	= function(oNode) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.setStartAfter	= function(oNode) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.setEndBefore	= function(oNode) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.setEndAfter		= function(oNode) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.collapse	= function(bStart) {
	// Validate arguments
	fAML_validate(arguments, [
		["toStart",	cBoolean]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.selectNode	= function(oNode) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.selectNodeContents	= function(oNode) {
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

//
cAMLRange.prototype.compareBoundaryPoints	= function(nHow, oRange) {
	// Validate arguments
	fAML_validate(arguments, [
		["how",			cNumber],
		["sourceRange",	cAMLRange]
	]);

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
	// Validate arguments
	fAML_validate(arguments, [
		["node",	cAMLNode]
	]);

	throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
};

cAMLRange.prototype.surroundContents= function(oParent) {
	// Validate arguments
	fAML_validate(arguments, [
		["parent",	cAMLNode]
	]);

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