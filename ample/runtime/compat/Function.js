/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// JavaScript 1.8.5
if (!cFunction.prototype.bind)
	fExporter_export(function(oObject/*[, argument1[, argument2[, ...argument3]]] */) {
//->Guard
		fGuard(arguments, [
			["object",	cObject,	true,	true]
		]);
//<-Guard
		if (typeof this != "function")
			throw new cTypeError("not" + ' ' + "IsCallable");

		var aArguments	= cArray.prototype.slice.call(arguments, 1),
			fFunction	= new cFunction,
			fToBind	= this,
			fBound	= function () {
				return fToBind.apply(this instanceof fFunction ? this : oObject || window, aArguments.concat(cArray.prototype.slice.call(arguments)));
			};
		//
		fFunction.prototype	= this.prototype;
		fBound.prototype	= new fFunction;

		return fBound;
	}, "bind", cFunction.prototype);
