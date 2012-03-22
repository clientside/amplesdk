/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cQuery.prototype.offset	= function(oOffset) {
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
				oRect		= fElement_getBoundingClientRect(this[0]),
				oPosition	= {};

			oPosition.left	= oRect.left;
			oPosition.top	= oRect.top;

			if (sPosition == "relative" || sPosition == "absolute") {
				oOffsetDOM	= oElementDOM.offsetParent;
				if (oElementDOM != oOffsetDOM) {
					var oOffsetParent	= fAmple_instance(oAmple_document, oOffsetDOM);
					if (oOffsetParent) {
						var oOffsetRect	= fElement_getBoundingClientRect(oOffsetParent);
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

cQuery.prototype.offsetParent	= function() {
	var oQuery	= new cQuery;
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		oQuery[oQuery.length++]	=(oElementDOM ? fAmple_instance(oAmple_document, oElementDOM.offsetParent) : null) || oAmple_root;
	}
	return oQuery;
};

cQuery.prototype.position	= function() {
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]),
				oPosition	= {};
			oPosition.left	= oRect.left;
			oPosition.top	= oRect.top;
			return oRect;
		}
	}
	return null;
};

cQuery.prototype.scrollTop	= function(nValue) {
//->Guard
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
//<-Guard

	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			if (arguments.length)
				oElementDOM.scrollTop	= nValue;
			else
				return oElementDOM.scrollTop;
		}
	}

	return null;
};

cQuery.prototype.scrollLeft	= function(nValue) {
//->Guard
	fGuard(arguments, [
		["value",	cNumber, true]
	]);
//<-Guard

	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			if (arguments.length)
				oElementDOM.scrollLeft	= nValue;
			else
				return oElementDOM.scrollLeft;
		}
	}

	return null;
};