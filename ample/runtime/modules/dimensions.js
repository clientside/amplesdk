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
		var oRect	= fAMLElement_getBoundingClientRect(this[0]);
		return oRect.right - oRect.left;
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
		var oRect	= fAMLElement_getBoundingClientRect(this[0]);
		return oRect.bottom - oRect.top;
	}
};

cAMLQuery.prototype.innerWidth	= function() {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nPaddingLeft	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingLeft")),
			nPaddingRight	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingRight"));
		return (oRect.right - oRect.left) +
				(fIsNaN(nPaddingLeft) ? 0 : nPaddingLeft) +	(fIsNaN(nPaddingRight) ? 0 : nPaddingRight);
	}
	return 0;
};

cAMLQuery.prototype.innerHeight	= function() {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nPaddingTop		= fParseInt(fBrowser_getStyle(oElementDOM, "paddingTop")),
			nPaddingBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingBottom"));
		return (oRect.bottom - oRect.top) +
				(fIsNaN(nPaddingTop) ? 0 : nPaddingTop) + (fIsNaN(nPaddingBottom) ? 0 : nPaddingBottom);
	}
	return 0;
};

cAMLQuery.prototype.outerWidth	= function(bMargin) {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nPaddingLeft	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingLeft")),
			nPaddingRight	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingRight")),
			nMarginLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "marginLeft")),
			nMarginRight	= fParseInt(fBrowser_getStyle(oElementDOM, "marginRight")),
			nBorderLeft		= fParseInt(fBrowser_getStyle(oElementDOM, "borderLeftWidth")),
			nBorderRight	= fParseInt(fBrowser_getStyle(oElementDOM, "borderRightWidth"));
		return (oRect.right - oRect.left) +
				(fIsNaN(nPaddingLeft) ? 0 : nPaddingLeft) + (fIsNaN(nPaddingRight) ? 0 : nPaddingRight) +
				(fIsNaN(nBorderLeft) ? 0 : nBorderLeft) + (fIsNaN(nBorderRight) ? 0 : nBorderRight) +
				(bMargin ? ((fIsNaN(nMarginLeft) ? 0 : nMarginLeft) + (fIsNaN(nMarginRight) ? 0 : nMarginRight)) : 0);
	}
	return 0;
};

cAMLQuery.prototype.outerHeight	= function(bMargin) {
	if (this.length) {
		var oRect	= fAMLElement_getBoundingClientRect(this[0]),
			oElementDOM	= this[0].$getContainer(),
			nPaddingTop		= fParseInt(fBrowser_getStyle(oElementDOM, "paddingTop")),
			nPaddingBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "paddingBottom")),
			nMarginTop		= fParseInt(fBrowser_getStyle(oElementDOM, "marginTop")),
			nMarginBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "marginBottom")),
			nBorderTop		= fParseInt(fBrowser_getStyle(oElementDOM, "borderTopWidth")),
			nBorderBottom	= fParseInt(fBrowser_getStyle(oElementDOM, "borderBottomWidth"));
		return (oRect.bottom - oRect.top) +
				(fIsNaN(nPaddingTop) ? 0 : nPaddingTop) + (fIsNaN(nPaddingBottom) ? 0 : nPaddingBottom) +
				(fIsNaN(nBorderTop) ? 0 : nBorderTop) + (fIsNaN(nBorderBottom) ? 0 : nBorderBottom) +
				(bMargin ? ((fIsNaN(nMarginTop) ? 0 : nMarginTop) + (fIsNaN(nMarginBottom) ? 0 : nMarginBottom)) : 0);
	}
	return 0;
};