<?php
    $aFiles		= array();
    $aFiles[]	= "classes/cXFElement.js";

	// elements
	// 3.3 XForms Core Module
	$aFiles[]	= "elements/model.js";
    $aFiles[]	= "elements/instance.js";
	$aFiles[]	= "elements/instanceData.js";
	$aFiles[]	= "elements/bind.js";
//	$aFiles[]	= "elements/submission.js";	// Defined in "11 XForms Submission Module"
	// 3.4 XForms Extension Module
	$aFiles[]	= "elements/extension.js";
	// 8 Core Form Controls
	// 8.1 Core Form Controls Module
	$aFiles[]	= "elements/controls/input.js";
	$aFiles[]	= "elements/controls/secret.js";
	$aFiles[]	= "elements/controls/textarea.js";
	$aFiles[]	= "elements/controls/output.js";
	$aFiles[]	= "elements/controls/upload.js";
	$aFiles[]	= "elements/controls/range.js";
	$aFiles[]	= "elements/controls/trigger.js";
	$aFiles[]	= "elements/controls/submit.js";
	$aFiles[]	= "elements/controls/select.js";
	$aFiles[]	= "elements/controls/select1.js";
	// 8.2 Common support elements
	$aFiles[]	= "elements/controls/label.js";
	$aFiles[]	= "elements/controls/help.js";
	$aFiles[]	= "elements/controls/hint.js";
	$aFiles[]	= "elements/controls/alert.js";
	// 8.3 Common markup for selection controls
	$aFiles[]	= "elements/controls/choices.js";
	$aFiles[]	= "elements/controls/item.js";
	$aFiles[]	= "elements/controls/value.js";
	// 9 Container Form Controls
	// 9.1 XForms Group Module
	$aFiles[]	= "elements/container/group.js";
	// 9.2 XForms Switch Module
	$aFiles[]	= "elements/container/switch.js";
	$aFiles[]	= "elements/container/case.js";
	// 9.3 XForms Repeat Module
	$aFiles[]	= "elements/container/repeat.js";
//	$aFiles[]	= "elements/container/setindex.js";	// Defined in "10 XForms Actions"
	$aFiles[]	= "elements/container/itemset.js";
	$aFiles[]	= "elements/container/copy.js";
	// 10 XForms Actions
	$aFiles[]	= "elements/actions/action.js";
	$aFiles[]	= "elements/actions/setvalue.js";
	$aFiles[]	= "elements/actions/insert.js";
	$aFiles[]	= "elements/actions/delete.js";
	$aFiles[]	= "elements/actions/setindex.js";
	$aFiles[]	= "elements/actions/toggle.js";
	$aFiles[]	= "elements/actions/setfocus.js";
	$aFiles[]	= "elements/actions/dispatch.js";
	$aFiles[]	= "elements/actions/rebuild.js";
	$aFiles[]	= "elements/actions/recalculate.js";
	$aFiles[]	= "elements/actions/revalidate.js";
	$aFiles[]	= "elements/actions/refresh.js";
	$aFiles[]	= "elements/actions/reset.js";
	$aFiles[]	= "elements/actions/load.js";
	$aFiles[]	= "elements/actions/send.js";
	$aFiles[]	= "elements/actions/message.js";
	// 11 XForms Submission Module
	$aFiles[]	= "elements/submission/submission.js";
	$aFiles[]	= "elements/submission/method.js";
	$aFiles[]	= "elements/submission/header.js";
	$aFiles[]	= "elements/submission/resource.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>