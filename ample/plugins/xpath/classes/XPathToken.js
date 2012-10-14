/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

function cXPathToken(nToken, vValue, nColumn, nLine) {
	this.token	= nToken;
	this.value	= vValue;
	//
	this.column	= nColumn;
	this.line	= nLine;
	//
	this.childNodes	= [];
};

var hXPathToken_table			= {},
	nXPathToken_FUNCTION_CALL										= 1,	// {func}()
	nXPathToken_AXIS												= 2,	// {axis}::
	nXPathToken_KIND_TEST											= 3,	// {kind}()
	nXPathToken_NAME_TEST											= 4,	// {prefix}:{name}
	nXPathToken_PREDICATE											= 5,	// []
	nXPathToken_LITERAL_NUMERIC										= 6,	// {10}
	nXPathToken_LITERAL_STRING										= 7,	// {string}
	//
	nXPathToken_VAR					= hXPathToken_table['$']		= 10,
	nXPathToken_DOT					= hXPathToken_table['.']		= 11,
	nXPathToken_DOTDOT				= hXPathToken_table['..']		= 12,
	nXPathToken_SLASH				= hXPathToken_table['/']		= 13,
	nXPathToken_SLASHSLASH			= hXPathToken_table['/' + '/']	= 14,
	nXPathToken_WILDCARD			= hXPathToken_table['*']		= 15,
	nXPathToken_AT					= hXPathToken_table['@']		= 17,
	//
	nXPathToken_PAREN_OPEN			= hXPathToken_table['(']		= 20,
	nXPathToken_PAREN_CLOSE			= hXPathToken_table[')']		= 21,
	nXPathToken_SQUARED_OPEN		= hXPathToken_table['[']		= 22,
	nXPathToken_SQUARED_CLOSE		= hXPathToken_table[']']		= 23,
	// Comments
	nXPathToken_COMMENT_OPEN		= hXPathToken_table['(:']		= 25,
	nXPathToken_COMMENT_CLOSE		= hXPathToken_table[':)']		= 26,
	// General comparison
	nXPathToken_EQUAL				= hXPathToken_table['=']		= 30,
	nXPathToken_LESS				= hXPathToken_table['<']		= 31,
	nXPathToken_GREATER				= hXPathToken_table['>']		= 32,
	nXPathToken_LESS_OR_EQUAL		= hXPathToken_table['<=']		= 33,
	nXPathToken_GREATER_OR_EQUAL	= hXPathToken_table['>=']		= 34,
	nXPathToken_NOT_EQUAL			= hXPathToken_table['!=']		= 35,
	// Node comparison
	nXPathToken_GREATER_GREATER		= hXPathToken_table['>>']		= 36,
	nXPathToken_LESS_LESS			= hXPathToken_table['<<']		= 37,
	nXPathToken_IS					= hXPathToken_table['is']		= 38,
	// Value comparison
	nXPathToken_ATOMIC_LESS			= hXPathToken_table['lt']		= 40,
	nXPathToken_ATOMIC_GREATER		= hXPathToken_table['gt']		= 41,
	nXPathToken_ATOMIC_LESS_EQUAL	= hXPathToken_table['le']		= 42,
	nXPathToken_ATOMIC_GREATER_EQUAL= hXPathToken_table['ge']		= 43,
	nXPathToken_ATOMIC_NOT_EQUAL	= hXPathToken_table['ne']		= 44,
	nXPathToken_ATOMIC_EQUAL		= hXPathToken_table['eq']		= 45,
	// Logical Expressions
	nXPathToken_AND					= hXPathToken_table['and']		= 46,
	nXPathToken_OR					= hXPathToken_table['or']		= 47,
	// Arithmetic Expressions
	nXPathToken_MINUS				= hXPathToken_table['-']		= 50,
	nXPathToken_PLUS				= hXPathToken_table['+']		= 51,
	nXPathToken_MULTIPLY			= hXPathToken_table['*']		= 52,
	nXPathToken_DIV					= hXPathToken_table['div']		= 53,
	nXPathToken_IDIV				= hXPathToken_table['idiv']		= 54,
	nXPathToken_MOD					= hXPathToken_table['mod']		= 55,
	// For statements
	nXPathToken_FOR					= hXPathToken_table['for']		= 60,
	nXPathToken_IN					= hXPathToken_table['in']		= 61,
	nXPathToken_RETURN				= hXPathToken_table['return']	= 62,
	// If statement
	nXPathToken_IF					= hXPathToken_table['if']		= 63,
	nXPathToken_THEN				= hXPathToken_table['then']		= 64,
	nXPathToken_ELSE				= hXPathToken_table['else']		= 65,
	// Quantified Expressions
	nXPathToken_SOME				= hXPathToken_table['some']		= 70,
	nXPathToken_EVERY				= hXPathToken_table['every']	= 71,
	nXPathToken_SATISFIES			= hXPathToken_table['satisfies']= 72,
	// Combining Node Sequences
	nXPathToken_UNION				= hXPathToken_table['union']	= 73,
	nXPathToken_PIPE				= hXPathToken_table['|']		= 74,
	nXPathToken_INTERSECT			= hXPathToken_table['intersect']= 75,
	nXPathToken_EXCEPT				= hXPathToken_table['except']	= 76,
	// Sequences
	nXPathToken_COMMA				= hXPathToken_table[',']		= 77,
	nXPathToken_TO					= hXPathToken_table['to']		= 78,
	// Expressions on SequenceTypes
	nXPathToken_INSTANCE_OF		= hXPathToken_table['instance of']	= 80,
	nXPathToken_CAST_AS			= hXPathToken_table['cast as']		= 81,
	nXPathToken_CASTABLE_AS		= hXPathToken_table['castable as']	= 82,
	nXPathToken_TREAT_AS		= hXPathToken_table['treat as']		= 83,
	// Occurrence indicator
	nXPathToken_OCCURRENCE_NONE_OR_ONE	= hXPathToken_table['?']	= 90,
	nXPathToken_OCCURRENCE_ONE_OR_MORE	= hXPathToken_table['+']	= 91,
	nXPathToken_OCCURRENCE_ZERO_OR_MORE	= hXPathToken_table['*']	= 92;


