/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cQuery.prototype.width	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cObject, true]
	]);
//<-Guard

	if (arguments.length) {
		return fQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			if (oElementDOM)
				fBrowser_setStyle(oElementDOM, "width", sValue +(fIsNaN(sValue) ? '' : 'px'));
		});
	}
	else
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]),
				nPaddingLeft	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingLeft")) || 0,
				nPaddingRight	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingRight")) || 0,
				nBorderLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "borderLeftWidth")) || 0,
				nBorderRight	= fParseInt(fBrowser_getStyle(oElementDOM, "borderRightWidth")) || 0;
			return (oRect.right - oRect.left) - (nPaddingLeft + nPaddingRight) - (nBorderLeft + nBorderRight);
		}
		return 0;
	}
};

cQuery.prototype.height	= function(sValue) {
//->Guard
	fGuard(arguments, [
		["value",	cObject, true]
	]);
//<-Guard

	if (arguments.length) {
		return fQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			if (oElementDOM)
				fBrowser_setStyle(oElementDOM, "height", sValue +(fIsNaN(sValue) ? '' : 'px'));
		});
	}
	else
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]),
				nPaddingTop		= fParseInt(fBrowser_getStyle(oElementDOM, "paddingTop")) || 0,
				nPaddingBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingBottom")) || 0,
				nBorderTop		= fParseInt(fBrowser_getStyle(oElementDOM, "borderTopWidth")) || 0,
				nBorderBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "borderBottomWidth")) || 0;
			return (oRect.bottom - oRect.top) - (nPaddingTop + nPaddingBottom) - (nBorderTop + nBorderBottom);
		}
		return 0;
	}
};

cQuery.prototype.innerWidth	= function() {
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]),
				nBorderLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "borderLeftWidth")) || 0,
				nBorderRight	= fParseInt(fBrowser_getStyle(oElementDOM, "borderRightWidth")) || 0;
			return (oRect.right - oRect.left) - (nBorderLeft + nBorderRight);
		}
	}
	return 0;
};

cQuery.prototype.innerHeight	= function() {
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]),
				nBorderTop		= fParseInt(fBrowser_getStyle(oElementDOM, "borderTopWidth")) || 0,
				nBorderBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "borderBottomWidth")) || 0;
			return (oRect.bottom - oRect.top) - (nBorderTop + nBorderBottom);
		}
	}
	return 0;
};

cQuery.prototype.outerWidth	= function(bMargin) {
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]);
			return (oRect.right - oRect.left) + (bMargin ? (fParseInt(fBrowser_getStyle(oElementDOM, "marginLeft")) || 0) + (fParseInt(fBrowser_getStyle(oElementDOM, "marginRight")) || 0) : 0);
		}
	}
	return 0;
};

cQuery.prototype.outerHeight	= function(bMargin) {
	if (this.length) {
		var oElementDOM	= this[0].$getContainer();
		if (oElementDOM) {
			var oRect	= fElement_getBoundingClientRect(this[0]);
			return (oRect.bottom - oRect.top) + (bMargin ? (fParseInt(fBrowser_getStyle(oElementDOM, "marginTop")) || 0) + (fParseInt(fBrowser_getStyle(oElementDOM, "marginBottom")) || 0) : 0);
		}
	}
	return 0;
};