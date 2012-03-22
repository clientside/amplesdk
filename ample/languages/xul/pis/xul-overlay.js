/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULOverlayPI	= function(){};

cXULOverlayPI.prototype	= new ample.classes.ProcessingInstruction;

cXULOverlayPI.prototype.target	= "xul-overlay";

cXULOverlayPI.handlers	= {
	"DOMNodeInserted":	function() {
		var aHref	= this.data.match(/href=('([^']*)'|"([^"]*)")/);
		if (aHref)
			this.ownerDocument.loadOverlay(aHref[2] || aHref[3]);
	}
};

// Register with Ample SDK
ample.extend(cXULOverlayPI);