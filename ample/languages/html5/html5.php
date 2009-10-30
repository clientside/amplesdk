<?
    $aFiles		= array();
    $aFiles[]		= "implementation/html5.js";
    $aFiles[]		= "implementation/classes/cHTML5Element.js";

    // 4.1 The root element
    $aFiles[]		= "implementation/elements/root/html.js";

    // 4.2 Document metadata
    $aFiles[]		= "implementation/elements/metadata/base.js";
    $aFiles[]		= "implementation/elements/metadata/head.js";
    $aFiles[]		= "implementation/elements/metadata/link.js";
    $aFiles[]		= "implementation/elements/metadata/meta.js";
    $aFiles[]		= "implementation/elements/metadata/style.js";
    $aFiles[]		= "implementation/elements/metadata/title.js";

    // 4.3 Scripting
    $aFiles[]		= "implementation/elements/scripting/eventsource.js";// HTML5
    $aFiles[]		= "implementation/elements/scripting/noscript.js";
    $aFiles[]		= "implementation/elements/scripting/script.js";

    // 4.4 Sections
    $aFiles[]		= "implementation/elements/sections/address.js";
    $aFiles[]		= "implementation/elements/sections/article.js";	// HTML5
    $aFiles[]		= "implementation/elements/sections/aside.js";		// HTML5
    $aFiles[]		= "implementation/elements/sections/body.js";
    $aFiles[]		= "implementation/elements/sections/footer.js";		// HTML5
    $aFiles[]		= "implementation/elements/sections/h1.js";
    $aFiles[]		= "implementation/elements/sections/h2.js";
    $aFiles[]		= "implementation/elements/sections/h3.js";
    $aFiles[]		= "implementation/elements/sections/h4.js";
    $aFiles[]		= "implementation/elements/sections/h5.js";
    $aFiles[]		= "implementation/elements/sections/h6.js";
    $aFiles[]		= "implementation/elements/sections/header.js";		// HTML5
    $aFiles[]		= "implementation/elements/sections/nav.js";		// HTML5
    $aFiles[]		= "implementation/elements/sections/section.js";	// HTML5

    // 4.5 Grouping
    $aFiles[]		= "implementation/elements/grouping/blockquote.js";
    $aFiles[]		= "implementation/elements/grouping/br.js";
    $aFiles[]		= "implementation/elements/grouping/dd.js";
    $aFiles[]		= "implementation/elements/grouping/dialog.js";		// HTML5
    $aFiles[]		= "implementation/elements/grouping/dl.js";
    $aFiles[]		= "implementation/elements/grouping/dt.js";
    $aFiles[]		= "implementation/elements/grouping/hr.js";
    $aFiles[]		= "implementation/elements/grouping/li.js";
    $aFiles[]		= "implementation/elements/grouping/ol.js";
    $aFiles[]		= "implementation/elements/grouping/p.js";
    $aFiles[]		= "implementation/elements/grouping/pre.js";
    $aFiles[]		= "implementation/elements/grouping/ul.js";

	// 4.6 Text-level semantics
    $aFiles[]		= "implementation/elements/text/a.js";
    $aFiles[]		= "implementation/elements/text/abbr.js";
    $aFiles[]		= "implementation/elements/text/b.js";
    $aFiles[]		= "implementation/elements/text/bdo.js";
    $aFiles[]		= "implementation/elements/text/cite.js";
    $aFiles[]		= "implementation/elements/text/code.js";
    $aFiles[]		= "implementation/elements/text/dfn.js";
    $aFiles[]		= "implementation/elements/text/em.js";
    $aFiles[]		= "implementation/elements/text/i.js";
    $aFiles[]		= "implementation/elements/text/kbd.js";
    $aFiles[]		= "implementation/elements/text/mark.js";			// HTML5
    $aFiles[]		= "implementation/elements/text/meter.js";			// HTML5
    $aFiles[]		= "implementation/elements/text/progress.js";		// HTML5
    $aFiles[]		= "implementation/elements/text/q.js";
    $aFiles[]		= "implementation/elements/text/rp.js";				// HTML5
    $aFiles[]		= "implementation/elements/text/rt.js";				// HTML5
    $aFiles[]		= "implementation/elements/text/ruby.js";			// HTML5
    $aFiles[]		= "implementation/elements/text/samp.js";
    $aFiles[]		= "implementation/elements/text/small.js";
    $aFiles[]		= "implementation/elements/text/span.js";
    $aFiles[]		= "implementation/elements/text/strong.js";
    $aFiles[]		= "implementation/elements/text/sub.js";
    $aFiles[]		= "implementation/elements/text/sup.js";
    $aFiles[]		= "implementation/elements/text/time.js";			// HTML5
    $aFiles[]		= "implementation/elements/text/var.js";

	// 4.7 Edits
    $aFiles[]		= "implementation/elements/edits/ins.js";
    $aFiles[]		= "implementation/elements/edits/del.js";

    // 4.8 Embedded content
    $aFiles[]		= "implementation/elements/embedded/audio.js";		// HTML5
    $aFiles[]		= "implementation/elements/embedded/area.js";
    $aFiles[]		= "implementation/elements/embedded/canvas.js";		// HTML5
    $aFiles[]		= "implementation/elements/embedded/embed.js";		// HTML5
    $aFiles[]		= "implementation/elements/embedded/figure.js";		// HTML5
	$aFiles[]		= "implementation/elements/embedded/iframe.js";
	$aFiles[]		= "implementation/elements/embedded/img.js";
	$aFiles[]		= "implementation/elements/embedded/map.js";
	$aFiles[]		= "implementation/elements/embedded/object.js";
	$aFiles[]		= "implementation/elements/embedded/param.js";
    $aFiles[]		= "implementation/elements/embedded/source.js";		// HTML5
	$aFiles[]		= "implementation/elements/embedded/video.js";		// HTML5

	// 4.9 Tabular data
	$aFiles[]		= "implementation/elements/tabular/caption.js";
	$aFiles[]		= "implementation/elements/tabular/col.js";
	$aFiles[]		= "implementation/elements/tabular/colgroup.js";
	$aFiles[]		= "implementation/elements/tabular/table.js";
	$aFiles[]		= "implementation/elements/tabular/tbody.js";
	$aFiles[]		= "implementation/elements/tabular/td.js";
	$aFiles[]		= "implementation/elements/tabular/tfoot.js";
	$aFiles[]		= "implementation/elements/tabular/th.js";
	$aFiles[]		= "implementation/elements/tabular/thead.js";
	$aFiles[]		= "implementation/elements/tabular/tr.js";

	// 4.10 Forms
	$aFiles[]		= "implementation/elements/forms/button.js";
	$aFiles[]		= "implementation/elements/forms/datalist.js";		// HTML5
	$aFiles[]		= "implementation/elements/forms/fieldset.js";
	$aFiles[]		= "implementation/elements/forms/form.js";
	$aFiles[]		= "implementation/elements/forms/input.js";
	$aFiles[]		= "implementation/elements/forms/label.js";
	$aFiles[]		= "implementation/elements/forms/optgroup.js";
	$aFiles[]		= "implementation/elements/forms/option.js";
	$aFiles[]		= "implementation/elements/forms/output.js";		// HTML5
	$aFiles[]		= "implementation/elements/forms/select.js";
	$aFiles[]		= "implementation/elements/forms/textarea.js";

	// 4.11 Interactive elements
    $aFiles[]		= "implementation/elements/interactive/details.js";	// HTML5
    $aFiles[]		= "implementation/elements/interactive/datagrid.js";// HTML5
    $aFiles[]		= "implementation/elements/interactive/command.js";
    $aFiles[]		= "implementation/elements/interactive/bb.js";		// HTML5
    $aFiles[]		= "implementation/elements/interactive/menu.js";	// HTML5
    $aFiles[]		= "implementation/elements/interactive/details.js";

	// 4.12 Miscellaneous elements
    $aFiles[]		= "implementation/elements/miscellaneous/div.js";
    $aFiles[]		= "implementation/elements/miscellaneous/legend.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>