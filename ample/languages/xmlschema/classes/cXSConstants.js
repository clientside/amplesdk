/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSConstants	= function() {

};

cXSConstants.ATTRIBUTE_DECLARATION	= 1;
cXSConstants.ELEMENT_DECLARATION	= 2;
cXSConstants.TYPE_DEFINITION		= 3;
cXSConstants.ATTRIBUTE_USE			= 4;
cXSConstants.ATTRIBUTE_GROUP		= 5;
cXSConstants.MODEL_GROUP_DEFINITION	= 6;
cXSConstants.MODEL_GROUP			= 7;
cXSConstants.PARTICLE				= 8;
cXSConstants.WILDCARD				= 9;
cXSConstants.IDENTITY_CONSTRAINT	= 10;
cXSConstants.NOTATION_DECLARATION	= 11;
cXSConstants.ANNOTATION				= 12;
cXSConstants.FACET					= 13;
cXSConstants.MULTIVALUE_FACET		= 14;

cXSConstants.DERIVATION_NONE		= 0;
cXSConstants.DERIVATION_EXTENSION	= 1;
cXSConstants.DERIVATION_RESTRICTION	= 2;
cXSConstants.DERIVATION_SUBSTITUTION= 3;
cXSConstants.DERIVATION_UNION		= 4;
cXSConstants.DERIVATION_LIST		= 5;

cXSConstants.SCOPE_ABSENT			= 0;
cXSConstants.SCOPE_GLOBAL			= 1;
cXSConstants.SCOPE_LOCAL			= 2;

cXSConstants.VC_NONE				= 0;
cXSConstants.VC_DEFAULT				= 1;
cXSConstants.VC_FIXED				= 2;

// XML Schema 1.0 Datatypes
cXSConstants.ANYSIMPLETYPE_DT		= 1;
cXSConstants.STRING_DT				= 2;
cXSConstants.BOOLEAN_DT				= 3;
cXSConstants.DECIMAL_DT				= 4;
cXSConstants.FLOAT_DT				= 5;
cXSConstants.DOUBLE_DT				= 6;
cXSConstants.DURATION_DT			= 7;
cXSConstants.DATETIME_DT			= 8;
cXSConstants.TIME_DT				= 9;
cXSConstants.DATE_DT				= 10;
cXSConstants.GYEARMONTH_DT			= 11;
cXSConstants.GYEAR_DT				= 12;
cXSConstants.GMONTHDAY_DT			= 13;
cXSConstants.GDAY_DT				= 14;
cXSConstants.GMONTH_DT				= 15;
cXSConstants.HEXBINARY_DT			= 16;
cXSConstants.BASE64BINARY_DT		= 17;
cXSConstants.ANYURI_DT				= 18;
cXSConstants.QNAME_DT				= 19;
cXSConstants.NOTATION_DT			= 20;
cXSConstants.NORMALIZEDSTRING_DT	= 21;
cXSConstants.TOKEN_DT				= 22;
cXSConstants.LANGUAGE_DT			= 23;
cXSConstants.NMTOKEN_DT				= 24;
cXSConstants.NAME_DT				= 25;
cXSConstants.NCNAME_DT				= 26;
cXSConstants.ID_DT					= 27;
cXSConstants.IDREF_DT				= 28;
cXSConstants.ENTITY_DT				= 29;
cXSConstants.INTEGER_DT				= 30;
cXSConstants.NONPOSITIVEINTEGER_DT	= 31;
cXSConstants.NEGATIVEINTEGER_DT		= 32;
cXSConstants.LONG_DT				= 33;
cXSConstants.INT_DT					= 34;
cXSConstants.SHORT_DT				= 35;
cXSConstants.BYTE_DT				= 36;
cXSConstants.NONNEGATIVEINTEGER_DT	= 37;
cXSConstants.UNSIGNEDLONG_DT		= 38;
cXSConstants.UNSIGNEDINT_DT			= 39;
cXSConstants.UNSIGNEDSHORT_DT		= 40;
cXSConstants.UNSIGNEDBYTE_DT		= 41;
cXSConstants.POSITIVEINTEGER_DT		= 42;
cXSConstants.LISTOFUNION_DT			= 43;
cXSConstants.LIST_DT				= 44;
cXSConstants.UNAVAILABLE_DT			= 45;

