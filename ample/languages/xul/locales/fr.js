(function($) {
    var locales = $.locales,
    	locale	= locales["fr"]	= $.extend(true, {}, locales.en, {

    		// window/dialog/wizard
    		"dialog.button.accept":		"OK",
    		"dialog.button.cancel":		"Annuler",
    		"dialog.button.close":		"Fermer",
    		"dialog.button.help":		"Aide",
    		"dialog.button.finish":		"Fin",
    		"dialog.button.next":		"Suivant",
    		"dialog.button.previous":	"Précédent",

    		// editor
    		"editor.button.undo":				"Annuler la frappe",
    		"editor.button.redo":				"Rétablir la frappe",
    		"editor.button.justifyleft":		"Aligner à gauche",
    		"editor.button.justifycenter":		"Centrer",
    		"editor.button.justifyright":		"Aligner à droite",
    		"editor.button.justifyfull":		"Alignement par défaut",
    		"editor.button.outdent":			"Diminuer le retrait",
    		"editor.button.indent":				"Augmenter le retrait",
    		"editor.button.insertunorderedlist":"Commencer une liste",
    		"editor.button.insertorderedlist":	"Commencer une liste numérotée",
    		"editor.button.createlink":			"Créer un lien",
    		"editor.button.unlink":				"Supprimer le lien",
    		"editor.button.bold":				"Mettre en texte gras",
    		"editor.button.italic":				"Mettre en texte italique",
    		"editor.button.underline":			"Mettre en texte souligné",
    		"editor.button.strikethrough":		"Mettre en texte barré",
    		"editor.button.subscript":			"Mettre en indice",
    		"editor.button.superscript":		"Mettre en exposant",
    		"editor.button.fontsize":			"Changer la taille des caractères",
    		"editor.button.fontname":			"Changer la police de caractères",
    		"editor.button.formatblock":		"Formater le bloc",
    		"editor.button.forecolor":			"Changer la couleur du texte",
    		"editor.button.backcolor":			"Changer la couleur de fond",

    		// Stupid text (please keep it for RCS and later editions)
    		"{":"}"
    	}, locales["fr"]);
})(ample.locale);