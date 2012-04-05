/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create Built-in datatypes XML Schema Item
var oXSBuiltin_namespaceItem	= new cXSNamespaceItem,
	oXSBuiltin_types	= oXSBuiltin_namespaceItem.$types,
	oXSBuiltin_primitiveDataTypes	= {};
oXSBuiltin_namespaceItem.schemaNamespace	= "http://www.w3.org/2001/XMLSchema";
oXSModel.namespaces.$add(oXSBuiltin_namespaceItem.schemaNamespace);
oXSModel.namespaceItems.$add(oXSBuiltin_namespaceItem);

/* Builtin datatypes */
function fXSBuiltin_createSimpleType(nType, nBaseType, aFacets, aMultiValueFacets) {
	var oType	= new cXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oXSBuiltin_types[nBaseType];
	oType.anonymous		= false;
	// XSSimpleTypeDefinition interface
	if (nType == cXSConstants.ANYTYPE_DT || nType == cXSConstants.ANYSIMPLETYPE_DT)
		oType.variety	= cXSSimpleTypeDefinition.VARIETY_ABSENT;
	else
		oType.variety	= cXSSimpleTypeDefinition.VARIETY_ATOMIC;
	oType.builtInKind	= nType;

	if (aFacets)
		for (var nIndex = 0; nIndex < aFacets.length; nIndex++)
			oType.facets.$add(aFacets[nIndex]);
	if (aMultiValueFacets)
		for (var nIndex = 0; nIndex < aMultiValueFacets.length; nIndex++)
			oType.multiValueFacets.$add(aMultiValueFacets[nIndex]);

	return oType;
};

function fXSBuiltin_createListType(nType, nItemType, aFacets, aMultiValueFacets) {
	var oType	= new cXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oXSBuiltin_types[cXSConstants.ANYSIMPLETYPE_DT];
	oType.anonymous		= false;
	// XSSimpleTypeDefinition interface
	oType.variety		= cXSSimpleTypeDefinition.VARIETY_LIST;
	oType.itemType		= oXSBuiltin_types[nItemType];
	oType.builtInKind	= nType;

	if (aFacets)
		for (var nIndex = 0; nIndex < aFacets.length; nIndex++)
			oType.facets.$add(aFacets[nIndex]);
	if (aMultiValueFacets)
		for (var nIndex = 0; nIndex < aMultiValueFacets.length; nIndex++)
			oType.multiValueFacets.$add(aMultiValueFacets[nIndex]);

	return oType;
};

function fXSBuiltin_createFacet(nFacet, sValue, bFixed) {
	var oFacet	= new cXSFacet;
	oFacet.lexicalFacetValue	= sValue;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;

	return oFacet;
};

function fXSBuiltin_createMultiValueFacet(nFacet, aValues, bFixed) {
	var oFacet	= new cXSMultiValueFacet;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;
	for (var nIndex = 0; nIndex < aValues.length; nIndex++)
		oFacet.lexicalFacetValues.$add(aValues[nIndex]);

	return oFacet;
};

