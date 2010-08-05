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
	for (var nIndex = 0, nLength = aArguments.length, aParameter, vValue, bValid; aParameter = aParameters[nIndex]; nIndex++) {
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
			else {
				// see if argument has correct type
				switch (aParameter[1]) {
					// Primitive types
					case cString:		bValid	= typeof vValue == "string"	|| vValue instanceof cString;	break;
					case cBoolean:		bValid	= typeof vValue == "boolean"|| vValue instanceof cBoolean;	break;
					case cNumber:		bValid	=(typeof vValue == "number" || vValue instanceof cNumber) && !fIsNaN(vValue);	break;
					case cObject:		bValid	= true;							break;
					// Virtual types
					case cXMLNode:		bValid	= vValue && !fIsNaN(vValue.nodeType);	break;
					case cXMLElement:	bValid	= vValue && vValue.nodeType == 1;		break;
					case cXMLDocument:	bValid	= vValue && vValue.nodeType == 9;		break;
					// Complex types
					case cArguments:	bValid	= typeof vValue == "object" && "callee" in vValue;	break;
					default:			bValid	= vValue instanceof aParameter[1];
				}

				if (!bValid)
					throw new cAMLException(cAMLException.AML_ARGUMENT_WRONG_TYPE_ERR, fCaller
//->Debug
										, [sArgument, aParameter[0], sFunction, oGuard_types[aParameter[1]] ||(cString(aParameter[1]).match(rGuard_function) ? cRegExp.$1 : "anonymous")]
//<-Debug
					);
			}
		}
	}
};