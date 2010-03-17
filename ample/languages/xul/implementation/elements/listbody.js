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
	var bOldTrident	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 8;
	return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
				<td style="height:100%">\
					<div class="xul-listbody--area" style="height:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this)._onScroll(event)">'+
						(bOldTrident ? '<div style="position:absolute;border-left: solid 18px white;margin-left:-18px;">' : '')+'\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" class="xul-listbody"' + (!bOldTrident ? ' style="position:absolute"' : '')+ '>\
							<tbody class="xul-listbody--gateway">';
};

// Element Render: close
cXULElement_listbody.prototype.$getTagClose	= function()
{
	var bOldTrident	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 8;
    var aHtml   = ['</tbody>'];
    if (this.parentNode.firstChild instanceof cXULElement_listhead)
    {
    	aHtml.push('<tfoot class="xul-listbody--foot">');
    	aHtml.push('<tr>');
        if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
        	aHtml.push('<td width="20"><div style="width:20px;"/></td>');
        for (var nIndex = 0, aItems = this.parentNode.firstChild.childNodes; nIndex < aItems.length; nIndex++)
        	aHtml.push('<td' + (aItems[nIndex].attributes["width"] ? ' width="' + aItems[nIndex].attributes["width"] + '"' : '') + '><div style="height:1px;' + (aItems[nIndex].attributes["minwidth"] ? 'width:' + aItems[nIndex].attributes["minwidth"] + 'px' : '') + '"/></td>');
        	aHtml.push('</tr>');
        	aHtml.push('</tfoot>');
    }
    aHtml.push('</table>');
    if (bOldTrident)
    	aHtml.push('</div>');
    aHtml.push('</div>');
    aHtml.push('</td>');
    aHtml.push('</tr>');

    return aHtml.join('');
};

// Register Element with language
oXULNamespace.setElement("listbody", cXULElement_listbody);
