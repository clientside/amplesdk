/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_tr	= function() {
	this.cells	= new ample.classes.NodeList;
};
cXHTMLElement_tr.prototype	= new cXHTMLElement("tr");

// Public Properties
cXHTMLElement_tr.prototype.cells	= null;

// Public Methods
cXHTMLElement_tr.prototype.insertCell	= function(nIndex) {
	var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, "td");
	return nIndex ==-1 ? this.appendChild(oElement) : this.insertBefore(oElement, this.rows[nIndex]);
};

cXHTMLElement_tr.prototype.deleteCell	= function(nIndex) {
	return this.removeChild(this.cells[nIndex]);
};

// Class events handlers
cXHTMLElement_tr.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_td || oEvent.target instanceof cXHTMLElement_th)
				this.cells.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_td || oEvent.target instanceof cXHTMLElement_th)
				this.cells.$remove(oEvent.target);
	}
};

// Register Element
ample.extend(cXHTMLElement_tr);
