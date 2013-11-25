/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSSimpleTypeDefinition	= function() {
	this.memberTypes		= new cXSObjectList;
	this.lexicalEnumeration	= new ample.classes.DOMStringList;
	this.lexicalPattern		= new ample.classes.DOMStringList;
	this.facets				= new cXSObjectList;
	this.multiValueFacets	= new cXSObjectList;
};

cXSSimpleTypeDefinition.prototype	= new cXSTypeDefinition;

// Constants
cXSSimpleTypeDefinition.VARIETY_ABSENT	= 0;
cXSSimpleTypeDefinition.VARIETY_ATOMIC	= 1;
cXSSimpleTypeDefinition.VARIETY_LIST	= 2;
cXSSimpleTypeDefinition.VARIETY_UNION	= 3;

// XML Schema 1.0
cXSSimpleTypeDefinition.FACET_NONE		= 0;
cXSSimpleTypeDefinition.FACET_LENGTH	= 1;
cXSSimpleTypeDefinition.FACET_MINLENGTH	= 2;
cXSSimpleTypeDefinition.FACET_MAXLENGTH	= 4;
cXSSimpleTypeDefinition.FACET_PATTERN	= 8;
cXSSimpleTypeDefinition.FACET_WHITESPACE	= 16;
cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE	= 32;
cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE	= 64;
cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE	= 128;
cXSSimpleTypeDefinition.FACET_MININCLUSIVE	= 256;
cXSSimpleTypeDefinition.FACET_TOTALDIGITS	= 512;
cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS= 1024;
cXSSimpleTypeDefinition.FACET_ENUMERATION	= 2048;
// XML Schema 1.1
cXSSimpleTypeDefinition.FACET_ASSERTION		= 4096;
cXSSimpleTypeDefinition.FACET_MINSCALE		= 8192;
cXSSimpleTypeDefinition.FACET_MAXSCALE		= 16384;

//->Source
cXSSimpleTypeDefinition.FACET_NONE			= "none";
cXSSimpleTypeDefinition.FACET_LENGTH		= "length";
cXSSimpleTypeDefinition.FACET_MINLENGTH		= "minLength";
cXSSimpleTypeDefinition.FACET_MAXLENGTH		= "maxLength";
cXSSimpleTypeDefinition.FACET_PATTERN		= "pattern";
cXSSimpleTypeDefinition.FACET_WHITESPACE	= "whiteSpace";
cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE	= "maxInclusive";
cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE	= "maxExclusive";
cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE	= "minExclusive";
cXSSimpleTypeDefinition.FACET_MININCLUSIVE	= "minInclulsive";
cXSSimpleTypeDefinition.FACET_TOTALDIGITS	= "totalDigits";
cXSSimpleTypeDefinition.FACET_FRACTIONDIGITS= "fractionDigits";
cXSSimpleTypeDefinition.FACET_ENUMERATION	= "enumeration";
// XML Schema 1.1
cXSSimpleTypeDefinition.FACET_ASSERTION		= "assertion";
cXSSimpleTypeDefinition.FACET_MINSCALE		= "minScale";
cXSSimpleTypeDefinition.FACET_MAXSCALE		= "maxScale";
//<-Source

cXSSimpleTypeDefinition.ORDERED_FALSE	= 0;
cXSSimpleTypeDefinition.ORDERED_PARTIAL	= 1;
cXSSimpleTypeDefinition.ORDERED_TOTAL	= 2;

// XML Schema 1.1
cXSSimpleTypeDefinition.CARDINALITY_FINITE				= 0;
cXSSimpleTypeDefinition.CARDINALITY_COUNTABLY_INFINITE	= 1;

cXSSimpleTypeDefinition.prototype.variety			= null;	// Number
cXSSimpleTypeDefinition.prototype.primitiveType		= null;	// XSSimpleTypeDefinition
cXSSimpleTypeDefinition.prototype.builtInKind		= null;	// Number
cXSSimpleTypeDefinition.prototype.itemType			= null;	// XSSimpleTypeDefinition
cXSSimpleTypeDefinition.prototype.memberTypes		= null;	// XSObjectList
cXSSimpleTypeDefinition.prototype.definedFacets		= null;	// Number
cXSSimpleTypeDefinition.prototype.fixedFacets		= null;	// Number
cXSSimpleTypeDefinition.prototype.lexicalEnumeration= null;	// StringList
cXSSimpleTypeDefinition.prototype.lexicalPattern	= null;	// StringList
cXSSimpleTypeDefinition.prototype.ordered			= null;	// Number
cXSSimpleTypeDefinition.prototype.finite			= null;	// Boolean
cXSSimpleTypeDefinition.prototype.bounded			= null;	// Boolean
cXSSimpleTypeDefinition.prototype.numeric			= null;	// Boolean
cXSSimpleTypeDefinition.prototype.facets			= null;	// XSObjectList
cXSSimpleTypeDefinition.prototype.multiValueFacets	= null;	// XSObjectList
cXSSimpleTypeDefinition.prototype.annotations		= null;	// XSObjectList
// XML Schema 1.1
cXSSimpleTypeDefinition.prototype.cardinality		= null;	// Number


