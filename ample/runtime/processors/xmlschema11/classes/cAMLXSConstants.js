/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cAMLXSConstants	= function() {

};

cAMLXSConstants.ATTRIBUTE_DECLARATION	= 1;
cAMLXSConstants.ELEMENT_DECLARATION		= 2;
cAMLXSConstants.TYPE_DEFINITION			= 3;
cAMLXSConstants.ATTRIBUTE_USE			= 4;
cAMLXSConstants.ATTRIBUTE_GROUP			= 5;
cAMLXSConstants.MODEL_GROUP_DEFINITION	= 6;
cAMLXSConstants.MODEL_GROUP				= 7;
cAMLXSConstants.PARTICLE				= 8;
cAMLXSConstants.WILDCARD				= 9;
cAMLXSConstants.IDENTITY_CONSTRAINT		= 10;
cAMLXSConstants.NOTATION_DECLARATION	= 11;
cAMLXSConstants.ANNOTATION				= 12;
cAMLXSConstants.FACET					= 13;
cAMLXSConstants.MULTIVALUE_FACET		= 14;

cAMLXSConstants.DERIVATION_NONE			= 0;
cAMLXSConstants.DERIVATION_EXTENSION	= 1;
cAMLXSConstants.DERIVATION_RESTRICTION	= 2;
cAMLXSConstants.DERIVATION_SUBSTITUTION	= 3;
cAMLXSConstants.DERIVATION_UNION		= 4;
cAMLXSConstants.DERIVATION_LIST			= 5;

cAMLXSConstants.SCOPE_ABSENT			= 0;
cAMLXSConstants.SCOPE_GLOBAL			= 1;
cAMLXSConstants.SCOPE_LOCAL				= 2;

cAMLXSConstants.VC_NONE					= 0;
cAMLXSConstants.VC_DEFAULT				= 1;
cAMLXSConstants.VC_FIXED				= 2;

// XML Schema 1.0 Datatypes
cAMLXSConstants.ANYSIMPLETYPE_DT		= 1;
cAMLXSConstants.STRING_DT				= 2;
cAMLXSConstants.BOOLEAN_DT				= 3;
cAMLXSConstants.DECIMAL_DT				= 4;
cAMLXSConstants.FLOAT_DT				= 5;
cAMLXSConstants.DOUBLE_DT				= 6;
cAMLXSConstants.DURATION_DT				= 7;
cAMLXSConstants.DATETIME_DT				= 8;
cAMLXSConstants.TIME_DT					= 9;
cAMLXSConstants.DATE_DT					= 10;
cAMLXSConstants.GYEARMONTH_DT			= 11;
cAMLXSConstants.GYEAR_DT				= 12;
cAMLXSConstants.GMONTHDAY_DT			= 13;
cAMLXSConstants.GDAY_DT					= 14;
cAMLXSConstants.GMONTH_DT				= 15;
cAMLXSConstants.HEXBINARY_DT			= 16;
cAMLXSConstants.BASE64BINARY_DT			= 17;
cAMLXSConstants.ANYURI_DT				= 18;
cAMLXSConstants.QNAME_DT				= 19;
cAMLXSConstants.NOTATION_DT				= 20;
cAMLXSConstants.NORMALIZEDSTRING_DT		= 21;
cAMLXSConstants.TOKEN_DT				= 22;
cAMLXSConstants.LANGUAGE_DT				= 23;
cAMLXSConstants.NMTOKEN_DT				= 24;
cAMLXSConstants.NAME_DT					= 25;
cAMLXSConstants.NCNAME_DT				= 26;
cAMLXSConstants.ID_DT					= 27;
cAMLXSConstants.IDREF_DT				= 28;
cAMLXSConstants.ENTITY_DT				= 29;
cAMLXSConstants.INTEGER_DT				= 30;
cAMLXSConstants.NONPOSITIVEINTEGER_DT	= 31;
cAMLXSConstants.NEGATIVEINTEGER_DT		= 32;
cAMLXSConstants.LONG_DT					= 33;
cAMLXSConstants.INT_DT					= 34;
cAMLXSConstants.SHORT_DT				= 35;
cAMLXSConstants.BYTE_DT					= 36;
cAMLXSConstants.NONNEGATIVEINTEGER_DT	= 37;
cAMLXSConstants.UNSIGNEDLONG_DT			= 38;
cAMLXSConstants.UNSIGNEDINT_DT			= 39;
cAMLXSConstants.UNSIGNEDSHORT_DT		= 40;
cAMLXSConstants.UNSIGNEDBYTE_DT			= 41;
cAMLXSConstants.POSITIVEINTEGER_DT		= 42;
cAMLXSConstants.LISTOFUNION_DT			= 43;
cAMLXSConstants.LIST_DT					= 44;
cAMLXSConstants.UNAVAILABLE_DT			= 45;

