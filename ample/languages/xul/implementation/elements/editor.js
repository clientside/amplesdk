/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_editor	= function(){};
cXULElement_editor.prototype = new cXULElement;
cXULElement_editor.prototype.tabIndex	= 0;

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
			var oEvent	= this.ownerDocument.createEvent("UIEvent");
			oEvent.initEvent("change", true, false, window, null);
			this.dispatchEvent(oEvent);
		}
		//
		cXULElement_editor.resetButtons(this);
	},
	"DOMAttrModified" : function (event) {
		if (event.target == this)
			switch (event.attrName) {
				case "disabled":
					this.$setPseudoClass("disabled", event.newValue == "true");
					this.$getContainer("frame").contentWindow.document.designMode	= event.newValue == "true" ? "off" : "on";
					//
					cXULElement_editor.resetButtons(this);
					// IE needs re-initialization
					if (navigator.userAgent.match(/MSIE ([\d\.]+)/)) {
						var that	= this;
						cXULElement_editor.finalizeDocument(that);
						setTimeout(function() {
							cXULElement_editor.initializeDocument(that);
						});
					}
					break;
			}
	},
	"DOMCharacterDataModified":	function() {
		if (this.firstChild.data != this.contentDocument.body.innerHTML)
			this.contentDocument.body.innerHTML	= this.firstChild.data;
	},
	"DOMNodeInsertedIntoDocument":	function() {
		var oDOMElement	= this.$getContainer("frame"),
			bGecko	= navigator.userAgent.match(/Gecko\/([\d\.]+)/),
			that	= this;
		if (!bGecko && that.$isAccessible())
			oDOMElement.contentWindow.document.designMode	= "on";
		setTimeout(function(){
			if (bGecko && that.$isAccessible())
				oDOMElement.contentWindow.document.designMode	= "on";
			setTimeout(function(){
				cXULElement_editor.initializeDocument(that);
			});
		});
	},
	"DOMNodeRemovedFromDocument":	function() {
		cXULElement_editor.finalizeDocument(this);
	}
};

