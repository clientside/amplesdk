/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_broadcaster	= function(){};
cXULElement_broadcaster.prototype	= new cXULElement("broadcaster");
cXULElement_broadcaster.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Class Handlers
cXULElement_broadcaster.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			// Skip attributes "id" and "persist" that should be not possible to set
			if (oEvent.attrName != "id" && oEvent.attrName != "persist") {
				var sId	= this.getAttribute("id");
				if (sId) {
					var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
					for (var nIndex = 0, oElement, sAttribute; oElement = aElements[nIndex]; nIndex++) {
						if (oElement.localName == "observes") {
							sAttribute	= oElement.getAttribute("attribute");
							if ((oElement.getAttribute("element") == sId) && (!sAttribute || sAttribute == "*" || sAttribute == oEvent.attrName)) {
								if (oEvent.newValue == null)
									oElement.parentNode.removeAttribute(oEvent.attrName);
								else
									oElement.parentNode.setAttribute(oEvent.attrName, oEvent.newValue);
								// Dispatch broadcast event
								oElement.doBroadcast();
							}
						}
						else {
							if (oElement.getAttribute("observes") == sId) {
								if (oEvent.newValue == null)
									oElement.removeAttribute(oEvent.attrName);
								else
									oElement.setAttribute(oEvent.attrName, oEvent.newValue);
							}
						}
					}
				}
			}
		}
	}
};

// Register Element
ample.extend(cXULElement_broadcaster);
