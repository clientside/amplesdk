/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listbody	= function(){};
cXULElement_listbody.prototype   = new cXULElement;

// Public Methdos

// Events Handlers
cXULElement_listbody.prototype._onScroll = function()
{
    if (this.parentNode.head)
        this.parentNode.head.$getContainer("area").scrollLeft  = this.$getContainer("area").scrollLeft;
};

// Class events handlers
cXULElement_listbody.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.body = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.body = null;
	}
};

// Element Render: open
cXULElement_listbody.prototype.$getTagOpen	= function()
{
	return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
				<td style="height:100%">\
					<div class="xul-listbody--area" style="height:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this)._onScroll(event)">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-listbody" style="position:absolute;' + (navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 == 7 ? 'border-left: solid 18px white;margin-left:-18px;' : '') + '">\
							<tbody class="xul-listbody--gateway">';
};

// Element Render: close
cXULElement_listbody.prototype.$getTagClose	= function()
{
    var sHtml   = '</tbody>';
    if (this.parentNode.firstChild instanceof cXULElement_listhead)
    {
        sHtml  += '<tfoot class="xul-listbody--foot">';
        sHtml  += '<tr>';
        if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
            sHtml  += '<td width="20"><div style="width:20px;"/></td>';
        for (var nIndex = 0, aItems = this.parentNode.firstChild.childNodes; nIndex < aItems.length; nIndex++)
            sHtml  += '<td' + (aItems[nIndex].attributes["width"] ? ' width="' + aItems[nIndex].attributes["width"] + '"' : '') + '><div style="height:1px;' + (aItems[nIndex].attributes["minwidth"] ? 'width:' + aItems[nIndex].attributes["minwidth"] + 'px' : '') + '"/></td>';
        sHtml  += '</tr>';
        sHtml  += '</tfoot>';
    }
    sHtml  += '</table>';
    sHtml  += '</div>';
    sHtml  += '</td>';
    sHtml  += '</tr>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("listbody", cXULElement_listbody);
