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
//->Guard
	fGuard(arguments, [
		["offset",	cObject, true]
	]);
//<-Guard

	if (arguments.length) {
		return this;
	}
	else
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var sPosition	= fBrowser_getStyle(oElementDOM, "position"),
				oRect		= fAMLElement_getBoundingClientRect(this[0]),
				oPosition	= {};

			oPosition.left	= oRect.left;
			oPosition.top	= oRect.top;

			if (sPosition == "relative" || sPosition == "absolute") {
				oOffsetDOM	= oElementDOM.offsetParent;
				if (oElementDOM != oOffsetDOM) {
					var oOffsetParent	= fAmple_instance(oAmple_document, oOffsetDOM);
					if (oOffsetParent) {
						var oOffsetRect	= fAMLElement_getBoundingClientRect(oOffsetParent);
						oPosition.left	-= oOffsetRect.left;
						oPosition.top	-= oOffsetRect.top;
					}
				}
			}
			return oPosition;
		}
	}
	return null;
};

cAMLQuery.prototype.offsetParent	= function() {
	var oQuery	= new cAMLQuery;
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		oQuery[oQuery.length++]	=(oElementDOM ? fAmple_instance(oAmple_document, oElementDOM.offsetParent) : null) || oAmple_root;
	}
	return oQuery;
};

cAMLQuery.prototype.position	= function() {
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fAMLElement_getBoundingClientRect(this[0]),
				oPosition	= {};
			oPosition.left	= oRect.left;
			oPosition.top	= oRect.top;
			return oRect;
		}
	}
	return null;
};

cAMLQuery.prototype.scrollTop	= function(nValue) {
//->Guard
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
//<-Guard

	// TODO: Implementation missing
};

cAMLQuery.prototype.scrollLeft	= function(nValue) {
//->Guard
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
//<-Guard

	// TODO: Implementation missing
};