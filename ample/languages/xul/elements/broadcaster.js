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
				if (this.attributes["id"]) {
					var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
					for (var nIndex = 0, oElement; oElement = aElements[nIndex]; nIndex++)
						if (oElement.attributes["observes"] == this.attributes["id"]) {
							if (oEvent.newValue == null)
								oElement.removeAttribute(oEvent.attrName);
							else
								oElement.setAttribute(oEvent.attrName, oEvent.newValue);
						}
					var aObservesElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "observes");
					for (var nIndex = 0, oElement; oElement = aElements[nIndex]; nIndex++)
						if (oElement.attributes["element"] == this.attributes["id"]) {
							if (oEvent.newValue == null)
								oElement.parentNode.removeAttribute(oEvent.attrName);
							else
								oElement.parentNode.setAttribute(oEvent.attrName, oEvent.newValue);
							if (oElement.attributes["onbroadcast"])
								oElement.doOnBroadcast();
						}
				}
			}
		}
	}
};

// Register Element
ample.extend(cXULElement_broadcaster);
