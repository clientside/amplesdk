/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

/*
 * groups:	clipboard, history, align, text, list, link, color, font, indent
 */
// component constructor
var cXULElement_editor	= function() {
	//
	var that	= this;
	this.contentFragment	= ample.createDocumentFragment();
	// Font names
	this._elementFontName	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:menulist"));
	this._elementFontName.tabIndex	=-1;
	this._elementFontName.setAttribute("disabled", "true");
	this._elementFontName.setAttribute("class", "fontname");
	this._elementFontName.setAttribute("value", "Default");
	this._elementFontName.addEventListener("change", function(oEvent) {
		var oDOMDocument	= that.$getContainer("frame").contentWindow.document;
		oDOMDocument.execCommand("fontname", false, this.selectedIndex !=-1 ? this.items[this.selectedIndex].getAttribute("value") : '');
	}, false);
	var oElement,
		oPopup	= this._elementFontName.appendChild(ample.createElementNS(this.namespaceURI, "xul:menupopup"));
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Default");
	oElement.setAttribute("value", "");
	oElement.setAttribute("selected", "true");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Arial");
	oElement.setAttribute("value", "Arial");
	oElement.setAttribute("style", "font-family:Arial");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Arial Black");
	oElement.setAttribute("value", "Arial Black");
	oElement.setAttribute("style", "font-family:'Arial Black'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Book Antiqua");
	oElement.setAttribute("value", "Book Antiqua");
	oElement.setAttribute("style", "font-family:'Book Antiqua'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Comic Sans MS");
	oElement.setAttribute("value", "Comic Sans MS");
	oElement.setAttribute("style", "font-family:'Comic Sans MS'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Courier New");
	oElement.setAttribute("value", "Courier New");
	oElement.setAttribute("style", "font-family:'Courier New'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Georgia");
	oElement.setAttribute("value", "Georgia");
	oElement.setAttribute("style", "font-family:'Georgia'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Helvetica");
	oElement.setAttribute("value", "Helvetica");
	oElement.setAttribute("style", "font-family:'Helvetica'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Tahoma");
	oElement.setAttribute("value", "Tahoma");
	oElement.setAttribute("style", "font-family:'Tahoma'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Times New Roman");
	oElement.setAttribute("value", "Times New Roman");
	oElement.setAttribute("style", "font-family:'Times New Roman'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Trebuchet MS");
	oElement.setAttribute("value", "Trebuchet MS");
	oElement.setAttribute("style", "font-family:'Trebuchet MS'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Verdana");
	oElement.setAttribute("value", "Verdana");
	oElement.setAttribute("style", "font-family:'Verdana'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Webdings");
	oElement.setAttribute("value", "Webdings");
	oElement.setAttribute("style", "font-family:'Webdings'");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Wingdings");
	oElement.setAttribute("value", "Wingdings");
	oElement.setAttribute("style", "font-family:'Wingdings'");
	// Font sizes
	this._elementFontSize	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:menulist"));
	this._elementFontSize.tabIndex	=-1;
	this._elementFontSize.setAttribute("disabled", "true");
	this._elementFontSize.setAttribute("class", "fontsize");
	this._elementFontSize.setAttribute("value", "Default");
	this._elementFontSize.addEventListener("change", function(oEvent) {
		var oDOMDocument	= that.$getContainer("frame").contentWindow.document;
		oDOMDocument.execCommand("fontsize", false, this.selectedIndex !=-1 ? this.items[this.selectedIndex].getAttribute("value") : '');
	}, false);
	oPopup	= this._elementFontSize.appendChild(ample.createElementNS(this.namespaceURI, "xul:menupopup"));
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Default");
	oElement.setAttribute("value", "");
	oElement.setAttribute("selected", "true");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "1 (8pt)");
	oElement.setAttribute("value", "1");
//	oElement.setAttribute("style", "font-size:8pt");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "2 (10pt)");
	oElement.setAttribute("value", "2");
//	oElement.setAttribute("style", "font-size:10pt");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "3 (12pt)");
	oElement.setAttribute("value", "3");
//	oElement.setAttribute("style", "font-size:12pt");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "4 (14pt)");
	oElement.setAttribute("value", "4");
//	oElement.setAttribute("style", "font-size:14pt");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "5 (18pt)");
	oElement.setAttribute("value", "5");
//	oElement.setAttribute("style", "font-size:18pt");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "6 (24pt)");
	oElement.setAttribute("value", "6");
