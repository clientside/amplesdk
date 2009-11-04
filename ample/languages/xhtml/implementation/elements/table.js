/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXHTMLElement_table	= function() {
	this.tHead		= null;
	this.tBodies	= new AMLNodeList;
	this.tFoot		= null;

	this.caption	= null;

	this.rows	= new AMLNodeList;
};
cXHTMLElement_table.prototype	= new cXHTMLElement;

// Public Properties
cXHTMLElement_table.prototype.tHead	= null;
cXHTMLElement_table.prototype.tBodies	= null;
cXHTMLElement_table.prototype.tFoot	= null;
cXHTMLElement_table.prototype.caption	= null;
cXHTMLElement_table.prototype.rows	= null;

// Public Methods
cXHTMLElement_table.prototype.insertRow	= function(nIndex) {
	var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, "tr");
	return nIndex ==-1 ? this.appendChild(oElement) : this.insertBefore(oElement, this.rows[nIndex]);
};

cXHTMLElement_table.prototype.deleteRow	= function(nIndex) {
	return this.removeChild(this.rows[nIndex]);
};

cXHTMLElement_table.prototype.createCaption	= function() {

};

cXHTMLElement_table.prototype.deleteCaption	= function() {

};

cXHTMLElement_table.prototype.createTHead	= function() {

};

cXHTMLElement_table.prototype.deleteTHead	= function() {

};

cXHTMLElement_table.prototype.createTFoot	= function() {

};

cXHTMLElement_table.prototype.deleteTFoot	= function() {

};

// Class events handlers
cXHTMLElement_table.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_caption)
				this.caption	= oEvent.target;
			else
			if (oEvent.target instanceof cXHTMLElement_tbody)
				this.tBodies.$add(oEvent.target);
			else
			if (oEvent.target instanceof cXHTMLElement_tfoot)
				this.tFoot	= oEvent.target;
			else
			if (oEvent.target instanceof cXHTMLElement_thead)
				this.tHead	= oEvent.target;
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_caption)
				this.caption	= null;
			else
			if (oEvent.target instanceof cXHTMLElement_tbody)
				this.tBodies.$remove(oEvent.target);
			else
			if (oEvent.target instanceof cXHTMLElement_tfoot)
				this.tFoot	= nullt;
			else
			if (oEvent.target instanceof cXHTMLElement_thead)
				this.tHead	= null;
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this)
			cXHTMLElement.mapAttribute(this, oEvent.attrName, oEvent.newValue);
	}
};

// Register Element with language
oXHTMLNamespace.setElement("table", cXHTMLElement_table);
