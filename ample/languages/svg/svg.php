<?
    $aFiles		= array();
    $aFiles[]	= "svg.js";
    $aFiles[]	= "classes/cSVGElement.js";

    $aFiles[]	= "classes/cSVGRect.js";
    $aFiles[]	= "classes/cSVGPathSeg.js";
    $aFiles[]	= "classes/cSVGPathSegList.js";

    // segments
    $aFiles[]	= "classes/segments/cSVGPathSegArcAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegArcRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegClosePath.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoCubicAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoCubicRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoCubicSmoothAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoCubicSmoothRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoQuadraticAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoQuadraticRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoQuadraticSmoothAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegCurvetoQuadraticSmoothRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegLinetoAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegLinetoRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegLinetoHorizontalAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegLinetoHorizontalRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegLinetoVerticalAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegLinetoVerticalRel.js";
    $aFiles[]	= "classes/segments/cSVGPathSegMovetoAbs.js";
    $aFiles[]	= "classes/segments/cSVGPathSegMovetoRel.js";

    // elements
	// structure
	$aFiles[]	= "elements/svg.js";
    $aFiles[]	= "elements/g.js";
	$aFiles[]	= "elements/defs.js";
	$aFiles[]	= "elements/image.js";
	// linking
	$aFiles[]	= "elements/a.js";
   	// path
	$aFiles[]	= "elements/path.js";
    // basic shapes
    $aFiles[]	= "elements/rect.js";
    $aFiles[]	= "elements/circle.js";
    $aFiles[]	= "elements/ellipse.js";
    $aFiles[]	= "elements/line.js";
    $aFiles[]	= "elements/polyline.js";
    $aFiles[]	= "elements/polygon.js";
    // gradients and patterns
    $aFiles[]	= "elements/linearGradient.js";
    $aFiles[]	= "elements/radialGradient.js";
    $aFiles[]	= "elements/stop.js";
    $aFiles[]	= "elements/pattern.js";
    // text
    $aFiles[]	= "elements/text.js";
    $aFiles[]	= "elements/tspan.js";
    $aFiles[]	= "elements/tref.js";
    $aFiles[]	= "elements/textPath.js";
    // foreign object
    $aFiles[]	= "elements/foreignObject.js";

    // uncertain
    $aFiles[]	= "elements/style.js";
    $aFiles[]	= "elements/script.js";
	$aFiles[]	= "elements/title.js";
	$aFiles[]	= "elements/desc.js";
	$aFiles[]	= "elements/use.js";
	$aFiles[]	= "elements/marker.js";
	$aFiles[]	= "elements/clipPath.js";
	$aFiles[]	= "elements/metadata.js";
	$aFiles[]	= "elements/symbol.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>