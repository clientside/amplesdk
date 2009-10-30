<?
	$aFiles		= array();
    $aFiles[]	= "markup.css";
    $aFiles[]	= "input.css";
    $aFiles[]	= "interaction.css";
    $aFiles[]	= "menu.css";
    $aFiles[]	= "tabbox.css";
    $aFiles[]	= "toolbox.css";
    $aFiles[]	= "listbox.css";
    $aFiles[]	= "tree.css";
    $aFiles[]	= "windowed.css";
    //
    $aFiles[]	= "datepicker-pane.css";
    $aFiles[]	= "colorpicker-pane.css";
    $aFiles[]	= "tooltip-pane.css";

    $sOutput	= "@namespace xul \"http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul\";\n";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: text/css");

	echo $sOutput;
?>