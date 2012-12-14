/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

/*
 * Syntaxis:
 * fGuard(arguments, [
 * 		[sArgumentName,	cArgumentType, bOptional, bNullAllowed]
 * ]);
 */
//->Debug
var oGuard_endings	= 'st-nd-rd-th'.split('-'),
	rGuard_function	= /function\s([^\s]+)\(/;
//<-Debug

//->Guard
function fGuard(aArguments, aParameters, oObject) {
	if (!oDOMConfiguration_values["ample-enable-guard"])
		return;

	var fCallee	= aArguments.callee,
		fCaller	= null;
	// Has to be wrapped in try/catch because Firebug throws "Permission denied to get property on Function.caller" in XMLHttpRequest
	try {
		fCaller	= fCallee.caller;
	} catch (oException) {}
//->Debug
	var sFunction	= cString(fCallee).match(rGuard_function) ? cRegExp.$1 : "anonymous";
//<-Debug

	// Check constructor
	if (oObject && fCaller && fCaller != fEval && oObject instanceof fCaller)
		throw new cAmpleException(cAmpleException.CANNOT_ACCESS_DOM_ERR
//->Debug
				, fCaller
//<-Debug
		);

	// Iterate over parameters list
	for (var nIndex = 0, nLength = aArguments.length, aParameter, vValue; aParameter = aParameters[nIndex]; nIndex++) {
		vValue	= aArguments[nIndex];
//->Debug
		var sArgument	=(nIndex + 1)+ oGuard_endings[nIndex < 3 ? nIndex : 3];
//<-Debug
		// see if argument is missing
		if (typeof vValue == "undefined" && !aParameter[2])
			throw new cAmpleException(cAmpleException.ARGUMENT_MISSING_ERR
//->Debug
					, fCaller
					, [sArgument, aParameter[0], sFunction]
//<-Debug
			);

		if (nLength > nIndex) {
			if (vValue === null) {
				// See if null is allowed
				if (!aParameter[3])
					throw new cAmpleException(cAmpleException.ARGUMENT_NULL_ERR
//->Debug
							, fCaller
							, [sArgument, aParameter[0], sFunction]
//<-Debug
					);
			}
			else
			// see if argument has correct type
			if (!fGuard_instanceOf(vValue, aParameter[1]))
				throw new cAmpleException(cAmpleException.ARGUMENT_WRONG_TYPE_ERR
//->Debug
						, fCaller
						, [sArgument, aParameter[0], sFunction, cString(aParameter[1]).match(rGuard_function) ? cRegExp.$1 : "anonymous"]
//<-Debug
				);
		}
	}
};

var rGuard_object	= /object\s([^\s]+)\]/;
function fGuard_instanceOf(vValue, cType) {
	var sType	= cObject.prototype.toString.call(vValue).match(rGuard_object)[1];
	switch (cType) {
		// Primitive types
		case cString:
			return sType == "String";
		case cBoolean:
			return sType == "Boolean";
		case cNumber:
			return sType == "Number" &&!fIsNaN(vValue);
		case cArray:
			return sType == "Array";
		case cFunction:
			return sType == "Function";
		case cRegExp:
			return sType == "RegExp";
		// Virtual types
		case cXMLNode:
			return vValue &&!fIsNaN(vValue.nodeType);
		case cXMLElement:
			return vValue && vValue.nodeType == 1;
		case cXMLDocument:
			return vValue && vValue.nodeType == 9;
		// Special type Arguments (pseudo type for JavaScript arguments object)
		case cArguments:
			return typeof vValue == "object" && "callee" in vValue;
		// Object and other types
		default:
			return cType == cObject ? true : vValue instanceof cType;
	}
};
//<-Guard

/*
function fGuard_typeof(vValue) {
	if (typeof vValue == "string" || vValue instanceof cString)
		return cString;
	else
	if (typeof vValue == "boolean" || vValue instanceof cBoolean)
		return cBoolean;
	else
	if (typeof vValue == "number" || vValue instanceof cNumber)
		return cNumber;
	else
	if (typeof vValue == "object" && "callee" in vValue)
		return cArguments;
	else
		return vValue.constructor;
};
*/