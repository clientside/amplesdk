/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_script	= function(){};
cXHTMLElement_script.prototype	= new cXHTMLElement("script");

// Class Events Handlers
cXHTMLElement_script.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		var sType	=(this.getAttribute("type") || '').match(/(\w+)\/([-\w]+\+)?(?:x\-)?([-\w]+)?;?(.+)?/) ? RegExp.$3 : '';
		if (this.getAttribute("src"))
			this.$getContainer().src	= this.getAttribute("src");
		else
		if (this.firstChild &&(sType == "" || sType == "javascript" || sType == "ecmascript")) {
			var oElement	= document.body.appendChild(document.createElement("script"));
			oElement.type	= "text/javascript";
			oElement.text	= this.firstChild.nodeValue;
		}
	}
};

// Register Element
ample.extend(cXHTMLElement_script);
