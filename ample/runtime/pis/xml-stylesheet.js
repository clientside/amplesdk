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
	if (this.target.match(/href=["']([^"']+)["']/)) {
		var sHref	= cRegExp.$1;
		if (this.target.match(/type=["']([^"']+)["']/))
			if (cRegExp.$1 == "text/css" || cRegExp.$1 == "text/ample+css") {
				var sCSS	= fBrowser_load(sHref, "text/css").responseText;
				if (sCSS)
					oBrowser_head.appendChild(fBrowser_createStyleSheet(sCSS, sHref));
			}
	}
};

// Register Processing Instruction
fAmple_extend(cXmlStylesheetPI);