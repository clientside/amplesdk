/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//->Source
/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */
var cRegExp	= window.RegExp;

(function() {
	var files	= [];
	//
	files.push("classes/XPathEvaluator.js");
	files.push("classes/XPathException.js");
	files.push("classes/XPathExpression.js");
	files.push("classes/XPathNamespace.js");
	files.push("classes/XPathNSResolver.js");
	files.push("classes/XPathParser.js");
	files.push("classes/XPathResult.js");
	files.push("classes/XPathToken.js");
	files.push("classes/XPathTokenizer.js");
	//
	files.push("parser/parser.js");
	files.push("evaluator/evaluator.js");

	// load files
	var source	= [],
		scripts	= document.getElementsByTagName("script"),
		base	= scripts[scripts.length-1].src.replace(/\/?[^\/]+$/, '');
	for (var n = 0; n < files.length; n++) {
		var oRequest	= new (window.XMLHttpRequest ? XMLHttpRequest : ActiveXObject("Microsoft.XMLHTTP"));
		oRequest.open("GET", base + files[n], false);
		oRequest.send(null);
		source[source.length]	= oRequest.responseText;
	}
	var oScript	= document.getElementsByTagName("head")[0].appendChild(document.createElement("script"));
	oScript.type	= "text/javascript";
	oScript.text	= source.join("\n");
	oScript.parentNode.removeChild(oScript);
})();
//<-Source

// Publish objects to window
ample.publish(cXPathEvaluator,	"XPathEvaluator");
ample.publish(cXPathException,	"XPathException");
ample.publish(cXPathExpression,	"XPathExpression");
ample.publish(cXPathNamespace,	"XPathNamespace");
ample.publish(cXPathNSResolver,	"XPathNSResolver");
ample.publish(cXPathResult,		"XPathResult");

// Extend ample object
ample.extend(ample.classes.Document.prototype, cXPathEvaluator.prototype);
