/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2013 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (!cPromise) {
	cPromise	= function(fCallback) {
//->Guard
		fGuard(arguments, [
			["callback",	cFunction]
		]);
//<-Guard
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};

	function fPromise_resolve() {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};
	cPromise.resolve	= function() {
		return fPromise_resolve.apply(this, arguments);
	};

	function fPromise_reject() {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};
	cPromise.reject	= function() {
		return fPromise_reject.apply(this, arguments);
	};

	function fPromise_cast() {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};
	cPromise.cast	= function() {
		return fPromise_cast.apply(this, arguments);
	};

	function fPromise_all() {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};
	cPromise.all	= function() {
		return fPromise_all.apply(this, arguments);
	};

	function fPromise_race() {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};
	cPromise.race	= function() {
		return fPromise_race.apply(this, arguments);
	};

	/*
	 * then
	 */
	function fPromise_then(oPromise, fFulfill, fReject) {
		throw new cDOMException(cDOMException.NOT_SUPPORTED_ERR);
	};
	cPromise.prototype.then	= function() {
//->Guard
		fGuard(arguments, [
			["fulfill",	cFunction, true],
			["reject",	cFunction, true]
		]);
//<-Guard
		return fPromise_then.apply(this, arguments);
	};

	/*
	 * catch (shorthand for then(undefined, reject))
	 */
	cPromise.prototype['catch']	= function() {
//->Guard
		fGuard(arguments, [
			["reject",	cFunction, true]
		]);
//<-Guard
		return fPromise_then.apply(this, [undefined, arguments[0]]);
	};

	// Export
	fExporter_export(cPromise,	"Promise",	window);
}