<?
    $aFiles		= array();
    $aFiles[]	= "xforms11.js";
    $aFiles[]	= "classes/cXFORMS11Element.js";

	// elements
	// 3.3 XForms Core Module
	$aFiles[]	= "elements/model.js";
    $aFiles[]	= "elements/instance.js";
	$aFiles[]	= "elements/instanceData.js";
	$aFiles[]	= "elements/bind.js";
	$aFiles[]	= "elements/submission.js";
	// 3.4 XForms Extension Module
	$aFiles[]	= "elements/extension.js";
	// 8 Core Form Controls
	// 8.1 Core Form Controls Module
	$aFiles[]	= "elements/input.js";
	$aFiles[]	= "elements/secret.js";
	$aFiles[]	= "elements/textarea.js";
	$aFiles[]	= "elements/output.js";
	$aFiles[]	= "elements/upload.js";
	$aFiles[]	= "elements/range.js";
	$aFiles[]	= "elements/trigger.js";
	$aFiles[]	= "elements/submit.js";
	$aFiles[]	= "elements/select.js";
	$aFiles[]	= "elements/select1.js";
	// 8.2 Common support elements
	$aFiles[]	= "elements/label.js";
	$aFiles[]	= "elements/help.js";
	$aFiles[]	= "elements/hint.js";
	$aFiles[]	= "elements/alert.js";
	// 8.3 Common markup for selection controls
	$aFiles[]	= "elements/choices.js";
	$aFiles[]	= "elements/item.js";
	$aFiles[]	= "elements/value.js";
	// 9 Container Form Controls
	// 9.1 XForms Group Module
	$aFiles[]	= "elements/group.js";
	// 9.2 XForms Switch Module
	$aFiles[]	= "elements/switch.js";
	$aFiles[]	= "elements/case.js";
	// 9.3 XForms Repeat Module
	$aFiles[]	= "elements/repeat.js";
//	$aFiles[]	= "elements/setindex.js";	// Defined in "10 XForms Actions"
	$aFiles[]	= "elements/itemset.js";
	$aFiles[]	= "elements/copy.js";
	// 10 XForms Actions
	$aFiles[]	= "elements/action.js";
	$aFiles[]	= "elements/setvalue.js";
	$aFiles[]	= "elements/insert.js";
	$aFiles[]	= "elements/delete.js";
	$aFiles[]	= "elements/setindex.js";
	$aFiles[]	= "elements/toggle.js";
	$aFiles[]	= "elements/setfocus.js";
	$aFiles[]	= "elements/dispatch.js";
	$aFiles[]	= "elements/rebuild.js";
	$aFiles[]	= "elements/recalculate.js";
	$aFiles[]	= "elements/revalidate.js";
	$aFiles[]	= "elements/refresh.js";
	$aFiles[]	= "elements/reset.js";
	$aFiles[]	= "elements/load.js";
	$aFiles[]	= "elements/send.js";
	$aFiles[]	= "elements/message.js";
	// 11 XForms Submission Module
//	$aFiles[]	= "elements/submission.js";	// Defined in "11 XForms Submission Module"
	$aFiles[]	= "elements/method.js";
	$aFiles[]	= "elements/header.js";
	$aFiles[]	= "elements/resource.js";

    $sOutput	= "";
    for ($nIndex = 0; $nIndex < count($aFiles); $nIndex++)
        $sOutput	.= join('', file($aFiles[$nIndex])) . "\n";

	header("Content-type: application/javascript");

	echo 	"(function(){" .
				$sOutput .
			"})();";
?>