// Datatypes initialization
oXSBuiltin_types["anyType"]	= fXSBuiltin_createSimpleType(cXSConstants.ANYTYPE_DT, 0);
	oXSBuiltin_types["anySimpleType"]	= fXSBuiltin_createSimpleType(cXSConstants.ANYSIMPLETYPE_DT, cXSConstants.ANYTYPE_DT);
		oXSBuiltin_types["anyAtomicType"]	= fXSBuiltin_createSimpleType(cXSConstants.ANYATOMICTYPE_DT, cXSConstants.ANYSIMPLETYPE_DT);
			// primititve types
			oXSBuiltin_primitiveDataTypes[cXSConstants.ANYURI_DT]	=
			oXSBuiltin_types["anyURI"]			= fXSBuiltin_createSimpleType(cXSConstants.ANYURI_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.BASE64BINARY_DT]	=
			oXSBuiltin_types["base64Binary"]	= fXSBuiltin_createSimpleType(cXSConstants.BASE64BINARY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.BOOLEAN_DT]	=
			oXSBuiltin_types["boolean"]			= fXSBuiltin_createSimpleType(cXSConstants.BOOLEAN_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.DATE_DT]	=
			oXSBuiltin_types["date"]			= fXSBuiltin_createSimpleType(cXSConstants.DATE_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.DATETIME_DT]	=
			oXSBuiltin_types["dateTime"]		= fXSBuiltin_createSimpleType(cXSConstants.DATETIME_DT, cXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oXSBuiltin_types["dateTimeStamp"]	= fXSBuiltin_createSimpleType(cXSConstants.DATETIMESTAMP_DT, cXSConstants.DATETIME_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.DECIMAL_DT]	=
			oXSBuiltin_types["decimal"]			= fXSBuiltin_createSimpleType(cXSConstants.DECIMAL_DT, cXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oXSBuiltin_types["integer"]			= fXSBuiltin_createSimpleType(cXSConstants.INTEGER_DT, cXSConstants.DECIMAL_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS, '0', true)], [fXSBuiltin_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[\\-+]?[0-9]+'])]);
					oXSBuiltin_types["long"]				= fXSBuiltin_createSimpleType(cXSConstants.LONG_DT, cXSConstants.INTEGER_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-9223372036854775808'), fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '9223372036854775807')]);
						oXSBuiltin_types["int"]					= fXSBuiltin_createSimpleType(cXSConstants.INT_DT, cXSConstants.LONG_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-2147483648'), fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '2147483647')]);
							oXSBuiltin_types["short"]				= fXSBuiltin_createSimpleType(cXSConstants.SHORT_DT, cXSConstants.INT_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-32768'), fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '32767')]);
								oXSBuiltin_types["byte"]				= fXSBuiltin_createSimpleType(cXSConstants.BYTE_DT, cXSConstants.SHORT_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-128'), fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '127')]);
					oXSBuiltin_types["nonNegativeInteger"]	= fXSBuiltin_createSimpleType(cXSConstants.NONNEGATIVEINTEGER_DT, cXSConstants.INTEGER_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '0')]);
						oXSBuiltin_types["positiveInteger"]		= fXSBuiltin_createSimpleType(cXSConstants.POSITIVEINTEGER_DT, cXSConstants.NONNEGATIVEINTEGER_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '1')]);
						oXSBuiltin_types["unsignedLong"]		= fXSBuiltin_createSimpleType(cXSConstants.UNSIGNEDLONG_DT, cXSConstants.NONNEGATIVEINTEGER_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '18446744073709551615')]);
							oXSBuiltin_types["unsignedInt"]			= fXSBuiltin_createSimpleType(cXSConstants.UNSIGNEDINT_DT, cXSConstants.UNSIGNEDLONG_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '4294967295')]);
								oXSBuiltin_types["unsignedShort"]		= fXSBuiltin_createSimpleType(cXSConstants.UNSIGNEDSHORT_DT, cXSConstants.UNSIGNEDINT_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '65535')]);
									oXSBuiltin_types["unsignedByte"]		= fXSBuiltin_createSimpleType(cXSConstants.UNSIGNEDBYTE_DT, cXSConstants.UNSIGNEDSHORT_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '255')]);
					oXSBuiltin_types["nonPositiveInteger"]	= fXSBuiltin_createSimpleType(cXSConstants.NONPOSITIVEINTEGER_DT, cXSConstants.INTEGER_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '0')]);
						oXSBuiltin_types["negativeInteger"]		= fXSBuiltin_createSimpleType(cXSConstants.NEGATIVEINTEGER_DT, cXSConstants.NONPOSITIVEINTEGER_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '-1')]);
			oXSBuiltin_primitiveDataTypes[cXSConstants.DOUBLE_DT]	=
			oXSBuiltin_types["double"]			= fXSBuiltin_createSimpleType(cXSConstants.DOUBLE_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.DURATION_DT]	=
			oXSBuiltin_types["duration"]		= fXSBuiltin_createSimpleType(cXSConstants.DURATION_DT, cXSConstants.ANYATOMICTYPE_DT);
				oXSBuiltin_types["dayTimeDuration"]	= fXSBuiltin_createSimpleType(cXSConstants.DAYTIMEDURATION_DT, cXSConstants.DURATION_DT);
				oXSBuiltin_types["dayMonthDuration"]= fXSBuiltin_createSimpleType(cXSConstants.DAYMONTHDURATION_DT, cXSConstants.DURATION_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.FLOAT_DT]	=
			oXSBuiltin_types["float"]			= fXSBuiltin_createSimpleType(cXSConstants.FLOAT_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.GDAY_DT]	=
			oXSBuiltin_types["gDay"]			= fXSBuiltin_createSimpleType(cXSConstants.GDAY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.GMONTH_DT]	=
			oXSBuiltin_types["gMonth"]			= fXSBuiltin_createSimpleType(cXSConstants.GMONTH_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.GMONTHDAY_DT]	=
			oXSBuiltin_types["gMonthDay"]		= fXSBuiltin_createSimpleType(cXSConstants.GMONTHDAY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.GYEAR_DT]	=
			oXSBuiltin_types["gYear"]			= fXSBuiltin_createSimpleType(cXSConstants.GYEAR_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.GYEARMONTH_DT]	=
			oXSBuiltin_types["gYearMonth"]		= fXSBuiltin_createSimpleType(cXSConstants.GYEARMONTH_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.HEXBINARY_DT]	=
			oXSBuiltin_types["hexBinary"]		= fXSBuiltin_createSimpleType(cXSConstants.HEXBINARY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.NOTATION_DT]	=
			oXSBuiltin_types["NOTATION"]		= fXSBuiltin_createSimpleType(cXSConstants.NOTATION_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.PRECISIONDECIMAL_DT]	=
			oXSBuiltin_types["precisionDecimal"]= fXSBuiltin_createSimpleType(cXSConstants.PRECISIONDECIMAL_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.QNAME_DT]	=
			oXSBuiltin_types["QName"]			= fXSBuiltin_createSimpleType(cXSConstants.QNAME_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXSBuiltin_primitiveDataTypes[cXSConstants.STRING_DT]	=
			oXSBuiltin_types["string"]			= fXSBuiltin_createSimpleType(cXSConstants.STRING_DT, cXSConstants.ANYATOMICTYPE_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "preserve")]);
				// Other built-in atomic types
				oXSBuiltin_types["normalizedString"]= fXSBuiltin_createSimpleType(cXSConstants.NORMALIZEDSTRING_DT, cXSConstants.STRING_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "replace")]);
					oXSBuiltin_types["token"]			= fXSBuiltin_createSimpleType(cXSConstants.TOKEN_DT, cXSConstants.NORMALIZEDSTRING_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oXSBuiltin_types["language"]		= fXSBuiltin_createSimpleType(cXSConstants.LANGUAGE_DT, cXSConstants.TOKEN_DT, [], [fXSBuiltin_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*'])]);
						oXSBuiltin_types["Name"]			= fXSBuiltin_createSimpleType(cXSConstants.NAME_DT, cXSConstants.TOKEN_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fXSBuiltin_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['\\i\\c*'])]);
							oXSBuiltin_types["NCName"]			= fXSBuiltin_createSimpleType(cXSConstants.NCNAME_DT, cXSConstants.NAME_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fXSBuiltin_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[\\i-[:]][\\c-[:]]*'])]);
								oXSBuiltin_types["ENTITY"]			= fXSBuiltin_createSimpleType(cXSConstants.ENITITY_DT, cXSConstants.NCNAME_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oXSBuiltin_types["ID"]				= fXSBuiltin_createSimpleType(cXSConstants.ID_DT, cXSConstants.NCNAME_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oXSBuiltin_types["IDREF"]			= fXSBuiltin_createSimpleType(cXSConstants.IDREF_DT, cXSConstants.NCNAME_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oXSBuiltin_types["NMTOKEN"]			= fXSBuiltin_createSimpleType(cXSConstants.NMTOKEN_DT, cXSConstants.TOKEN_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fXSBuiltin_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ["\\c"])]);
			oXSBuiltin_primitiveDataTypes[cXSConstants.TIME_DT]	=
			oXSBuiltin_types["time"]			= fXSBuiltin_createSimpleType(cXSConstants.TIME_DT, cXSConstants.ANYATOMICTYPE_DT);
		// Built-in list types
		oXSBuiltin_types["ENTITIES"]		= fXSBuiltin_createListType(cXSConstants.LIST_DT, cXSConstants.ENITITY_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fXSBuiltin_createFacet("minLength", '1')]);
		oXSBuiltin_types["IDREFS"]			= fXSBuiltin_createListType(cXSConstants.LIST_DT, cXSConstants.IDREF_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fXSBuiltin_createFacet("minLength", '1')]);
		oXSBuiltin_types["NMTOKENS"]		= fXSBuiltin_createListType(cXSConstants.LIST_DT, cXSConstants.NMTOKEN_DT, [fXSBuiltin_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fXSBuiltin_createFacet("minLength", '1')]);

