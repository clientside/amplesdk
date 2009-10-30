/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_broadcaster	= function(){};
cXULElement_broadcaster.prototype    = new cXULElement;
cXULElement_broadcaster.prototype.viewType   = cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods
cXULElement_broadcaster.prototype.setAttribute   = function(sName, sValue)
{
    // Skip attributes "id" and "persist" that should be not possible to set
    if (sName != "id" && sName != "persist")
    {
    	var aElements	= this.ownerDocument.getElementsByAttribute("observes", this.getAttribute("id"));
        for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
        	aElements[nIndex].setAttribute(sName, sValue);
        this.AMLElement.setAttribute.call(this, sName, sValue);
    }
};

// Register Element with language
oXULNamespace.setElement("broadcaster", cXULElement_broadcaster);
