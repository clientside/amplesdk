/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_groupbox	= function(){};
cXULElement_groupbox.prototype	= new cXULElement("groupbox");
cXULElement_groupbox.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Attributes Defaults
cXULElement_groupbox.attributes	= {};
cXULElement_groupbox.attributes.orient	= "vertical";

// Public Methods

// Element Render: open
cXULElement_groupbox.prototype.$getTagOpen		= function() {
	var sWidth	= this.getAttribute("width"),
		sHeight	= this.getAttribute("height");
	return '<div class="xul-groupbox' +(this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="' +
			(sWidth ? 'width:' + (isNaN(parseInt(sWidth, 10)) ? sWidth : sWidth + 'px;') : '')+
			(sHeight ? 'height:' + (isNaN(parseInt(sHeight, 10)) ? sHeight : sHeight + 'px;') : '')+
				'">\
				<table cellpadding="0" cellspacing="0" border="0" width="100%" height="100%">\
					<thead>\
						<tr>\
							<td class="xul-groupbox-head-left"></td>\
							<td class="xul-groupbox-head"><span class="xul-groupbox--caption xul-caption" style="display:none;"></span></td>\
							<td class="xul-groupbox-head-right"></td>\
						</tr>\
					</thead>\
					<tbody>\
						<tr>\
							<td class="xul-groupbox-body-left"></td>\
							<td height="100%" class="xul-groupbox-body">';
};

// Element Render: close
cXULElement_groupbox.prototype.$getTagClose	= function() {
	return 					'</td>\
							<td class="xul-groupbox-body-right"></td>\
						</tr>\
					</tbody>\
					<tfoot>\
						<tr>\
							<td class="xul-groupbox-foot-left"></td>\
							<td class="xul-groupbox-foot"></td>\
							<td class="xul-groupbox-foot-right"></td>\
						</tr>\
					</tfoot>\
				</table>\
			</div>';
};

// Register Element
ample.extend(cXULElement_groupbox);
