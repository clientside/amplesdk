<?
    $aFiles		= array();
    $aFiles[]		= "xhtml.js";

    // classes
    $aFiles[]		= "classes/cXHTMLElement.js";

	// managers
    $aFiles[]		= "managers/oXHTMLAccessKeyManager.js";

	// elements
	$aFiles[]	= "elements/a.js";
	$aFiles[]	= "elements/abbr.js";
	$aFiles[]	= "elements/acronym.js";
	$aFiles[]	= "elements/address.js";
	$aFiles[]	= "elements/area.js";
	$aFiles[]	= "elements/b.js";
	$aFiles[]	= "elements/base.js";
	$aFiles[]	= "elements/bdo.js";
	$aFiles[]	= "elements/big.js";
	$aFiles[]	= "elements/blockquote.js";
	$aFiles[]	= "elements/body.js";
	$aFiles[]	= "elements/br.js";
	$aFiles[]	= "elements/button.js";
	$aFiles[]	= "elements/caption.js";
	$aFiles[]	= "elements/cite.js";
	$aFiles[]	= "elements/code.js";
	$aFiles[]	= "elements/col.js";
	$aFiles[]	= "elements/colgroup.js";
	$aFiles[]	= "elements/dd.js";
	$aFiles[]	= "elements/del.js";
	$aFiles[]	= "elements/dfn.js";
	$aFiles[]	= "elements/div.js";
	$aFiles[]	= "elements/dl.js";
	$aFiles[]	= "elements/dt.js";
	$aFiles[]	= "elements/em.js";
	$aFiles[]	= "elements/fieldset.js";
	$aFiles[]	= "elements/form.js";
	$aFiles[]	= "elements/h1.js";
	$aFiles[]	= "elements/h2.js";
	$aFiles[]	= "elements/h3.js";
	$aFiles[]	= "elements/h4.js";
	$aFiles[]	= "elements/h5.js";
	$aFiles[]	= "elements/h6.js";
	$aFiles[]	= "elements/head.js";
	$aFiles[]	= "elements/hr.js";
	$aFiles[]	= "elements/html.js";
	$aFiles[]	= "elements/i.js";
	$aFiles[]	= "elements/img.js";
	$aFiles[]	= "elements/input.js";
	$aFiles[]	= "elements/ins.js";
	$aFiles[]	= "elements/kbd.js";
	$aFiles[]	= "elements/label.js";
	$aFiles[]	= "elements/legend.js";
	$aFiles[]	= "elements/li.js";
	$aFiles[]	= "elements/link.js";
	$aFiles[]	= "elements/map.js";
	$aFiles[]	= "elements/meta.js";
	$aFiles[]	= "elements/noscript.js";
	$aFiles[]	= "elements/object.js";
	$aFiles[]	= "elements/ol.js";
	$aFiles[]	= "elements/optgroup.js";
	$aFiles[]	= "elements/option.js";
	$aFiles[]	= "elements/p.js";
	$aFiles[]	= "elements/param.js";
	$aFiles[]	= "elements/pre.js";
	$aFiles[]	= "elements/q.js";
	$aFiles[]	= "elements/samp.js";
	$aFiles[]	= "elements/script.js";
	$aFiles[]	= "elements/select.js";
	$aFiles[]	= "elements/small.js";
	$aFiles[]	= "elements/span.js";
	$aFiles[]	= "elements/strong.js";
	$aFiles[]	= "elements/style.js";
	$aFiles[]	= "elements/sub.js";
	$aFiles[]	= "elements/sup.js";
	$aFiles[]	= "elements/table.js";
	$aFiles[]	= "elements/tbody.js";
	$aFiles[]	= "elements/td.js";
	$aFiles[]	= "elements/th.js";
	$aFiles[]	= "elements/textarea.js";
	$aFiles[]	= "elements/tfoot.js";
	$aFiles[]	= "elements/thead.js";
	$aFiles[]	= "elements/title.js";
	$aFiles[]	= "elements/tr.js";
	$aFiles[]	= "elements/tt.js";
	$aFiles[]	= "elements/ul.js";
	$aFiles[]	= "elements/var.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>