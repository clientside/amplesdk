/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_window	= function(){};
cXULElement_window.prototype	= new cXULWindowElement("window");
cXULElement_window.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_window.attributes	= {};
cXULElement_window.attributes.orient	= "vertical";
cXULElement_window.attributes.flex		= "1";
cXULElement_window.attributes.width		= "400";
cXULElement_window.attributes.height	= "300";

// Class Events Handlers
cXULElement_window.handlers	= {
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
	}
};

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
								<td class="xul-window--title">' +(this.attributes["title"] ? ample.$encodeXMLCharacters(this.attributes["title"]) : " ")+ '</td>\
								<td width="1"><div class="xul-window--button-close xul-window--button-close_normal" onclick="ample.$instance(this).hide()" onmouseover="this.className=this.className.replace(\'normal\', \'hover\')" onmouseout="this.className=this.className.replace(/hover|active/, \'normal\')" onmousedown="this.className=this.className.replace(\'hover\', \'active\')" onmouseup="this.className=this.className.replace(\'active\', \'normal\')"><br /></div></td>\
							</tr>\
						</tbody>\
					</table>\
				</div>\
				<div class="xul-window--body" style="height:100%">';
};

// Element Render: close
cXULElement_window.prototype.$getTagClose	= function() {
	return '	</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_window);
