/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */
/* FIXME: Uncomment when API gets available
// Publish objects to window
window.AMLXPathEvaluator	= ample.sign(cAMLXPathEvaluator);
window.AMLXPathException	= ample.sign(cAMLXPathException);
window.AMLXPathExpression	= ample.sign(cAMLXPathExpression);
window.AMLXPathNamespace	= ample.sign(cAMLXPathNamespace);
window.AMLXPathNSResolver	= ample.sign(cAMLXPathNSResolver);
window.AMLXPathResult		= ample.sign(cAMLXPathResult);
*/
// Extend Ample SDK
ample.extend(cAMLXPathEvaluator.prototype,	AMLDocument.prototype);