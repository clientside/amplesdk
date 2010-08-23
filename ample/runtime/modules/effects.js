/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//
cAMLQuery.prototype.animate	= function(oProperties, vDuration, sEasing, fCallback) {
	// Validate API call
	fGuard(arguments, [
		["properties",	cObject, true],
		["duration",	cObject, true],
		["easing",		cString, true],
		["callback",	cFunction, true]
	]);

	var sPseudo	= arguments[4];
	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_play(this, oProperties, vDuration, sEasing, fCallback, sPseudo);
	});

	// Invoke implementation
	return this;
};

cAMLQuery.prototype.stop	= function() {
	// TODO

	return this;
};

cAMLQuery.prototype.fadeIn	= function(vDuration, fCallback) {
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
	var oProperties	= {};
	oProperties.opacity	= 1;
	fAMLQuery_each(this, function() {
		fBrowser_setStyle(this.$getContainer(), "display", "");
		fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", fCallback);
	});

	return this;
};

cAMLQuery.prototype.fadeOut	= function(vDuration, fCallback) {
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
	var oProperties	= {};
	oProperties.opacity	= 0;
	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
			this.$getContainer().style.display	= "none";
			if (fCallback)
				fCallback.call(this);
		});
	});

	return this;
};

cAMLQuery.prototype.fadeTo	= function(vDuration, nOpacity, fCallback) {
	fGuard(arguments, [
		["duration",	cObject],
		["opacity",		cNumber],
		["callback",	cFunction, true]
	]);
	var oProperties	= {};
	oProperties.opacity	= nOpacity;
	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", fCallback);
	});

	return this;
};

cAMLQuery.prototype.show	= function(vDuration, fCallback) {
	fGuard(arguments, [
   		["duration",	cObject, true],
   		["callback",	cFunction, true]
   	]);

	fAMLQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display == "none") {
			oStyle.display	= '';
			if (vDuration) {
				var oProperties	= {},
					oComputedStyle	= fBrowser_getComputedStyle(oElementDOM);
				oProperties.width	= fBrowser_adjustStyleValue(oElementDOM, "width", fBrowser_getStyle(oElementDOM, "width", oComputedStyle));
				oProperties.height	= fBrowser_adjustStyleValue(oElementDOM, "height", fBrowser_getStyle(oElementDOM, "height", oComputedStyle));
				oProperties.opacity	= '1';
				oStyle.width	= '0px';
				oStyle.height	= '0px';
				fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
					oStyle.width	= '';
					oStyle.height	= '';
					if (fCallback)
						fCallback.call(this);
				});
			}
		}
	});

	return this;
};

cAMLQuery.prototype.hide	= function(vDuration, fCallback) {
	fGuard(arguments, [
   		["duration",	cObject, true],
   		["callback",	cFunction, true]
   	]);

	fAMLQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display != "none") {
			if (vDuration) {
				var oProperties	= {};
				oProperties.width	= '0px';
				oProperties.height	= '0px';
				oProperties.opacity	= '0';
				fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
					oStyle.display	= "none";
					oStyle.width	= '';
					oStyle.height	= '';
					if (fCallback)
						fCallback.call(this);
				});
			}
			else
				oStyle.display	= "none";
		}
	});

	return this;
};
