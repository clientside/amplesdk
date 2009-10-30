/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

function fAMLXMLSchema11_simpleType_validate(oType, sValue) {
	switch (oType.variety) {
		case cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC:
			// 1: Validate lexical space
//			sValue = fAMLXMLSchema11_simpleType_getValue(oType, sValue);
			if (oType.builtInKind in oAMLXMLSchema11_primitives && !oAMLXMLSchema11_primitives[oType.builtInKind].test(sValue))
				return false;

			// Additional analyzis required for some types
			switch (oType.builtInKind) {
				case cAMLXSConstants.DATETIME_DT:
				case cAMLXSConstants.DATE_DT:
				case cAMLXSConstants.GMONTHDAY_DT:
					var aValue	= sValue.match(/^(-|-?\d{4,})-(\d\d)-(\d\d)/),
						nYear	= aValue[1] != '-' ? cNumber(aValue[1]) : 0,
						nMonth	= cNumber(aValue[2]),
						nDay	= cNumber(aValue[3]);
					if (!(nDay == 29 && nMonth == 2 && (nYear % 400 == 0 || nYear % 100 != 0 && nYear % 4 == 0)))
						if (nDay > [31,28,31,30,31,30,31,31,30,31,30,31][nMonth - 1])
							return false;

				case cAMLXSConstants.DURATION_DT:
					if (sValue.charAt(sValue.length - 1) == 'T')
						return false;
					if (sValue.length <= 2)
						return false;

				case cAMLXSConstants.QNAME_DT:
					// TODO:
			}

			// 2: (a) Validate Facets
			for (var nFacet = 0, oFacet; oFacet = oType.facets[nFacet]; nFacet++) {
				switch (oFacet.facetKind) {
//					case cAMLXSSimpleTypeDefinition.FACET_NONE:
//						break;

					case cAMLXSSimpleTypeDefinition.FACET_LENGTH:
						var nLength	= fAMLXMLSchema11_simpleType_getLength(oType, sValue);
						if (nLength === false || nLength != cNumber(oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MINLENGTH:
						var nLength	= fAMLXMLSchema11_simpleType_getLength(oType, sValue);
						if (nLength === false || nLength < cNumber(oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MAXLENGTH:
						var nLength	= fAMLXMLSchema11_simpleType_getLength(oType, sValue);
						if (nLength === false || nLength > cNumber(oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_WHITESPACE:
						// TODO:
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE:
						if (fAMLXMLSchema11_simpleType_getValue(oType, sValue) > fAMLXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE:
						if (fAMLXMLSchema11_simpleType_getValue(oType, sValue) >= fAMLXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MINEXCLUSIVE:
						if (fAMLXMLSchema11_simpleType_getValue(oType, sValue) <= fAMLXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE:
						if (fAMLXMLSchema11_simpleType_getValue(oType, sValue) < fAMLXMLSchema11_simpleType_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_TOTALDIGITS:
						if (cNumber(sValue).toString().replace(/[^\d]/g, '').length > cNumber(oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_FRACTIONDIGITS:
						if (cNumber(sValue).toString().match(/\.(\d+)/) && cRegExp.$1.length > cNumber(oFacet.lexicalFacetValue))
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MINSCALE:
						// TODO:
						break;

					case cAMLXSSimpleTypeDefinition.FACET_MAXSCALE:
						// TODO:
						break;
				}
			}

			// 2: (b) Validate multi value facets
			for (var nFacet = 0, oFacet; oFacet = oType.multiValueFacets[nFacet]; nFacet++) {
				switch (oFacet.facetKind) {
					case cAMLXSSimpleTypeDefinition.FACET_PATTERN:
						for (var nIndex = 0; nIndex < oFacet.lexicalFacetValues.length; nIndex++)
							if (!(new cRegExp('^' + fAMLXMLSchema11_schemaRegExpToJSRegExp(oFacet.lexicalFacetValues[nIndex]) + '$')).test(sValue))
								return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_ENUMERATION:
						for (var nIndex = 0, bFound = false; nIndex < oFacet.lexicalFacetValues.length && !bFound; nIndex++)
							if (oFacet.lexicalFacetValues[nIndex] == sValue)
								bFound	= true;
						if (!bFound)
							return false;
						break;

					case cAMLXSSimpleTypeDefinition.FACET_ASSERTION:
						// TODO:
						break;
				}
			}

			// 3: Validate base type
			if (oType.baseType)
				return fAMLXMLSchema11_simpleType_validate(oType.baseType, sValue);
			return true;

		case cAMLXSSimpleTypeDefinition.VARIETY_LIST:
			// Validate every value from the list against itemType
			if (sValue)
				for (var nIndex = 0, aValue = fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue).split(' '); nIndex < aValue.length; nIndex++)
					if (oType.itemType && !fAMLXMLSchema11_simpleType_validate(oType.itemType, aValue[nIndex]))
						return false;
			return true;

		case cAMLXSSimpleTypeDefinition.VARIETY_UNION:
			// Validate value against member types untill successfull
			for (var nIndex = 0; nIndex < oType.memberTypes.length; nIndex++)
				if (fAMLXMLSchema11_simpleType_validate(oType.memberTypes[nIndex], sValue))
					return true;
			return false;

		default:
			return true;
	}
};

function fAMLXMLSchema11_simpleType_getValue(oType, sValue) {
//	sValue = fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue);
	if (oType.variety == cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC) {
		switch (fAMLXMLSchema11_simpleType_getPrimitiveType(oType).builtInKind) {
			case cAMLXSConstants.BOOLEAN_DT:
				return sValue == "true" || sValue == '1';

			case cAMLXSConstants.FLOAT_DT:
			case cAMLXSConstants.DOUBLE_DT:
				return sValue == "INF" ? nInfinity : sValue == '-' + "INF" ? -nInfinity : sValue == "NaN" ? nNaN : fParseFloat(sValue);

			case cAMLXSConstants.DECIMAL_DT:
// TODO:			case cAMLXSConstants.PRECISIONDECIMAL_DT:
				return cNumber(sValue);

			case cAMLXSConstants.DURATION_DT:
				var aDate	= oAMLXMLSchema11_primitives[cAMLXSConstants.DURATION_DT].exec(sValue),
					nMonths = fParseInt(aDate[2], 10) * 12 + fParseInt(aDate[3], 10),
					nSeconds = ((fParseInt(aDate[4], 10) * 24 + fParseInt(aDate[5], 10)) * 60 + fParseInt(aDate[6], 10)) * 60 + fParseFloat(aDate[7]);
				return cString(aDate[1] == '-' ? [-nMonths, -nSeconds] : [nMonths, nSeconds]);

			// DATETIME/TIME/DATE
			// GYEAR/GYEARMONTH/GMONTH/GMONTHDAY/GDAY

			case cAMLXSConstants.HEXBINARY_DT:
				return sValue.toUpperCase();

			case cAMLXSConstants.BASE64BINARY_DT:
				return sValue.replace(/[^a-zA-Z0-9+\/]/g, '');

			case cAMLXSConstants.QNAME_DT:
				// TODO:
		}
	}
	return sValue;
};

function fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue) {
	var sWhiteSpace	= null;
	if (oType.variety == cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC) {
		// find whiteSpace facet specified
		for (var oBaseType = oType, bFound = false; oBaseType && sWhiteSpace == null; oBaseType = oBaseType.baseType)
			for (var nIndex = 0, oFacet; oFacet = oBaseType.facets[nIndex] && sWhiteSpace == null; nIndex++)
				if (oFacet.facetKind == cAMLXSSimpleTypeDefinition.FACET_WHITESPACE)
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

function fAMLXMLSchema11_simpleType_getLength(oType, sValue) {
	switch (oType.variety) {
		case cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC:
			switch (fAMLXMLSchema11_simpleType_getPrimitiveType(oType).builtInKind) {
				case cAMLXSConstants.STRING_DT:
				case cAMLXSConstants.ANYURI_DT:
					return fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue).length;

				case cAMLXSConstants.HEXBINARY_DT:
					return fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue).length / 2;

				case cAMLXSConstants.BASE64BINARY_DT:
					return cMath.floor(fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue).replace(/[^a-zA-Z0-9+\/]/g,'').length * 3 / 4);

				case cAMLXSConstants.QNAME_DT:
				case cAMLXSConstants.NOTATION_DT:
					return true;

				default:
					return false;
			}
			break;

		case cAMLXSSimpleTypeDefinition.VARIETY_LIST:
			var sLexicalValue	= fAMLXMLSchema11_simpleType_getWhiteSpace(oType, sValue);
			return sLexicalValue == '' ? 0 : sLexicalValue.split(' ').length;
	}
	return false;
};

function fAMLXMLSchema11_simpleType_getPrimitiveType(oType) {
	for (; oType; oType = oType.baseType)
		if (oAMLXMLSchema11_primitiveDataTypes[oType.builtInKind])
			return oType;
};

var oAMLXMLSchema_facets	= {};
//oAMLXMLSchema_facets["none"]			= cAMLXSSimpleTypeDefinition.FACET_NONE;
oAMLXMLSchema_facets["length"]			= cAMLXSSimpleTypeDefinition.FACET_LENGTH;
oAMLXMLSchema_facets["minLength"]		= cAMLXSSimpleTypeDefinition.FACET_MINLENGTH;
oAMLXMLSchema_facets["maxLength"]		= cAMLXSSimpleTypeDefinition.FACET_MAXLENGTH;
oAMLXMLSchema_facets["pattern"]			= cAMLXSSimpleTypeDefinition.FACET_PATTERN;
oAMLXMLSchema_facets["whiteSpace"]		= cAMLXSSimpleTypeDefinition.FACET_WHITESPACE;
oAMLXMLSchema_facets["maxInclusive"]	= cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE;
oAMLXMLSchema_facets["maxExclusive"]	= cAMLXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE;
oAMLXMLSchema_facets["minExclusive"]	= cAMLXSSimpleTypeDefinition.FACET_MINEXCLUSIVE;
oAMLXMLSchema_facets["minInclusive"]	= cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE;
oAMLXMLSchema_facets["totalDigits"]		= cAMLXSSimpleTypeDefinition.FACET_TOTALDIGITS;
oAMLXMLSchema_facets["fractionDigits"]	= cAMLXSSimpleTypeDefinition.FACET_FRACTIONDIGITS;
oAMLXMLSchema_facets["enumeration"]		= cAMLXSSimpleTypeDefinition.FACET_ENUMERATION;
oAMLXMLSchema_facets["assertion"]		= cAMLXSSimpleTypeDefinition.FACET_ASSERTION;
oAMLXMLSchema_facets["minScale"]		= cAMLXSSimpleTypeDefinition.FACET_MINSCALE;
oAMLXMLSchema_facets["maxScale"]		= cAMLXSSimpleTypeDefinition.FACET_MAXSCALE;

/*
	sBla	= (0[1-9]|1[0-2])
var sYear	= ([1-9]\d\d\d+|0\d\d\d)-sBla
	sZone	= (Z|[+\-](0\d|1[0-4]):[0-5]\d)
	sOther	= (([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)
	sTime	= (0[1-9]|[12]\d|3[01])
	sDecimal= [+\-]?((\d+(\.\d*)?)|(\.\d+))
	sGroup	= [A-Za-z0-9+\/]\s*
*/

var oAMLXMLSchema11_primitives	= {};
oAMLXMLSchema11_primitives[cAMLXSConstants.BOOLEAN_DT]		= /^(true|false|1|0)$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.DECIMAL_DT]		= /^[+\-]?((\d+(\.\d*)?)|(\.\d+))$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.DOUBLE_DT]		=
oAMLXMLSchema11_primitives[cAMLXSConstants.FLOAT_DT]		= /^([+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][+\-]?\d+)?|-?INF|NaN)$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.DURATION_DT]		= /^(-)?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:((?:(?:[0-9]+(?:.[0-9]*)?)|(?:.[0-9]+)))S)?)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.DATETIME_DT] 	= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.DATE_DT]			= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.TIME_DT]			= /^(([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.GYEARMONTH_DT]	= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.GYEAR_DT]		= /^-?([1-9]\d\d\d+|0\d\d\d)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.GMONTHDAY_DT]	= /^--(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.GDAY_DT]			= /^---(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.GMONTH_DT]		= /^--(0[1-9]|1[0-2])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.HEXBINARY_DT]	= /^([0-9a-fA-F]{2})*$/;
oAMLXMLSchema11_primitives[cAMLXSConstants.BASE64BINARY_DT]	= /^((([A-Za-z0-9+\/]\s*){4})*(([A-Za-z0-9+\/]\s*){3}[A-Za-z0-9+\/]|([A-Za-z0-9+\/]\s*){2}[AEIMQUYcgkosw048]\s*=|[A-Za-z0-9+\/]\s*[AQgw]\s*=\s*=))?$/;

