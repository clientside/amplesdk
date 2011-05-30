/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


function fXMLSchema11_simpleType_validate(oType, sValue) {
	switch (oType.variety) {
		case cXSSimpleTypeDefinition.VARIETY_ATOMIC:
			// 1: Validate lexical space
//			sValue = fXMLSchema11_simpleType_getValue(oType, sValue);
			if (oType.builtInKind in oXMLSchema11_primitives && !oXMLSchema11_primitives[oType.builtInKind].test(sValue))
				return false;

			// Additional analyzis required for some types
			switch (oType.builtInKind) {
				case cXSConstants.DATETIME_DT:
				case cXSConstants.DATE_DT:
				case cXSConstants.GMONTHDAY_DT:
					var aValue	= sValue.match(/^(-|-?\d{4,})-(\d\d)-(\d\d)/),
						nYear	= aValue[1] != '-' ? Number(aValue[1]) : 0,
						nMonth	= Number(aValue[2]),
						nDay	= Number(aValue[3]);
					if (!(nDay == 29 && nMonth == 2 && (nYear % 400 == 0 || nYear % 100 != 0 && nYear % 4 == 0)))
						if (nDay > [31,28,31,30,31,30,31,31,30,31,30,31][nMonth - 1])
							return false;

				case cXSConstants.DURATION_DT:
					if (sValue.charAt(sValue.length - 1) == 'T')
						return false;
					if (sValue.length <= 2)
						return false;

				case cXSConstants.QNAME_DT:
					// TODO:
			}

			// 2: (a) Validate Facets
			for (var nFacet = 0, oFacet; oFacet = oType.facets[nFacet]; nFacet++) {
				switch (oFacet.facetKind) {
//					case cXSSimpleTypeDefinition.FACET_NONE:
//						break;

					case cXSSimpleTypeDefinition.FACET_LENGTH:
						var nLength	= fXMLSchema11_simpleType_getLength(oType, sValue);
						if (nLength === false || nLength != Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MINLENGTH:
						var nLength	= fXMLSchema11_simpleType_getLength(oType, sValue);
						if (nLength === false || nLength < Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MAXLENGTH:
						var nLength	= fXMLSchema11_simpleType_getLength(oType, sValue);
						if (nLength === false || nLength > Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_WHITESPACE:
						// TODO:
						break;

					case cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE:
						if (fXMLSchema11_simpleType_getValue(oType, sValue) > fXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE:
						if (fXMLSchema11_simpleType_getValue(oType, sValue) >= fXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE:
						if (fXMLSchema11_simpleType_getValue(oType, sValue) <= fXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MININCLUSIVE:
						if (fXMLSchema11_simpleType_getValue(oType, sValue) < fXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_TOTALDIGITS:
						if (Number(sValue).toString().replace(/[^\d]/g, '').length > Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS:
						if (Number(sValue).toString().match(/\.(\d+)/) && RegExp.$1.length > Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MINSCALE:
						// TODO:
						break;

					case cXSSimpleTypeDefinition.FACET_MAXSCALE:
						// TODO:
						break;
				}
			}

			// 2: (b) Validate multi value facets
			for (var nFacet = 0, oFacet; oFacet = oType.multiValueFacets[nFacet]; nFacet++) {
				switch (oFacet.facetKind) {
					case cXSSimpleTypeDefinition.FACET_PATTERN:
						for (var nIndex = 0; nIndex < oFacet.lexicalFacetValues.length; nIndex++)
							if (!(new RegExp('^' + fXMLSchema11_schemaRegExpToJSRegExp(oFacet.lexicalFacetValues[nIndex]) + '$')).test(sValue))
								return false;
						break;

					case cXSSimpleTypeDefinition.FACET_ENUMERATION:
						for (var nIndex = 0, bFound = false; nIndex < oFacet.lexicalFacetValues.length && !bFound; nIndex++)
							if (oFacet.lexicalFacetValues[nIndex] == sValue)
								bFound	= true;
						if (!bFound)
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_ASSERTION:
						// TODO:
						break;
				}
			}

			// 3: Validate base type
			if (oType.baseType)
				return fXMLSchema11_simpleType_validate(oType.baseType, sValue);
			return true;

		case cXSSimpleTypeDefinition.VARIETY_LIST:
			// Validate every value from the list against itemType
			if (sValue)
				for (var nIndex = 0, aValue = fXMLSchema11_simpleType_getWhiteSpace(oType, sValue).split(' '); nIndex < aValue.length; nIndex++)
					if (oType.itemType && !fXMLSchema11_simpleType_validate(oType.itemType, aValue[nIndex]))
						return false;
			return true;

		case cXSSimpleTypeDefinition.VARIETY_UNION:
			// Validate value against member types untill successfull
			for (var nIndex = 0; nIndex < oType.memberTypes.length; nIndex++)
				if (fXMLSchema11_simpleType_validate(oType.memberTypes[nIndex], sValue))
					return true;
			return false;

		default:
			return true;
	}
};

ample.$validate	= fXMLSchema11_simpleType_validate;

function fXMLSchema11_simpleType_getValue(oType, sValue) {
//	sValue = fXMLSchema11_simpleType_getWhiteSpace(oType, sValue);
	if (oType.variety == cXSSimpleTypeDefinition.VARIETY_ATOMIC) {
		switch (fXMLSchema11_simpleType_getPrimitiveType(oType).builtInKind) {
			case cXSConstants.BOOLEAN_DT:
				return sValue == "true" || sValue == '1';

			case cXSConstants.FLOAT_DT:
			case cXSConstants.DOUBLE_DT:
				return sValue == "INF" ? Infinity : sValue == '-' + "INF" ? -Infinity : sValue == "NaN" ? nNaN : parseFloat(sValue);

			case cXSConstants.DECIMAL_DT:
// TODO:			case cXSConstants.PRECISIONDECIMAL_DT:
				return Number(sValue);

			case cXSConstants.DURATION_DT:
				var aDate	= oXMLSchema11_primitives[cXSConstants.DURATION_DT].exec(sValue),
					nMonths = parseInt(aDate[2], 10) * 12 + parseInt(aDate[3], 10),
					nSeconds = ((parseInt(aDate[4], 10) * 24 + parseInt(aDate[5], 10)) * 60 + parseInt(aDate[6], 10)) * 60 + parseFloat(aDate[7]);
				return String(aDate[1] == '-' ? [-nMonths, -nSeconds] : [nMonths, nSeconds]);

			// DATETIME/TIME/DATE
			// GYEAR/GYEARMONTH/GMONTH/GMONTHDAY/GDAY

			case cXSConstants.HEXBINARY_DT:
				return sValue.toUpperCase();

			case cXSConstants.BASE64BINARY_DT:
				return sValue.replace(/[^a-zA-Z0-9+\/]/g, '');

			case cXSConstants.QNAME_DT:
				// TODO:
		}
	}
	return sValue;
};

function fXMLSchema11_simpleType_getWhiteSpace(oType, sValue) {
	var sWhiteSpace	= null;
	if (oType.variety == cXSSimpleTypeDefinition.VARIETY_ATOMIC) {
		// find whiteSpace facet specified
		for (var oBaseType = oType, bFound = false; oBaseType && sWhiteSpace == null; oBaseType = oBaseType.baseType)
			for (var nIndex = 0, oFacet; oFacet = oBaseType.facets[nIndex] && sWhiteSpace == null; nIndex++)
				if (oFacet.facetKind == cXSSimpleTypeDefinition.FACET_WHITESPACE)
					sWhiteSpace	= oFacet.lexicalFacetValue;
	} else
		sWhiteSpace = "collapse";

	//
	switch (sWhiteSpace) {
		case "replace":
			return sValue.replace(/[\t\n\r]/g, ' ');
		case "collapse":
			return sValue.replace(/[\t\n\r ]+/g, ' ').replace(/^[\t\n\r ]|[\t\n\r ]$/g, '');
		case "preserve":
			return sValue;
		default:
			return sValue;
	}
};

function fXMLSchema11_simpleType_getLength(oType, sValue) {
	switch (oType.variety) {
		case cXSSimpleTypeDefinition.VARIETY_ATOMIC:
			switch (fXMLSchema11_simpleType_getPrimitiveType(oType).builtInKind) {
				case cXSConstants.STRING_DT:
				case cXSConstants.ANYURI_DT:
					return fXMLSchema11_simpleType_getWhiteSpace(oType, sValue).length;

				case cXSConstants.HEXBINARY_DT:
					return fXMLSchema11_simpleType_getWhiteSpace(oType, sValue).length / 2;

				case cXSConstants.BASE64BINARY_DT:
					return Math.floor(fXMLSchema11_simpleType_getWhiteSpace(oType, sValue).replace(/[^a-zA-Z0-9+\/]/g,'').length * 3 / 4);

				case cXSConstants.QNAME_DT:
				case cXSConstants.NOTATION_DT:
					return true;

				default:
					return false;
			}
			break;

		case cXSSimpleTypeDefinition.VARIETY_LIST:
			var sLexicalValue	= fXMLSchema11_simpleType_getWhiteSpace(oType, sValue);
			return sLexicalValue == '' ? 0 : sLexicalValue.split(' ').length;
	}
	return false;
};

function fXMLSchema11_simpleType_getPrimitiveType(oType) {
	for (; oType; oType = oType.baseType)
		if (oXMLSchema11_primitiveDataTypes[oType.builtInKind])
			return oType;
};

var oXMLSchema11_facets	= {};
//oXMLSchema11_facets["none"]			= cXSSimpleTypeDefinition.FACET_NONE;
oXMLSchema11_facets["length"]			= cXSSimpleTypeDefinition.FACET_LENGTH;
oXMLSchema11_facets["minLength"]		= cXSSimpleTypeDefinition.FACET_MINLENGTH;
oXMLSchema11_facets["maxLength"]		= cXSSimpleTypeDefinition.FACET_MAXLENGTH;
oXMLSchema11_facets["pattern"]			= cXSSimpleTypeDefinition.FACET_PATTERN;
oXMLSchema11_facets["whiteSpace"]		= cXSSimpleTypeDefinition.FACET_WHITESPACE;
oXMLSchema11_facets["maxInclusive"]	= cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE;
oXMLSchema11_facets["maxExclusive"]	= cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE;
oXMLSchema11_facets["minExclusive"]	= cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE;
oXMLSchema11_facets["minInclusive"]	= cXSSimpleTypeDefinition.FACET_MININCLUSIVE;
oXMLSchema11_facets["totalDigits"]		= cXSSimpleTypeDefinition.FACET_TOTALDIGITS;
oXMLSchema11_facets["fractionDigits"]	= cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS;
oXMLSchema11_facets["enumeration"]		= cXSSimpleTypeDefinition.FACET_ENUMERATION;
oXMLSchema11_facets["assertion"]		= cXSSimpleTypeDefinition.FACET_ASSERTION;
oXMLSchema11_facets["minScale"]		= cXSSimpleTypeDefinition.FACET_MINSCALE;
oXMLSchema11_facets["maxScale"]		= cXSSimpleTypeDefinition.FACET_MAXSCALE;

/*
	sBla	= (0[1-9]|1[0-2])
var sYear	= ([1-9]\d\d\d+|0\d\d\d)-sBla
	sZone	= (Z|[+\-](0\d|1[0-4]):[0-5]\d)
	sOther	= (([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)
	sTime	= (0[1-9]|[12]\d|3[01])
	sDecimal= [+\-]?((\d+(\.\d*)?)|(\.\d+))
	sGroup	= [A-Za-z0-9+\/]\s*
*/

var oXMLSchema11_primitives	= {};
oXMLSchema11_primitives[cXSConstants.BOOLEAN_DT]		= /^(true|false|1|0)$/;
oXMLSchema11_primitives[cXSConstants.DECIMAL_DT]		= /^[+\-]?((\d+(\.\d*)?)|(\.\d+))$/;
oXMLSchema11_primitives[cXSConstants.DOUBLE_DT]		=
oXMLSchema11_primitives[cXSConstants.FLOAT_DT]		= /^([+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][+\-]?\d+)?|-?INF|NaN)$/;
oXMLSchema11_primitives[cXSConstants.DURATION_DT]		= /^(-)?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:((?:(?:[0-9]+(?:.[0-9]*)?)|(?:.[0-9]+)))S)?)?$/;
oXMLSchema11_primitives[cXSConstants.DATETIME_DT] 	= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.DATE_DT]			= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.TIME_DT]			= /^(([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.GYEARMONTH_DT]	= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.GYEAR_DT]		= /^-?([1-9]\d\d\d+|0\d\d\d)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.GMONTHDAY_DT]	= /^--(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.GDAY_DT]			= /^---(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.GMONTH_DT]		= /^--(0[1-9]|1[0-2])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXMLSchema11_primitives[cXSConstants.HEXBINARY_DT]	= /^([0-9a-fA-F]{2})*$/;
oXMLSchema11_primitives[cXSConstants.BASE64BINARY_DT]	= /^((([A-Za-z0-9+\/]\s*){4})*(([A-Za-z0-9+\/]\s*){3}[A-Za-z0-9+\/]|([A-Za-z0-9+\/]\s*){2}[AEIMQUYcgkosw048]\s*=|[A-Za-z0-9+\/]\s*[AQgw]\s*=\s*=))?$/;

// Converts XML Schema RegExp syntaxis to JavaScipt one
function fXMLSchema11_schemaRegExpToJSRegExp(sValue) {
	var d1= '\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF',
		d2= '\u0370-\u037D\u037F-\u1FFF\u200C-\u200D',
		d3= '\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD',
		c = 'A-Z_a-z\\-.0-9\u00B7' + d1 + '\u0300-\u036F' + d2 + '\u203F-\u2040' + d3,
		i = 'A-Z_a-z' + d1 + d2 + d3;
	return sValue
				.replace(/\[\\i-\[:\]\]/g, '[' + i + ']')
				.replace(/\[\\c-\[:\]\]/g, '[' + c + ']')
				.replace(/\\i/g, '[:' + i + ']')
				.replace(/\\I/g, '[^:' + i + ']')
				.replace(/\\c/g, '[:' + c + ']')
				.replace(/\\C/g, '[^:' + c + ']');
};
/*
// Simple Types processor
oXMLSchema11_processors["schema"]["simpleType"]	= function(oElementDOM, oNamespace) {
	var sName	= oElementDOM.getAttribute("name");
	if (sName) {
		var oType	= new cXSSimpleTypeDefinition;
		// XSObject
//		oType.type		= cXSConstants.TYPE_DEFINITION;
		oType.name		= sName;
		oType.namespace	= oNamespace.schemaNamespace;
		oType.namespaceItem	= oNamespace;
		// XSTypeDefinition interface
		oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
		oType.anonymous		= false;
		// XSSimpleTypeDefinition interface
		oType.variety		= cXSSimpleTypeDefinition.VARIETY_ABSENT;

		// Register type
		oNamespace.$types[sName]	= oType;

		// traverse children
		fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["simpleType"], oType);
	}
//->Debug
	else
		fUtilities_warn(sGUARD_MISSING_ATTRIBUTE_WRN, ["name", oElementDOM.tagName]);
//<-Debug
};
oXMLSchema11_processors["simpleType"]	= {};
oXMLSchema11_processors["simpleType"]["list"]	= function(oElementDOM, oType) {
	var sItemType	= oElementDOM.getAttribute("itemType");
	if (sItemType) {
		var aQName	= sItemType.split(':'),
			sLocalName		= aQName[1],
			sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
			oItemType		= oXMLSchema11_model.getTypeDefinition(sNameSpaceURI, sLocalName);
		if (oItemType)
			oType.itemType	= oItemType;
//->Debug
		else
			fUtilities_warn(sGUARD_UNKNOWN_SIMPLE_TYPE_WRN, [sItemType]);
//<-Debug
	}
	oType.variety	= cXSSimpleTypeDefinition.VARIETY_LIST;
	// traverse children
	fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["list"], oType);
};
oXMLSchema11_processors["simpleType"]["union"]	= function(oElementDOM, oType) {
	var sMemberTypes	= oElementDOM.getAttribute("memberTypes");
	if (sMemberTypes) {
		for (var nIndex = 0, aMemberTypes = sMemberTypes.split(' '); nIndex < aMemberTypes.length; nIndex++) {
			var aQName	= aMemberTypes[nIndex].split(':'),
				sLocalName		= aQName[1],
				sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
				oMemberType		= oXMLSchema11_model.getTypeDefinition(sNameSpaceURI, sLocalName);
			if (oMemberType)
				oType.memberTypes.$add(oMemberType);
//->Debug
			else
				fUtilities_warn(sGUARD_UNKNOWN_SIMPLE_TYPE_WRN, [aMemberTypes[nIndex]]);
//<-Debug
		}
	}
	oType.variety	= cXSSimpleTypeDefinition.VARIETY_UNION;
	// traverse children
	fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["union"], oType);
};
oXMLSchema11_processors["simpleType"]["restriction"]	= function(oElementDOM, oType) {
	var sBase	= oElementDOM.getAttribute("base");
	if (sBase) {
		var aQName	= sBase.split(':'),
			sLocalName		= aQName[1],
			sNameSpaceURI	= this.lookupNamespaceURI(aQName[0]),
			oBaseType		= oXMLSchema11_model.getTypeDefinition(sNameSpaceURI, sLocalName);

		if (oBaseType) {
			oType.baseType		= oBaseType;
			// traverse children
			fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["restriction"], oType);
		}
//->Debug
		else
			fUtilities_warn(sGUARD_UNKNOWN_SIMPLE_TYPE_WRN, [sBase]);
//<-Debug
		oType.variety		= cXSSimpleTypeDefinition.VARIETY_ATOMIC;
	}
//->Debug
	else
		fUtilities_warn(sGUARD_MISSING_ATTRIBUTE_WRN, ["base", oElementDOM.tagName]);
//<-Debug
};
oXMLSchema11_processors["list"]	= {};
oXMLSchema11_processors["list"]["simpleType"]	= function(oElementDOM, oType) {
	var oItemType	= new cXSSimpleTypeDefinition;
	// XSObject
//	oItemType.type		= cXSConstants.TYPE_DEFINITION;
//	oItemType.name		= null;	// no neeed to set
//	oItemType.namespace	= null;	// no neeed to set
//	oItemType.namespaceItem	= oType.namespaceItem;
	// XSTypeDefinition interface
	oItemType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oItemType.anonymous		= true;
	// XSSimpleTypeDefinition interface
	oItemType.variety		= cXSSimpleTypeDefinition.VARIETY_ATOMIC;

	// TODO: Check if there is itemType specified in attribute
	oType.itemType	= oItemType;

	// traverse children
	fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["simpleType"], oItemType);
};

oXMLSchema11_processors["union"]	= {};
oXMLSchema11_processors["union"]["simpleType"]	= function(oElementDOM, oType) {
	var oMemberType	= new cXSSimpleTypeDefinition;
//	oMemberType.type		= cXSConstants.TYPE_DEFINITION;
//	oMemberType.name		= null;	// no neeed to set
//	oMemberType.namespace	= null;	// no neeed to set
//	oMemberType.namespaceItem	= oType.namespaceItem;
	// XSTypeDefinition interface
	oMemberType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oMemberType.anonymous		= true;
//	oMemberType.baseType		=
	// XSSimpleTypeDefinition interface
	oMemberType.variety		= cXSSimpleTypeDefinition.VARIETY_ATOMIC;

	// TODO: Check if there is memberTypes specified in attribute
	oType.memberTypes.$add(oMemberType);

	// traverse children
	fXMLSchema11_traverseChildren(oElementDOM, oXMLSchema11_processors["simpleType"], oMemberType);
};

oXMLSchema11_processors["restriction"]	= {};

// Single-value Factes
oXMLSchema11_processors["restriction"]["length"]		=
oXMLSchema11_processors["restriction"]["maxLength"]	=
oXMLSchema11_processors["restriction"]["minLength"]	=
oXMLSchema11_processors["restriction"]["maxExclusive"]	=
oXMLSchema11_processors["restriction"]["minExclusive"]	=
oXMLSchema11_processors["restriction"]["maxInclusive"]	=
oXMLSchema11_processors["restriction"]["minInclusive"]	=
oXMLSchema11_processors["restriction"]["totalDigits"]	=
oXMLSchema11_processors["restriction"]["fractionDigits"]	=
oXMLSchema11_processors["restriction"]["whiteSpace"]	=
oXMLSchema11_processors["restriction"]["minScale"]	=
oXMLSchema11_processors["restriction"]["maxScale"]	= function(oElementDOM, oType) {
	var sValue	= oElementDOM.getAttribute("value");
	if (sValue) {
		var oFacet	= new cXSFacet;
		// XSFacet
		oFacet.lexicalFacetValue	= sValue;
		oFacet.fixed	= oElementDOM.getAttribute("fixed") == "true";
		oFacet.facetKind= oXMLSchema11_facets[oElementDOM.localName || oElementDOM.baseName];

		// Add facet to type
		oType.facets.$add(oFacet);
	}
//->Debug
	else
		fUtilities_warn(sGUARD_MISSING_ATTRIBUTE_WRN, ["value", oElementDOM.tagName]);
//<-Debug
};
// Multi-value Facets
oXMLSchema11_processors["restriction"]["pattern"]	=
oXMLSchema11_processors["restriction"]["assertion"]	=
oXMLSchema11_processors["restriction"]["enumeration"]	= function(oElementDOM, oType) {
	var sValue	= oElementDOM.getAttribute("value"),
		nFacet	= oXMLSchema11_facets[oElementDOM.localName || oElementDOM.baseName];
	if (sValue) {
		// check if facet defined
		for (var nIndex = 0, oFacet; oFacet = oType.multiValueFacets[nIndex]; nIndex++)
			if (oFacet.facetKind == nFacet)
				break;

		// if facet not defined, create one
		if (!oFacet) {
			oFacet	= new cXSMultiValueFacet;
			// XSMultiValueFacet
			oFacet.fixed	= oElementDOM.getAttribute("fixed") == "true";
			oFacet.facetKind= nFacet;

			// Add facet to type
			oType.multiValueFacets.$add(oFacet);
		}
		oFacet.lexicalFacetValues.$add(sValue);

		//
//		oType.lexicalEnumeration.$add(sValue);
	}
//->Debug
	else
		fUtilities_warn(sGUARD_MISSING_ATTRIBUTE_WRN, ["value", oElementDOM.tagName]);
//<-Debug
};
*/