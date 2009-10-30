<?
    $aFiles		= array();
    $aFiles[]	= "implementation/xforms11.js";
    $aFiles[]	= "implementation/classes/cXFORMS11Element.js";

	// elements
	// 3.3 XForms Core Module
	$aFiles[]	= "implementation/elements/model.js";
    $aFiles[]	= "implementation/elements/instance.js";
	$aFiles[]	= "implementation/elements/instanceData.js";
	$aFiles[]	= "implementation/elements/bind.js";
	$aFiles[]	= "implementation/elements/submission.js";
	// 3.4 XForms Extension Module
	$aFiles[]	= "implementation/elements/extension.js";
	// 8 Core Form Controls
	// 8.1 Core Form Controls Module
	$aFiles[]	= "implementation/elements/input.js";
	$aFiles[]	= "implementation/elements/secret.js";
	$aFiles[]	= "implementation/elements/textarea.js";
	$aFiles[]	= "implementation/elements/output.js";
	$aFiles[]	= "implementation/elements/upload.js";
	$aFiles[]	= "implementation/elements/range.js";
	$aFiles[]	= "implementation/elements/trigger.js";
	$aFiles[]	= "implementation/elements/submit.js";
	$aFiles[]	= "implementation/elements/select.js";
	$aFiles[]	= "implementation/elements/select1.js";
	// 8.2 Common support elements
	$aFiles[]	= "implementation/elements/label.js";
	$aFiles[]	= "implementation/elements/help.js";
	$aFiles[]	= "implementation/elements/hint.js";
	$aFiles[]	= "implementation/elements/alert.js";
	// 8.3 Common markup for selection controls
	$aFiles[]	= "implementation/elements/choices.js";
	$aFiles[]	= "implementation/elements/item.js";
	$aFiles[]	= "implementation/elements/value.js";
	// 9 Container Form Controls
	// 9.1 XForms Group Module
	$aFiles[]	= "implementation/elements/group.js";
	// 9.2 XForms Switch Module
	$aFiles[]	= "implementation/elements/switch.js";
	$aFiles[]	= "implementation/elements/case.js";
	// 9.3 XForms Repeat Module
	$aFiles[]	= "implementation/elements/repeat.js";
//	$aFiles[]	= "implementation/elements/setindex.js";	// Defined in "10 XForms Actions"
	$aFiles[]	= "implementation/elements/itemset.js";
	$aFiles[]	= "implementation/elements/copy.js";
	// 10 XForms Actions
	$aFiles[]	= "implementation/elements/action.js";
	$aFiles[]	= "implementation/elements/setvalue.js";
	$aFiles[]	= "implementation/elements/insert.js";
	$aFiles[]	= "implementation/elements/delete.js";
	$aFiles[]	= "implementation/elements/setindex.js";
	$aFiles[]	= "implementation/elements/toggle.js";
	$aFiles[]	= "implementation/elements/setfocus.js";
	$aFiles[]	= "implementation/elements/dispatch.js";
	$aFiles[]	= "implementation/elements/rebuild.js";
	$aFiles[]	= "implementation/elements/recalculate.js";
	$aFiles[]	= "implementation/elements/revalidate.js";
	$aFiles[]	= "implementation/elements/refresh.js";
	$aFiles[]	= "implementation/elements/reset.js";
	$aFiles[]	= "implementation/elements/load.js";
	$aFiles[]	= "implementation/elements/send.js";
	$aFiles[]	= "implementation/elements/message.js";
	// 11 XForms Submission Module
//	$aFiles[]	= "implementation/elements/submission.js";	// Defined in "11 XForms Submission Module"
	$aFiles[]	= "implementation/elements/method.js";
	$aFiles[]	= "implementation/elements/header.js";
	$aFiles[]	= "implementation/elements/resource.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>