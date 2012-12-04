/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXmlStylesheetPI	= function(){};
cXmlStylesheetPI.prototype	= new cProcessingInstruction;

cXmlStylesheetPI.prototype.nodeName	=
cXmlStylesheetPI.prototype.target	= "xml-stylesheet";

cXmlStylesheetPI.handlers	= {};
cXmlStylesheetPI.handlers["DOMNodeInserted"]	= function(oEvent) {
	var aMatch,
		sHref,
		sType;
	if (aMatch = this.target.match(/href=["']([^"']+)["']/)) {
		sHref	= aMatch[1];
		if (aMatch = this.target.match(/type=["']([^"']+)["']/)) {
			sType	= aMatch[1];
			if (sType == "text/css" || sType == "text/ample+css") {
				var sCSS	= fBrowser_load(sHref, "text/css").responseText;
				if (sCSS)
					oBrowser_head.appendChild(fBrowser_createStyleSheet(sCSS, sHref));
			}
		}
	}
};

// Register Processing Instruction
fAmple_extend(cXmlStylesheetPI);