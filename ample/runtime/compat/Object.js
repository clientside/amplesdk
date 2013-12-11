/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2013 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var bObject_hasDontEnumBug = !({toString: null}).propertyIsEnumerable("toString"),
	aObject_dontEnums = [
		"toString",
		"toLocaleString",
		"valueOf",
		"hasOwnProperty",
		"isPrototypeOf",
		"propertyIsEnumerable",
		"constructor"
	];

// ECMA Script 5
if (!cObject.keys)
	fExporter_export(function(oObject) {
		if (typeof oObject !== "object" && (typeof oObject !== "function" || oObject === null))
			throw new cTypeError('Object.' + "keys" + ' called on non-object');

		var aValue = [];
		for (var sKey in oObject)
			if (cObject.prototype.hasOwnProperty.call(oObject, sKey))
				aValue.push(sKey);

		if (bObject_hasDontEnumBug)
			for (var nIndex = 0, nLength = aObject_dontEnums.length; nIndex < nLength; nIndex++)
				if (cObject.prototype.hasOwnProperty.call(oObject, aObject_dontEnums[nIndex]))
					aValue.push(aObject_dontEnums[nIndex]);

		return aValue;
	}, "keys", cObject);
