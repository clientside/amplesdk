/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLCharacterData	= function(){};

cAMLCharacterData.prototype	= new cAMLNode;

// nsIDOMCharacterData
cAMLCharacterData.prototype.data	= null;
cAMLCharacterData.prototype.length	= 0;

function fAMLCharacterData_appendData(oNode, sData)
{
	var sValueOld	= oNode.data;
	oNode.data		+= sData;
	oNode.length		= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fAMLNode_dispatchEvent(oNode, oEvent);
	}
};

cAMLCharacterData.prototype.appendData	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cString]
	], "appendData");

	// Invoke actual implementation
	fAMLCharacterData_appendData(this, sData);
};

function fAMLCharacterData_deleteData(oNode, nOffset, nLength)
{
	var sValueOld	= oNode.data;
	oNode.data		= oNode.data.substring(0, nOffset) + oNode.data.substring(nOffset, nOffset + nLength);
	oNode.length		= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fAMLNode_dispatchEvent(oNode, oEvent);
	}
};

cAMLCharacterData.prototype.deleteData	= function(nOffset, nLength)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber],
		["length",	cNumber]
	], "deleteData");

	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		fAMLCharacterData_deleteData(this, nOffset, nLength);
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

function fAMLCharacterData_insertData(oNode, nOffset, sData)
{
	var sValueOld	= oNode.data;
	oNode.data		= oNode.data.substring(0, nOffset) + sData + oNode.data.substring(nOffset);
	oNode.length	= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fAMLNode_dispatchEvent(oNode, oEvent);
	}
};

cAMLCharacterData.prototype.insertData	= function(nOffset, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber],
		["data",	cString]
	], "insertData");

	if (nOffset <= this.length && nOffset >= 0)
		fAMLCharacterData_insertData(this, nOffset, sData);
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

function fAMLCharacterData_replaceData(oNode, nOffset, nLength, sData)
{
	var sValueOld	= oNode.data;
	oNode.data		= oNode.data.substring(0, nOffset) + sData + oNode.data.substring(nOffset + nLength);
	oNode.length	= oNode.data.length;
	oNode.nodeValue	= oNode.data;

	// Fire Mutation event
    if (sValueOld != oNode.data) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, oNode.data, null, null);
	    fAMLNode_dispatchEvent(oNode, oEvent);
	}
};

cAMLCharacterData.prototype.replaceData	= function(nOffset, nLength, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber],
		["length",	cNumber],
		["data",	cString]
	], "replaceData");

	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		fAMLCharacterData_replaceData(this, nOffset, nLength, sData);
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

function fAMLCharacterData_substringData(oNode, nOffset, nLength)
{
	return this.data.substring(nOffset, nOffset + nLength);
};

cAMLCharacterData.prototype.substringData	= function(nOffset, nLength)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber],
		["length",	cNumber]
	], "substringData");

	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		return fAMLCharacterData_substringData(this, nOffset, nLength);
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

cAMLCharacterData.prototype.$getContainer	= function()
{
	return this.parentNode && this.parentNode.$getContainer() ? this.parentNode.$getContainer().childNodes[this.parentNode.childNodes.$indexOf(this)] : null;
};