// Static members
cXULElement_editor.commands	= [
	// command, display name, title
	[
	 	["undo", "Undo", "Undo last editing operation"],
	 	["redo", "Redo", "Redo last editing operation"]
	],
	[
		["bold", "Bold", "Give text strength"],
		["italic", "Emphasis", "Give text emphasis"],
		["underline", "Underline", "Give text an underline"],
		["strikethrough", "Strikethrough", "Give text strikethrough"]
	],
	[
		["subscript", "Subscript", "Give text subscript"],
		["superscript", "Superscript", "Give text superscript"]
	],
	[
		["insertunorderedlist", "Unordered", "Make an unordered list"],
		["insertorderedlist", "Ordered", "Make an ordered list"]
	],
	[
		["justifyleft", "Left", "Align block to left"],
		["justifycenter", "Center", "Align block to center"],
		["justifyright", "Right", "Align block to right"],
		["justifyfull", "None", "Default alignment"]
	],
	[
	 	["outdent", "Outdent", "Outdent the block where the caret is located"],
	 	["indent", "Indent", "Indent the block where the caret is located"]
	],
	[
	 	["createlink", "Link", "Create a hyperlink"],
	 	["unlink", "Unlink", "Remove hyperlink"]
	]/*,	// TODO
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
		sHtml = sHtml.replace(cXULElement_editor.htmlmap[nIndex][0], cXULElement_editor.htmlmap[nIndex][1]);

	return sHtml;
};

cXULElement_editor.initializeDocument	= function(oInstance) {
	var oDOMElement		= oInstance.$getContainer("frame"),
		oDOMDocument	= oDOMElement.contentWindow.document;

	// Create Stylesheet
	var sStyle	= '0<style type="text/css">p{margin:0}body{background-color:transparent}</style>';	// IE needs transparency
		oFactory= oDOMDocument.createElement("div");
	oFactory.innerHTML	= sStyle;
	oDOMDocument.getElementsByTagName("head")[0].appendChild(oFactory.childNodes[1]);
	// Set property
	oInstance.contentDocument	= oDOMDocument;
	// Load document with data
	oDOMDocument.body.innerHTML	= oInstance.firstChild ? oInstance.firstChild.data : '';

	//
	var fOnMouseDown	= function(oEvent) {
		if (oInstance.$isAccessible())
			oInstance.focus();
	};
	var fUpdateState = function(oEvent) {
		if (oInstance.$isAccessible())
			cXULElement_editor.updateButtons(oInstance);
	};
	if (oDOMDocument.addEventListener) {
		oDOMDocument.addEventListener("click", fUpdateState, true);
		oDOMDocument.addEventListener("keyup", fUpdateState, true);
		oDOMDocument.addEventListener("mousedown", fOnMouseDown, true);
	}
	else {
		oDOMDocument.onclick	= fUpdateState;
		oDOMDocument.onkeyup	= fUpdateState;
		oDOMDocument.onmousedown= fOnMouseDown;
	}
	// In Firefox 3.6, CTRL+B|I|U invoke browser shortcuts, so we need to redefine behaviour for content editable area
	if (window.controllers)
		oDOMDocument.addEventListener("keydown", function(oEvent) {
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
		}, false);
};

cXULElement_editor.finalizeDocument	= function(oInstance) {
	var oDOMDocument	= oInstance.$getContainer("frame").contentWindow.document;
	oDOMDocument.onkeyup	= null;
	oDOMDocument.onclick	= null;
	oDOMDocument.onmousedown= null;
};

// 'Private members'
cXULElement_editor.prototype._onButtonClick	= function(sCommand) {
	var oWindow	= this.$getContainer('frame').contentWindow,
		vValue	= null;
	// If not enabled, return
	if (!this.$isAccessible() || !oWindow.document.queryCommandEnabled(sCommand))
		return;
	//
	if (sCommand == "createlink")
		vValue	= prompt("Enter the URL:", "http://");
	oWindow.document.execCommand(sCommand, false, vValue);
	oWindow.focus();
	cXULElement_editor.updateButtons(this);
};

cXULElement_editor.updateButtons	= function(oInstance) {
	var oDOMDocument	= oInstance.$getContainer('frame').contentWindow.document,
		oToolBar	= oInstance.$getContainer("toolbar"),
		oButton,
		sCommand;
	// Update commands state
	for (var nGroup = 0; nGroup < cXULElement_editor.commands.length; nGroup++)
		for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++) {
			oButton	= oToolBar.getElementsByTagName("div")[nGroup].getElementsByTagName("button")[nIndex];
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
};

cXULElement_editor.resetButtons	= function(oInstance) {
	var oDOMDocument	= oInstance.$getContainer('frame').contentWindow.document,
		oToolBar	= oInstance.$getContainer("toolbar"),
		oButton,
		sCommand;
	// Update commands state
	for (var nGroup = 0; nGroup < cXULElement_editor.commands.length; nGroup++)
		for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++) {
			oButton	= oToolBar.getElementsByTagName("div")[nGroup].getElementsByTagName("button")[nIndex];
			sCommand= cXULElement_editor.commands[nGroup][nIndex][0];
			oButton.className	= oButton.className.replace(/ xul-button_active/, '');
			if (!oButton.className.match(/ xul-button_disabled/))
				oButton.className += " xul-button_disabled";
		}
};

// presentation
cXULElement_editor.prototype.$getTagOpen	= function() {
	return '<div class="xul-editor' + (this.getAttribute("disabled") == "true" ? ' xul-editor_disabled' : '') + (this.hasAttribute("class") ? ' ' + this.getAttribute("class") : '')+ '"' + (this.hasAttribute("style") ? ' style="' + this.getAttribute("style") + '"' : '') + '><div style="display:none"></div>\
				<div class="xul-editor--toolbar">'+
					(function(){
						var aHtml	= [];
						for (var nGroup = 0; nGroup < cXULElement_editor.commands.length; nGroup++) {
							aHtml.push('<div class="xul-editor-buttonbar" style="display:inline' + (navigator.userAgent.match(/MSIE ([\d\.]+)/) && RegExp.$1 < 8 ? '' : '-block') + '">');
							for (var nIndex = 0; nIndex < cXULElement_editor.commands[nGroup].length; nIndex++)
								aHtml.push('<button class="xul-button ' + cXULElement_editor.commands[nGroup][nIndex][0] + ' xul-button_disabled" \
												title="' + cXULElement_editor.commands[nGroup][nIndex][2] + '"\
												onclick="ample.$instance(this)._onButtonClick(\'' + cXULElement_editor.commands[nGroup][nIndex][0] + '\')"\
												onmouseover="if (ample.$instance(this).$isAccessible()) this.className += \' xul-button_hover\'"\
												onmouseout="if (ample.$instance(this).$isAccessible()) this.className = this.className.replace(/ xul-button_hover/, \'\')"\
												></button>');
							aHtml.push('</div>');
						}
						return aHtml.join('');
					})()+'\
				</div>\
				<div class="xul-editor--input" style="height:100%;">\
					<iframe class="xul-editor--frame" src="about:blank" frameborder="0" allowtransparency="true" style="width:100%;height:100%;">';
};

cXULElement_editor.prototype.$getTagClose	= function() {
	return '		</iframe>\
				</div>\
			</div>';
};

// Register Element with language
oXULNamespace.setElement("editor", cXULElement_editor);
