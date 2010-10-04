/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	var files	= [];

	// Classes
	files.push("classes/cSVGElement.js");
	files.push("classes/cSVGRect.js");
	files.push("classes/cSVGPathSeg.js");
	files.push("classes/cSVGPathSegList.js");
	// segments
	files.push("classes/segments/cSVGPathSegArcAbs.js");
	files.push("classes/segments/cSVGPathSegArcRel.js");
	files.push("classes/segments/cSVGPathSegClosePath.js");
	files.push("classes/segments/cSVGPathSegCurvetoCubicAbs.js");
	files.push("classes/segments/cSVGPathSegCurvetoCubicRel.js");
	files.push("classes/segments/cSVGPathSegCurvetoCubicSmoothAbs.js");
	files.push("classes/segments/cSVGPathSegCurvetoCubicSmoothRel.js");
	files.push("classes/segments/cSVGPathSegCurvetoQuadraticAbs.js");
	files.push("classes/segments/cSVGPathSegCurvetoQuadraticRel.js");
	files.push("classes/segments/cSVGPathSegCurvetoQuadraticSmoothAbs.js");
	files.push("classes/segments/cSVGPathSegCurvetoQuadraticSmoothRel.js");
	files.push("classes/segments/cSVGPathSegLinetoAbs.js");
	files.push("classes/segments/cSVGPathSegLinetoRel.js");
	files.push("classes/segments/cSVGPathSegLinetoHorizontalAbs.js");
	files.push("classes/segments/cSVGPathSegLinetoHorizontalRel.js");
	files.push("classes/segments/cSVGPathSegLinetoVerticalAbs.js");
	files.push("classes/segments/cSVGPathSegLinetoVerticalRel.js");
	files.push("classes/segments/cSVGPathSegMovetoAbs.js");
	files.push("classes/segments/cSVGPathSegMovetoRel.js");

	// Elements
	// structure
	files.push("elements/svg.js");
	files.push("elements/g.js");
	files.push("elements/defs.js");
	files.push("elements/image.js");
	// linking
	files.push("elements/a.js");
	// path
	files.push("elements/path.js");
	// basic shapes
	files.push("elements/rect.js");
	files.push("elements/circle.js");
	files.push("elements/ellipse.js");
	files.push("elements/line.js");
	files.push("elements/polyline.js");
	files.push("elements/polygon.js");
	// gradients and patterns
	files.push("elements/linearGradient.js");
	files.push("elements/radialGradient.js");
	files.push("elements/stop.js");
	files.push("elements/pattern.js");
	// text
	files.push("elements/text.js");
	files.push("elements/tspan.js");
	files.push("elements/tref.js");
	files.push("elements/textPath.js");
	// foreign object
	files.push("elements/foreignObject.js");

	// uncertain
	files.push("elements/style.js");
	files.push("elements/script.js");
	files.push("elements/title.js");
	files.push("elements/desc.js");
	files.push("elements/switch.js");
	files.push("elements/use.js");
	files.push("elements/marker.js");
	files.push("elements/clipPath.js");
	files.push("elements/metadata.js");
	files.push("elements/symbol.js");

	// integrations
	files.push("integrations/smil.js");

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
	oScript.text	= "(function(){" + source.join("\n") + "})()";
	oScript.parentNode.removeChild(oScript);
})();