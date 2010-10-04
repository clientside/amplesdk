/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create Built-in datatypes XML Schema
var oAMLXMLSchema11_namespaceDataTypes	= new cXSNamespaceItem,
	oAMLXMLSchema11_builtinDataTypes	= oAMLXMLSchema11_namespaceDataTypes.$types,
	oAMLXMLSchema11_primitiveDataTypes	= {};
oAMLXMLSchema11_namespaceDataTypes.schemaNamespace	= sAMLXMLSchema11_namespaceURI;
oAMLXMLSchema11_model.namespaces.$add(sAMLXMLSchema11_namespaceURI);
oAMLXMLSchema11_model.namespaceItems.$add(oAMLXMLSchema11_namespaceDataTypes);


/* Builtin datatypes */
function fAMLXMLSchema11_createBuiltType(nType, nBaseType, aFacets, aMultiValueFacets) {
	var oType	= new cXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oAMLXMLSchema11_builtinDataTypes[nBaseType];
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

function fAMLXMLSchema11_createBuiltListType(nType, nItemType, aFacets, aMultiValueFacets) {
	var oType	= new cXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oAMLXMLSchema11_builtinDataTypes[cXSConstants.ANYSIMPLETYPE_DT];
	oType.anonymous		= false;
	// XSSimpleTypeDefinition interface
	oType.variety		= cXSSimpleTypeDefinition.VARIETY_LIST;
	oType.itemType		= oAMLXMLSchema11_builtinDataTypes[nItemType];
	oType.builtInKind	= nType;

	if (aFacets)
		for (var nIndex = 0; nIndex < aFacets.length; nIndex++)
			oType.facets.$add(aFacets[nIndex]);
	if (aMultiValueFacets)
		for (var nIndex = 0; nIndex < aMultiValueFacets.length; nIndex++)
			oType.multiValueFacets.$add(aMultiValueFacets[nIndex]);

	return oType;
};

function fAMLXMLSchema11_createFacet(nFacet, sValue, bFixed) {
	var oFacet	= new cXSFacet;
	oFacet.lexicalFacetValue	= sValue;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;

	return oFacet;
};

function fAMLXMLSchema11_createMultiValueFacet(nFacet, aValues, bFixed) {
	var oFacet	= new cXSMultiValueFacet;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;
	for (var nIndex = 0; nIndex < aValues.length; nIndex++)
		oFacet.lexicalFacetValues.$add(aValues[nIndex]);

	return oFacet;
};

// Datatypes initialization
oAMLXMLSchema11_builtinDataTypes["anyType"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.ANYTYPE_DT, 0);
	oAMLXMLSchema11_builtinDataTypes["anySimpleType"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.ANYSIMPLETYPE_DT, cXSConstants.ANYTYPE_DT);
		oAMLXMLSchema11_builtinDataTypes["anyAtomicType"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.ANYATOMICTYPE_DT, cXSConstants.ANYSIMPLETYPE_DT);
			// primititve types
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.ANYURI_DT]	=
			oAMLXMLSchema11_builtinDataTypes["anyURI"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.ANYURI_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.BASE64BINARY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["base64Binary"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.BASE64BINARY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.BOOLEAN_DT]	=
			oAMLXMLSchema11_builtinDataTypes["boolean"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.BOOLEAN_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.DATE_DT]	=
			oAMLXMLSchema11_builtinDataTypes["date"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.DATE_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.DATETIME_DT]	=
			oAMLXMLSchema11_builtinDataTypes["dateTime"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.DATETIME_DT, cXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oAMLXMLSchema11_builtinDataTypes["dateTimeStamp"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.DATETIMESTAMP_DT, cXSConstants.DATETIME_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.DECIMAL_DT]	=
			oAMLXMLSchema11_builtinDataTypes["decimal"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.DECIMAL_DT, cXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oAMLXMLSchema11_builtinDataTypes["integer"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.INTEGER_DT, cXSConstants.DECIMAL_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS, '0', true)], [fAMLXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[\\-+]?[0-9]+'])]);
					oAMLXMLSchema11_builtinDataTypes["long"]				= fAMLXMLSchema11_createBuiltType(cXSConstants.LONG_DT, cXSConstants.INTEGER_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-9223372036854775808'), fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '9223372036854775807')]);
						oAMLXMLSchema11_builtinDataTypes["int"]					= fAMLXMLSchema11_createBuiltType(cXSConstants.INT_DT, cXSConstants.LONG_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-2147483648'), fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '2147483647')]);
							oAMLXMLSchema11_builtinDataTypes["short"]				= fAMLXMLSchema11_createBuiltType(cXSConstants.SHORT_DT, cXSConstants.INT_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-32768'), fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '32767')]);
								oAMLXMLSchema11_builtinDataTypes["byte"]				= fAMLXMLSchema11_createBuiltType(cXSConstants.BYTE_DT, cXSConstants.SHORT_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-128'), fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '127')]);
					oAMLXMLSchema11_builtinDataTypes["nonNegativeInteger"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.NONNEGATIVEINTEGER_DT, cXSConstants.INTEGER_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '0')]);
						oAMLXMLSchema11_builtinDataTypes["positiveInteger"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.POSITIVEINTEGER_DT, cXSConstants.NONNEGATIVEINTEGER_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MININCLUSIVE, '1')]);
						oAMLXMLSchema11_builtinDataTypes["unsignedLong"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDLONG_DT, cXSConstants.NONNEGATIVEINTEGER_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '18446744073709551615')]);
							oAMLXMLSchema11_builtinDataTypes["unsignedInt"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDINT_DT, cXSConstants.UNSIGNEDLONG_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '4294967295')]);
								oAMLXMLSchema11_builtinDataTypes["unsignedShort"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDSHORT_DT, cXSConstants.UNSIGNEDINT_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '65535')]);
									oAMLXMLSchema11_builtinDataTypes["unsignedByte"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.UNSIGNEDBYTE_DT, cXSConstants.UNSIGNEDSHORT_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '255')]);
					oAMLXMLSchema11_builtinDataTypes["nonPositiveInteger"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.NONPOSITIVEINTEGER_DT, cXSConstants.INTEGER_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '0')]);
						oAMLXMLSchema11_builtinDataTypes["negativeInteger"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.NEGATIVEINTEGER_DT, cXSConstants.NONPOSITIVEINTEGER_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '-1')]);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.DOUBLE_DT]	=
			oAMLXMLSchema11_builtinDataTypes["double"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.DOUBLE_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.DURATION_DT]	=
			oAMLXMLSchema11_builtinDataTypes["duration"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.DURATION_DT, cXSConstants.ANYATOMICTYPE_DT);
				oAMLXMLSchema11_builtinDataTypes["dayTimeDuration"]	= fAMLXMLSchema11_createBuiltType(cXSConstants.DAYTIMEDURATION_DT, cXSConstants.DURATION_DT);
				oAMLXMLSchema11_builtinDataTypes["dayMonthDuration"]= fAMLXMLSchema11_createBuiltType(cXSConstants.DAYMONTHDURATION_DT, cXSConstants.DURATION_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.FLOAT_DT]	=
			oAMLXMLSchema11_builtinDataTypes["float"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.FLOAT_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.GDAY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gDay"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.GDAY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.GMONTH_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gMonth"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.GMONTH_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.GMONTHDAY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gMonthDay"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.GMONTHDAY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.GYEAR_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gYear"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.GYEAR_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.GYEARMONTH_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gYearMonth"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.GYEARMONTH_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.HEXBINARY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["hexBinary"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.HEXBINARY_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.NOTATION_DT]	=
			oAMLXMLSchema11_builtinDataTypes["NOTATION"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.NOTATION_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.PRECISIONDECIMAL_DT]	=
			oAMLXMLSchema11_builtinDataTypes["precisionDecimal"]= fAMLXMLSchema11_createBuiltType(cXSConstants.PRECISIONDECIMAL_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.QNAME_DT]	=
			oAMLXMLSchema11_builtinDataTypes["QName"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.QNAME_DT, cXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.STRING_DT]	=
			oAMLXMLSchema11_builtinDataTypes["string"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.STRING_DT, cXSConstants.ANYATOMICTYPE_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "preserve")]);
				// Other built-in atomic types
				oAMLXMLSchema11_builtinDataTypes["normalizedString"]= fAMLXMLSchema11_createBuiltType(cXSConstants.NORMALIZEDSTRING_DT, cXSConstants.STRING_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "replace")]);
					oAMLXMLSchema11_builtinDataTypes["token"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.TOKEN_DT, cXSConstants.NORMALIZEDSTRING_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oAMLXMLSchema11_builtinDataTypes["language"]		= fAMLXMLSchema11_createBuiltType(cXSConstants.LANGUAGE_DT, cXSConstants.TOKEN_DT, [], [fAMLXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*'])]);
						oAMLXMLSchema11_builtinDataTypes["Name"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.NAME_DT, cXSConstants.TOKEN_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fAMLXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['\\i\\c*'])]);
							oAMLXMLSchema11_builtinDataTypes["NCName"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.NCNAME_DT, cXSConstants.NAME_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fAMLXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ['[\\i-[:]][\\c-[:]]*'])]);
								oAMLXMLSchema11_builtinDataTypes["ENTITY"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.ENITITY_DT, cXSConstants.NCNAME_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oAMLXMLSchema11_builtinDataTypes["ID"]				= fAMLXMLSchema11_createBuiltType(cXSConstants.ID_DT, cXSConstants.NCNAME_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oAMLXMLSchema11_builtinDataTypes["IDREF"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.IDREF_DT, cXSConstants.NCNAME_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oAMLXMLSchema11_builtinDataTypes["NMTOKEN"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.NMTOKEN_DT, cXSConstants.TOKEN_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fAMLXMLSchema11_createMultiValueFacet(cXSSimpleTypeDefinition.FACET_PATTERN, ["\\c"])]);
			oAMLXMLSchema11_primitiveDataTypes[cXSConstants.TIME_DT]	=
			oAMLXMLSchema11_builtinDataTypes["time"]			= fAMLXMLSchema11_createBuiltType(cXSConstants.TIME_DT, cXSConstants.ANYATOMICTYPE_DT);
		// Built-in list types
		oAMLXMLSchema11_builtinDataTypes["ENTITIES"]		= fAMLXMLSchema11_createBuiltListType(cXSConstants.LIST_DT, cXSConstants.ENITITY_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fAMLXMLSchema11_createFacet("minLength", '1')]);
		oAMLXMLSchema11_builtinDataTypes["IDREFS"]			= fAMLXMLSchema11_createBuiltListType(cXSConstants.LIST_DT, cXSConstants.IDREF_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fAMLXMLSchema11_createFacet("minLength", '1')]);
		oAMLXMLSchema11_builtinDataTypes["NMTOKENS"]		= fAMLXMLSchema11_createBuiltListType(cXSConstants.LIST_DT, cXSConstants.NMTOKEN_DT, [fAMLXMLSchema11_createFacet(cXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fAMLXMLSchema11_createFacet("minLength", '1')]);

