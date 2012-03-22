/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_toolbarbutton	= function(){};
cXULElement_toolbarbutton.prototype  = new cXULElement("toolbarbutton");

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
			if (this.getAttribute("type") == "menu-button") {
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
		    if (this.getAttribute("type") == "menu") {
		    	if (this.getAttribute("open") != "true")
	            	this.setAttribute("open", "true");
	            else
	            	return;
		    }

			//
		   	this.$setPseudoClass("active", true);
		}
	},
	"click":	function(oEvent) {
		if (oEvent.target == this && oEvent.button == 0)
			if (this.getAttribute("type") != "menu" && this.getAttribute("type") != "menu-button")
				this.$activate();
	},
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "open":
					var oElement	= this.getElementsByTagNameNS(this.namespaceURI, "menupopup")[0];
					if (oElement) {
						if (oEvent.newValue == "true") {
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
					break;

				case "disabled":
					this.$setPseudoClass("disabled", oEvent.newValue == "true");
					break;

				case "type":
					// TODO
					break;

				case "label":
					this.$getContainer("label").innerHTML  =(this.attributes["image"] ? '<img src="' + this.attributes["image"] + '" align="absmiddle" />' : '') + ' ' + (oEvent.newValue || '');
					break;

				case "image":
			        this.$getContainer("label").innerHTML  =(oEvent.newValue ? '<img src="' + oEvent.newValue + '" align="absmiddle" />' : '') + ' ' + (this.attributes["label"] || '');
			        break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMActivate":	function(oEvent) {
		if (oEvent.target == this)
			this.doCommand();
	}
};

// Element Render: open
cXULElement_toolbarbutton.prototype.$getTagOpen	= function() {
	var sType	= this.getAttribute("type");
    return '<table cellpadding="0" cellspacing="0" border="0" class="xul-toolbarbutton' + (!this.$isAccessible() ? " xul-toolbarbutton_disabled" : "") + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
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
					(this.getAttribute("image")
						? '<img src="' + this.getAttribute("image") + '" align="absmiddle"/>'
						: '')+
					(this.getAttribute("label")
						? ' ' + this.getAttribute("label")
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