//	oElement.setAttribute("style", "font-size:24pt");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "7 (36pt)");
	oElement.setAttribute("value", "7");
//	oElement.setAttribute("style", "font-size:36pt");
	// Formats
	this._elementFormat		= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:menulist"));
	this._elementFormat.tabIndex	=-1;
	this._elementFormat.setAttribute("disabled", "true");
	this._elementFormat.setAttribute("class", "formatblock");
	this._elementFormat.setAttribute("value", "Default");
	this._elementFormat.addEventListener("change", function(oEvent) {
		var oDOMDocument	= that.$getContainer("frame").contentWindow.document;
		oDOMDocument.execCommand("formatblock", false, this.selectedIndex !=-1 ? this.items[this.selectedIndex].getAttribute("value") : '');
	}, false);
	oPopup	= this._elementFormat.appendChild(ample.createElementNS(this.namespaceURI, "xul:menupopup"));
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Default");
	oElement.setAttribute("value", "");
	oElement.setAttribute("selected", "true");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Paragraph");
	oElement.setAttribute("value", "p");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Address");
	oElement.setAttribute("value", "address");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Preformatted");
	oElement.setAttribute("value", "pre");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Heading 1");
	oElement.setAttribute("value", "h1");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Heading 2");
	oElement.setAttribute("value", "h2");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Heading 3");
	oElement.setAttribute("value", "h3");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Heading 4");
	oElement.setAttribute("value", "h4");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Heading 5");
	oElement.setAttribute("value", "h5");
	oElement	= oPopup.appendChild(ample.createElementNS(this.namespaceURI, "xul:menuitem"));
	oElement.setAttribute("label", "Heading 6");
	oElement.setAttribute("value", "h6");
};

// component prototype
cXULElement_editor.prototype	= new cXULInputElement("editor");
cXULElement_editor.prototype.$selectable	= true;

cXULElement_editor.prototype.contentDocument	= null;

// Handlers
cXULElement_editor.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer("frame").contentWindow.focus();
	},
	"blur":		function(oEvent) {
		var oNode	= this.firstChild || this.appendChild(this.ownerDocument.createCDATASection()),
			sHtml	= cXULElement_editor.sanityze(this.contentDocument.body.innerHTML);
		if (sHtml != oNode.data) {
			oNode.replaceData(0, oNode.length, sHtml);
			// Dispatch change event
			cXULInputElement.dispatchChange(this);
		}
		if (window.controllers)
			document.body.focus();
		else
			window.focus();
		//
		cXULElement_editor.resetButtons(this);
	},
	"DOMCharacterDataModified":	function() {
		if (this.firstChild.data != this.contentDocument.body.innerHTML)
			this.contentDocument.body.innerHTML	= this.firstChild.data;
	},
	"DOMNodeInsertedIntoDocument":	function() {
		var oDOMElement	= this.$getContainer("frame"),
			bGecko	= navigator.userAgent.match(/Gecko\/([\d\.]+)/),
			bEnabled	= this.$isAccessible(),
			that	= this;
		if (bEnabled) {
			if (!bGecko)
				oDOMElement.contentWindow.document.designMode	= "on";
			setTimeout(function(){
				if (bGecko)
					oDOMElement.contentWindow.document.designMode	= "on";
				setTimeout(function(){
					cXULElement_editor.initializeDocument(that);
				}, 0);
			}, 0);
		}
	},
	"DOMNodeRemovedFromDocument":	function() {
		cXULElement_editor.finalizeDocument(this);
	}
};