// Converts XML Schema RegExp syntaxis to JavaScipt one
function fAMLXMLSchema11_schemaRegExpToJSRegExp(sValue) {
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

// Simple Types processor
oAMLXMLSchema11_processors["schema"]["simpleType"]	= function(oElementDOM, oNamespace) {
	var sName	= oElementDOM.getAttribute("name");
	if (sName) {
		var oType	= new cAMLXSSimpleTypeDefinition;
		// XSObject
//		oType.type		= cAMLXSConstants.TYPE_DEFINITION;
		oType.name		= sName;
		oType.namespace	= oNamespace.schemaNamespace;
		oType.namespaceItem	= oNamespace;
		// XSTypeDefinition interface
		oType.typeCategory	= cAMLXSTypeDefinition.SIMPLE_TYPE;
		oType.anonymous		= false;
		// XSSimpleTypeDefinition interface
		oType.variety		= cAMLXSSimpleTypeDefinition.VARIETY_ABSENT;

		// Register type
		oNamespace.$types[sName]	= oType;

		// traverse children
		fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["simpleType"], oType);
	}
//->Debug
	else
		fAML_warn(nAML_MISSING_ATTRIBUTE_WRN, ["name", oElementDOM.tagName]);
//<-Debug
};
oAMLXMLSchema11_processors["simpleType"]	= {};
oAMLXMLSchema11_processors["simpleType"]["list"]	= function(oElementDOM, oType) {
	var sItemType	= oElementDOM.getAttribute("itemType");
	if (sItemType) {
		var aQName	= sItemType.split(':'),
			sLocalName		= aQName[1],
			sNameSpaceURI	= fAMLXMLSchema11_lookupNamespaceURI(oElementDOM, aQName[0]),
			oItemType		= oAMLXMLSchema11_model.getTypeDefinition(sNameSpaceURI, sLocalName);
		if (oItemType)
			oType.itemType	= oItemType;
//->Debug
		else
			fAML_warn(nAML_UNKNOWN_SIMPLE_TYPE_WRN, [sItemType]);
//<-Debug
	}
	oType.variety	= cAMLXSSimpleTypeDefinition.VARIETY_LIST;
	// traverse children
	fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["list"], oType);
};
oAMLXMLSchema11_processors["simpleType"]["union"]	= function(oElementDOM, oType) {
	var sMemberTypes	= oElementDOM.getAttribute("memberTypes");
	if (sMemberTypes) {
		for (var nIndex = 0, aMemberTypes = sMemberTypes.split(' '); nIndex < aMemberTypes.length; nIndex++) {
			var aQName	= aMemberTypes[nIndex].split(':'),
				sLocalName		= aQName[1],
				sNameSpaceURI	= fAMLXMLSchema11_lookupNamespaceURI(oElementDOM, aQName[0]),
				oMemberType		= oAMLXMLSchema11_model.getTypeDefinition(sNameSpaceURI, sLocalName);
			if (oMemberType)
				oType.memberTypes.$add(oMemberType);
//->Debug
			else
				fAML_warn(nAML_UNKNOWN_SIMPLE_TYPE_WRN, [aMemberTypes[nIndex]]);
//<-Debug
		}
	}
	oType.variety	= cAMLXSSimpleTypeDefinition.VARIETY_UNION;
	// traverse children
	fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["union"], oType);
};
oAMLXMLSchema11_processors["simpleType"]["restriction"]	= function(oElementDOM, oType) {
	var sBase	= oElementDOM.getAttribute("base");
	if (sBase) {
		var aQName	= sBase.split(':'),
			sLocalName		= aQName[1],
			sNameSpaceURI	= fAMLXMLSchema11_lookupNamespaceURI(oElementDOM, aQName[0]),
			oBaseType		= oAMLXMLSchema11_model.getTypeDefinition(sNameSpaceURI, sLocalName);

		if (oBaseType) {
			oType.baseType		= oBaseType;
			// traverse children
			fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["restriction"], oType);
		}
//->Debug
		else
			fAML_warn(nAML_UNKNOWN_SIMPLE_TYPE_WRN, [sBase]);
//<-Debug
		oType.variety		= cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC;
	}
