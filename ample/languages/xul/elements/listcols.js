/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listcols	= function() {
	// Collections
	this.items	= new ample.classes.NodeList;
};
cXULElement_listcols.prototype	= new cXULElement("listcols");

// Class event handler
cXULElement_listcols.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_listcol)
				this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_listcol)
				this.items.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_listcols.prototype.$getTagOpen	= function() {
	return '<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-listcols' + (this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">\
				<tbody>\
					<tr>';
};

// Element Render: close
cXULElement_listcols.prototype.$getTagClose	= function() {
	return			'</tr>\
				</tbody>\
			</table>';
};

// Register Element
ample.extend(cXULElement_listcols);