/* @type	Boolean */
cXSSimpleTypeDefinition.prototype.isDefinedFacet	= function(nFacetName) {

};

/* @type	Boolean */
cXSSimpleTypeDefinition.prototype.isFixedFacet	= function(nFacetName) {

};

/* @type	String */
cXSSimpleTypeDefinition.prototype.getLexicalFacetValue	= function(nFacetName) {

};

cXSSimpleTypeDefinition.prototype.$validate	= function(vValue) {
	// Validate arguments
	ample.guard(arguments, [
		["value",		String]
	]);

	return fXSSimpleTypeDefinition_validate(this, vValue);
};


var oXSPrimitives	= {};
oXSPrimitives[cXSConstants.BOOLEAN_DT]		= /^(true|false|1|0)$/;
oXSPrimitives[cXSConstants.DECIMAL_DT]		= /^[+\-]?((\d+(\.\d*)?)|(\.\d+))$/;
oXSPrimitives[cXSConstants.DOUBLE_DT]		=
oXSPrimitives[cXSConstants.FLOAT_DT]		= /^([+\-]?((\d+(\.\d*)?)|(\.\d+))([eE][+\-]?\d+)?|-?INF|NaN)$/;
oXSPrimitives[cXSConstants.DURATION_DT]		= /^(-)?P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)D)?(?:T(?:([0-9]+)H)?(?:([0-9]+)M)?(?:((?:(?:[0-9]+(?:.[0-9]*)?)|(?:.[0-9]+)))S)?)?$/;
oXSPrimitives[cXSConstants.DATETIME_DT]		= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])T(([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.DATE_DT]			= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.TIME_DT]			= /^(([01]\d|2[0-3]):[0-5]\d:[0-5]\d(\.\d+)?|24:00:00(\.0+)?)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.GYEARMONTH_DT]	= /^-?([1-9]\d\d\d+|0\d\d\d)-(0[1-9]|1[0-2])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.GYEAR_DT]		= /^-?([1-9]\d\d\d+|0\d\d\d)(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.GMONTHDAY_DT]	= /^--(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.GDAY_DT]			= /^---(0[1-9]|[12]\d|3[01])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.GMONTH_DT]		= /^--(0[1-9]|1[0-2])(Z|[+\-](0\d|1[0-4]):[0-5]\d)?$/;
oXSPrimitives[cXSConstants.HEXBINARY_DT]	= /^([0-9a-fA-F]{2})*$/;
oXSPrimitives[cXSConstants.BASE64BINARY_DT]	= /^((([A-Za-z0-9+\/]\s*){4})*(([A-Za-z0-9+\/]\s*){3}[A-Za-z0-9+\/]|([A-Za-z0-9+\/]\s*){2}[AEIMQUYcgkosw048]\s*=|[A-Za-z0-9+\/]\s*[AQgw]\s*=\s*=))?$/;

// Converts XML Schema RegExp syntaxis to JavaScipt one
function fXSSimpleTypeDefinition_schemaRegExpToJSRegExp(sValue) {
	var d1	= '\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF',
		d2	= '\u0370-\u037D\u037F-\u1FFF\u200C-\u200D',
		d3	= '\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD',
		c	= 'A-Z_a-z\\-.0-9\u00B7' + d1 + '\u0300-\u036F' + d2 + '\u203F-\u2040' + d3,
		i	= 'A-Z_a-z' + d1 + d2 + d3;
	return sValue
				.replace(/\[\\i-\[:\]\]/g, '[' + i + ']')
				.replace(/\[\\c-\[:\]\]/g, '[' + c + ']')
				.replace(/\\i/g, '[:' + i + ']')
				.replace(/\\I/g, '[^:' + i + ']')
				.replace(/\\c/g, '[:' + c + ']')
				.replace(/\\C/g, '[^:' + c + ']');
};

