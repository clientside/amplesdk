/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXSWildcard	= function() {

};

cXSWildcard.prototype	= new cXSTerm;

cXSWildcard.NSCONSTRAINT_ANY	= 1;
cXSWildcard.NSCONSTRAINT_NOT	= 2;
cXSWildcard.NSCONSTRAINT_LIST	= 3;

cXSWildcard.PC_STRICT	= 1;
cXSWildcard.PC_SKIP		= 2;
cXSWildcard.PC_LAX		= 3;

cXSWildcard.prototype.constraintType	= null;	// Number
cXSWildcard.prototype.nsConstraintList	= null;	// StringList
cXSWildcard.prototype.processContents	= null;	// Number
cXSWildcard.prototype.annotation		= null;	// XSAnnotation
