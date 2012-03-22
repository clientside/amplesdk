/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLElement_data	= function() {
	this.customers	= new cNodeList;
};
cAMLElement_data.prototype	= new cAMLElement("data");

// Public properties
cAMLElement_data.prototype.customers	= null;

// Public Methods
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
		fNodeLoader_load(this, this.attributes["src"]);
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
				fNodeLoader_load(this, oEvent.newValue);
				break;

			case "type":
				throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
		}
	else
	if (this.attributes["type"] == "application/xml")
		this.notify(oEvent.target);
};

// Register Element
fAmple_extend(cAMLElement_data);
