/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_window	= function(){};
cXULElement_window.prototype	= new cXULWindowElement;
cXULElement_window.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_window.attributes	= {};
cXULElement_window.attributes.orient	= "vertical";
cXULElement_window.attributes.width		= "100%";
cXULElement_window.attributes.height	= "100%";

// Class Events Handlers
cXULElement_window.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			switch (oEvent.attrName) {
				default:
					this.$mapAttribute(oEvent.attrName, oEvent.newValue);
			}
		}
	},
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
//		this.$getContainer("body").style.visibility	= "hidden";
//		this.$getContainer("foot").style.visibility	= "hidden";
	}/*,
	"dragend":		function(oEvent) {
//		this.$getContainer("body").style.visibility	= "";
//		this.$getContainer("foot").style.visibility	= "";
	}*/
};
//cXULElement_window.handlers.resizestart	= cXULElement_handlers.dragstart;
//cXULElement_window.handlers.resizedragend	= cXULElement_handlers.dragend;

// Element Renders
cXULElement_window.prototype.$getTagOpen	= function() {
	return '<div class="xul-window'+(this.attributes["class"] ? " " + this.attributes["class"] : "") + '" style="' +
				(this.attributes["width"] ? 'width:' + this.attributes["width"] + 'px;' : '') +
				(this.attributes["height"] ? 'height:' + this.attributes["height"] + 'px;' : '') +
				(this.attributes["hidden"] == "true" ? 'display:none;' : '') +
				(this.attributes["style"] ? this.attributes["style"] : '') + '">\
				<div class="xul-window--head" ' +(this.attributes["hidechrome"] == "true" ? ' style="display:none"': '')+ '>\
					<table cellpadding="0" cellspacing="0" border="0" width="100%" height="20">\
						<tbody>\
							<tr>\
								<td class="xul-window--title">' +(this.attributes["title"] || " ")+ '</td>\
								<td width="1"><div class="xul-window--button-close xul-window--button-close_normal" onclick="ample.$instance(this).setAttribute(\'hidden\', \'true\')" onmouseover="this.className=this.className.replace(\'normal\', \'hover\')" onmouseout="this.className=this.className.replace(/hover|active/, \'normal\')" onmousedown="this.className=this.className.replace(\'hover\', \'active\')" onmouseup="this.className=this.className.replace(\'active\', \'normal\')"><br /></div></td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
				<div class="xul-window--body" style="height:100%">\
					<div class=" xul-window--gateway" style="height:100%">';
};

// Element Render: close
cXULElement_window.prototype.$getTagClose	= function() {
	return '		</div>\
				</div>\
			</div>';
};

// Register Element with language
oXULNamespace.setElement("window", cXULElement_window);
