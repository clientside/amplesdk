/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cText	= function(){};

cText.prototype	= new cCharacterData;
cText.prototype.nodeType	= cNode.TEXT_NODE;
cText.prototype.nodeName	= "#text";

// Level 3
cText.prototype.isElementContentWhitespace	= false;
cText.prototype.wholeText	= null;

// nsIDOMText
cText.prototype.splitText	= function(nOffset)
{
//->Guard
	fGuard(arguments, [
		["offset",	cNumber]
	]);
//<-Guard

	if (nOffset <= this.length && nOffset >= 0)
	{
		var sData	= fCharacterData_substringData(this, nOffset, this.length);
		fElement_insertBefore(this.parentNode, fDocument_createTextNode(this.ownerDocument, sData), this);

		var sValueOld	= this.data;
		this.data	= sData;
		this.length	= sData.length;
		this.nodeValue	= this.data;

	    // Fire Event
	    if (sValueOld != this.data)
	    {
		    var oEvent = new cMutationEvent;
		    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
		    fNode_dispatchEvent(this, oEvent);
		}

		// Update presentation
		var oNode	= this.$getContainer();
		if (oNode)
			oNode.nodeValue	= this.data;
	}
	else
		throw new cDOMException(cDOMException.INDEX_SIZE_ERR);
};

cText.prototype.appendData	= function(sData)
{
	cCharacterData.prototype.appendData.call(this, sData);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

cText.prototype.deleteData	= function(nOffset, nLength)
{
	cCharacterData.prototype.deleteData.call(this, nOffset, nLength);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

cText.prototype.insertData	= function(nOffset, sData)
{
	cCharacterData.prototype.insertData.call(this, nOffset, sData);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

cText.prototype.replaceData	= function(nOffset, nLength, sData)
{
	cCharacterData.prototype.replaceData.call(this, nOffset, nLength, sData);

	// Update presentation
	var oNode	= this.$getContainer();
	if (oNode)
		oNode.nodeValue	= this.data;
};

// Level 3
cText.prototype.replaceWholeText	= function(sContent) {
//->Guard
	fGuard(arguments, [
		["content",	cString]
	]);
//<-Guard

	var sValueOld	= this.data;
	this.data		= sContent;
	this.length		= sContent.length;
	this.nodeValue	= sContent;

	// Fire Mutation event
    if (sValueOld != sContent) {
	    var oEvent = new cMutationEvent;
	    oEvent.initMutationEvent("DOMCharacterDataModified", true, false, null, sValueOld, this.data, null, null);
	    fNode_dispatchEvent(this, oEvent);
	}
};

cText.prototype.$getTag	= function()
{
	return this.nodeValue;
};
