/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var rQuery_effects_display	= /display\s*:\s*(\w+)\s*(;?)/;

function fQuery_effects_show(oQuery, fCallback) {
	fQuery_each(oQuery, function() {
		var oElementDOM	= this.$getContainer(),
//			sValue	= fElement_getAttribute(this, "style"),
//			aMatch,
			oStyle;

		// Update model
		// FIXME: Implement @style attribute updates
//		if (sValue && (aMatch = sValue.match(rQuery_effects_display)) && aMatch[1] == "none")
//			fElement_setAttribute(this, "style", sValue.replace(rQuery_effects_display, '$2'));

		// Update view, if available
		if (oElementDOM && (oStyle = oElementDOM.style))
			if (oStyle.display == "none")
				fCallback(this, oElementDOM, oStyle);
	});
};

function fQuery_effects_hide(oQuery, fCallback) {
	fQuery_each(oQuery, function() {
		var oElementDOM	= this.$getContainer(),
//			sValue	= fElement_getAttribute(this, "style"),
//			aMatch,
			oStyle;

		// Update model
		// FIXME: Implement @style attribute updates
//		if (!sValue)
//			fElement_setAttribute(this, "style", 'display:none');
//		else
//		if ((aMatch = sValue.match(rQuery_effects_display)) && aMatch[1] != "none")
//			fElement_setAttribute(this, "style", sValue.replace(rQuery_effects_display, 'display:none' + '$2'));

		// Update view, if available
		if (oElementDOM && (oStyle = oElementDOM.style))
			if (oStyle.display != "none")
				fCallback(this, oElementDOM, oStyle);
	});
};

//
cQuery.prototype.animate	= function(oProperties, vDuration, sEasing, fCallback) {
//->Guard
	fGuard(arguments, [
		["properties",	cObject],
		["duration",	cObject, true],
		["easing",		cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var sPseudo	= arguments[4];
	return fQuery_each(this, function() {
		fNodeAnimation_play(this, oProperties, vDuration, sEasing, fCallback, sPseudo);
	});
};

cQuery.prototype.stop	= function() {
	// Invoke implementation
	return fQuery_each(this, function() {
		fNodeAnimation_stop(this);
	});
};

cQuery.prototype.delay	= function(vDuration) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject]
	]);
//<-Guard

	return fQuery_each(this, function() {
		fNodeAnimation_delay(this, vDuration);
	});
};


// Pre-defined animations
function fQuery_effects_fadeTo(oQuery, vDuration, nOpacity, fCallback) {
	var oProperties	= {};
		oProperties.opacity	= nOpacity;

	return fQuery_each(oQuery, function() {
		var oElement	= this,
			oElementDOM	= this.$getContainer(),
			oStyle;

		// Update view, if available
		if (oElementDOM && (oStyle = oElementDOM.style)) {
			if (oStyle.display == "none" && nOpacity)
				oStyle.display	= '';

			fNodeAnimation_play(oElement, oProperties, vDuration, "ease", function() {
				if (!nOpacity)
					oStyle.display	= 'none';
				//
				if (fCallback)
					fCallback(oElement);
			});
		}
	});
};

cQuery.prototype.fadeIn	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	return fQuery_effects_fadeTo(this, vDuration, 1, fCallback);
};

cQuery.prototype.fadeOut	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	return fQuery_effects_fadeTo(this, vDuration, 0, fCallback);
};

cQuery.prototype.fadeTo	= function(vDuration, nOpacity, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject],
		["opacity",		cNumber],
		["callback",	cFunction, true]
	]);
//<-Guard

	return fQuery_effects_fadeTo(this, vDuration, nOpacity, fCallback);
};

cQuery.prototype.show	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
			["duration",	cObject, true],
			["callback",	cFunction, true]
		]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= 1;
	//
	fQuery_effects_show(this, function(oElement, oElementDOM, oStyle) {
		oStyle.display	= '';
		if (vDuration) {
			var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM);

			//
			oProperties.width	= fBrowser_adjustStyleValue(oElementDOM, "width", fBrowser_getStyle(oElementDOM, "width", oComputedStyle));
			oProperties.height	= fBrowser_adjustStyleValue(oElementDOM, "height", fBrowser_getStyle(oElementDOM, "height", oComputedStyle));
			//
			oStyle.width	= 0;
			oStyle.height	= 0;
			oStyle.overflow	= "hidden";
			fBrowser_setStyle(oElementDOM, "opacity", '0');
			//
			fNodeAnimation_play(oElement, oProperties, vDuration, "ease", function() {
				// Restore values
				oStyle.width	= '';
				oStyle.height	= '';
				oStyle.overflow	= '';
				fBrowser_setStyle(oElementDOM, "opacity", '');
				// Call callback
				if (fCallback)
					fCallback.call(oElement);
			});
		}
	});

	return this;
};

cQuery.prototype.hide	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
			["duration",	cObject, true],
			["callback",	cFunction, true]
		]);
//<-Guard

	var oProperties	= {};
	oProperties.width	= '0px';
	oProperties.height	= '0px';
	oProperties.opacity	= 0;
	//
	fQuery_effects_hide(this, function(oElement, oElementDOM, oStyle) {
		if (vDuration) {
			//
			oStyle.overflow	= "hidden";
			fBrowser_setStyle(oElementDOM, "opacity", '1');
			//
			fNodeAnimation_play(oElement, oProperties, vDuration, "ease", function() {
				//
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
	});

	return this;
};

cQuery.prototype.slideDown	= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.opacity	= 1;
	//
	fQuery_effects_show(this, function(oElement, oElementDOM, oStyle) {
		oStyle.display	= '';
		//
		var oComputedStyle	= fBrowser_getComputedStyle(oElementDOM);
		//
		oProperties.height	= fBrowser_adjustStyleValue(oElementDOM, "height", fBrowser_getStyle(oElementDOM, "height", oComputedStyle));
		//
		oStyle.height	= 0;
		oStyle.overflow	= "hidden";
		fBrowser_setStyle(oElementDOM, "opacity", '0');
		//
		fNodeAnimation_play(oElement, oProperties, vDuration || "normal", "ease", function() {
			// Restore values
			oStyle.height	= '';
			oStyle.overflow	= '';
			fBrowser_setStyle(oElementDOM, "opacity", '');
			// Call callback
			if (fCallback)
				fCallback.call(oElement);
		});
	});

	return this;
};

cQuery.prototype.slideUp		= function(vDuration, fCallback) {
//->Guard
	fGuard(arguments, [
		["duration",	cObject, true],
		["callback",	cFunction, true]
	]);
//<-Guard

	var oProperties	= {};
	oProperties.height	= '0px';
	oProperties.opacity	= 0;
	//
	fQuery_effects_hide(this, function(oElement, oElementDOM, oStyle) {
		//
		oStyle.overflow	= "hidden";
		fBrowser_setStyle(oElementDOM, "opacity", '1');
		//
		fNodeAnimation_play(oElement, oProperties, vDuration || "normal", "ease", function() {
			oStyle.display	= "none";
			// Restore values
			oStyle.height	= '';
			oStyle.overflow	= '';
			fBrowser_setStyle(oElementDOM, "opacity", '');
			// Call callback
			if (fCallback)
				fCallback.call(oElement);
		});
	});

	return this;
};

// Extend ample object
oAmple.easing	= oNodeAnimation_easing;
