/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathTokenizer(sSource) {
	//
	this.char		= 0;
	this.source		= sSource;
	//
	this.line		= 1;
	this.column		= 0;
	//
	this.state		= cXPathTokenizer.DEFAULT;
	this.stack		= [];
};

// States
cXPathTokenizer.DEFAULT		= 0;
cXPathTokenizer.OPERATOR	= 1;
cXPathTokenizer.SINGLETYPE	= 2;
cXPathTokenizer.ITEMTYPE	= 3;
cXPathTokenizer.KINDTEST	= 4;
cXPathTokenizer.KINDTESTFORPI		= 5;
cXPathTokenizer.CLOSEKINDTEST		= 6;
cXPathTokenizer.OCCURRENCEINDICATOR	= 7;
cXPathTokenizer.VARNAME		= 8;
cXPathTokenizer.EXPR_COMMENT= 9;

//
cXPathTokenizer.prototype.source	= null;
cXPathTokenizer.prototype.char		= null;
//
cXPathTokenizer.prototype.line		= null;
cXPathTokenizer.prototype.column	= null;
//
cXPathTokenizer.prototype.state		= null;
cXPathTokenizer.prototype.stack		= null;
//
cXPathTokenizer.prototype.currentToken	=-1;
cXPathTokenizer.prototype.currentValue	= null;
//
cXPathTokenizer.prototype.lookAheadToken	= null;
cXPathTokenizer.prototype.lookAheadValue	= null;

cXPathTokenizer.prototype.advance	= function() {
	console.log([this.currentToken, this.currentValue, this.state]);

	if (this.currentToken == 0)
		return false;
	if (this.lookAheadToken > 0) {
		this.currentToken	= this.lookAheadToken;
		this.currentValue	= this.lookAheadValue;
		this.lookAheadToken	= -1;
	}
	else
	if (this.char < this.source.length) {
		fXPathTokenizer_parseToken(this);
	}
	else {
		return false;
	}

	return this.currentToken >= 0;
};

cXPathTokenizer.prototype.token	= function(nToken) {
	return this.currentToken;
};

cXPathTokenizer.prototype.value	= function(nToken) {
	return this.currentValue;
};

function fXPathTokenizer_pushState(oTokenizer, nState) {
	oTokenizer.stack.push(nState);
};

function fXPathTokenizer_popState(oTokenizer) {
	return oTokenizer.stack.pop(nState);
};

function fXPathTokenizer_parseToken(oTokenizer) {
	return hXPathTokenizer_stateParser[oTokenizer.state](oTokenizer);
};

