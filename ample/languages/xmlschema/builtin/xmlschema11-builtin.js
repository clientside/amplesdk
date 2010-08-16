/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

// Create Built-in datatypes XML Schema
var oAMLXMLSchema11_namespaceDataTypes	= new cAMLXSNamespaceItem,
	oAMLXMLSchema11_builtinDataTypes	= oAMLXMLSchema11_namespaceDataTypes.$types,
	oAMLXMLSchema11_primitiveDataTypes	= {};
oAMLXMLSchema11_namespaceDataTypes.schemaNamespace	= sAMLXMLSchema11_namespaceURI;
oAMLXMLSchema11_model.namespaces.$add(sAMLXMLSchema11_namespaceURI);
oAMLXMLSchema11_model.namespaceItems.$add(oAMLXMLSchema11_namespaceDataTypes);


/* Builtin datatypes */
function fAMLXMLSchema11_createBuiltType(nType, nBaseType, aFacets, aMultiValueFacets) {
	var oType	= new cAMLXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cAMLXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oAMLXMLSchema11_builtinDataTypes[nBaseType];
	oType.anonymous		= false;
	// XSSimpleTypeDefinition interface
	if (nType == cAMLXSConstants.ANYTYPE_DT || nType == cAMLXSConstants.ANYSIMPLETYPE_DT)
		oType.variety	= cAMLXSSimpleTypeDefinition.VARIETY_ABSENT;
	else
		oType.variety	= cAMLXSSimpleTypeDefinition.VARIETY_ATOMIC;
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
	var oType	= new cAMLXSSimpleTypeDefinition;
	// XSTypeDefinition interface
	oType.typeCategory	= cAMLXSTypeDefinition.SIMPLE_TYPE;
	oType.baseType		= oAMLXMLSchema11_builtinDataTypes[cAMLXSConstants.ANYSIMPLETYPE_DT];
	oType.anonymous		= false;
	// XSSimpleTypeDefinition interface
	oType.variety		= cAMLXSSimpleTypeDefinition.VARIETY_LIST;
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
	var oFacet	= new cAMLXSFacet;
	oFacet.lexicalFacetValue	= sValue;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;

	return oFacet;
};

function fAMLXMLSchema11_createMultiValueFacet(nFacet, aValues, bFixed) {
	var oFacet	= new cAMLXSMultiValueFacet;
	oFacet.fixed		= !!bFixed;
	oFacet.facetKind	= nFacet;
	for (var nIndex = 0; nIndex < aValues.length; nIndex++)
		oFacet.lexicalFacetValues.$add(aValues[nIndex]);

	return oFacet;
};