function fXSSimpleTypeDefinition_validate(oType, sValue) {
	switch (oType.variety) {
		case cXSSimpleTypeDefinition.VARIETY_ATOMIC:
			// 1: Validate lexical space
//			sValue = fXSSimpleTypeDefinition_getValue(oType, sValue);
			if (oType.builtInKind in oXSPrimitives && !oXSPrimitives[oType.builtInKind].test(sValue))
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
						var nLength	= fXSSimpleTypeDefinition_getLength(oType, sValue);
						if (nLength === false || nLength != Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MINLENGTH:
						var nLength	= fXSSimpleTypeDefinition_getLength(oType, sValue);
						if (nLength === false || nLength < Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MAXLENGTH:
						var nLength	= fXSSimpleTypeDefinition_getLength(oType, sValue);
						if (nLength === false || nLength > Number(oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_WHITESPACE:
						// TODO:
						break;

					case cXSSimpleTypeDefinition.FACET_MAXINCLUSIVE:
						if (fXSSimpleTypeDefinition_getValue(oType, sValue) > fXSSimpleTypeDefinition_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MAXEXCLUSIVE:
						if (fXSSimpleTypeDefinition_getValue(oType, sValue) >= fXSSimpleTypeDefinition_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MINEXCLUSIVE:
						if (fXSSimpleTypeDefinition_getValue(oType, sValue) <= fXSSimpleTypeDefinition_getValue(oType, oFacet.lexicalFacetValue))
							return false;
						break;

					case cXSSimpleTypeDefinition.FACET_MININCLUSIVE:
						if (fXSSimpleTypeDefinition_getValue(oType, sValue) < fXSSimpleTypeDefinition_getValue(oType, oFacet.lexicalFacetValue))
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
							if (!(new RegExp('^' + fXSSimpleTypeDefinition_schemaRegExpToJSRegExp(oFacet.lexicalFacetValues[nIndex]) + '$')).test(sValue))
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
				return fXSSimpleTypeDefinition_validate(oType.baseType, sValue);
			return true;

		case cXSSimpleTypeDefinition.VARIETY_LIST:
			// Validate every value from the list against itemType
			if (sValue)
				for (var nIndex = 0, aValue = fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue).split(' '); nIndex < aValue.length; nIndex++)
					if (oType.itemType && !fXSSimpleTypeDefinition_validate(oType.itemType, aValue[nIndex]))
						return false;
			return true;

		case cXSSimpleTypeDefinition.VARIETY_UNION:
			// Validate value against member types untill successfull
			for (var nIndex = 0; nIndex < oType.memberTypes.length; nIndex++)
				if (fXSSimpleTypeDefinition_validate(oType.memberTypes[nIndex], sValue))
					return true;
			return false;

		default:
			return true;
	}
};

function fXSSimpleTypeDefinition_getValue(oType, sValue) {
//	sValue = fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue);
	if (oType.variety == cXSSimpleTypeDefinition.VARIETY_ATOMIC) {
		switch (fXSSimpleTypeDefinition_getPrimitiveType(oType).builtInKind) {
			case cXSConstants.BOOLEAN_DT:
				return sValue == "true" || sValue == '1';

			case cXSConstants.FLOAT_DT:
			case cXSConstants.DOUBLE_DT:
				return sValue == "INF" ? Infinity : sValue == '-' + "INF" ? -Infinity : sValue == "NaN" ? nNaN : parseFloat(sValue);

			case cXSConstants.DECIMAL_DT:
// TODO:			case cXSConstants.PRECISIONDECIMAL_DT:
				return Number(sValue);

			case cXSConstants.DURATION_DT:
				var aDate	= oXSPrimitives[cXSConstants.DURATION_DT].exec(sValue),
					nMonths		= parseInt(aDate[2], 10) * 12 + parseInt(aDate[3], 10),
					nSeconds	= ((parseInt(aDate[4], 10) * 24 + parseInt(aDate[5], 10)) * 60 + parseInt(aDate[6], 10)) * 60 + parseFloat(aDate[7]);
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

function fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue) {
	var sWhiteSpace	= null;
	if (oType.variety == cXSSimpleTypeDefinition.VARIETY_ATOMIC) {
		// find whiteSpace facet specified
		for (var oBaseType = oType; oBaseType && sWhiteSpace == null; oBaseType = oBaseType.baseType)
			for (var nIndex = 0, oFacet; oFacet = oBaseType.facets[nIndex] && sWhiteSpace == null; nIndex++)
				if (oFacet.facetKind == cXSSimpleTypeDefinition.FACET_WHITESPACE)
					sWhiteSpace	= oFacet.lexicalFacetValue;
	} else
		sWhiteSpace	= "collapse";

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

function fXSSimpleTypeDefinition_getLength(oType, sValue) {
	switch (oType.variety) {
		case cXSSimpleTypeDefinition.VARIETY_ATOMIC:
			switch (fXSSimpleTypeDefinition_getPrimitiveType(oType).builtInKind) {
				case cXSConstants.STRING_DT:
				case cXSConstants.ANYURI_DT:
					return fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue).length;

				case cXSConstants.HEXBINARY_DT:
					return fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue).length / 2;

				case cXSConstants.BASE64BINARY_DT:
					return Math.floor(fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue).replace(/[^a-zA-Z0-9+\/]/g,'').length * 3 / 4);

				case cXSConstants.QNAME_DT:
				case cXSConstants.NOTATION_DT:
					return true;

				default:
					return false;
			}
			break;

		case cXSSimpleTypeDefinition.VARIETY_LIST:
			var sLexicalValue	= fXSSimpleTypeDefinition_getWhiteSpace(oType, sValue);
			return sLexicalValue == '' ? 0 : sLexicalValue.split(' ').length;
	}
	return false;
};

function fXSSimpleTypeDefinition_getPrimitiveType(oType) {
	for (; oType; oType = oType.baseType)
		if (oXSBuiltin_primitiveDataTypes[oType.builtInKind])
			return oType;
};