cXULElement_editor.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "disabled") {
		this.$setPseudoClass("disabled", sValue == "true");
		this.$getContainer("frame").contentWindow.document.designMode	= sValue == "true" ? "off" : "on";
		//
//		if (event.newValue == "true")
			cXULElement_editor.resetButtons(this);
		// IE needs re-initialization
		if (navigator.userAgent.match(/MSIE ([\d\.]+)/)) {
			var that	= this;
			cXULElement_editor.finalizeDocument(that);
			setTimeout(function() {
				cXULElement_editor.initializeDocument(that);
			}, 0);
		}
	}
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Static members
cXULElement_editor.commands	= [
	// command, display name, title
	[
		["undo",	"Undo",		ample.locale.localize("xul.editor.button.undo")],
		["redo",	"Redo",		ample.locale.localize("xul.editor.button.redo")]
	],
	[
		["justifyleft",	"Left",		ample.locale.localize("xul.editor.button.justifyleft")],
		["justifycenter",	"Center",	ample.locale.localize("xul.editor.button.justifycenter")],
		["justifyright",	"Right",	ample.locale.localize("xul.editor.button.justifyright")],
		["justifyfull",		"None",		ample.locale.localize("xul.editor.button.justifyfull")]
	],
	[
		["outdent",		"Outdent",	ample.locale.localize("xul.editor.button.outdent")],
		["indent",		"Indent",	ample.locale.localize("xul.editor.button.indent")]
	],
	[
		["insertunorderedlist",		"Unordered",	ample.locale.localize("xul.editor.button.insertunorderedlist")],
		["insertorderedlist",		"Ordered",		ample.locale.localize("xul.editor.button.insertorderedlist")]
	],
	[
		["createlink",	"Link",		ample.locale.localize("xul.editor.button.createlink")],
		["unlink",		"Unlink",	ample.locale.localize("xul.editor.button.unlink")]
	],
	[
		["bold",			"Bold",				ample.locale.localize("xul.editor.button.bold")],
		["italic",			"Emphasis",			ample.locale.localize("xul.editor.button.italic")],
		["underline",		"Underline",		ample.locale.localize("xul.editor.button.underline")],
		["strikethrough",	"Strikethrough",	ample.locale.localize("xul.editor.button.strikethrough")]
	],
	[
		["subscript",		"Subscript",		ample.locale.localize("xul.editor.button.subscript")],
		["superscript",		"Superscript",		ample.locale.localize("xul.editor.button.superscript")]
	]
	/*	// TODO
	[
		["fontsize", "Font size", "Font size"],
		["fontname", "Font name", "Font name"],
		["formatblock", "Format block", "Format block"]
	],
	[
		["forecolor", "Fore color", "Fore color"],
		["backcolor", "Back color", "Back color"]
	]*/
];

cXULElement_editor.htmlmap	= [
	// control regex, desired regex replacement
	[/<(B|b|STRONG)>(.*?)<\/\1>/gm, "<strong>$2</strong>"],
	[/<(I|i|EM)>(.*?)<\/\1>/gm, "<em>$2</em>"],
	[/<P>(.*?)<\/P>/gm, "<p>$1</p>"],
	[/<A (.*?)<\/A>/gm, "<a $1</a>"],
	[/<LI>(.*?)<\/LI>/gm, "<li>$1</li>"],
	[/<UL>(.*?)<\/UL>/gm, "<ul>$1</ul>"],
	[/<span style="font-weight: normal;">(.*?)<\/span>/gm, "$1"],
	[/<span style="font-weight: bold;">(.*?)<\/span>/gm, "<strong>$1</strong>"],
	[/<span style="font-style: italic;">(.*?)<\/span>/gm, "<em>$1</em>"],
	[/<span style="(font-weight: bold; ?|font-style: italic; ?){2}">(.*?)<\/span>/gm, "<strong><em>$2</em></strong>"],
	[/<([a-z]+) style="font-weight: normal;">(.*?)<\/\1>/gm, "<$1>$2</$1>"],
	[/<([a-z]+) style="font-weight: bold;">(.*?)<\/\1>/gm, "<$1><strong>$2</strong></$1>"],
	[/<([a-z]+) style="font-style: italic;">(.*?)<\/\1>/gm, "<$1><em>$2</em></$1>"],
	[/<([a-z]+) style="(font-weight: bold; ?|font-style: italic; ?){2}">(.*?)<\/\1>/gm, "<$1><strong><em>$3</em></strong></$1>"],
	[/<(br|BR)>/g, "<br />"],
	[/<(hr|HR)( style="width: 100%; height: 2px;")?>/g, "<hr />"]
];

cXULElement_editor.sanityze	= function(sHtml) {
	for (var nIndex = 0; nIndex < cXULElement_editor.htmlmap.length; nIndex++)
		sHtml	= sHtml.replace(cXULElement_editor.htmlmap[nIndex][0], cXULElement_editor.htmlmap[nIndex][1]);

	return sHtml.replace(/<a( target="_blank")?/g, '<a target="_blank"')
				.replace(/\r?\n/g, "")
				.replace(/<br\s*\/>$/, "")
	;
};

