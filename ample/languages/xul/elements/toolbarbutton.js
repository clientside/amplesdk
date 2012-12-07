/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbarbutton	= function(){};
cXULElement_toolbarbutton.prototype	= new cXULElement("toolbarbutton");

cXULElement_toolbarbutton.prototype.$hoverable	= true;

// Class Events Handlers
cXULElement_toolbarbutton.handlers	= {
	"mouseout":		function(oEvent) {
		if (this.getAttribute("open") != "true")
			this.$setPseudoClass("active", false);
	},
	"mouseup":		function(oEvent) {
		if (this.getAttribute("open") != "true")
			this.$setPseudoClass("active", false);
	},
	"mousedown":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		if (oEvent.button == 0) {
			var sType	= this.getAttribute("type");
			if (sType == "menu-button") {
				// If click happend on "arrow" button
				if (oEvent.$pseudoTarget == this.$getContainer("arrow")) {
					if (this.getAttribute("open") == "true")
						this.setAttribute("open", "false");
					else {
						this.setAttribute("open", "true");
						this.$setPseudoClass("active", true);
					}
				}
				else
				if (this.getAttribute("open") == "true")
					return;
			}
			else
			if (sType == "menu") {
				if (this.getAttribute("open") != "true")
					this.setAttribute("open", "true");
				else
					return;
			}
			else
			if (sType == "checkbox") {
				if (this.getAttribute("checked") == "true")
					this.setAttribute("checked", "false");
				else
					this.setAttribute("checked", "true");
			}
			else
			if (sType == "radio") {
				if (this.getAttribute("checked") != "true") {
					var sGroup	= this.getAttribute("group").match(/^\w+$/),
						sNamespaceURI	= this.namespaceURI;
					if (sGroup) {
						// Uncheck previous items
						var aGroup	= this.ownerDocument.querySelectorAll("xul|toolbarbutton[group=" + sGroup[0] + "][checked=true]", function() {return sNamespaceURI;});
						for (var nIndex = 0; nIndex < aGroup.length; nIndex++)
							aGroup[nIndex].setAttribute("checked", "false");
						// Check this item
						this.setAttribute("checked", "true");
					}
				}
			}

			//
			this.$setPseudoClass("active", true);
		}
	},
	"click":	function(oEvent) {
		var sType	= this.getAttribute("type");
		if (oEvent.target == this && oEvent.button == 0) {
			if (sType == "menu-button") {
				if (oEvent.$pseudoTarget != this.$getContainer("arrow"))
					this.$activate();
			}
			else
			if (sType != "menu")
				this.$activate();
		}
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target == this)
			this.doCommand();
	}
};

cXULElement_toolbarbutton.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "open") {
		var oElement	= this.getElementsByTagNameNS(this.namespaceURI, "menupopup")[0];
		if (oElement) {
			if (sValue == "true") {
				var that	= this;
				oElement.showPopup(this, -1, -1, cXULPopupElement.POPUP_TYPE_POPUP);
				oElement.addEventListener("popuphidden", function(oEvent) {
					oElement.removeEventListener("popuphidden", arguments.callee, false);
					//
					that.$setPseudoClass("active", false);
					that.setAttribute("open", "false");
				}, false);
				//
				this.ownerDocument.popupNode	= oElement;
			}
			else {
				oElement.hidePopup();
				//
				this.ownerDocument.popupNode	= null;
			}
		}
	}
	else
	if (sName == "disabled")
		this.$setPseudoClass("disabled", sValue == "true");
	else
	if (sName == "type") {
		// TODO
	}
	else
	if (sName == "checked") {
		var sType	= this.getAttribute("type");
		if (sType == "checkbox" || sType == "radio")
			this.$setPseudoClass("checked", sValue == "true");
	}
	else
	if (sName == "label")
		this.$getContainer("label").innerHTML	=(this.hasAttribute("image") ? '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" align="absmiddle" />' : '') + ' ' + ample.$encodeXMLCharacters(sValue || '');
	else
	if (sName == "image")
		this.$getContainer("label").innerHTML	=(sValue ? '<img src="' + ample.$encodeXMLCharacters(sValue) + '" align="absmiddle" />' : '') + ' ' + ample.$encodeXMLCharacters(this.getAttribute("label") || '');
	else
		cXULElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Element Render: open
cXULElement_toolbarbutton.prototype.$getTagOpen	= function() {
	var sType	= this.getAttribute("type");
	return '<table cellpadding="0" cellspacing="0" border="0" class="xul-toolbarbutton' +
				(!this.$isAccessible() ? " xul-toolbarbutton_disabled" : "") +
				((sType == "radio" || sType == "checkbox") && this.getAttribute("checked") == "true" ? " xul-toolbarbutton_checked" : "") +
				(this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '">\
				<tbody>\
					<tr height="3">\
						<td width="3" rowspan="3" class="xul-toolbarbutton-left"><div style="width:3px"/></td>\
						<td class="xul-toolbarbutton-top"></td>'+
					(sType == "menu-button"
						? '<td width="3" rowspan="3" class="xul-toolbarbutton-right"></td>'
								: '')+
					(sType == "menu" || sType == "menu-button"
						? '<td class="xul-toolbarbutton-top"></td>'
								: '')+ '\
						<td width="3" rowspan="3" class="xul-toolbarbutton-right"><div style="width:3px"/></td>\
					</tr>\
					<tr>\
						<td nowrap="nowrap">\
							<div class="xul-toolbarbutton--label">' +
					(this.hasAttribute("image")
						? '<img src="' + ample.$encodeXMLCharacters(this.getAttribute("image")) + '" align="absmiddle"/>'
						: '')+
					(this.hasAttribute("label")
						? ' ' + ample.$encodeXMLCharacters(this.getAttribute("label"))
						: '')+ '\
							</div>\
							<div class="xul-toolbarbutton--gateway">';

	return sHtml;
};

// Element Render: close
cXULElement_toolbarbutton.prototype.$getTagClose	= function() {
	var sType	= this.getAttribute("type");
	return '				</div>\
						</td>'+
					(sType == "menu" || sType == "menu-button"
						? '<td class="xul-toolbarbutton-arrow"><div class="xul-toolbarbutton--arrow"><br /></div></td>'
						: '') + '\
					</tr>\
					<tr height="3">\
						<td class="xul-toolbarbutton-bottom"></td>'+
					(sType == "menu" || sType == "menu-button"
						? '<td class="xul-toolbarbutton-bottom"></td>'
						: '')+ '\
					</tr>\
				</tbody>\
			</table>';
};

// Register Element
ample.extend(cXULElement_toolbarbutton);
