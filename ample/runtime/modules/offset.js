/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cAMLQuery.prototype.offset	= function(oOffset) {
	// Validate API call
	fGuard(arguments, [
		["offset",	cObject, true]
	]);

	if (arguments.length) {
		//
		return this;
	}
	else
	if (this.length) {
		var oElementDOM	= this[0].$getContainer(),
			sPosition	= fBrowser_getStyle(oElementDOM, "position"),
			oRect		= fAMLElement_getBoundingClientRect(this[0]),
			oPosition	= {};

		oPosition.left	= oRect.left;
		oPosition.top	= oRect.top;

		if (sPosition == "relative" || sPosition == "absolute") {
			oOffsetDOM	= oElementDOM.offsetParent;
			if (oElementDOM != oOffsetDOM) {
				var oOffsetParent	= fAmple_instance(oAmple_document, oOffsetDOM);
				if (oOffsetParent) {
					var oOffsetRect		= fAMLElement_getBoundingClientRect(oOffsetParent);
					oPosition.left	-= oOffsetRect.left;
					oPosition.top	-= oOffsetRect.top;
				}
			}
		}
		return oPosition;
	}
	else
		return null;
};

cAMLQuery.prototype.offsetParent	= function() {
	var oQuery	= new cAMLQuery;
	if (this.length) {
		var oElementDOM	= fAMLElement_getBoundingClientRect(this[0]);
		oQuery[oQuery.length++]	= fAmple_instance(oAmple_document, oElementDOM.offsetParent) || oAmple_root;
	}
	return oQuery;
};

cAMLQuery.prototype.position	= function() {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oPosition	= {};
		oPosition.left	= oRect.left;
		oPosition.top	= oRect.top;
		return oRect;
	}
	else
		return null;
};

cAMLQuery.prototype.scrollTop	= function(nValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
};

cAMLQuery.prototype.scrollLeft	= function(nValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
};