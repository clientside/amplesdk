/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLText	= function(){};

cAMLText.prototype	= new cAMLCharacterData;
cAMLText.prototype.nodeType	= cAMLNode.TEXT_NODE;
cAMLText.prototype.nodeName	= "#text";

// Level 3
cAMLCharacterData.prototype.isElementContentWhitespace	= false;
cAMLCharacterData.prototype.wholeText	= null;

// nsIDOMText
cAMLText.prototype.splitText	= function(nOffset)
{
	// Validate arguments
	fAML_validate(arguments, [
		["offset",	cNumber]
	], "splitText");

	if (nOffset <= this.length && nOffset >= 0)
	{
		var sData	= this.substringData(nOffset, this.length);
		this.parentNode.insertBefore(this.ownerDocument.createTextNode(sData), this);

		var sValueOld	= this.data;
		this.data	= sData;
		this.length	= sData.length;
		this.nodeValue	= this.data;

	    // Fire Event
	    if (sValueOld != this.data && oAML_configuration.getParameter("ample-use-dom-events"))
	    {
		    var oEvent = new cAMLMutationEvent;
		    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
		    this.dispatchEvent(oEvent);
		}

		// Update presentation
		var oNode	= this.$getContainer();
		if (oNode)
			oNode.nodeValue	= this.data;
	}
	else
		throw new cAMLException(cAMLException.INDEX_SIZE_ERR);
};

cAMLText.prototype.appendData	= function(sData)
{
	cAMLCharacterData.prototype.appendData.call(this, sData);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

cAMLText.prototype.deleteData	= function(nOffset, nLength)
{
	cAMLCharacterData.prototype.deleteData.call(this, nOffset, nLength);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

cAMLText.prototype.insertData	= function(nOffset, sData)
{
	cAMLCharacterData.prototype.insertData.call(this, nOffset, sData);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

cAMLText.prototype.replaceData= function(nOffset, nLength, sData)
{
	cAMLCharacterData.prototype.replaceData.call(this, nOffset, nLength, sData);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

// Level 3
cAMLText.prototype.replaceWholeText	= function(sContent) {
	// Validate arguments
	fAML_validate(arguments, [
		["content",	cString]
	], "replaceWholeText");

	var sValueOld	= this.data;
	this.data		= this.data;
	this.length		= this.data.length;
	this.nodeValue	= this.data;

	// Fire Mutation event
    if (sValueOld != sContent && oAML_configuration.getParameter("ample-use-dom-events")) {
	    var oEvent = new cAMLMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
	    this.dispatchEvent(oEvent);
	}
};


cAMLText.prototype.cloneNode	= function(bDeep)
{
	return this.ownerDocument.createTextNode(this.data);
};

cAMLText.prototype.$getTag	= function()
{
	return this.nodeValue;
};
