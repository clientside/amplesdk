/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_tfoot	= function() {
	this.rows	= new ample.classes.NodeList;
};
cXHTMLElement_tfoot.prototype	= new cXHTMLElement("tfoot");

// Public Properties
cXHTMLElement_tfoot.prototype.rows	= null;

// Public Methods
cXHTMLElement_tfoot.prototype.insertRow	= function(nIndex) {
	var oElement	= this.ownerDocument.createElementNS(this.namespaceURI, "tr");
	return nIndex ==-1 ? this.appendChild(oElement) : this.insertBefore(oElement, this.rows[nIndex]);
};

cXHTMLElement_tfoot.prototype.deleteRow	= function(nIndex) {
	return this.removeChild(this.rows[nIndex]);
};

// Class events handlers
cXHTMLElement_tfoot.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_tr)
				this.rows.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXHTMLElement_tr)
				this.rows.$remove(oEvent.target);
	}
};

// Register Element
ample.extend(cXHTMLElement_tfoot);