// State parsers
var hXPathTokenizer_stateParser	= {};
hXPathTokenizer_stateParser[cXPathTokenizer.OPERATOR]	= function(oTokenizer) {
	// "then", "else", "and", ",", "div", "=", "except", "eq", "ge", "gt", "le", "lt", "ne", ">=", ">>", ">", "idiv", "intersect", "in", "is", "[", "<=", "<<", "<", "-", "mod", "*", "!=", "or", "+", "return", "satisfies", "//", "/", "to", "union", "|"
	// Transition to DEFAULT
	var sInput	= oTokenizer.source.substr(oTokenizer.char),
		sValue	= null,
		sMatch	= null,
		nToken	= 0;

	if (sInput.match(/^(then|else|and|,|div|=|except|eq|ge|gt|le|lt|ne|>=|>>|>|idiv|intersect|in|is|\[|<=|<<|<|-|mod|\*|!=|or|\+|return|satisfies|\/\/|\/|to|union|\|)/)) {
		oTokenizer.state	= cXPathTokenizer.DEFAULT;
		sMatch	= cRegExp.$1;
		nToken	= hXPathToken_table[sMatch];
	}
	// <"castable" "as">, <"cast" "as">
	// Transition to SINGLETYPE
	else
	if (sInput.match(/^(castable\s+as|cast\s+as)/)) {
		oTokenizer.state	= cXPathTokenizer.SINGLETYPE;
		sMatch	= cRegExp.$1;
		nToken	= hXPathToken_table[sMatch.replace(/\s+/, ' ')];
	}
	// <"instance" "of">, <"treat" "as">
	// Transition to ITEMTYPE
	else
	if (sInput.match(/^(instance\s+of|treat\s+as)/)) {
		oTokenizer.state	= cXPathTokenizer.ITEMTYPE;
		sMatch	= cRegExp.$1;
		nToken	= hXPathToken_table[sMatch.replace(/\s+/, ' ')];
	}
	// "$", <"for" "$">
	// Transition to VARNAME
	else
	if (sInput.match(/^((for\s+)?\$)/)) {
		oTokenizer.state	= cXPathTokenizer.VARNAME;
		sMatch	= cRegExp.$1;
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		sMatch	= sInput.substr(0, 2);
		nToken	= hXPathToken_table[sMatch];
	}
	// ")", "?", "]"
	// Transition to OPERATOR
	else
	if (sInput.match(/^(\)|\?|\])/)) {
		oTokenizer.state	= cXPathTokenizer.OPERATOR;
		sMatch	= sInput.substr(0, 1);
		nToken	= hXPathToken_table[sMatch];
	}
	// StringLiteral, NotOperatorKeyword
	// (maintain state)
	else
	if (sInput.match(/^('([^']*)'|"([^"]*)")/)) {
		sMatch	= cRegExp.$1;
		sValue	= cRegExp.$2 || cRegExp.$3;
		nToken	= nXPathToken_LITERAL_STRING;
	}

	if (sMatch != null) {
		oTokenizer.currentToken	= nToken || hXPathToken_table[sToken];
		oTokenizer.currentValue	= sValue || sMatch;
		oTokenizer.char	+= sMatch.length;
	}
	else
		throw "Unexpected input in cXPathTokenizer.OPERATOR state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.SINGLETYPE]	= function(oTokenizer) {
	// QName
	// Transition to OPERATOR
	if (sInput.match(/^((\w+\:)?\w+)/)) {
		oTokenizer.state	= cXPathTokenizer.OPERATOR;
		return [];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}
	//
	throw "Unexpected input in cXPathTokenizer.SINGLETYPE state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.ITEMTYPE]	= function(oTokenizer) {
	// <"void" "(" ")">, QName
	// Transition to OPERATOR
	if (sInput.match(/^((void\s*\(\s*\))|((\w+\:)?\w+))/)) {
		oTokenizer.state	= cXPathTokenizer.OPERATOR;
		return [];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}
	// <"element" "(">, <"attribute" "(">, <"schema-element" "(">, <"schema-attribute" "(">, <"comment" "(">, <"text" "(">, <"node" "(">, <"document-node" "(">
	// pushState(OCCURRENCEINDICATOR)
	// Transition to KINDTEST
	else
	if (sInput.match(/^(element|attribute|schema-element|schema-attribute|comment|text|node|document-node)\s*\(/)) {
		fXPathTokenizer_pushState(oTokenizer, cXPathTokenizer.KINDTEST);
		oTokenizer.state	= cXPathTokenizer.KINDTEST;
		return [];
	}
	// <"processing-instruction" "(">
	// pushState(OCCURRENCEINDICATOR)
	// Transition to KINDTESTFORPI
	else
	if (sInput.match(/^(processing-instruction)\s*\(/)) {
		fXPathTokenizer_pushState(oTokenizer, cXPathTokenizer.OCCURRENCEINDICATOR);
		oTokenizer.state	= cXPathTokenizer.KINDTESTFORPI;
		return [];
	}
	// QName, <"item" "(" ")">
	// Transition to OCCURRENCEINDICATOR
	else
	if (sInput.match(/^(((\w+\:)?\w+)|(item\s*\(\s*\)))/)) {
		oTokenizer.state	= cXPathTokenizer.OCCURRENCEINDICATOR;
		return [];
	}
	// "then", "else", "and", ",", "div", "=", "except", "eq", "ge", "gt", "le", "lt", "ne", ">=", ">>", ">", "idiv", "intersect", "in", "is", "[", "(", "<=", "<<", "<", "-", "mod", "!=", "or", "return", "satisfies", "to", "union", "|"
	// Transition to DEFAULT
	else
	if (sInput.match(/^(then|else|and|,|div|=|except|eq|ge|gt|le|lt|ne|>=|>>|>|idiv|intersect|in|is|\[|\(|<=|<<|<|-|mod|!=|or|satisfies|to|union|\|)/)) {
		oTokenizer.state	= cXPathTokenizer.DEFAULT;
		return [];
	}
	// <"castable" "as">, <"cast" "as">
	// Transition to SINGLETYPE
	else
	if (sInput.match(/^(castable\s+as|cast\s+as)/)) {
		oTokenizer.state	= cXPathTokenizer.SINGLETYPE;
		return [];
	}
	// <"instance" "of">, <"treat" "as">
	// Transition to ITEMTYPE
	else
	if (sInput.match(/^(instance\s+of|treat\s+as)/)) {
		oTokenizer.state	= cXPathTokenizer.ITEMTYPE;
		return [];
	}
	//
	throw "Unexpected input in cXPathTokenizer.ITEMTYPE state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.KINDTEST]	= function(oTokenizer) {
	var sInput	= oTokenizer.source.substr(oTokenizer.char),
		sValue	= null,
		sMatch	= null,
		nToken	= 0;

	// ")"
	// popState()
	if (sInput.substr(0, 1) == ")") {
		oTokenizer.state	= fXPathTokenizer_popState(oTokenizer);
		sMatch	= ')';
		nToken	= nXPathToken_PAREN_CLOSE;
	}
	// "*", QName
	// Transition to CLOSEKINDTEST
	else
	if (sInput.match(/^(\*|(\w+\:)?\w+)/)) {
		oTokenizer.state	= cXPathTokenizer.CLOSEKINDTEST;
		sMatch	= cRegExp.$1;
		nToken	= nXPathToken_NAME_TEST;
	}
	// <"element" "(">, <"schema-element" "(">
	// pushState(KINDTEST)
	// Transition to KINDTEST
	else
	if (sInput.match(/^((element|schema-element)\s*\()/)) {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.KINDTEST;
		sMatch	= cRegExp.$1;
		sValue	= cRegExp.$2;
		nToken	= nXPathToken_KIND_TEST;
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		sMatch	= '(:';
		nToken	= nXPathToken_COMMENT_OPEN;
	}

	if (sMatch != null) {
		oTokenizer.currentToken	= nToken || hXPathToken_table[sToken];
		oTokenizer.currentValue	= sValue || sMatch;
		oTokenizer.char	+= sMatch.length;
	}
	else
		throw "Unexpected input in cXPathTokenizer.KINDTEST state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.KINDTESTFORPI]	= function(oTokenizer) {
	// ")"
	// popState()
	if (sInput.substr(0, 1) == ")") {
		oTokenizer.state	= fXPathTokenizer_popState(oTokenizer);
		return [cXPathToken.BRACKET_CLOSE];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}
	// NCName, StringLiteral
	// Transition to KINDTESTFORPI
	else
	if (sInput.match(/^(\w+|'[^']*'|"[^"]*")/)) {
		oTokenizer.state	= cXPathTokenizer.KINDTESTFORPI;
		return [cXPathToken.STRING];
	}

	throw "Unexpected input in cXPathTokenizer.KINDTESTFORPI state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.CLOSEKINDTEST]	= function(oTokenizer) {
	// ")"
	// popState()
	if (sInput.substr(0, 1) == ")") {
		oTokenizer.state	= fXPathTokenizer_popState(oTokenizer);
		return [cXPathToken.BRACKET_CLOSE];
	}
	// ","
	// Transition to KINDTEST
	else
	if (sInput.substr(0, 1) == ",") {
		oTokenizer.state	= cXPathTokenizer.CLOSEKINDTEST;
		return [cXPathToken];
	}
	// "?"
	// Transition to CLOSEKINDTEST
	else
	if (sInput.substr(0, 1) == "?") {
		oTokenizer.state	= cXPathTokenizer.CLOSEKINDTEST;
		return [cXPathToken];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}

	throw "Unexpected input in cXPathTokenizer.CLOSEKINDTEST state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.OCCURRENCEINDICATOR]	= function(oTokenizer) {
	// [NotOccurrenceIndicator]
	// input_stream.backup(1)
	// Transition to OPERATOR

	// "?", "*", "+"
	// Transition to OPERATOR
	if (sInput.substr(0, 1) == "?" || sInput.substr(0, 1) == "*" || sInput.substr(0, 1) == "+") {
		oTokenizer.state	= cXPathTokenizer.OPERATOR;
		return [];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}

	throw "Unexpected input in cXPathTokenizer.OCCURRENCEINDICATOR state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.VARNAME]	= function(oTokenizer) {
	// VarName
	// Transition to OPERATOR
	if (sInput.match(/^(([\w]+:)\w+)/)) {
		oTokenizer.state	= cXPathTokenizer.OPERATOR;
		return [cXPathToken.STRING_LITERAL];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}

	throw "Unexpected input in cXPathTokenizer.VARNAME state";
};

hXPathTokenizer_stateParser[cXPathTokenizer.EXPR_COMMENT]	= function(oTokenizer) {
	// ":)"
	// popState()
	if (sInput.substr(0, 2) == ':)') {
		oTokenizer.state	= fXPathTokenizer_popState(oTokenizer);
		return [cXPathToken.COMMENT_END];
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		return [cXPathToken.COMMENT_START];
	}

	// Char
	// Maintain state
};

hXPathTokenizer_stateParser[cXPathTokenizer.DEFAULT]	= function(oTokenizer) {
	var sInput	= oTokenizer.source.substr(oTokenizer.char),
		sValue	= null,
		sMatch	= null,
		nToken	= 0;

	// DecimalLiteral, "..", ".", DoubleLiteral, IntegerLiteral, NotNumber,
	// <NCName ":" "*">, QName, ")", <"*" ":" NCName>, "*", StringLiteral
	// Transition to OPERATOR
	if (sInput.match(/^(\.\d+|\d+\.\d*|\d+|NaN)/)) {
		sMatch	= cRegExp.$1;
		nToken	= nXPathToken_LITERAL_NUMERIC;
	}
	else
	if (sInput.match(/^((\.\d+)|\d+(\.\d*)?)[eE][+-]?\d+/)) {
		sMatch	= cRegExp.$1;
		nToken	= nXPathToken_LITERAL_NUMERIC;
	}
	else
	if (sInput.match(/^(\.|\.\.)/)) {
		sMatch	= cRegExp.$1;
		nToken	= hXPathToken_table[sMatch];
	}
	else
	if (sInput.match(/^((\w+\:)?\w+|\w+\:\*|\*\:\w+|\*)/)) {
		sMatch	= cRegExp.$1;
		nToken	= nXPathToken_PREDICATE;
	}
	else
	if (sInput.substr(0, 1) == ')') {
		sMatch	= ')';
		nToken	= hXPathToken_table[')'];
	}
	else
	if (sInput.match(/^('([^']*)'|"([^"]*)")/)) {
		sMatch	= cRegExp.$1;
		sValue	= cRegExp.$2 || cRegExp.$3;
		nToken	= nXPathToken_LITERAL_STRING;
	}

	//
	if (nToken > 0) {
		oTokenizer.state	= cXPathTokenizer.OPERATOR;
	}
	// "$", <"for" "$">, <"some" "$">, <"every" "$">
	// Transition to VARNAME
	else
	if (sInput.match(/^(((for|some|every)\s+)?\$)/)) {
		fXPathTokenizer_pushState(oTokenizer, cXPathTokenizer.VARNAME);
		oTokenizer.state	= cXPathTokenizer.VARNAME;
		sMatch	= cRegExp.$1;
		nToken	= hXPathToken_table[cRegExp.$3] || nXPathToken_VAR;
	}
	// <"element" "(">, <"attribute" "(">, <"schema-element" "(">, <"schema-attribute" "(">, <"comment" "(">, <"text" "(">, <"node" "(">, <"document-node" "(">
	// pushState(OPERATOR)
	// Transition to KINDTEST
	else
	if (sInput.match(/^((element|attribute|schema-element|schema-attribute|comment|text|node|document-node)\s*\()/)) {
		fXPathTokenizer_pushState(oTokenizer, cXPathTokenizer.OPERATOR);
		oTokenizer.state	= cXPathTokenizer.KINDTEST;
		sMatch	= cRegExp.$1;
		sValue	= cRegExp.$2;
		nToken	= nXPathToken_KIND_TEST;
	}
	// <"processing-instruction" "(">
	// pushState(OPERATOR)
	// Transition to KINDTESTFORPI
	else
	if (sInput.match(/^((processing-instruction)\s*\()/)) {
		fXPathTokenizer_pushState(oTokenizer, cXPathTokenizer.OPERATOR);
		oTokenizer.state	= cXPathTokenizer.KINDTESTFORPI;
		sMatch	= cRegExp.$1;
		sValue	= cRegExp.$2;
		nToken	= nXPathToken_KIND_TEST;
	}
	// "(:"
	// pushState()
	// Transition to EXPR_COMMENT
	else
	if (sInput.substr(0, 2) == '(:') {
		fXPathTokenizer_pushState(oTokenizer, oTokenizer.state);
		oTokenizer.state	= cXPathTokenizer.EXPR_COMMENT;
		sMatch	= '(:';
		nToken	= nXPathToken_COMMENT_OPEN;
	}
	// ",", "(", <QName "(">, <"if" "(">, "-", "+", "//", "/",
	// <"ancestor-or-self" "::">, <"ancestor" "::">, <"attribute" "::">, <"child" "::">, <"descendant-or-self" "::">, <"descendant" "::">, <"following-sibling" "::">, <"following" "::">, <"namespace" "::">, <"parent" "::">, <"preceding-sibling" "::">, <"preceding" "::">, <"self" "::">,
	// "@"
	// Transition to DEFAULT
//	else
//	if (sInput.match(/^()/)) {
//		oToken	= [];
//	}
	else
	if (sInput.match(/^((ancestor-or-self|ancestor|attribute|child|descendant-or-self|descendant|following-sibling|following|namespace|parent|preceding-sibling|preceding|self)\:\:)/)) {
		sMatch	= cRegExp.$1;
		sValue	= cRegExp.$2;
		nToken	= nXPathToken_AXIS;
	}

	if (nToken) {
		oTokenizer.currentToken	= nToken;
		oTokenizer.currentValue	= sValue || sMatch;
		oTokenizer.char	+= sMatch.length;
	}
	else
		throw "Unexpected input in cXPathTokenizer.DEFAULT state";
};
