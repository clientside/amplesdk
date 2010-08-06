/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
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
	rGuard_function	= /function ([^\s]+)\(/,
	oGuard_types	= fUtilities_stringToHash('0:Node;1:Element;9:Document');
//<-Debug

function fGuard(aArguments, aParameters) {
	var fCallee	= aArguments.callee,
		fCaller	= null;
	// Has to be wrapped in try/catch because Firebug throws "Permission denied to get property on Function.caller" in XMLHttpRequest
	try {
		fCaller	= fCallee.caller;
	} catch (oException) {}
//->Debug
	var sFunction	= cString(fCallee).match(rGuard_function) ? cRegExp.$1 : "anonymous";
//<-Debug

	// Iterate over parameters list
	for (var nIndex = 0, nLength = aArguments.length, aParameter, vValue; aParameter = aParameters[nIndex]; nIndex++) {
		vValue	= aArguments[nIndex];
//->Debug
		var sArgument	=(nIndex + 1)+ oGuard_endings[nIndex < 3 ? nIndex : 3];
//<-Debug
		// see if argument is missing
		if (typeof vValue == "undefined" && !aParameter[2])
			throw new cAMLException(cAMLException.AML_ARGUMENT_MISSING_ERR, fCaller
//->Debug
								, [sArgument, aParameter[0], sFunction]
//<-Debug
			);

		if (nLength > nIndex) {
			if (vValue === null) {
				// See if null is allowed
				if (!aParameter[3])
					throw new cAMLException(cAMLException.AML_ARGUMENT_NULL_ERR, fCaller
//->Debug
										, [sArgument, aParameter[0], sFunction]
//<-Debug
					);
			}
			else
			// see if argument has correct type
			if (!fGuard_instanceOf(vValue, aParameter[1]))
				throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fCaller
//->Debug
									, [sArgument, aParameter[0], sFunction, oGuard_types[aParameter[1]] ||(cString(aParameter[1]).match(rGuard_function) ? cRegExp.$1 : "anonymous")]
//<-Debug
				);
		}
	}
};

function fGuard_instanceOf(vValue, cType) {
	// Primitive types
	if (cType == cString)
		return typeof vValue == "string" || vValue instanceof cType;
	else
	if (cType == cBoolean)
		return typeof vValue == "boolean" || vValue instanceof cType;
	else
	if (cType == cNumber)
		return(typeof vValue == "number" || vValue instanceof cType) &&!fIsNaN(vValue);
	// Virtual types
	else
	if (cType == cXMLNode)
		return vValue &&!fIsNaN(vValue.nodeType);
	else
	if (cType == cXMLElement)
		return vValue && vValue.nodeType == 1;
	else
	if (cType == cXMLDocument)
		return vValue && vValue.nodeType == 9;
	// Special type Arguments (pseudo type for JavaScript arguments object)
	else
	if (cType == cArguments)
		return typeof vValue == "object" && "callee" in vValue;
	// Complex types
	return cType == cObject ? true : vValue instanceof cType;
};
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