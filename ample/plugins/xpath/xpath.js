/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */
//->Source
ample.include("classes/AMLXPathEvaluator.js");
ample.include("classes/AMLXPathException.js");
ample.include("classes/AMLXPathExpression.js");
ample.include("classes/AMLXPathNamespace.js");
ample.include("classes/AMLXPathNSResolver.js");
ample.include("classes/AMLXPathResult.js");
//<-Source
// Publish objects to window
ample.publish(cAMLXPathEvaluator,	"AMLXPathEvaluator");
ample.publish(cAMLXPathException,	"AMLXPathException");
ample.publish(cAMLXPathExpression,	"AMLXPathExpression");
ample.publish(cAMLXPathNamespace,	"AMLXPathNamespace");
ample.publish(cAMLXPathNSResolver,	"AMLXPathNSResolver");
ample.publish(cAMLXPathResult,		"AMLXPathResult");
// Extend ample
ample.extend(cAMLXPathEvaluator.prototype,	AMLDocument.prototype);