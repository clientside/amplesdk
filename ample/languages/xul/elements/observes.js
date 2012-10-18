/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_observes	= function(){};
cXULElement_observes.prototype	= new cXULElement("observes");
cXULElement_observes.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;


// Class Event Handlers
cXULElement_observes.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			// Skip attributes "id" and "persist" that should be not possible to set
			if (oEvent.attrName != "id" && oEvent.attrName != "persist") {
				if (this.attributes["id"]) {
					var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
					for (var nIndex = 0, oElement; oElement = aElements[nIndex]; nIndex++)
						if (oElement.attributes["element"] == this.attributes["id"]) {
							if (oEvent.newValue == null)
								oElement.parentNode.removeAttribute(oEvent.attrName);
							else
								oElement.parentNode.setAttribute(oEvent.attrName, oEvent.newValue);
						}
				}
			}
		}
	}
};

// Register Element
ample.extend(cXULElement_observes);