// XPath Grammar

// 0
cXPathToken.EOF				= 0;

/*
// 2.5.3 SequenceType Syntax
cXPathToken.SequenceType		= 50;	// ("empty-sequence" "(" ")") | (ItemType OccurrenceIndicator?)
cXPathToken.OccurrenceIndicator	= 51;	// "?" | "*" | "+"
cXPathToken.ItemType			= 52;	// KindTest | ("item" "(" ")") | AtomicType
cXPathToken.AtomicType			= 53;	// QName
*/
// Kind tests
cXPathToken.KindTest				= 54;	// DocumentTest | ElementTest | AttributeTest | SchemaElementTest | SchemaAttributeTest | PITest | CommentTest | TextTest | AnyKindTest
cXPathToken.AnyKindTest				= 55;	// "node" "(" ")"
cXPathToken.DocumentTest			= 56;	// "document-node" "(" (ElementTest | SchemaElementTest)? ")"
cXPathToken.TextTest				= 57;	// "text" "(" ")"
cXPathToken.CommentTest				= 58;	// "comment" "(" ")"
cXPathToken.PITest					= 59;	// "processing-instruction" "(" (NCName | StringLiteral)? ")"
cXPathToken.AttributeTest			= 60;	// "attribute" "(" (AttribNameOrWildcard ("," TypeName)?)? ")"
cXPathToken.AttribNameOrWildcard	= 61;	// AttributeName | "*"
cXPathToken.SchemaAttributeTest		= 62;	// "schema-attribute" "(" AttributeDeclaration ")"
cXPathToken.AttributeDeclaration	= 63;	// AttributeName
cXPathToken.ElementTest				= 64;	// "element" "(" (ElementNameOrWildcard ("," TypeName "?"?)?)? ")"
cXPathToken.ElementNameOrWildcard	= 65;	// ElementName | "*"
cXPathToken.SchemaElementTest		= 66;	// "schema-element" "(" ElementDeclaration ")"
cXPathToken.ElementDeclaration		= 67;	// ElementName
cXPathToken.AttributeName			= 68;	// QName
cXPathToken.ElementName				= 69;	// QName
cXPathToken.TypeName				= 70;	// QName


// 2.6 Comments
// TERMINAL LITERALS
cXPathToken.Comment				= 77;	// "(:" (CommentContents | Comment)* ":)"
cXPathToken.CommentContents		= 82;	// (Char+ - (Char* ':)' Char*))

