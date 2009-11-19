<?
    $aFiles		= array();
    $aFiles[]	= "implementation/svg.js";
    $aFiles[]	= "implementation/classes/cSVGElement.js";

    $aFiles[]	= "implementation/classes/cSVGRect.js";
    $aFiles[]	= "implementation/classes/cSVGPathSeg.js";
    $aFiles[]	= "implementation/classes/cSVGPathSegList.js";

    // segments
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegArcAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegArcRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegClosePath.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoCubicAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoCubicRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoCubicSmoothAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoCubicSmoothRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoQuadraticAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoQuadraticRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoQuadraticSmoothAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegCurvetoQuadraticSmoothRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegLinetoAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegLinetoRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegLinetoHorizontalAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegLinetoHorizontalRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegLinetoVerticalAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegLinetoVerticalRel.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegMovetoAbs.js";
    $aFiles[]	= "implementation/classes/segments/cSVGPathSegMovetoRel.js";

    // elements
	// structure
	$aFiles[]	= "implementation/elements/svg.js";
    $aFiles[]	= "implementation/elements/g.js";
	$aFiles[]	= "implementation/elements/defs.js";
	$aFiles[]	= "implementation/elements/image.js";
	// linking
	$aFiles[]	= "implementation/elements/a.js";
   	// path
	$aFiles[]	= "implementation/elements/path.js";
    // basic shapes
    $aFiles[]	= "implementation/elements/rect.js";
    $aFiles[]	= "implementation/elements/circle.js";
    $aFiles[]	= "implementation/elements/ellipse.js";
    $aFiles[]	= "implementation/elements/line.js";
    $aFiles[]	= "implementation/elements/polyline.js";
    $aFiles[]	= "implementation/elements/polygon.js";
    // gradients and patterns
    $aFiles[]	= "implementation/elements/linearGradient.js";
    $aFiles[]	= "implementation/elements/radialGradient.js";
    $aFiles[]	= "implementation/elements/stop.js";
    $aFiles[]	= "implementation/elements/pattern.js";
    // text
    $aFiles[]	= "implementation/elements/text.js";
    $aFiles[]	= "implementation/elements/tspan.js";
    $aFiles[]	= "implementation/elements/textPath.js";
    // foreign object
    $aFiles[]	= "implementation/elements/foreignObject.js";

    // uncertain
    $aFiles[]	= "implementation/elements/style.js";
    $aFiles[]	= "implementation/elements/script.js";
	$aFiles[]	= "implementation/elements/title.js";
	$aFiles[]	= "implementation/elements/desc.js";
	$aFiles[]	= "implementation/elements/use.js";
	$aFiles[]	= "implementation/elements/marker.js";
	$aFiles[]	= "implementation/elements/clipPath.js";
	$aFiles[]	= "implementation/elements/metadata.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>