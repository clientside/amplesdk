/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLXSWildcard	= function() {

};

cAMLXSWildcard.prototype	= new cAMLXSTerm;

cAMLXSWildcard.NSCONSTRAINT_ANY		= 1;
cAMLXSWildcard.NSCONSTRAINT_NOT		= 2;
cAMLXSWildcard.NSCONSTRAINT_LIST	= 3;

cAMLXSWildcard.PC_STRICT	= 1;
cAMLXSWildcard.PC_SKIP		= 2;
cAMLXSWildcard.PC_LAX		= 3;

cAMLXSWildcard.prototype.constraintType		= null;	// Number
cAMLXSWildcard.prototype.nsConstraintList	= null;	// StringList
cAMLXSWildcard.prototype.processContents	= null;	// Number
cAMLXSWildcard.prototype.annotation			= null;	// XSAnnotation