cXULElement_editor.initializeDocument	= function(oInstance) {
	var oDOMElement		= oInstance.$getContainer("frame"),
		oDOMDocument	= oDOMElement.contentWindow.document;

	// Create Stylesheet
	var sStyle	= '0<style type="text/css">p{margin:0}html,body{margin:0;padding:0}body{padding-left:2px;height:100%;background-color:transparent}</style>',	// IE needs transparency
		oFactory= oDOMDocument.createElement("div");
	oFactory.innerHTML	= sStyle;
	oDOMDocument.getElementsByTagName("head")[0].appendChild(oFactory.childNodes[1]);
	// Set property
	oInstance.contentDocument	= oDOMDocument;
	// Load document with data
	oDOMDocument.body.innerHTML	= oInstance.firstChild ? oInstance.firstChild.data : '';

	//
	var fOnMouseDown	= function(oEvent) {
		// Re-dispatch event to the element
		if (oInstance.$isAccessible()) {
			try {
				oDOMElement.contentWindow.document.designMode	= "on";
			} catch (e) {
				var f	= arguments.callee
				setTimeout(function(){f(oEvent)}, 0);
				return;
			}

			var oMouseEvent	= oInstance.ownerDocument.createEvent("MouseEvent");
			oMouseEvent.initMouseEvent("mousedown", true, true, window, 1, oEvent.screenX, oEvent.screenY, oEvent.clientX, oEvent.clientY, oEvent.ctrlKey, oEvent.altKey, oEvent.shiftKey, oEvent.metaKey, 0, null);
			oMouseEvent.$pseudoTarget	= oInstance.$getContainer("frame");
			oInstance.dispatchEvent(oMouseEvent);
		}
	};
	function fOnKeyUp(oEvent) {
		if (oEvent.keyCode == 9 && oInstance.ownerDocument.activeElement == oInstance)
			fUpdateState(oEvent);
	};
	function fOnKeyDown(oEvent) {
		// Re-dispatch event to the element
		if (oInstance.$isAccessible() && oEvent.keyCode == 9) {
			var oKeydownEvent	= oInstance.ownerDocument.createEvent("KeyboardEvent");
			oKeydownEvent.initKeyboardEvent("keydown", true, true, window, "U+0009", null, (oEvent.ctrlKey ? "Control" : "") + (oEvent.shiftKey ? "Shift" : "") + (oEvent.altKey ? "Alt" : ""));
			oKeydownEvent.$pseudoTarget	= oInstance.$getContainer("frame");
			oInstance.dispatchEvent(oKeydownEvent);
			if (!window.controllers) {
				if (oEvent.preventDefault)
					oEvent.preventDefault();
				else
					oEvent.returnValue	= false;
			}
		}
		// In Firefox 3.6, CTRL+B|I|U invoke browser shortcuts, so we need to redefine behaviour for content editable area
		if (window.controllers)
			if (oEvent.ctrlKey) {
				switch (oEvent.keyCode) {
					case 66:	// b
						this.execCommand('bold', false, null);
						oEvent.preventDefault();
						break;
					case 73:	// i
						this.execCommand('italic', false, null);
						oEvent.preventDefault();
						break;
					case 85:	// u
						this.execCommand('underline', false, null);
						oEvent.preventDefault();
						break;
				}
			}
	};
	var fUpdateState	= function(oEvent) {
		if (oInstance.$isAccessible())
			cXULElement_editor.updateButtons(oInstance);
	};
	if (oDOMDocument.addEventListener) {
		oDOMDocument.addEventListener("mouseup", fUpdateState, true);
		oDOMDocument.addEventListener("keyup", fOnKeyUp, true);
		oDOMDocument.addEventListener("keydown", fOnKeyDown, false);
		oDOMDocument.addEventListener("mousedown", fOnMouseDown, true);
	}
	else {
		oDOMDocument.attachEvent("onmouseup", fUpdateState);
		oDOMDocument.attachEvent("onkeyup", fOnKeyUp);
		oDOMDocument.attachEvent("onkeydown", fOnKeyDown);
		oDOMDocument.attachEvent("onmousedown", fOnMouseDown);
	}
};

cXULElement_editor.finalizeDocument	= function(oInstance) {
	var oDOMDocument	= oInstance.$getContainer("frame").contentWindow.document;
/*	if (oDOMDocument.removeEventListener) {
		oDOMDocument.removeEventListener("mouseup", fUpdateState, true);
		oDOMDocument.removeEventListener("keyup", fOnKeyUp, true);
		oDOMDocument.removeEventListener("keydown", fOnKeyDown, true);
		oDOMDocument.removeEventListener("mousedown", fOnMouseDown, true);
	}
	else {
		oDOMDocument.detachEvent("onmouseup", fUpdateState);
		oDOMDocument.detachEvent("onkeyup", fOnKeyUp);
		oDOMDocument.detachEvent("onkeydown", fOnKeyDownState);
		oDOMDocument.detachEvent("onmousedown", fOnMouseDown);
	}*/
};