//->Debug
	else
		fAML_warn(nAML_MISSING_ATTRIBUTE_WRN, ["base", oElementDOM.tagName]);
//<-Debug
};
oAMLXMLSchema11_processors["list"]	= {};
oAMLXMLSchema11_processors["list"]["simpleType"]	= function(oElementDOM, oType) {
	var oItemType	= new cAMLXSSimpleTypeDefinition;
	// XSObject
//	oItemType.type		= cAMLXSConstants.TYPE_DEFINITION;
//	oItemType.name		= null;	// no neeed to set
//	oItemType.namespace	= null;	// no neeed to set
//	oItemType.namespaceItem	= oType.namespaceItem;
	// XSTypeDefinition interface
	oItemType.typeCategory	= cAMLXSTypeDefinition.SIMPLE_TYPE;
	oItemType.anonymous		= true;
	// XSSimpleTypeDefinition interface
	oItemType.variety		= cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC;

	// TODO: Check if there is itemType specified in attribute
	oType.itemType	= oItemType;

	// traverse children
	fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["simpleType"], oItemType);
};

oAMLXMLSchema11_processors["union"]	= {};
oAMLXMLSchema11_processors["union"]["simpleType"]	= function(oElementDOM, oType) {
	var oMemberType	= new cAMLXSSimpleTypeDefinition;
//	oMemberType.type		= cAMLXSConstants.TYPE_DEFINITION;
//	oMemberType.name		= null;	// no neeed to set
//	oMemberType.namespace	= null;	// no neeed to set
//	oMemberType.namespaceItem	= oType.namespaceItem;
	// XSTypeDefinition interface
	oMemberType.typeCategory	= cAMLXSTypeDefinition.SIMPLE_TYPE;
	oMemberType.anonymous		= true;
//	oMemberType.baseType		=
	// XSSimpleTypeDefinition interface
	oMemberType.variety		= cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC;

	// TODO: Check if there is memberTypes specified in attribute
	oType.memberTypes.$add(oMemberType);

	// traverse children
	fAMLXMLSchema11_traverseChildren(oElementDOM, oAMLXMLSchema11_processors["simpleType"], oMemberType);
};

