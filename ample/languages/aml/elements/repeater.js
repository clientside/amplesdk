/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_repeater	= function(){};
cAMLElement_repeater.prototype	= new cAMLElement("repeater");

// Public properties
cAMLElement_repeater.prototype.data	= null;

// Private Properties
cAMLElement_repeater.prototype._timeout	= null;

// Public Methods
cAMLElement_repeater.prototype.setAttribute	= function(sName, sValue)
{
	if (sName == "data")
	{
		if (sValue != this.attributes[sName])
			this.bind(sValue);
	}
	else
	if (sName == "select")
	{
//		this.refresh();
	}
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_repeater.prototype.$getTag	= function()
{
	return "";
};

cAMLElement_repeater.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oElement	= this.ownerDocument.getElementById(this.getAttribute("data"));
		if (oElement)
		{
			this.bind(oElement);
			//
			this.refresh();
		}
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		this.unbind();
	}
};

cAMLElement_repeater.prototype.bind	= function(oElement)
{
	if (this.data && this.data != oElement)
		this.unbind();
	else
	{
		this.data	= oElement;
		this.data.register(this);
	}
};

cAMLElement_repeater.prototype.unbind	= function()
{
	if (this.data)
	{
		this.data.unregister(this);
		this.data	= null;
	}
};

cAMLElement_repeater.prototype.refresh	= function()
{
	// skip refresh (if scheduled)
	if (this._timeout)
		return;

	// schedule refresh
	var self	= this;
	this._timeout	= setTimeout(function() {
		// execute refresh
		self._timeout	= null;
		self.repeat();
	}, 0);
};

cAMLElement_repeater.prototype.repeat	= function()
{
	if (this.data) {
		var aElements, nIndex, oElement;

		// Clean up previously created elements
		aElements	= this.parentNode.childNodes;
		for (nIndex = 0; oElement = aElements[nIndex]; nIndex++)
			if (oElement.dataIndex)
				oElement.parentNode.removeChild(oElement) && nIndex--;

		// Generate new content
		var oContext	= this,
			oContextCache	= {},
			fResolver	= function (sPrefix) {
				return sPrefix in oContextCache ? oContextCache[sPrefix] : oContextCache[sPrefix] = oContext.lookupNamespaceURI(sPrefix);
			};
		aElements	= this.data.querySelectorAll(this.getAttribute("select"), fResolver);
		for (nIndex = 0; nIndex < aElements.length; nIndex++)
			this.parentNode.insertBefore(
				cAMLElement_repeater._processNode(
					this.firstChild.cloneNode(true),
					aElements[nIndex],
					fResolver),
				this).dataIndex	= nIndex + 1;
	}
};

cAMLElement_repeater._regexp	= /(\{([^\}]+)\})/g;

cAMLElement_repeater._processNode	= function(oElement, oData, fResolver)
{
	var oNode, sName;
	for (var nIndex = 0; nIndex < oElement.childNodes.length; nIndex++)
	{
		oNode	= oElement.childNodes[nIndex];
		switch (oNode.nodeType)
		{
			case AMLNode.ELEMENT_NODE:
				for (sName in oNode.attributes)
					if (oNode.attributes.hasOwnProperty(sName) && oNode.attributes[sName].match(cAMLElement_repeater._regexp))
						oNode.attributes[sName]	= oNode.attributes[sName].replace(RegExp.$1, cAMLElement_repeater._resolveValue(RegExp.$2, oData, fResolver));
				cAMLElement_repeater._processNode(oNode, oData, fResolver);
				break;

			case AMLNode.TEXT_NODE:
			case AMLNode.CDATA_SECTION:
				if (oNode.data.match(cAMLElement_repeater._regexp))
				{
					oNode.data	= oNode.data.replace(RegExp.$1, cAMLElement_repeater._resolveValue(RegExp.$2, oData, fResolver));
					oNode.nodeValue	= oNode.data;
					oNode.length= oNode.data.length;
				}
		}
	}
	return oElement;
};

cAMLElement_repeater._resolveValue	= function(sQuery, oData, fResolver)
{
	var oElement	= oData.querySelector(sQuery, fResolver);
	return oElement && oElement.firstChild ? oElement.firstChild.data : '';
};

// Register Element
ample.extend(cAMLElement_repeater);
