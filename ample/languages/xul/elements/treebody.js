/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_treebody	= function(){};
cXULElement_treebody.prototype	= new cXULElement("treebody");

// Public Properties
cXULElement_treebody.prototype.children	= null;

// Public Methods

// Events Handlers
cXULElement_treebody.prototype._onScroll	= function() {
	if (this.parentNode.head)
		this.parentNode.head.$getContainer("area").scrollLeft	= this.$getContainer("area").scrollLeft;
};

// Class events handlers
cXULElement_treebody.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= this.parentNode;

				// In both cases
				this.children	= oEvent.target;
			}
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treechildren) {
				oEvent.target.tree	= null;

				// In both cases
				this.children	= null;
			}
	}
};

// Element Render: open
cXULElement_treebody.prototype.$getTagOpen	= function() {
	var bOldTrident	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 8;
	return '<tr' +(this.attributes["hidden"] == "true" ? ' style="display:hidden;"' : '')+ '>\
				<td style="height:100%">\
					<div class="xul-treebody--area" style="height:100%;width:100%;overflow:scroll;position:relative;" onscroll="return ample.$instance(this)._onScroll(event)">\
						' + (bOldTrident ? '<div style="position:absolute;border-left:solid 18px white;margin-left:-18px;">' : '')+'\
						<table cellpadding="0" cellspacing="0" border="0" class="xul-treebody' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"' + (!bOldTrident ? ' style="position:absolute"' : '')+ '>\
							<tbody class="xul-treebody--gateway">';
};

// Element Render: close
cXULElement_treebody.prototype.$getTagClose	= function() {
	var bOldTrident	= navigator.userAgent.match(/MSIE ([\d.]+)/) && RegExp.$1 < 8;
	var aHtml	= ['</tbody>'];
	if (this.parentNode.head) {
		aHtml.push('<tfoot class="xul-treebody--foot">');
		aHtml.push('<tr>');
		if (this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio")
			aHtml.push('<td width="20"><div style="width:20px"></div></td>');
		for (var nIndex = 0, aItems = this.parentNode.head.items, oItem; oItem = aItems[nIndex]; nIndex++)
			aHtml.push('<td style="padding-top:0px;padding-bottom:0px;height:1px;' + (oItem.attributes["hidden"] == "true" ? 'display:none' : '') + '" class="xul-treecell"><div style="height:1px;' + (oItem.attributes["width"] ? 'width:' + oItem.attributes["width"] + 'px;' : '') + '"></div><div style="height:1px;' + (oItem.attributes["minwidth"] ? 'width:' + oItem.attributes["minwidth"] + 'px' : '') + '"></div></td>');
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

// Register Element
ample.extend(cXULElement_treebody);
