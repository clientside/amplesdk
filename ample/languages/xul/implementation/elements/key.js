/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_key	= function(){};
cXULElement_key.prototype	= new cXULElement;
cXULElement_key.prototype.viewType	= cXULElement.VIEW_TYPE_VIRTUAL;

// Public Methods
cXULElement_key.prototype.setAttribute	= function(sName, sValue)
{
    if (sName == "keytext")
    {
    	var aElements	= this.ownerDocument.getElementsByAttribute("key", this.getAttribute("id"));
        for (var nIndex = 0, nLength = aElements.length; nIndex < nLength; nIndex++)
        	if (aElements[nIndex].namespaceURI == this.namespaceURI)
	        	aElements[nIndex].setAttribute("acceltext", sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Static Methods
cXULElement_key._handleKeyDown	= function(oEvent, oElement)
{
	// filter out by modifier
	if (oElement.hasAttribute("modifiers"))
	{
		var aModifiers	= oElement.getAttribute("modifiers").replace(/,/g, " ").split(" ");
		for (var nIndex = 0; nIndex < aModifiers.length; nIndex++)
		{
			switch (aModifiers[nIndex])
			{
				case "shift":	if (!oEvent.shiftKey)	return;	break;
				case "alt":		if (!oEvent.altKey)		return;	break;
				case "meta":	if (!oEvent.metaKey)	return;	break;
				case "control":	if (!oEvent.ctrlKey)	return;	break;
			}
		}
	}

	// filter out by key
	if (oElement.hasAttribute("key"))
		if (oEvent.keyIdentifier != oElement.getAttribute("key"))
			return;

	// filter out by keycode
	// TODO: KeyEvent changed to KeboardEvent, so no keyCode property is available!
	if (oElement.hasAttribute("keycode"))
		if (oElement.getAttribute("keycode") != oEvent.keyCode)
			return;

	// do command if validation did not fail
	oElement.doCommand();
};

// Class Event Handlers
cXULElement_key.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var oElement	= oEvent.target;
		this.ownerDocument.addEventListener("keydown", function(oEvent){cXULElement_key._handleKeyDown(oEvent, oElement)}, false);
	}
};

// Register Element with language
oXULNamespace.setElement("key", cXULElement_key);
