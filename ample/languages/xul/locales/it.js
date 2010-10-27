/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky, Zingus J. Rinkle
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

(function($) {
    var locales = $.locales,
    	locale	= locales["it"]	= $.extend(true, {}, locales.en, {
    		// window/dialog/wizard
    		"dialog.button.accept":		"OK",
    		"dialog.button.cancel":		"Annulla",
    		"dialog.button.close":		"Chiudi",
    		"dialog.button.help":		"Aiuto",
    		"dialog.button.finish":		"Fine",
    		"dialog.button.next":		"Prossimo",
    		"dialog.button.previous":	"Precedente",

    		// editor
    		"editor.button.undo":				"Annulla Inserimento",
    		"editor.button.redo":				"Ripristina Inserimento",
    		"editor.button.justifyleft":		"Allinea Testo a Sinistra",
    		"editor.button.justifycenter":		"Allinea Testo al Centro",
    		"editor.button.justifyright":		"Allinea Text a Destra",
    		"editor.button.justifyfull":		"Allineamento giustificato",
    		"editor.button.outdent":			"Diminuisci l'Indentazione del Paragrafo",
    		"editor.button.indent":				"Aumenta l'Indentazione del Paragrafo",
    		"editor.button.insertunorderedlist":"Inizia una Lista puntata",
    		"editor.button.insertorderedlist":	"Inizia una Lista numerata",
    		"editor.button.createlink":			"Crea un Link",
    		"editor.button.unlink":				"Rimuovi il Link",
    		"editor.button.bold":				"Rendi grassetto il Testo selezionato",
    		"editor.button.italic":				"Rendi corsivo il Testo selezionato",
    		"editor.button.underline":			"Sottolinea il Testo selezionato",
    		"editor.button.strikethrough":		"Sbarra il Testo selezionato",
    		"editor.button.subscript":			"Sposta il Testo in alto (Apice)",
    		"editor.button.superscript":		"Sposta il Testo in basso (Pedice)",
    		"editor.button.fontsize":			"Cambia la Dimensione del Carattere",
    		"editor.button.fontname":			"Cambia il Tipo di Carattere",
    		"editor.button.formatblock":		"Formattazione del Paragrafo",
    		"editor.button.forecolor":			"Cambia il colore del testo",
    		"editor.button.backcolor":			"Cambia il colore di sfondo del testo",

    		// Stupid text (please keep it for RCS and later editions)
    		"{":"}"
    	}, locales["it"]);
})(ample.locale);