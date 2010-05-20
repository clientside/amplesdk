/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_broadcaster	= function(){};
cXULElement_broadcaster.prototype    = new cXULElement;
cXULElement_broadcaster.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

// Class Handlers
cXULElement_broadcaster.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
		    // Skip attributes "id" and "persist" that should be not possible to set
		    if (oEvent.attrName != "id" && oEvent.attrName != "persist") {
		    	var aElements	= this.ownerDocument.querySelector("[observes='" + this.attributes["id"] + "']");
		        for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
		        	aElements[nIndex].setAttribute(oEvent.attrName, oEvent.newName);
		    }
		}
	}
};

// Register Element with language
oXULNamespace.setElement("broadcaster", cXULElement_broadcaster);
