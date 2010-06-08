/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_command	= function(){};
cXULElement_command.prototype    = new cXULElement;
cXULElement_command.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

// Class Event Handlers
cXULElement_command.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			// Skip attributes "id" and "persist" that should be not possible to set
			if (oEvent.attrName != "id" && oEvent.attrName != "persist") {
				if (this.attributes["id"]) {
					var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
					for (var nIndex = 0; nIndex < aElements.length; nIndex++)
						if (aElements[nIndex].attributes["command"] == this.attributes["id"]) {
				        	if (oEvent.newValue == null)
				        		aElements[nIndex].removeAttribute(oEvent.attrName);
				        	else
				        		aElements[nIndex].setAttribute(oEvent.attrName, oEvent.newValue);
						}
				}
			}
		}
	}
};

// Register Element with language
oXULNamespace.setElement("command", cXULElement_command);
