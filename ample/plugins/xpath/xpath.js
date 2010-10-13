/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//->Source
/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */
(function() {
	var files	= [];
	//
	files.push("classes/AMLXPathEvaluator.js");
	files.push("classes/AMLXPathException.js");
	files.push("classes/AMLXPathExpression.js");
	files.push("classes/AMLXPathNamespace.js");
	files.push("classes/AMLXPathNSResolver.js");
	files.push("classes/AMLXPathResult.js");
	//
	files.push("parser/parser.js");
	files.push("evaluator/evaluator.js");

	// load files
	var source = [],
		scripts	= document.getElementsByTagName("script"),
		base	= scripts[scripts.length-1].src.replace(/\/?[^\/]+$/, '');
	for (var n = 0; n < files.length; n++) {
		var oRequest = new (window.XMLHttpRequest ? XMLHttpRequest : ActiveXObject("Microsoft.XMLHTTP"));
		oRequest.open("GET", base + '/' + files[n], false);
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
ample.publish(cAMLXPathEvaluator,	"AMLXPathEvaluator");
ample.publish(cAMLXPathException,	"AMLXPathException");
ample.publish(cAMLXPathExpression,	"AMLXPathExpression");
ample.publish(cAMLXPathNamespace,	"AMLXPathNamespace");
ample.publish(cAMLXPathNSResolver,	"AMLXPathNSResolver");
ample.publish(cAMLXPathResult,		"AMLXPathResult");

// Extend ample object
ample.extend(cAMLXPathEvaluator.prototype,	AMLDocument.prototype);
