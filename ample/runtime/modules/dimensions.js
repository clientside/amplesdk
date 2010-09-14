/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cAMLQuery.prototype.width	= function(sValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	if (arguments.length) {
		fAMLQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			fBrowser_setStyle(oElementDOM, "width", sValue +(fIsNaN(sValue) ? '' : 'px'));
		});
		return this;
	}
	else
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
		nPaddingLeft	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingLeft")) || 0,
		nPaddingRight	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingRight")) || 0,
		nBorderLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "borderLeftWidth")) || 0,
		nBorderRight	= fParseInt(fBrowser_getStyle(oElementDOM, "borderRightWidth")) || 0;
		return (oRect.right - oRect.left) - (nPaddingLeft + nPaddingRight) - (nBorderLeft + nBorderRight);
	}
};

cAMLQuery.prototype.height	= function(sValue) {
	// Validate API call
	fGuard(arguments, [
		["value",	cObject, true]
	]);

	if (arguments.length) {
		fAMLQuery_each(this, function() {
			var oElementDOM	= this.$getContainer();
			fBrowser_setStyle(oElementDOM, "height", sValue +(fIsNaN(sValue) ? '' : 'px'));
		});
		return this;
	}
	else
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nPaddingTop		= fParseInt(fBrowser_getStyle(oElementDOM, "paddingTop")) || 0,
			nPaddingBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingBottom")) || 0,
			nBorderTop		= fParseInt(fBrowser_getStyle(oElementDOM, "borderTopWidth")) || 0,
			nBorderBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "borderBottomWidth")) || 0;
		return (oRect.bottom - oRect.top) - (nPaddingTop + nPaddingBottom) - (nBorderTop + nBorderBottom);
	}
};

cAMLQuery.prototype.innerWidth	= function() {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nBorderLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "borderLeftWidth")) || 0,
			nBorderRight	= fParseInt(fBrowser_getStyle(oElementDOM, "borderRightWidth")) || 0;
		return (oRect.right - oRect.left) - (nBorderLeft + nBorderRight);
	}
	return 0;
};

cAMLQuery.prototype.innerHeight	= function() {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nBorderTop		= fParseInt(fBrowser_getStyle(oElementDOM, "borderTopWidth")) || 0,
			nBorderBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "borderBottomWidth")) || 0;
		return (oRect.bottom - oRect.top) - (nBorderTop + nBorderBottom);
	}
	return 0;
};

cAMLQuery.prototype.outerWidth	= function(bMargin) {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nMarginLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "marginLeft")) || 0,
			nMarginRight	= fParseInt(fBrowser_getStyle(oElementDOM, "marginRight")) || 0;
		return (oRect.right - oRect.left) + (bMargin ? nMarginLeft + nMarginRight : 0);
	}
	return 0;
};

cAMLQuery.prototype.outerHeight	= function(bMargin) {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nMarginTop		= fParseInt(fBrowser_getStyle(oElementDOM, "marginTop")) || 0,
			nMarginBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "marginBottom")) || 0;
		return (oRect.bottom - oRect.top) + (bMargin ? nMarginTop + nMarginBottom : 0);
	}
	return 0;
};