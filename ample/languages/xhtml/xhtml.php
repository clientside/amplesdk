<?
    $aFiles		= array();
    $aFiles[]		= "implementation/xhtml.js";

    // classes
    $aFiles[]		= "implementation/classes/cXHTMLElement.js";

	// managers
    $aFiles[]		= "implementation/managers/oXHTMLAccessKeyManager.js";

	// elements
	$aFiles[]	= "implementation/elements/a.js";
	$aFiles[]	= "implementation/elements/abbr.js";
	$aFiles[]	= "implementation/elements/acronym.js";
	$aFiles[]	= "implementation/elements/address.js";
	$aFiles[]	= "implementation/elements/area.js";
	$aFiles[]	= "implementation/elements/b.js";
	$aFiles[]	= "implementation/elements/base.js";
	$aFiles[]	= "implementation/elements/bdo.js";
	$aFiles[]	= "implementation/elements/big.js";
	$aFiles[]	= "implementation/elements/blockquote.js";
	$aFiles[]	= "implementation/elements/body.js";
	$aFiles[]	= "implementation/elements/br.js";
	$aFiles[]	= "implementation/elements/button.js";
	$aFiles[]	= "implementation/elements/caption.js";
	$aFiles[]	= "implementation/elements/cite.js";
	$aFiles[]	= "implementation/elements/code.js";
	$aFiles[]	= "implementation/elements/col.js";
	$aFiles[]	= "implementation/elements/colgroup.js";
	$aFiles[]	= "implementation/elements/dd.js";
	$aFiles[]	= "implementation/elements/del.js";
	$aFiles[]	= "implementation/elements/dfn.js";
	$aFiles[]	= "implementation/elements/div.js";
	$aFiles[]	= "implementation/elements/dl.js";
	$aFiles[]	= "implementation/elements/dt.js";
	$aFiles[]	= "implementation/elements/em.js";
	$aFiles[]	= "implementation/elements/fieldset.js";
	$aFiles[]	= "implementation/elements/form.js";
	$aFiles[]	= "implementation/elements/h1.js";
	$aFiles[]	= "implementation/elements/h2.js";
	$aFiles[]	= "implementation/elements/h3.js";
	$aFiles[]	= "implementation/elements/h4.js";
	$aFiles[]	= "implementation/elements/h5.js";
	$aFiles[]	= "implementation/elements/h6.js";
	$aFiles[]	= "implementation/elements/head.js";
	$aFiles[]	= "implementation/elements/hr.js";
	$aFiles[]	= "implementation/elements/html.js";
	$aFiles[]	= "implementation/elements/i.js";
	$aFiles[]	= "implementation/elements/img.js";
	$aFiles[]	= "implementation/elements/input.js";
	$aFiles[]	= "implementation/elements/ins.js";
	$aFiles[]	= "implementation/elements/kbd.js";
	$aFiles[]	= "implementation/elements/label.js";
	$aFiles[]	= "implementation/elements/legend.js";
	$aFiles[]	= "implementation/elements/li.js";
	$aFiles[]	= "implementation/elements/link.js";
	$aFiles[]	= "implementation/elements/map.js";
	$aFiles[]	= "implementation/elements/meta.js";
	$aFiles[]	= "implementation/elements/noscript.js";
	$aFiles[]	= "implementation/elements/object.js";
	$aFiles[]	= "implementation/elements/ol.js";
	$aFiles[]	= "implementation/elements/optgroup.js";
	$aFiles[]	= "implementation/elements/option.js";
	$aFiles[]	= "implementation/elements/p.js";
	$aFiles[]	= "implementation/elements/param.js";
	$aFiles[]	= "implementation/elements/pre.js";
	$aFiles[]	= "implementation/elements/q.js";
	$aFiles[]	= "implementation/elements/samp.js";
	$aFiles[]	= "implementation/elements/script.js";
	$aFiles[]	= "implementation/elements/select.js";
	$aFiles[]	= "implementation/elements/small.js";
	$aFiles[]	= "implementation/elements/span.js";
	$aFiles[]	= "implementation/elements/strong.js";
	$aFiles[]	= "implementation/elements/style.js";
	$aFiles[]	= "implementation/elements/sub.js";
	$aFiles[]	= "implementation/elements/sup.js";
	$aFiles[]	= "implementation/elements/table.js";
	$aFiles[]	= "implementation/elements/tbody.js";
	$aFiles[]	= "implementation/elements/td.js";
	$aFiles[]	= "implementation/elements/th.js";
	$aFiles[]	= "implementation/elements/textarea.js";
	$aFiles[]	= "implementation/elements/tfoot.js";
	$aFiles[]	= "implementation/elements/thead.js";
	$aFiles[]	= "implementation/elements/title.js";
	$aFiles[]	= "implementation/elements/tr.js";
	$aFiles[]	= "implementation/elements/tt.js";
	$aFiles[]	= "implementation/elements/ul.js";
	$aFiles[]	= "implementation/elements/var.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>