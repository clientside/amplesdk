/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create Built-in datatypes XML Schema
var oXMLSchema11_namespaceDataTypes	= new cXSNamespaceItem,
	oXMLSchema11_builtinDataTypes	= oXMLSchema11_namespaceDataTypes.$types,
	oXMLSchema11_primitiveDataTypes	= {};
oXMLSchema11_namespaceDataTypes.schemaNamespace	= "http://www.w3.org/2001/XMLSchema";
oXMLSchema11_model.namespaces.$add(oXMLSchema11_namespaceDataTypes.schemaNamespace);
oXMLSchema11_model.namespaceItems.$add(oXMLSchema11_namespaceDataTypes);


/* Builtin datatypes */
function fXMLSchema11_createBuiltType(nType, nBaseType, aFacets, aMultiValueFacets) {
	var oType	= new cXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oXMLSchema11_builtinDataTypes[nBaseType];
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

function fXMLSchema11_createBuiltListType(nType, nItemType, aFacets, aMultiValueFacets) {
	var oType	= new cXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oXMLSchema11_builtinDataTypes[cXSConstants.ANYSIMPLETYPE_DT];
	oType.anonymous		= false;
	// XSSimpleTypeDefinition interface
	oType.variety		= cXSSimpleTypeDefinition.VARIETY_LIST;
	oType.itemType		= oXMLSchema11_builtinDataTypes[nItemType];
	oType.builtInKind	= nType;

	if (aFacets)
		for (var nIndex = 0; nIndex < aFacets.length; nIndex++)
			oType.facets.$add(aFacets[nIndex]);
	if (aMultiValueFacets)
		for (var nIndex = 0; nIndex < aMultiValueFacets.length; nIndex++)
			oType.multiValueFacets.$add(aMultiValueFacets[nIndex]);

	return oType;
};

function fXMLSchema11_createFacet(nFacet, sValue, bFixed) {
	var oFacet	= new cXSFacet;
	oFacet.lexicalFacetValue	= sValue;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;

	return oFacet;
};

function fXMLSchema11_createMultiValueFacet(nFacet, aValues, bFixed) {
	var oFacet	= new cXSMultiValueFacet;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;
	for (var nIndex = 0; nIndex < aValues.length; nIndex++)
		oFacet.lexicalFacetValues.$add(aValues[nIndex]);

	return oFacet;
};

// Datatypes initialization
oXMLSchema11_builtinDataTypes["anyType"]	= fXMLSchema11_createBuiltType(cXSConstants.ANYTYPE_DT, 0);
	oXMLSchema11_builtinDataTypes["anySimpleType"]	= fXMLSchema11_createBuiltType(cXSConstants.ANYSIMPLETYPE_DT, cXSConstants.ANYTYPE_DT);
		oXMLSchema11_builtinDataTypes["anyAtomicType"]	= fXMLSchema11_createBuiltType(cXSConstants.ANYATOMICTYPE_DT, cXSConstants.ANYSIMPLETYPE_DT);
			// primititve types
			oXMLSchema11_primitiveDataTypes[cXSConstants.ANYURI_DT]	=
			oXMLSchema11_builtinDataTypes["anyURI"]			= fXMLSchema11_createBuiltType(cXSConstants.ANYURI_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.BASE64BINARY_DT]	=
			oXMLSchema11_builtinDataTypes["base64Binary"]	= fXMLSchema11_createBuiltType(cXSConstants.BASE64BINARY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.BOOLEAN_DT]	=
			oXMLSchema11_builtinDataTypes["boolean"]			= fXMLSchema11_createBuiltType(cXSConstants.BOOLEAN_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.DATE_DT]	=
			oXMLSchema11_builtinDataTypes["date"]			= fXMLSchema11_createBuiltType(cXSConstants.DATE_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.DATETIME_DT]	=
			oXMLSchema11_builtinDataTypes["dateTime"]		= fXMLSchema11_createBuiltType(cXSConstants.DATETIME_DT, cXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oXMLSchema11_builtinDataTypes["dateTimeStamp"]	= fXMLSchema11_createBuiltType(cXSConstants.DATETIMESTAMP_DT, cXSConstants.DATETIME_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.DECIMAL_DT]	=
			oXMLSchema11_builtinDataTypes["decimal"]			= fXMLSchema11_createBuiltType(cXSConstants.DECIMAL_DT, cXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oXMLSchema11_builtinDataTypes["integer"]			= fXMLSchema11_createBuiltType(cXSConstants.INTEGER_DT, cXSConstants.DECIMAL_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS, '0', true)], [fXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[\\-+]?[0-9]+'])]);
					oXMLSchema11_builtinDataTypes["long"]				= fXMLSchema11_createBuiltType(cXSConstants.LONG_DT, cXSConstants.INTEGER_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-9223372036854775808'), fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '9223372036854775807')]);
						oXMLSchema11_builtinDataTypes["int"]					= fXMLSchema11_createBuiltType(cXSConstants.INT_DT, cXSConstants.LONG_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-2147483648'), fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '2147483647')]);
							oXMLSchema11_builtinDataTypes["short"]				= fXMLSchema11_createBuiltType(cXSConstants.SHORT_DT, cXSConstants.INT_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-32768'), fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '32767')]);
								oXMLSchema11_builtinDataTypes["byte"]				= fXMLSchema11_createBuiltType(cXSConstants.BYTE_DT, cXSConstants.SHORT_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-128'), fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '127')]);
					oXMLSchema11_builtinDataTypes["nonNegativeInteger"]	= fXMLSchema11_createBuiltType(cXSConstants.NONNEGATIVEINTEGER_DT, cXSConstants.INTEGER_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '0')]);
						oXMLSchema11_builtinDataTypes["positiveInteger"]		= fXMLSchema11_createBuiltType(cXSConstants.POSITIVEINTEGER_DT, cXSConstants.NONNEGATIVEINTEGER_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '1')]);
						oXMLSchema11_builtinDataTypes["unsignedLong"]		= fXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDLONG_DT, cXSConstants.NONNEGATIVEINTEGER_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '18446744073709551615')]);
							oXMLSchema11_builtinDataTypes["unsignedInt"]			= fXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDINT_DT, cXSConstants.UNSIGNEDLONG_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '4294967295')]);
								oXMLSchema11_builtinDataTypes["unsignedShort"]		= fXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDSHORT_DT, cXSConstants.UNSIGNEDINT_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '65535')]);
									oXMLSchema11_builtinDataTypes["unsignedByte"]		= fXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDBYTE_DT, cXSConstants.UNSIGNEDSHORT_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '255')]);
					oXMLSchema11_builtinDataTypes["nonPositiveInteger"]	= fXMLSchema11_createBuiltType(cXSConstants.NONPOSITIVEINTEGER_DT, cXSConstants.INTEGER_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '0')]);
						oXMLSchema11_builtinDataTypes["negativeInteger"]		= fXMLSchema11_createBuiltType(cXSConstants.NEGATIVEINTEGER_DT, cXSConstants.NONPOSITIVEINTEGER_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '-1')]);
			oXMLSchema11_primitiveDataTypes[cXSConstants.DOUBLE_DT]	=
			oXMLSchema11_builtinDataTypes["double"]			= fXMLSchema11_createBuiltType(cXSConstants.DOUBLE_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.DURATION_DT]	=
			oXMLSchema11_builtinDataTypes["duration"]		= fXMLSchema11_createBuiltType(cXSConstants.DURATION_DT, cXSConstants.ANYATOMICTYPE_DT);
				oXMLSchema11_builtinDataTypes["dayTimeDuration"]	= fXMLSchema11_createBuiltType(cXSConstants.DAYTIMEDURATION_DT, cXSConstants.DURATION_DT);
				oXMLSchema11_builtinDataTypes["dayMonthDuration"]= fXMLSchema11_createBuiltType(cXSConstants.DAYMONTHDURATION_DT, cXSConstants.DURATION_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.FLOAT_DT]	=
			oXMLSchema11_builtinDataTypes["float"]			= fXMLSchema11_createBuiltType(cXSConstants.FLOAT_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.GDAY_DT]	=
			oXMLSchema11_builtinDataTypes["gDay"]			= fXMLSchema11_createBuiltType(cXSConstants.GDAY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.GMONTH_DT]	=
			oXMLSchema11_builtinDataTypes["gMonth"]			= fXMLSchema11_createBuiltType(cXSConstants.GMONTH_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.GMONTHDAY_DT]	=
			oXMLSchema11_builtinDataTypes["gMonthDay"]		= fXMLSchema11_createBuiltType(cXSConstants.GMONTHDAY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.GYEAR_DT]	=
			oXMLSchema11_builtinDataTypes["gYear"]			= fXMLSchema11_createBuiltType(cXSConstants.GYEAR_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.GYEARMONTH_DT]	=
			oXMLSchema11_builtinDataTypes["gYearMonth"]		= fXMLSchema11_createBuiltType(cXSConstants.GYEARMONTH_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.HEXBINARY_DT]	=
			oXMLSchema11_builtinDataTypes["hexBinary"]		= fXMLSchema11_createBuiltType(cXSConstants.HEXBINARY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.NOTATION_DT]	=
			oXMLSchema11_builtinDataTypes["NOTATION"]		= fXMLSchema11_createBuiltType(cXSConstants.NOTATION_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.PRECISIONDECIMAL_DT]	=
			oXMLSchema11_builtinDataTypes["precisionDecimal"]= fXMLSchema11_createBuiltType(cXSConstants.PRECISIONDECIMAL_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.QNAME_DT]	=
			oXMLSchema11_builtinDataTypes["QName"]			= fXMLSchema11_createBuiltType(cXSConstants.QNAME_DT, cXSConstants.ANYATOMICTYPE_DT);
			oXMLSchema11_primitiveDataTypes[cXSConstants.STRING_DT]	=
			oXMLSchema11_builtinDataTypes["string"]			= fXMLSchema11_createBuiltType(cXSConstants.STRING_DT, cXSConstants.ANYATOMICTYPE_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "preserve")]);
				// Other built-in atomic types
				oXMLSchema11_builtinDataTypes["normalizedString"]= fXMLSchema11_createBuiltType(cXSConstants.NORMALIZEDSTRING_DT, cXSConstants.STRING_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "replace")]);
					oXMLSchema11_builtinDataTypes["token"]			= fXMLSchema11_createBuiltType(cXSConstants.TOKEN_DT, cXSConstants.NORMALIZEDSTRING_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oXMLSchema11_builtinDataTypes["language"]		= fXMLSchema11_createBuiltType(cXSConstants.LANGUAGE_DT, cXSConstants.TOKEN_DT, [], [fXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*'])]);
						oXMLSchema11_builtinDataTypes["Name"]			= fXMLSchema11_createBuiltType(cXSConstants.NAME_DT, cXSConstants.TOKEN_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['\\i\\c*'])]);
							oXMLSchema11_builtinDataTypes["NCName"]			= fXMLSchema11_createBuiltType(cXSConstants.NCNAME_DT, cXSConstants.NAME_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[\\i-[:]][\\c-[:]]*'])]);
								oXMLSchema11_builtinDataTypes["ENTITY"]			= fXMLSchema11_createBuiltType(cXSConstants.ENITITY_DT, cXSConstants.NCNAME_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oXMLSchema11_builtinDataTypes["ID"]				= fXMLSchema11_createBuiltType(cXSConstants.ID_DT, cXSConstants.NCNAME_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oXMLSchema11_builtinDataTypes["IDREF"]			= fXMLSchema11_createBuiltType(cXSConstants.IDREF_DT, cXSConstants.NCNAME_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oXMLSchema11_builtinDataTypes["NMTOKEN"]			= fXMLSchema11_createBuiltType(cXSConstants.NMTOKEN_DT, cXSConstants.TOKEN_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ["\\c"])]);
			oXMLSchema11_primitiveDataTypes[cXSConstants.TIME_DT]	=
			oXMLSchema11_builtinDataTypes["time"]			= fXMLSchema11_createBuiltType(cXSConstants.TIME_DT, cXSConstants.ANYATOMICTYPE_DT);
		// Built-in list types
		oXMLSchema11_builtinDataTypes["ENTITIES"]		= fXMLSchema11_createBuiltListType(cXSConstants.LIST_DT, cXSConstants.ENITITY_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fXMLSchema11_createFacet("minLength", '1')]);
		oXMLSchema11_builtinDataTypes["IDREFS"]			= fXMLSchema11_createBuiltListType(cXSConstants.LIST_DT, cXSConstants.IDREF_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fXMLSchema11_createFacet("minLength", '1')]);
		oXMLSchema11_builtinDataTypes["NMTOKENS"]		= fXMLSchema11_createBuiltListType(cXSConstants.LIST_DT, cXSConstants.NMTOKEN_DT, [fXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fXMLSchema11_createFacet("minLength", '1')]);

