/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLElement_handler	= function(){};
cAMLElement_handler.prototype	= new cAMLElement;

// Class Event Handlers
cAMLElement_handler.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.firstChild)
		{
			if (this.getAttribute("event"))
				this.parentNode.addEventListener(this.getAttribute("event"), new window.Function("event", this.firstChild.nodeValue), this.getAttribute("phase") == "capture");
			else {
				var oElement	= window.document.createElement("script");
				oElement.type	= "text/javascript";
				oElement.text	= this.firstChild.nodeValue;
				window.document.getElementsByTagName("head")[0].appendChild(oElement);
				oElement.parentNode.removeChild(oElement);
			}
		}
	}
};

cAMLElement_handler.prototype.$getTag	= function(){return ''};

// Register Element with language
oAMLNamespace.setElement("handler", cAMLElement_handler);