// XML Schema 1.1 Datatypes
cAMLXSConstants.DATETIMESTAMP_DT		= 46;
cAMLXSConstants.DAYMONTHDURATION_DT		= 47;
cAMLXSConstants.DAYTIMEDURATION_DT		= 48;
cAMLXSConstants.PRECISIONDECIMAL_DT		= 49;
cAMLXSConstants.ANYATOMICTYPE_DT		= 50;
cAMLXSConstants.ANYTYPE_DT				= 51;

//->Source
// XML Schema 1.0 Datatypes
cAMLXSConstants.ANYSIMPLETYPE_DT		= "anySimpleType";
cAMLXSConstants.STRING_DT				= "string";
cAMLXSConstants.BOOLEAN_DT				= "boolean";
cAMLXSConstants.DECIMAL_DT				= "decimal";
cAMLXSConstants.FLOAT_DT				= "float";
cAMLXSConstants.DOUBLE_DT				= "double";
cAMLXSConstants.DURATION_DT				= "duration";
cAMLXSConstants.DATETIME_DT				= "dateTime";
cAMLXSConstants.TIME_DT					= "date";
cAMLXSConstants.DATE_DT					= "time";
cAMLXSConstants.GYEARMONTH_DT			= "gYearMonth";
cAMLXSConstants.GYEAR_DT				= "gYear";
cAMLXSConstants.GMONTHDAY_DT			= "gMonthDay";
cAMLXSConstants.GDAY_DT					= "gDay";
cAMLXSConstants.GMONTH_DT				= "gMonth";
cAMLXSConstants.HEXBINARY_DT			= "hexBinary";
cAMLXSConstants.BASE64BINARY_DT			= "base64Binary";
cAMLXSConstants.ANYURI_DT				= "anyURI";
cAMLXSConstants.QNAME_DT				= "QName";
cAMLXSConstants.NOTATION_DT				= "NOTATION";
cAMLXSConstants.NORMALIZEDSTRING_DT		= "normalizedString";
cAMLXSConstants.TOKEN_DT				= "token";
cAMLXSConstants.LANGUAGE_DT				= "language";
cAMLXSConstants.NMTOKEN_DT				= "NMTOKEN";
cAMLXSConstants.NAME_DT					= "Name";
cAMLXSConstants.NCNAME_DT				= "NCName";
cAMLXSConstants.ID_DT					= "ID";
cAMLXSConstants.IDREF_DT				= "IDREF";
cAMLXSConstants.ENTITY_DT				= "ENTITY";
cAMLXSConstants.INTEGER_DT				= "integer";
cAMLXSConstants.NONPOSITIVEINTEGER_DT	= "nonPositiveInteger";
cAMLXSConstants.NEGATIVEINTEGER_DT		= "negativeInteger";
cAMLXSConstants.LONG_DT					= "long";
cAMLXSConstants.INT_DT					= "int";
cAMLXSConstants.SHORT_DT				= "short";
cAMLXSConstants.BYTE_DT					= "byte";
cAMLXSConstants.NONNEGATIVEINTEGER_DT	= "nonNegativeInteger";
cAMLXSConstants.UNSIGNEDLONG_DT			= "unsignedLong";
cAMLXSConstants.UNSIGNEDINT_DT			= "unsignedInt";
cAMLXSConstants.UNSIGNEDSHORT_DT		= "unsignedShort";
cAMLXSConstants.UNSIGNEDBYTE_DT			= "unsignedByte";
cAMLXSConstants.POSITIVEINTEGER_DT		= "positiveInteger";
cAMLXSConstants.LISTOFUNION_DT			= 43;
cAMLXSConstants.LIST_DT					= "#list#";
cAMLXSConstants.UNAVAILABLE_DT			= 45;

// XML Schema 1.1 Datatypes
cAMLXSConstants.DATETIMESTAMP_DT		= "dateTimeStamp";
cAMLXSConstants.DAYMONTHDURATION_DT		= "dayMonthDuration";
cAMLXSConstants.DAYTIMEDURATION_DT		= "dayTimeDuration";
cAMLXSConstants.PRECISIONDECIMAL_DT		= "precisionDecimal";
cAMLXSConstants.ANYATOMICTYPE_DT		= "anyAtomicType";
cAMLXSConstants.ANYTYPE_DT				= "anyType";
//<-Source
