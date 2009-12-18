/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_data	= function()
{
	this.customers	= new AMLNodeList;
};
cAMLElement_data.prototype	= new cAMLElement;

// Public properties
cAMLElement_data.prototype.customers	= null;

// Public Methods
cAMLElement_data.prototype.setAttribute	= function(sName, sValue)
{
	switch (sName)
	{
		case "src":
			this.load(sValue, this.getAttribute("async") != "false");
			break;

		case "type":
			throw new AMLException(AMLException.NOT_SUPPORTED_ERR);
	}

	this.AMLElement.setAttribute.call(this, sName, sValue);
};

cAMLElement_data.prototype.load	= function(sUrl, bAsync)
{
	// Clean up content
	if (this.hasChildNodes())
	{
		// Dispatch unload event
		var oEvent	= this.ownerDocument.createEvent("Events");
		oEvent.initEvent("unload", false, false);
		this.dispatchEvent(oEvent);

		// Clear document
		while (this.firstChild)
			this.removeChild(this.firstChild);
	}

	var oRequest	= new window.XMLHttpRequest;
	var oElement	= this;
	function fOnLoad()
	{
		if (oRequest.responseXML && oRequest.responseXML.documentElement && oRequest.responseXML.documentElement.localName != "parsererror")
		{
			// process response
			oElement.appendChild(oElement.ownerDocument.importNode(oRequest.responseXML.documentElement, true));

			// Dispatch load event
			var oEvent	= oElement.ownerDocument.createEvent("Events");
			oEvent.initEvent("load", false, false);
			oElement.dispatchEvent(oEvent);
		}
		else
		{
			// Dispatch error event
			var oEvent	= oElement.ownerDocument.createEvent("Events");
			oEvent.initEvent("error", true, false);
			oElement.dispatchEvent(oEvent);
		}
	};

	// Make request for the new content
	oRequest.open("GET", sUrl, bAsync);
	if (bAsync) {
		oRequest.onreadystatechange	= function() {
			if (oRequest.readyState == 4) {
				//
				fOnLoad();
				// Remove memory leak in IE
				oRequest.onreadystatechange	= new window.Function;
			}
		};
	}
	oRequest.send(null);
	if (!bAsync)
		fOnLoad();
};

cAMLElement_data.prototype.register	= function(oElement)
{
	this.customers.$add(oElement);
};

cAMLElement_data.prototype.unregister	= function(oElement)
{
	this.customers.$remove(oElement);
};

cAMLElement_data.prototype.notify	= function()
{
	for (var nIndex = 0; nIndex < this.customers.length; nIndex++)
		this.customers[nIndex].refresh();
};

// Class Event Handlers
cAMLElement_data.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.getAttribute("src"))
			this.load(this.getAttribute("src"), this.getAttribute("async") != "false");
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		// TODO: unregister customers
		for (var nIndex = 0; nIndex < this.customers.length; nIndex++)
			this.customers[nIndex].unbind();
	},
	// These listeners will notify data observers on data changes
	"DOMNodeInserted":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	},
	"DOMCharacterDataModified":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	},
	"DOMAttrModified":	function(oEvent) {
		if (this.getAttribute("type") == "application/xml")
			this.notify(oEvent.target);
	}
};
cAMLElement_data.prototype.$getTag	= function()
{
	return "";
};

// Register Element with language
oAMLNamespace.setElement("data", cAMLElement_data);
