/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_dialog	= function(){
	this.buttons	= {};
};
cXULElement_dialog.prototype	= new cXULWindowElement;
cXULElement_dialog.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_dialog.attributes	= {};
cXULElement_dialog.attributes.orient	= "vertical";
cXULElement_dialog.attributes.buttons	= "accept" + "," + "cancel";
cXULElement_dialog.attributes.width		= "100%";
cXULElement_dialog.attributes.height	= "100%";

// Public Methods
cXULElement_dialog.prototype.acceptDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogaccept", false, true);
    if (this.dispatchEvent(oEvent2))
        this.setAttribute("hidden", "true");
};

cXULElement_dialog.prototype.cancelDialog    = function()
{
    var oEvent2  = this.ownerDocument.createEvent("Events");
    oEvent2.initEvent("dialogcancel", false, true);
    if (this.dispatchEvent(oEvent2))
        this.setAttribute("hidden", "true");
};

cXULElement_dialog.prototype.centerWindowOnScreen    = function()
{
	var oElementDOM	= this.$getContainer(),
    	oPosition	= this.getBoundingClientRect();
	oElementDOM.style.left	=(document.body.clientWidth - oPosition.right + oPosition.left) / 2;
	oElementDOM.style.top	=(document.body.clientHeight - oPosition.bottom + oPosition.top) / 2;
};

// Class Events Handlers
cXULElement_dialog.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				case "title":
					this.$getContainer("title").innerHTML = oEvent.newValue || '';
					break;

				case "buttons":
					this.buttons["help"].setAttribute("hidden", !sValue || sValue.indexOf("help")    ==-1 ? "true" : "false");
					this.buttons["cancel"].setAttribute("hidden", !sValue || sValue.indexOf("cancel")  ==-1 ? "true" : "false");
					this.buttons["accept"].setAttribute("hidden", !sValue || sValue.indexOf("accept")  ==-1 ? "true" : "false");
					break;

				case "buttonalign":
			        if (oEvent.newValue == "start")
			            this.$getContainer("foot").align  = "left";
			        else
			        if (oEvent.newValue == "center")
			            this.$getContainer("foot").align  = "center";
			        else
			            this.$getContainer("foot").align  = "right";
			        break;

				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target == this) {
			var oElement,
				that	= this;
			// Accept
			oElement	= this.$appendChildAnonymous(this.ownerDocument.createElementNS(this.namespaceURI, "xul:button"));
			oElement.addEventListener("DOMActivate", function(oEvent) {
				that.acceptDialog();
			}, false);
			oElement.setAttribute("label", "OK");
			oElement.setAttribute("class", "accept");
			if (this.attributes["buttons"].indexOf("accept") ==-1)
				oElement.setAttribute("hidden", "true");
			this.buttons["accept"]	= oElement;
			// Cancel
			oElement	= this.$appendChildAnonymous(this.ownerDocument.createElementNS(this.namespaceURI, "xul:button"));
			oElement.addEventListener("DOMActivate", function(oEvent) {
				that.cancelDialog();
			}, false);
			oElement.setAttribute("label", "Cancel");
			oElement.setAttribute("class", "cancel");
			if (this.attributes["buttons"].indexOf("cancel") ==-1)
				oElement.setAttribute("hidden", "true");
			this.buttons["cancel"]	= oElement;
			// Help
			oElement	= this.$appendChildAnonymous(this.ownerDocument.createElementNS(this.namespaceURI, "xul:button"));
			oElement.addEventListener("DOMActivate", function(oEvent) {
		        var oEvent2    = that.ownerDocument.createEvent("Events");
		        oEvent2.initEvent("dialoghelp", false, true);
		        that.dispatchEvent(oEvent2);
			}, false);
			oElement.setAttribute("label", "Help");
			oElement.setAttribute("class", "help");
			if (this.attributes["buttons"].indexOf("help") ==-1)
				oElement.setAttribute("hidden", "true");
			this.buttons["help"]	= oElement;
		}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target == this) {
			this.$removeChildAnonymous(this.buttons["accept"]);
			this.buttons["accept"]	= null;
			this.$removeChildAnonymous(this.buttons["cancel"]);
			this.buttons["cancel"]	= null;
			this.$removeChildAnonymous(this.buttons["help"]);
			this.buttons["help"]	= null;
		}
	},
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
/*
		this.$getContainer("body").style.visibility	= "hidden";
		this.$getContainer("foot").style.visibility	= "hidden";*/
	}/*,
	"dragend":		function(oEvent) {
		this.$getContainer("body").style.visibility	= "";
		this.$getContainer("foot").style.visibility	= "";
	}*/
};
//cXULElement_dialog.handlers.resizestart	= cXULElement_dialog.handlers.dragstart;
//cXULElement_dialog.handlers.resizedragend	= cXULElement_dialog.handlers.dragend;

// Element Renders
cXULElement_dialog.prototype.$getTagOpen	= function()
{
	return '<div class="xul-dialog'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + 'px;' : '') +
				(this.attributes["height"] ? 'height:' + (this.attributes["height"] - 40) + 'px;' : '') +
				(this.attributes["hidden"] == "true" ? 'display:none;' : '') +
				(this.attributes["style"] ? this.attributes["style"] : '') + '">\
				<div class="xul-dialog--head" ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<table cellpadding="0" cellspacing="0" border="0" width="100%">\
						<tbody>\
							<tr>\
								<td class="xul-dialog--title">' +(this.attributes["title"] || " ")+ '</td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
				<div class="xul-dialogheader xul-dialog--header" style="display:none"><div class="xul-dialogheader--title xul-dialog--label"></div><div class="xul-dialogheader--description xul-dialog--description"></div></div>\
				<div class="xul-dialog--body xul-dialog--gateway">';
};

// Element Render: close
cXULElement_dialog.prototype.$getTagClose	= function()
{
	return '	</div>\
				<div class="xul-dialog--foot">\
					<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%" align="' +(this.attributes["buttonalign"] == "start" ? "left" : this.attributes["buttonalign"] == "center" ? "center" : "right")+ '">\
						<tbody>\
							<tr>\
								<td width="100%">' + this.buttons['help'].$getTag() + '</td>\
								<td>' + this.buttons['accept'].$getTag() + '</td>\
								<td>' + this.buttons['cancel'].$getTag() + '</td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
			</div>';
};

// Register Element with language
oXULNamespace.setElement("dialog", cXULElement_dialog);
