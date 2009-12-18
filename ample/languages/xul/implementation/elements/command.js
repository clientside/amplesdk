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

// Public Methods
cXULElement_command.prototype.setAttribute   = function(sName, sValue)
{
    // Skip attributes "id" and "persist" that should be not possible to set
    if (sName != "id" && sName != "persist")
    {
    	var aElements	= this.ownerDocument.getElementsByTagNameNS(this.namespaceURI, "*");
        for (var nIndex = 0; nIndex < aElements.length; nIndex++)
            if (aElements[nIndex].attributes["command"] == this.getAttribute("id"))
                aElements[nIndex].setAttribute(sName, sValue);
        this.AMLElement.setAttribute.call(this, sName, sValue);
    }
};

// Register Element with language
oXULNamespace.setElement("command", cXULElement_command);
