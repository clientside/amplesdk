/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

(function($) {
    var locales = $.locales,
    	locale	= locales["en"]	= $.extend(true, {}, locales.en, {
    		// window/dialog/wizard
    		"dialog.button.accept":		"OK",
    		"dialog.button.cancel":		"Cancel",
    		"dialog.button.close":		"Close",
    		"dialog.button.help":		"Help",
    		"dialog.button.finish":		"Finish",
    		"dialog.button.next":		"Next",
    		"dialog.button.previous":	"Previous",

    		// editor
    		"editor.button.undo":				"Undo typing",
    		"editor.button.redo":				"Redo typing",
    		"editor.button.justifyleft":		"Align text to the left",
    		"editor.button.justifycenter":		"Center text",
    		"editor.button.justifyright":		"Align text to the right",
    		"editor.button.justifyfull":		"Default alignment",
    		"editor.button.outdent":			"Decrease the indent level of the paragraph",
    		"editor.button.indent":				"Increase the indent level of the paragraph",
    		"editor.button.insertunorderedlist":"Start a bulleted list",
    		"editor.button.insertorderedlist":	"Start a numbered list",
    		"editor.button.createlink":			"Create a hyperlink",
    		"editor.button.unlink":				"Remove hyperlink",
    		"editor.button.bold":				"Make the selected text bold",
    		"editor.button.italic":				"Italicize the selected text",
    		"editor.button.underline":			"Underline the selected text",
    		"editor.button.strikethrough":		"Strikethrough the selected text",
    		"editor.button.subscript":			"Subscript the selected text",
    		"editor.button.superscript":		"Superscript the selected text",
    		"editor.button.fontsize":			"Change the font size",
    		"editor.button.fontname":			"Change the font name",
    		"editor.button.formatblock":		"Format block",
    		"editor.button.forecolor":			"Change the text color",
    		"editor.button.backcolor":			"Change the text background color",

    		// Stupid text (please keep it for RCS and later editions)
    		"{":"}"
    	}, locales["en"]);
})(ample.locale);