oAMLXMLSchema11_processors["restriction"]	= {};

// Single-value Factes
oAMLXMLSchema11_processors["restriction"]["length"]		=
oAMLXMLSchema11_processors["restriction"]["maxLength"]	=
oAMLXMLSchema11_processors["restriction"]["minLength"]	=
oAMLXMLSchema11_processors["restriction"]["maxExclusive"]	=
oAMLXMLSchema11_processors["restriction"]["minExclusive"]	=
oAMLXMLSchema11_processors["restriction"]["maxInclusive"]	=
oAMLXMLSchema11_processors["restriction"]["minInclusive"]	=
oAMLXMLSchema11_processors["restriction"]["totalDigits"]	=
oAMLXMLSchema11_processors["restriction"]["fractionDigits"]	=
oAMLXMLSchema11_processors["restriction"]["whiteSpace"]	=
oAMLXMLSchema11_processors["restriction"]["minScale"]	=
oAMLXMLSchema11_processors["restriction"]["maxScale"]	= function(oElementDOM, oType) {
	var sValue	= oElementDOM.getAttribute("value");
	if (sValue) {
		var oFacet	= new cAMLXSFacet;
		// XSFacet
		oFacet.lexicalFacetValue	= sValue;
		oFacet.fixed	= oElementDOM.getAttribute("fixed") == "true";
		oFacet.facetKind= oAMLXMLSchema_facets[oElementDOM.localName || oElementDOM.baseName];

		// Add facet to type
		oType.facets.$add(oFacet);
	}
//->Debug
	else
		fAML_warn(nAML_MISSING_ATTRIBUTE_WRN, ["value", oElementDOM.tagName]);
//<-Debug
};
// Multi-value Facets
oAMLXMLSchema11_processors["restriction"]["pattern"]	=
oAMLXMLSchema11_processors["restriction"]["assertion"]	=
oAMLXMLSchema11_processors["restriction"]["enumeration"]	= function(oElementDOM, oType) {
	var sValue	= oElementDOM.getAttribute("value"),
		nFacet	= oAMLXMLSchema_facets[oElementDOM.localName || oElementDOM.baseName];
	if (sValue) {
		// check if facet defined
		for (var nIndex = 0, oFacet; oFacet = oType.multiValueFacets[nIndex]; nIndex++)
			if (oFacet.facetKind == nFacet)
				break;

		// if facet not defined, create one
		if (!oFacet) {
			oFacet	= new cAMLXSMultiValueFacet;
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
		fAML_warn(nAML_MISSING_ATTRIBUTE_WRN, ["value", oElementDOM.tagName]);
//<-Debug
};