// 3 Expressions
cXPathToken.XPath			= 1;	// Expr
cXPathToken.Expr			= 2;	// ExprSingle ("," ExprSingle)*
cXPathToken.ExprSingle		= 3;	// ForExpr | QuantifiedExpr | IfExpr | OrExpr

// 3.1 Primary Expressions		[Primary expressions are the basic primitives of the language]
cXPathToken.PrimaryExpr		= 41;	// Literal | VarRef | ParenthesizedExpr | ContextItemExpr | FunctionCall
// 3.1.1 Literals				[A literal is a direct syntactic representation of an atomic value]
cXPathToken.Literal			= 42;	// NumericLiteral | StringLiteral
cXPathToken.NumericLiteral	= 43;	// IntegerLiteral | DecimalLiteral | DoubleLiteral
// 3.1.2 Variable References	[A variable reference is a QName preceded by a $-sign]
cXPathToken.VarRef			= 44;	// "$" VarName
cXPathToken.VarName			= 45;	// QName
// 3.1.3 Parenthesized Expressions	[Parentheses may be used to enforce a particular evaluation order in expressions that contain multiple operators]
cXPathToken.ParenthesizedExpr	= 46;	// "(" Expr? ")"
// 3.1.4 Context Item Expression	[A context item expression evaluates to the context item]
cXPathToken.ContextItemExpr		= 47;	// "."
// 3.1.5 Function Calls
cXPathToken.FunctionCall		= 48;	// QName "(" (ExprSingle ("," ExprSingle)*)? ")"

// 3.2 Path Expressions		[A path expression can be used to locate nodes within trees. A path expression consists of a series of one or more steps, separated by "/" or "//", and optionally beginning with "/" or "//"]
cXPathToken.PathExpr			= 25;	// ("/" RelativePathExpr?) | ("//" RelativePathExpr) | RelativePathExpr
cXPathToken.RelativePathExpr	= 26;	// StepExpr (("/" | "//") StepExpr)*
// 3.2.1 Steps				[A step is a part of a path expression that generates a sequence of items and then filters the sequence by zero or more predicates. The value of the step consists of those items that satisfy the predicates, working from left to right]
cXPathToken.StepExpr	= 27;	// FilterExpr | AxisStep
cXPathToken.AxisStep	= 28;	// (ForwardStep | ReverseStep) PredicateList
cXPathToken.ForwardStep	= 29;	// (ForwardAxis NodeTest) | AbbrevForwardStep
cXPathToken.ReverseStep	= 32;	// (ReverseAxis NodeTest) | AbbrevReverseStep
// 3.2.1.1 Axes
cXPathToken.ForwardAxis	= 30;	// "child" "::" | "descendant" "::" | "attribute" "::" | "self" "::" | "descendant-or-self" "::" | "following-sibling" "::" | "following" "::" | "namespace" "::"
cXPathToken.ReverseAxis	= 33;	// "parent" "::" | "ancestor" "::" | "preceding-sibling" "::" | "preceding" "::" | "ancestor-or-self" "::"
// 3.2.1.2 Node Tests 		[A node test is a condition that must be true for each node selected by a step]
cXPathToken.NodeTest	= 35;	// KindTest | NameTest
cXPathToken.NameTest	= 36;	// QName | Wildcard
cXPathToken.Wildcard	= 37;	// "*" | NCName ":" "*" | "*" ":" NCName
// 3.2.2 Predicates			[A predicate consists of an expression, called a predicate expression, enclosed in square brackets. A predicate serves to filter a sequence, retaining some items and discarding others.]
cXPathToken.Predicate	= 40;	// "[" Expr "]"
// 3.2.4 Abbreviated Syntax
cXPathToken.AbbrevForwardStep	= 31;	// "@"? NodeTest
cXPathToken.AbbrevReverseStep	= 34;	// ".."

// 3.3 Sequence Expressions

// 3.3.1 Constructing Sequences
cXPathToken.RangeExpr		= 11;	// AdditiveExpr ("to" AdditiveExpr)?

// 3.3.2 Filter Expressions
cXPathToken.FilterExpr		= 38;	// PrimaryExpr PredicateList
cXPathToken.PredicateList	= 39;	// Predicate*