// XML Schema 1.1 Datatypes
cXSConstants.DATETIMESTAMP_DT		= 46;
cXSConstants.DAYMONTHDURATION_DT	= 47;
cXSConstants.DAYTIMEDURATION_DT		= 48;
cXSConstants.PRECISIONDECIMAL_DT	= 49;
cXSConstants.ANYATOMICTYPE_DT		= 50;
cXSConstants.ANYTYPE_DT				= 51;

//->Source
// XML Schema 1.0 Datatypes
cXSConstants.ANYSIMPLETYPE_DT		= "anySimpleType";
cXSConstants.STRING_DT				= "string";
cXSConstants.BOOLEAN_DT				= "boolean";
cXSConstants.DECIMAL_DT				= "decimal";
cXSConstants.FLOAT_DT				= "float";
cXSConstants.DOUBLE_DT				= "double";
cXSConstants.DURATION_DT			= "duration";
cXSConstants.DATETIME_DT			= "dateTime";
cXSConstants.TIME_DT				= "date";
cXSConstants.DATE_DT				= "time";
cXSConstants.GYEARMONTH_DT			= "gYearMonth";
cXSConstants.GYEAR_DT				= "gYear";
cXSConstants.GMONTHDAY_DT			= "gMonthDay";
cXSConstants.GDAY_DT				= "gDay";
cXSConstants.GMONTH_DT				= "gMonth";
cXSConstants.HEXBINARY_DT			= "hexBinary";
cXSConstants.BASE64BINARY_DT		= "base64Binary";
cXSConstants.ANYURI_DT				= "anyURI";
cXSConstants.QNAME_DT				= "QName";
cXSConstants.NOTATION_DT			= "NOTATION";
cXSConstants.NORMALIZEDSTRING_DT	= "normalizedString";
cXSConstants.TOKEN_DT				= "token";
cXSConstants.LANGUAGE_DT			= "language";
cXSConstants.NMTOKEN_DT				= "NMTOKEN";
cXSConstants.NAME_DT				= "Name";
cXSConstants.NCNAME_DT				= "NCName";
cXSConstants.ID_DT					= "ID";
cXSConstants.IDREF_DT				= "IDREF";
cXSConstants.ENTITY_DT				= "ENTITY";
cXSConstants.INTEGER_DT				= "integer";
cXSConstants.NONPOSITIVEINTEGER_DT	= "nonPositiveInteger";
cXSConstants.NEGATIVEINTEGER_DT		= "negativeInteger";
cXSConstants.LONG_DT				= "long";
cXSConstants.INT_DT					= "int";
cXSConstants.SHORT_DT				= "short";
cXSConstants.BYTE_DT				= "byte";
cXSConstants.NONNEGATIVEINTEGER_DT	= "nonNegativeInteger";
cXSConstants.UNSIGNEDLONG_DT		= "unsignedLong";
cXSConstants.UNSIGNEDINT_DT			= "unsignedInt";
cXSConstants.UNSIGNEDSHORT_DT		= "unsignedShort";
cXSConstants.UNSIGNEDBYTE_DT		= "unsignedByte";
cXSConstants.POSITIVEINTEGER_DT		= "positiveInteger";
cXSConstants.LISTOFUNION_DT			= 43;
cXSConstants.LIST_DT				= "#list#";
cXSConstants.UNAVAILABLE_DT			= 45;

// XML Schema 1.1 Datatypes
cXSConstants.DATETIMESTAMP_DT		= "dateTimeStamp";
cXSConstants.DAYMONTHDURATION_DT	= "dayMonthDuration";
cXSConstants.DAYTIMEDURATION_DT		= "dayTimeDuration";
cXSConstants.PRECISIONDECIMAL_DT	= "precisionDecimal";
cXSConstants.ANYATOMICTYPE_DT		= "anyAtomicType";
cXSConstants.ANYTYPE_DT				= "anyType";
//<-Source