// 'Private' members
cXULElement_editor.prototype._onButtonClick	= function(sCommand) {
	var oWindow	= this.$getContainer('frame').contentWindow,
		vValue	= null;
	// If not enabled, return
	if (!this.$isAccessible())// || !oWindow.document.queryCommandEnabled(sCommand))
		return;
	//
	if (sCommand == "createlink")
		vValue	= prompt("Enter the URL:", "http://");
	oWindow.focus();
	oWindow.document.execCommand(sCommand, false, vValue);
	cXULElement_editor.updateButtons(this);
};

//
cXULElement_editor.fontSizeValueInPixels	= [0, 10, 13, 16, 18, 24, 32, 48];
cXULElement_editor.fontSizeValueInPoints	= [0, 8, 10, 12, 14, 18, 24, 36];
cXULElement_editor.fontSizeValueToFontSizeNumber	= function(sValue) {
	var aFontSize	= sValue.match(/(\d*)(px|pt)?/);
	if (aFontSize[2] == "px")
		return cXULElement_editor.fontSizeValueInPixels.indexOf(Number(aFontSize[1]));
	else
	if (aFontSize[2] == "pt")
		return cXULElement_editor.fontSizeValueInPoints.indexOf(Number(aFontSize[1]));
	return aFontSize[1];
};

cXULElement_editor.updateButtons	= function(oInstance) {
	var oDOMDocument	= oInstance.$getContainer('frame').contentWindow.document,
		oToolBar	= oInstance.$getContainer("toolbar"),
		oButton,
		sCommand,
		sValue,
		oItem;
	// Update commands state
	for (var nGroup = 0; nGroup < cXULElement_editor.commands.length; nGroup++)
		for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++) {
			oButton	= oToolBar.getElementsByTagName("p")[nGroup].getElementsByTagName("button")[nIndex];
			sCommand= cXULElement_editor.commands[nGroup][nIndex][0];
			if (sCommand != "indent" && sCommand != "outdent" && sCommand != "createlink" && sCommand != "unlink" && sCommand != "undo" && sCommand != "redo") {
				// Command executed
				if (oDOMDocument.queryCommandState(sCommand)) {
					if (!oButton.className.match(/ xul-button_active/))
						oButton.className += " xul-button_active";
				}
				else
					oButton.className	= oButton.className.replace(/ xul-button_active/, '');
			}
			// Command enabled
			if (!oDOMDocument.queryCommandEnabled(sCommand)) {
				if (!oButton.className.match(/ xul-button_disabled/))
					oButton.className += " xul-button_disabled";
			}
			else
				oButton.className	= oButton.className.replace(/ xul-button_disabled/, '');
		}
	// Lists
	sValue	= String(oDOMDocument.queryCommandValue("fontname")).replace(/^'|'$/g, '');
	oItem	= oInstance._elementFontName.menupopup.querySelector("[value='" + sValue + "']");
	oInstance._elementFontName.setAttribute("disabled", !oDOMDocument.queryCommandEnabled("fontname"));
	oInstance._elementFontName.menupopup.selectItem(oItem);
	oInstance._elementFontName.setAttribute("value", oItem ? oItem.getAttribute("label") : '');
	sValue	= cXULElement_editor.fontSizeValueToFontSizeNumber(String(oDOMDocument.queryCommandValue("fontsize")));
	oItem	= oInstance._elementFontSize.menupopup.querySelector("[value='" + sValue + "']");
	oInstance._elementFontSize.setAttribute("disabled", !oDOMDocument.queryCommandEnabled("fontsize"));
	oInstance._elementFontSize.menupopup.selectItem(oItem);	// Chrome returns font-size in pixels
	oInstance._elementFontSize.setAttribute("value", oItem ? oItem.getAttribute("label") : '');
	sValue	= String(oDOMDocument.queryCommandValue("formatblock")).toLowerCase();
	oItem	= oInstance._elementFormat.menupopup.querySelector("[value='" + sValue + "']");
	oInstance._elementFormat.setAttribute("disabled", !oDOMDocument.queryCommandEnabled("formatblock"));
	oInstance._elementFormat.menupopup.selectItem(oItem);
	oInstance._elementFormat.setAttribute("value", oItem ? oItem.getAttribute("label") : '');
};

