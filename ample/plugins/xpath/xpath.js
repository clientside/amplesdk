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
/* FIXME: Uncomment when API gets available
// Publish objects to window
window.AMLXPathEvaluator	= ample.sign(cAMLXPathEvaluator);
window.AMLXPathException	= ample.sign(cAMLXPathException);
window.AMLXPathExpression	= ample.sign(cAMLXPathExpression);
window.AMLXPathNamespace	= ample.sign(cAMLXPathNamespace);
window.AMLXPathNSResolver	= ample.sign(cAMLXPathNSResolver);
window.AMLXPathResult		= ample.sign(cAMLXPathResult);
*/
// Extend ample
ample.extend(cAMLXPathEvaluator.prototype,	AMLDocument.prototype);