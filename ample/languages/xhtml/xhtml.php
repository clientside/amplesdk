<?
    $aFiles		= array();
    $aFiles[]	= "xhtml.js";

    // classes
    $aFiles[]	= "classes/cXHTMLElement.js";
    $aFiles[]	= "classes/cXHTMLInputElement.js";

	// managers
    $aFiles[]	= "managers/oXHTMLAccessKeyManager.js";

    // 4.1 The root element
    $aFiles[]		= "elements/root/html.js";

    // 4.2 Document metadata
    $aFiles[]		= "elements/metadata/base.js";
    $aFiles[]		= "elements/metadata/head.js";
    $aFiles[]		= "elements/metadata/link.js";
    $aFiles[]		= "elements/metadata/meta.js";
    $aFiles[]		= "elements/metadata/style.js";
    $aFiles[]		= "elements/metadata/title.js";

    // 4.3 Scripting
    $aFiles[]		= "elements/scripting/eventsource.js";	// HTML5
    $aFiles[]		= "elements/scripting/noscript.js";
    $aFiles[]		= "elements/scripting/script.js";

    // 4.4 Sections
    $aFiles[]		= "elements/sections/address.js";
    $aFiles[]		= "elements/sections/article.js";	// HTML5
    $aFiles[]		= "elements/sections/aside.js";		// HTML5
    $aFiles[]		= "elements/sections/body.js";
    $aFiles[]		= "elements/sections/footer.js";	// HTML5
    $aFiles[]		= "elements/sections/h1.js";
    $aFiles[]		= "elements/sections/h2.js";
    $aFiles[]		= "elements/sections/h3.js";
    $aFiles[]		= "elements/sections/h4.js";
    $aFiles[]		= "elements/sections/h5.js";
    $aFiles[]		= "elements/sections/h6.js";
    $aFiles[]		= "elements/sections/header.js";	// HTML5
    $aFiles[]		= "elements/sections/nav.js";		// HTML5
    $aFiles[]		= "elements/sections/section.js";	// HTML5

    // 4.5 Grouping
    $aFiles[]		= "elements/grouping/blockquote.js";
    $aFiles[]		= "elements/grouping/dd.js";
    $aFiles[]		= "elements/grouping/div.js";
    $aFiles[]		= "elements/grouping/dl.js";
    $aFiles[]		= "elements/grouping/dt.js";
    $aFiles[]		= "elements/grouping/figure.js";
    $aFiles[]		= "elements/grouping/figcaption.js";
    $aFiles[]		= "elements/grouping/hr.js";
    $aFiles[]		= "elements/grouping/li.js";
    $aFiles[]		= "elements/grouping/ol.js";
    $aFiles[]		= "elements/grouping/p.js";
    $aFiles[]		= "elements/grouping/pre.js";
    $aFiles[]		= "elements/grouping/ul.js";

	// 4.6 Text-level semantics
    $aFiles[]		= "elements/text/a.js";
    $aFiles[]		= "elements/text/abbr.js";
    $aFiles[]		= "elements/text/b.js";
    $aFiles[]		= "elements/text/bdo.js";
    $aFiles[]		= "elements/text/br.js";
    $aFiles[]		= "elements/text/cite.js";
    $aFiles[]		= "elements/text/code.js";
    $aFiles[]		= "elements/text/dfn.js";
    $aFiles[]		= "elements/text/em.js";
    $aFiles[]		= "elements/text/i.js";
    $aFiles[]		= "elements/text/kbd.js";
    $aFiles[]		= "elements/text/mark.js";			// HTML5
    $aFiles[]		= "elements/text/q.js";
    $aFiles[]		= "elements/text/rp.js";			// HTML5
    $aFiles[]		= "elements/text/rt.js";			// HTML5
    $aFiles[]		= "elements/text/ruby.js";			// HTML5
    $aFiles[]		= "elements/text/samp.js";
    $aFiles[]		= "elements/text/small.js";
    $aFiles[]		= "elements/text/span.js";
    $aFiles[]		= "elements/text/strong.js";
    $aFiles[]		= "elements/text/sub.js";
    $aFiles[]		= "elements/text/sup.js";
    $aFiles[]		= "elements/text/time.js";			// HTML5
    $aFiles[]		= "elements/text/var.js";
    $aFiles[]		= "elements/text/wbr.js";			// HTML5

	// 4.7 Edits
    $aFiles[]		= "elements/edits/ins.js";
    $aFiles[]		= "elements/edits/del.js";

    // 4.8 Embedded content
    $aFiles[]		= "elements/embedded/audio.js";		// HTML5
    $aFiles[]		= "elements/embedded/area.js";
    $aFiles[]		= "elements/embedded/canvas.js";	// HTML5
    $aFiles[]		= "elements/embedded/embed.js";		// HTML5
    $aFiles[]		= "elements/embedded/figure.js";	// HTML5
	$aFiles[]		= "elements/embedded/iframe.js";
	$aFiles[]		= "elements/embedded/img.js";
	$aFiles[]		= "elements/embedded/map.js";
	$aFiles[]		= "elements/embedded/object.js";
	$aFiles[]		= "elements/embedded/param.js";
    $aFiles[]		= "elements/embedded/source.js";	// HTML5
	$aFiles[]		= "elements/embedded/video.js";		// HTML5

	// 4.9 Tabular data
	$aFiles[]		= "elements/tabular/caption.js";
	$aFiles[]		= "elements/tabular/col.js";
	$aFiles[]		= "elements/tabular/colgroup.js";
	$aFiles[]		= "elements/tabular/table.js";
	$aFiles[]		= "elements/tabular/tbody.js";
	$aFiles[]		= "elements/tabular/td.js";
	$aFiles[]		= "elements/tabular/tfoot.js";
	$aFiles[]		= "elements/tabular/th.js";
	$aFiles[]		= "elements/tabular/thead.js";
	$aFiles[]		= "elements/tabular/tr.js";

	// 4.10 Forms
	$aFiles[]		= "elements/forms/button.js";
	$aFiles[]		= "elements/forms/datalist.js";		// HTML5
	$aFiles[]		= "elements/forms/fieldset.js";
	$aFiles[]		= "elements/forms/form.js";
	$aFiles[]		= "elements/forms/input.js";
	$aFiles[]		= "elements/forms/keygen.js";
	$aFiles[]		= "elements/forms/label.js";
	$aFiles[]		= "elements/forms/legend.js";
	$aFiles[]		= "elements/forms/meter.js";
	$aFiles[]		= "elements/forms/optgroup.js";
	$aFiles[]		= "elements/forms/option.js";
	$aFiles[]		= "elements/forms/output.js";		// HTML5
	$aFiles[]		= "elements/forms/progress.js";
	$aFiles[]		= "elements/forms/select.js";
	$aFiles[]		= "elements/forms/textarea.js";

	// 4.11 Interactive elements
    $aFiles[]		= "elements/interactive/command.js";	// HTML5
    $aFiles[]		= "elements/interactive/details.js";	// HTML5
    $aFiles[]		= "elements/interactive/menu.js";		// HTML5
    $aFiles[]		= "elements/interactive/summary.js";	// HTML5

    // Other
    $aFiles[]		= "elements/other/dialog.js";		// HTML5

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>