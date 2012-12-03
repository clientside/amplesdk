/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_command	= function(){};
cXULElement_command.prototype	= new cXULElement("command");
cXULElement_command.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Class Event Handlers
cXULElement_command.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			// Skip attributes "id" and "persist" that should be not possible to set
			if (oEvent.attrName != "id" && oEvent.attrName != "persist") {
				var sId	= this.getAttribute("id");
				if (sId) {
					var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
					for (var nIndex = 0, oElement; oElement = aElements[nIndex]; nIndex++)
						if (oElement.getAttribute("command") == sId) {
							if (oEvent.newValue == null)
								oElement.removeAttribute(oEvent.attrName);
							else
								oElement.setAttribute(oEvent.attrName, oEvent.newValue);
						}
				}
			}
		}
	}
};

// Register Element
ample.extend(cXULElement_command);
