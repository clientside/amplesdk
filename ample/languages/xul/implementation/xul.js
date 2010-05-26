/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULNamespace	= new AMLNamespace;

// Register language
ample.domConfig.setNamespace("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", oXULNamespace);

// XUL load handler
ample.addEventListener("load",		function(oEvent) {
	for (var nIndex = 0, aElements = oEvent.target.getElementsByTagNameNS(oXULNamespace.namespaceURI, "*"), oElement; oElement = aElements[nIndex]; nIndex++) {
   		// refresh boxed elements
   		if (oElement.viewType == cXULElement.VIEW_TYPE_BOXED)
			oElement.refresh();

		switch (oElement.localName) {
			case "broadcaster":	// broadcast
			case "command":		// resend commands
				for (var sName in oElement.attributes)
					if (oElement.attributes.hasOwnProperty(sName))
						oElement.setAttribute(sName, oElement.attributes[sName]);
				break;
		}
	}
}, false);

// XUL command handler
ample.addEventListener("command",	function(oEvent) {
//	var oElement	= this.getElementById(oEvent.target.getAttribute("command"));
//	if (oElement)
//		oElement.$handleEvent(oEvent);
},	false);

//

