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

cAMLCharacterData.prototype.appendData	= function(sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["data",	cString]
	], "appendData");

	var sValueOld	= this.data;
	this.data		+= sData;
	this.length		= this.data.length;
	this.nodeValue	= this.data;

	// Fire Mutation event
    if (sValueOld != this.data && oAML_configuration.getParameter("ample-use-dom-events")) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
	    this.dispatchEvent(oEvent);
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
	{
		var sValueOld	= this.data;
		this.data		= this.data.substring(0, nOffset) + this.data.substring(nOffset, nOffset + nLength);
		this.length		= this.data.length;
		this.nodeValue	= this.data;

		// Fire Mutation event
	    if (sValueOld != this.data && oAML_configuration.getParameter("ample-use-dom-events")) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
		    this.dispatchEvent(oEvent);
		}
	}
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

cAMLCharacterData.prototype.insertData	= function(nOffset, sData)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber],
		["data",	cString]
	], "insertData");

	if (nOffset <= this.length && nOffset >= 0)
	{
		var sValueOld	= this.data;
		this.data		= this.data.substring(0, nOffset) + sData + this.data.substring(nOffset);
		this.length		= this.data.length;
		this.nodeValue	= this.data;

		// Fire Mutation event
	    if (sValueOld != this.data && oAML_configuration.getParameter("ample-use-dom-events")) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
		    this.dispatchEvent(oEvent);
		}
	}
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
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
	{
		var sValueOld	= this.data;
		this.data		= this.data.substring(0, nOffset) + sData + this.data.substring(nOffset + nLength);
		this.length		= this.data.length;
		this.nodeValue	= this.data;

		// Fire Mutation event
	    if (sValueOld != this.data && oAML_configuration.getParameter("ample-use-dom-events")) {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
		    this.dispatchEvent(oEvent);
		}
	}
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

cAMLCharacterData.prototype.substringData	= function(nOffset, nLength)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber],
		["length",	cNumber]
	], "substringData");

	if (nOffset <= this.length && nOffset >= 0 && nLength >= 0)
		return this.data.substring(nOffset, nOffset + nLength);
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

cAMLCharacterData.prototype.$getContainer	= function()
{
	return this.parentNode && this.parentNode.$getContainer() ? this.parentNode.$getContainer().childNodes[this.parentNode.childNodes.$indexOf(this)] : null;
};