// Datatypes initialization
oAMLXMLSchema11_builtinDataTypes["anyType"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.ANYTYPE_DT, 0);
	oAMLXMLSchema11_builtinDataTypes["anySimpleType"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.ANYSIMPLETYPE_DT, cAMLXSConstants.ANYTYPE_DT);
		oAMLXMLSchema11_builtinDataTypes["anyAtomicType"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.ANYATOMICTYPE_DT, cAMLXSConstants.ANYSIMPLETYPE_DT);
			// primititve types
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.ANYURI_DT]	=
			oAMLXMLSchema11_builtinDataTypes["anyURI"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.ANYURI_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.BASE64BINARY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["base64Binary"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.BASE64BINARY_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.BOOLEAN_DT]	=
			oAMLXMLSchema11_builtinDataTypes["boolean"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.BOOLEAN_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.DATE_DT]	=
			oAMLXMLSchema11_builtinDataTypes["date"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DATE_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.DATETIME_DT]	=
			oAMLXMLSchema11_builtinDataTypes["dateTime"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DATETIME_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oAMLXMLSchema11_builtinDataTypes["dateTimeStamp"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DATETIMESTAMP_DT, cAMLXSConstants.DATETIME_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.DECIMAL_DT]	=
			oAMLXMLSchema11_builtinDataTypes["decimal"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DECIMAL_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
				// Other built-in atomic types
				oAMLXMLSchema11_builtinDataTypes["integer"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.INTEGER_DT, cAMLXSConstants.DECIMAL_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_FRACTIONDIGITS, '0', true)], [fAMLXMLSchema11_createMultiValueFacet(cAMLXSSimpleTypeDefinition.FACET_PATTERN, ['[\\-+]?[0-9]+'])]);
					oAMLXMLSchema11_builtinDataTypes["long"]				= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.LONG_DT, cAMLXSConstants.INTEGER_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-9223372036854775808'), fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '9223372036854775807')]);
						oAMLXMLSchema11_builtinDataTypes["int"]					= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.INT_DT, cAMLXSConstants.LONG_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-2147483648'), fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '2147483647')]);
							oAMLXMLSchema11_builtinDataTypes["short"]				= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.SHORT_DT, cAMLXSConstants.INT_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-32768'), fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '32767')]);
								oAMLXMLSchema11_builtinDataTypes["byte"]				= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.BYTE_DT, cAMLXSConstants.SHORT_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE, '-128'), fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '127')]);
					oAMLXMLSchema11_builtinDataTypes["nonNegativeInteger"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NONNEGATIVEINTEGER_DT, cAMLXSConstants.INTEGER_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE, '0')]);
						oAMLXMLSchema11_builtinDataTypes["positiveInteger"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.POSITIVEINTEGER_DT, cAMLXSConstants.NONNEGATIVEINTEGER_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MININCLUSIVE, '1')]);
						oAMLXMLSchema11_builtinDataTypes["unsignedLong"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.UNSIGNEDLONG_DT, cAMLXSConstants.NONNEGATIVEINTEGER_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '18446744073709551615')]);
							oAMLXMLSchema11_builtinDataTypes["unsignedInt"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.UNSIGNEDINT_DT, cAMLXSConstants.UNSIGNEDLONG_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '4294967295')]);
								oAMLXMLSchema11_builtinDataTypes["unsignedShort"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.UNSIGNEDSHORT_DT, cAMLXSConstants.UNSIGNEDINT_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '65535')]);
									oAMLXMLSchema11_builtinDataTypes["unsignedByte"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.UNSIGNEDBYTE_DT, cAMLXSConstants.UNSIGNEDSHORT_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '255')]);
					oAMLXMLSchema11_builtinDataTypes["nonPositiveInteger"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NONPOSITIVEINTEGER_DT, cAMLXSConstants.INTEGER_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '0')]);
						oAMLXMLSchema11_builtinDataTypes["negativeInteger"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NEGATIVEINTEGER_DT, cAMLXSConstants.NONPOSITIVEINTEGER_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_MAXINCLUSIVE, '-1')]);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.DOUBLE_DT]	=
			oAMLXMLSchema11_builtinDataTypes["double"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DOUBLE_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.DURATION_DT]	=
			oAMLXMLSchema11_builtinDataTypes["duration"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DURATION_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
				oAMLXMLSchema11_builtinDataTypes["dayTimeDuration"]	= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DAYTIMEDURATION_DT, cAMLXSConstants.DURATION_DT);
				oAMLXMLSchema11_builtinDataTypes["dayMonthDuration"]= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.DAYMONTHDURATION_DT, cAMLXSConstants.DURATION_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.FLOAT_DT]	=
			oAMLXMLSchema11_builtinDataTypes["float"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.FLOAT_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.GDAY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gDay"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.GDAY_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.GMONTH_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gMonth"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.GMONTH_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.GMONTHDAY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gMonthDay"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.GMONTHDAY_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.GYEAR_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gYear"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.GYEAR_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.GYEARMONTH_DT]	=
			oAMLXMLSchema11_builtinDataTypes["gYearMonth"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.GYEARMONTH_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.HEXBINARY_DT]	=
			oAMLXMLSchema11_builtinDataTypes["hexBinary"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.HEXBINARY_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.NOTATION_DT]	=
			oAMLXMLSchema11_builtinDataTypes["NOTATION"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NOTATION_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.PRECISIONDECIMAL_DT]	=
			oAMLXMLSchema11_builtinDataTypes["precisionDecimal"]= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.PRECISIONDECIMAL_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.QNAME_DT]	=
			oAMLXMLSchema11_builtinDataTypes["QName"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.QNAME_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.STRING_DT]	=
			oAMLXMLSchema11_builtinDataTypes["string"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.STRING_DT, cAMLXSConstants.ANYATOMICTYPE_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "preserve")]);
				// Other built-in atomic types
				oAMLXMLSchema11_builtinDataTypes["normalizedString"]= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NORMALIZEDSTRING_DT, cAMLXSConstants.STRING_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "replace")]);
					oAMLXMLSchema11_builtinDataTypes["token"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.TOKEN_DT, cAMLXSConstants.NORMALIZEDSTRING_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oAMLXMLSchema11_builtinDataTypes["language"]		= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.LANGUAGE_DT, cAMLXSConstants.TOKEN_DT, [], [fAMLXMLSchema11_createMultiValueFacet(cAMLXSSimpleTypeDefinition.FACET_PATTERN, ['[a-zA-Z]{1,8}(-[a-zA-Z0-9]{1,8})*'])]);
						oAMLXMLSchema11_builtinDataTypes["Name"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NAME_DT, cAMLXSConstants.TOKEN_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fAMLXMLSchema11_createMultiValueFacet(cAMLXSSimpleTypeDefinition.FACET_PATTERN, ['\\i\\c*'])]);
							oAMLXMLSchema11_builtinDataTypes["NCName"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NCNAME_DT, cAMLXSConstants.NAME_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fAMLXMLSchema11_createMultiValueFacet(cAMLXSSimpleTypeDefinition.FACET_PATTERN, ['[\\i-[:]][\\c-[:]]*'])]);
								oAMLXMLSchema11_builtinDataTypes["ENTITY"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.ENITITY_DT, cAMLXSConstants.NCNAME_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oAMLXMLSchema11_builtinDataTypes["ID"]				= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.ID_DT, cAMLXSConstants.NCNAME_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
								oAMLXMLSchema11_builtinDataTypes["IDREF"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.IDREF_DT, cAMLXSConstants.NCNAME_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")]);
						oAMLXMLSchema11_builtinDataTypes["NMTOKEN"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.NMTOKEN_DT, cAMLXSConstants.TOKEN_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse")], [fAMLXMLSchema11_createMultiValueFacet(cAMLXSSimpleTypeDefinition.FACET_PATTERN, ["\\c"])]);
			oAMLXMLSchema11_primitiveDataTypes[cAMLXSConstants.TIME_DT]	=
			oAMLXMLSchema11_builtinDataTypes["time"]			= fAMLXMLSchema11_createBuiltType(cAMLXSConstants.TIME_DT, cAMLXSConstants.ANYATOMICTYPE_DT);
		// Built-in list types
		oAMLXMLSchema11_builtinDataTypes["ENTITIES"]		= fAMLXMLSchema11_createBuiltListType(cAMLXSConstants.LIST_DT, cAMLXSConstants.ENITITY_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fAMLXMLSchema11_createFacet("minLength", '1')]);
		oAMLXMLSchema11_builtinDataTypes["IDREFS"]			= fAMLXMLSchema11_createBuiltListType(cAMLXSConstants.LIST_DT, cAMLXSConstants.IDREF_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fAMLXMLSchema11_createFacet("minLength", '1')]);
		oAMLXMLSchema11_builtinDataTypes["NMTOKENS"]		= fAMLXMLSchema11_createBuiltListType(cAMLXSConstants.LIST_DT, cAMLXSConstants.NMTOKEN_DT, [fAMLXMLSchema11_createFacet(cAMLXSSimpleTypeDefinition.FACET_WHITESPACE, "collapse"), fAMLXMLSchema11_createFacet("minLength", '1')]);