// 3.3.3 Combining Node Sequences
cXPathToken.UnionExpr			= 14;	// IntersectExceptExpr (("union" | "|") IntersectExceptExpr)*
cXPathToken.IntersectExceptExpr	= 15;	// InstanceofExpr (("intersect" | "except") InstanceofExpr)*

// 3.4 Arithmetic Expressions
cXPathToken.AdditiveExpr		= 12;	// MultiplicativeExpr (("+" | "-") MultiplicativeExpr)*
cXPathToken.MultiplicativeExpr	= 13;	// UnionExpr (("*" | "div" | "idiv" | "mod") UnionExpr)*
cXPathToken.UnaryExpr			= 20;	// ("-" | "+")* ValueExpr
cXPathToken.ValueExpr			= 21;	// PathExpr


// 3.5 Comparison Expressions
cXPathToken.ComparisonExpr	= 10;	// RangeExpr ((ValueComp | GeneralComp | NodeComp) RangeExpr)?
cXPathToken.GeneralComp		= 22;	// "=" | "!=" | "<" | "<=" | ">" | ">="
cXPathToken.ValueComp		= 23;	// "eq" | "ne" | "lt" | "le" | "gt" | "ge"
cXPathToken.NodeComp		= 24;	// "is" | "<<" | ">>"

// 3.6 Logical Expressions
cXPathToken.OrExpr			= 8;	// AndExpr ("or" AndExpr)*
cXPathToken.AndExpr			= 9;	// ComparisonExpr ("and" ComparisonExpr)*

// 3.7 For Expressions
cXPathToken.ForExpr			= 4;	// SimpleForClause "return" ExprSingle
cXPathToken.SimpleForClause	= 5;	// "for" "$" VarName "in" ExprSingle ("," "$" VarName "in" ExprSingle)*

// 3.8 Conditional Expressions
cXPathToken.IfExpr			= 7;	// "if" "(" Expr ")" "then" ExprSingle "else" ExprSingle

// 3.9 Quantified Expressions
cXPathToken.QuantifiedExpr	= 6;	// ("some" "$" | "every" "$") VarName "in" ExprSingle ("," "$" VarName "in" ExprSingle)* "satisfies" ExprSingle

/*
// 3.10 Expressions on SequenceTypes
// 3.10.1 Instance Of
cXPathToken.InstanceofExpr	= 16;	// TreatExpr ("instance" "of" SequenceType)?
// 3.10.2 Cast
cXPathToken.CastExpr		= 19;	// UnaryExpr ("cast" "as" SingleType)?
cXPathToken.SingleType		= 49;	// AtomicType "?"?
// 3.10.3 Castable
cXPathToken.CastableExpr	= 18;	// CastExpr ("castable" "as" SingleType)?
// 3.10.5 Treat
cXPathToken.TreatExpr		= 17;	// CastableExpr ("treat" "as" SequenceType)?
*/

// TERMINAL LITERALS
cXPathToken.IntegerLiteral	= 71;	// Digits
cXPathToken.DecimalLiteral	= 72;	// ("." Digits) | (Digits "." [0-9]*)
cXPathToken.DoubleLiteral	= 73;	// (("." Digits) | (Digits ("." [0-9]*)?)) [eE] [+-]? Digits
cXPathToken.StringLiteral	= 74;	// ('"' (EscapeQuot | [^"])* '"') | ("'" (EscapeApos | [^'])* "'")
cXPathToken.EscapeQuot		= 75;	// '""'
cXPathToken.EscapeApos		= 76;	// "''"
cXPathToken.QName			= 78;	// (Prefix ':' NCName) | NCName
cXPathToken.NCName			= 79;	//
cXPathToken.Char			= 80;	// #x9 | #xA | #xD | [#x20-#xD7FF] | [#xE000-#xFFFD] | [#x10000-#x10FFFF]
cXPathToken.Digits			= 81;	// [0-9]+





// Members
cXPathToken.prototype.token		= null;
cXPathToken.prototype.value		= null;
//
cXPathToken.prototype.parentNode	= null;
cXPathToken.prototype.childNodes	= null;
//
cXPathToken.prototype.column	= 0;
cXPathToken.prototype.line		= 0;

cXPathToken.prototype.appendChild	= function(oNode) {
	oNode.parentNode	= this;
	this.childNodes.push(oNode);
};