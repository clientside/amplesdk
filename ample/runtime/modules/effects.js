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
//->Guard
	fGuard(arguments, [
		["properties",	cObject],
		["duration",	cObject, true],
		["easing",		cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var sPseudo	= arguments[4];
	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_play(this, oProperties, vDuration, sEasing, fCallback, sPseudo);
	});

	return this;
};

cAMLQuery.prototype.stop	= function() {
	// Invoke implementation
	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_stop(this);
	});

	return this;
};

cAMLQuery.prototype.delay	= function(vDuration) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject]
	]);
//<-Guard

	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_delay(this, vDuration);
	});

	return this;
};


// Pre-defined animations
cAMLQuery.prototype.fadeIn	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= 1;
	fAMLQuery_each(this, function() {
		fBrowser_setStyle(this.$getContainer(), "display", "");
		fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", fCallback);
	});

	return this;
};

cAMLQuery.prototype.fadeOut	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

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
//->Guard
	fGuard(arguments, [
		["duration",	cObject],
		["opacity",		cNumber],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= nOpacity;
	fAMLQuery_each(this, function() {
		fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", fCallback);
	});

	return this;
};

cAMLQuery.prototype.show	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
   		["duration",	cObject, true],
   		["callback",	cFunction, true]
   	]);
//<-Guard

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
				//
				oStyle.width	= 0;
				oStyle.height	= 0;
				oStyle.overflow	= "hidden";
				fBrowser_setStyle(oElementDOM, "opacity", '0');
				fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
					// Restore values
					oStyle.width	= '';
					oStyle.height	= '';
					oStyle.overflow	= '';
					fBrowser_setStyle(oElementDOM, "opacity", '');
					// Call callback
					if (fCallback)
						fCallback.call(this);
				});
			}
		}
	});

	return this;
};

cAMLQuery.prototype.hide	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
   		["duration",	cObject, true],
   		["callback",	cFunction, true]
   	]);
//<-Guard

	fAMLQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display != "none") {
			if (vDuration) {
				var oProperties	= {};
				oProperties.width	= '0px';
				oProperties.height	= '0px';
				oProperties.opacity	= '0';
				//
				oStyle.overflow	= "hidden";
				fBrowser_setStyle(oElementDOM, "opacity", '1');
				fAMLNodeAnimation_play(this, oProperties, vDuration, "ease", function() {
					oStyle.display	= "none";
					// Restore values
					oStyle.width	= '';
					oStyle.height	= '';
					oStyle.overflow	= '';
					fBrowser_setStyle(oElementDOM, "opacity", '');
					// Call callback
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

cAMLQuery.prototype.slideDown	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	fAMLQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display == "none") {
			oStyle.display	= '';
			var oProperties	= {},
				oComputedStyle	= fBrowser_getComputedStyle(oElementDOM);
			oProperties.height	= fBrowser_adjustStyleValue(oElementDOM, "height", fBrowser_getStyle(oElementDOM, "height", oComputedStyle));
			oProperties.opacity	= '1';
			//
			oStyle.height	= 0;
			oStyle.overflow	= "hidden";
			fBrowser_setStyle(oElementDOM, "opacity", '0');
			fAMLNodeAnimation_play(this, oProperties, vDuration || "normal", "ease", function() {
				// Restore values
				oStyle.height	= '';
				oStyle.overflow	= '';
				fBrowser_setStyle(oElementDOM, "opacity", '');
				// Call callback
				if (fCallback)
					fCallback.call(this);
			});
		}
	});

	return this;
};

cAMLQuery.prototype.slideUp		= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	fAMLQuery_each(this, function() {
		var oElementDOM	= this.$getContainer(),
			oStyle	= oElementDOM.style;
		if (oStyle.display != "none") {
			var oProperties	= {};
			oProperties.height	= '0px';
			oProperties.opacity	= '0';
			//
			oStyle.overflow	= "hidden";
			fBrowser_setStyle(oElementDOM, "opacity", '1');
			fAMLNodeAnimation_play(this, oProperties, vDuration || "normal", "ease", function() {
				oStyle.display	= "none";
				// Restore values
				oStyle.height	= '';
				oStyle.overflow	= '';
				fBrowser_setStyle(oElementDOM, "opacity", '');
				// Call callback
				if (fCallback)
					fCallback.call(this);
			});
		}
	});

	return this;
};

// Extend ample object
oAmple.easing	= oAMLNodeAnimation_easing;
