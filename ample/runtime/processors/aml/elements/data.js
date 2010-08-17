/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_data	= function() {
	this.customers	= new cAMLNodeList;
};
cAMLElement_data.prototype	= new cAMLElement_prototype("data");

// Public properties
cAMLElement_data.prototype.customers	= null;

// Public Methods
cAMLElement_data.prototype.load	= function(sUrl, bAsync) {
	// Clean up content
	if (this.firstChild) {
		// Dispatch unload event
		var oEvent	= new cAMLEvent;
		oEvent.initEvent("unload", false, false);
		fAMLNode_dispatchEvent(this, oEvent);

		// Clear document
		while (this.firstChild)
			fAMLElement_removeChild(this, this.firstChild);
	}

	var oRequest	= new cXMLHttpRequest;
	var oElement	= this;
	function fOnLoad() {
		var oDocument	= fBrowser_getResponseDocument(oRequest);
		if (oDocument) {
			// process response
			fAMLElement_appendChild(oElement, fAMLDocument_importNode(oElement.ownerDocument, oRequest.responseXML.documentElement, true));

			// Dispatch load event
			var oEvent	= new cAMLEvent;
			oEvent.initEvent("load", false, false);
			fAMLNode_dispatchEvent(oElement, oEvent);
		}
		else {
			// Dispatch error event
			var oEvent	= new cAMLEvent;
			oEvent.initEvent("error", true, false);
			fAMLNode_dispatchEvent(oElement, oEvent);
		}
	};

	// Make request for the new content
	oRequest.open("GET", sUrl, bAsync);
	if (bAsync)
		oRequest.onreadystatechange	= function() {
			if (oRequest.readyState == 4)
				fOnLoad();
		};
	oRequest.send(null);
	if (!bAsync)
		fOnLoad();
};

cAMLElement_data.prototype.register	= function(oElement) {
	this.customers.$add(oElement);
};

cAMLElement_data.prototype.unregister	= function(oElement) {
	this.customers.$remove(oElement);
};

cAMLElement_data.prototype.notify	= function() {
	for (var nIndex = 0; nIndex < this.customers.length; nIndex++)
		this.customers[nIndex].refresh();
};

// Class Event Handlers
cAMLElement_data.handlers	= {};
cAMLElement_data.handlers["DOMNodeInsertedIntoDocument"]	= function(oEvent) {
	if (this.attributes["src"])
		this.load(this.attributes["src"], this.attributes["async"] != "false");
};
cAMLElement_data.handlers["DOMNodeRemovedFromDocument"]	= function(oEvent) {
	// TODO: unregister customers
	for (var nIndex = 0; nIndex < this.customers.length; nIndex++)
		this.customers[nIndex].unbind();
};
// These listeners will notify data observers on data changes
cAMLElement_data.handlers["DOMNodeInserted"]	= function(oEvent) {
	if (this.attributes["type"] == "application/xml")
		this.notify(oEvent.target);
};
cAMLElement_data.handlers["DOMNodeRemoved"]	= function(oEvent) {
	if (this.attributes["type"] == "application/xml")
		this.notify(oEvent.target);
};
cAMLElement_data.handlers["DOMCharacterDataModified"]	= function(oEvent) {
	if (this.attributes["type"] == "application/xml")
		this.notify(oEvent.target);
};
cAMLElement_data.handlers["DOMAttrModified"]	= function(oEvent) {
	if (oEvent.target == this)
		switch (oEvent.newValue) {
			case "src":
				this.load(sValue, this.attributes["async"] != "false");
				break;

			case "type":
				throw new cAMLException(cAMLException.NOT_SUPPORTED_ERR);
		}
	else
	if (this.attributes["type"] == "application/xml")
		this.notify(oEvent.target);
};

// Register Element
fAmple_extend(cAMLElement_data);