cXULElement_editor.resetButtons	= function(oInstance) {
	var oDOMDocument	= oInstance.$getContainer('frame').contentWindow.document,
		oToolBar	= oInstance.$getContainer("toolbar"),
		oButton,
		sCommand;
	// Update commands state
	for (var nGroup = 0; nGroup < cXULElement_editor.commands.length; nGroup++)
		for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++) {
			oButton	= oToolBar.getElementsByTagName("p")[nGroup].getElementsByTagName("button")[nIndex];
			sCommand= cXULElement_editor.commands[nGroup][nIndex][0];
			oButton.className	= oButton.className.replace(/ xul-button_active/, '');
			if (!oButton.className.match(/ xul-button_disabled/))
				oButton.className += " xul-button_disabled";
		}
	oInstance._elementFontName.setAttribute("disabled", "true");
	oInstance._elementFontSize.setAttribute("disabled", "true");
	oInstance._elementFormat.setAttribute("disabled", "true");
};

// presentation
cXULElement_editor.prototype.$getTagOpen	= function() {
	return '<div class="xul-editor' + (this.getAttribute("disabled") == "true" ? ' xul-editor_disabled' : '') + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '')+ '>\
				<div class="xul-editor--toolbar" style="position:relative" xonmousedown="return false">\
					<div>'+
						(function(){
							var aHtml	= [];
							for (var nGroup = 0; nGroup < 5; nGroup++) {
								aHtml.push('<p class="xul-editor-buttonbar" style="display:inline' + (navigator.userAgent.match(/MSIE ([\d\.]+)/) && RegExp.$1 < 8 ? '' : '-block') + '">');
								for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++)
									aHtml.push('<button class="xul-button ' + cXULElement_editor.commands[nGroup][nIndex][0] + ' xul-button_disabled" \
													title="' + cXULElement_editor.commands[nGroup][nIndex][2] + '"\
													onclick="ample.$instance(this)._onButtonClick(\'' + cXULElement_editor.commands[nGroup][nIndex][0] + '\')"\
													onmouseover="if (ample.$instance(this).$isAccessible()) this.className += \' xul-button_hover\'"\
													onmouseout="if (ample.$instance(this).$isAccessible()) this.className = this.className.replace(/ xul-button_hover/, \'\')"\
													></button>');
								aHtml.push('</p>');
							}
							return aHtml.join('');
						})()+'\
					</div>\
					<div>'+
						(function(){
							var aHtml	= [];
							for (var nGroup = 5; nGroup < cXULElement_editor.commands.length; nGroup++) {
								aHtml.push('<p class="xul-editor-buttonbar" style="display:inline' + (navigator.userAgent.match(/MSIE ([\d\.]+)/) && RegExp.$1 < 8 ? '' : '-block') + '">');
								for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++)
									aHtml.push('<button class="xul-button ' + cXULElement_editor.commands[nGroup][nIndex][0] + ' xul-button_disabled" \
													title="' + cXULElement_editor.commands[nGroup][nIndex][2] + '"\
													onclick="ample.$instance(this)._onButtonClick(\'' + cXULElement_editor.commands[nGroup][nIndex][0] + '\')"\
													onmouseover="if (ample.$instance(this).$isAccessible()) this.className += \' xul-button_hover\'"\
													onmouseout="if (ample.$instance(this).$isAccessible()) this.className = this.className.replace(/ xul-button_hover/, \'\')"\
													></button>');
								aHtml.push('</p>');
							}
							return aHtml.join('');
						})()+'\
						<div class="xul-editor-buttonbar" style="display:inline' + (navigator.userAgent.match(/MSIE ([\d\.]+)/) && RegExp.$1 < 8 ? '' : '-block') + '">' +
							'<a href="javascript:;" style="color:black;text-decoration:none;cursor:default;">' + this._elementFontName.$getTag() + '</a>' +
							'<a href="javascript:;" style="color:black;text-decoration:none;cursor:default;">' + this._elementFontSize.$getTag() + '</a>' +
							'<a href="javascript:;" style="color:black;text-decoration:none;cursor:default;">' + this._elementFormat.$getTag() + '</a>' +'\
						</div>\
					</div>\
				</div>\
				<div class="xul-editor--input" style="position:relative;height:100%;">\
					<iframe class="xul-editor--frame" src="about:blank" frameborder="0" allowtransparency="true" style="width:100%;height:100%"></iframe>\
				</div>\
				<div class="xul-editor--gateway" style="display:none">';
};

cXULElement_editor.prototype.$getTagClose	= function() {
	return		'</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_editor);
