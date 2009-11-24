/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_treecols	= function()
{
    // Collections
    this.items  = new AMLNodeList;
};
cXULElement_treecols.prototype   = new cXULElement;

// Public Methods

// Private Methods
cXULElement_treecols.prototype._getPrimaryColIndex   = function()
{
    for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        if (this.items[nIndex].attributes["primary"] == "true")
            return nIndex;
    return -1;
};

// Events Handlers
cXULElement_treecols.prototype._onCommandClick   = function(oEvent)
{
    if (this.parentNode.attributes["type"] == "checkbox")
    {
        if (this.$getContainer("command").checked)
            this.parentNode.selectAll();
        else
            this.parentNode.clearSelection();
    }
    else
    if (this.parentNode.attributes["type"] == "radio")
    {
        if (this.$getContainer("command").checked)
            this.parentNode.clearSelection();
    }
};

// Class events handlers
cXULElement_treecols.handlers	= {
	"click":	function(oEvent) {
		if (oEvent.button == 2 || (oEvent.button == 0 && oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("settings"))) {
			var oPopup	= cXULSelectElement.getSettingsPopup(this);
			oPopup.showPopup(this, 0, 0, cXULPopupElement.POPUP_TYPE_POPUP);

			if (oEvent.button == 2) {
				// context menu
				var oPositionPopup	= oPopup.getBoundingClientRect();
				//
				oPopup.moveTo(	oEvent.clientX - oPositionPopup.left/* + oPositionPopup.scrollLeft*/,
								oEvent.clientY - oPositionPopup.top/* + oPositionPopup.scrollTop*/);

				// Prevent browser context menu
				oEvent.preventDefault();
			}
			else {
				// ::settings left-click
				var oPositionPopup	= oPopup.getBoundingClientRect(),
					oPositionSelf	= this.getBoundingClientRect();
				//
				oPopup.moveTo(	oPositionSelf.right - oPositionPopup.right,
			 					oPositionSelf.bottom - oPositionPopup.top);
			}

			this.ownerDocument.popupNode	= oPopup;
		}
	},
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecol)
				this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_treecol)
				this.items.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_treecols.prototype.$getTagOpen	= function()
{
    return '<tr' + (this.attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>\
				<td class="xul-treecols--container">\
					<div class="xul-treecol" style="float:right"><div class="xul-treecol--label"><div class="xul-treecols--settings"><br /></div></div></div>\
					<div class="xul-treecols--area" style="height:18px;overflow:hidden;position:relative;">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" style="height:18px;position:absolute;" class="xul-treecols">\
							<thead>\
								<tr class="xul-treecols--gateway">' +
    								(this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio"
    								? ('<th class="xul-listheader" style="width:20px">' +
        								(this.parentNode.attributes["type"] == "checkbox"
        								? '<input type="checkbox" name="' + this.parentNode.uniqueID + '_cmd" class="xul-treecol--command" onclick="return ample.$instance(this)._onCommandClick(event)" autocomplete="off" />'
										: (this.parentNode.attributes["type"] == "radio"
											? '<input type="radio" name="' + this.parentNode.uniqueID + '_cmd" class="xul-treecol--command" checked="true" onclick="return ample.$instance(this)._onCommandClick(event)"/>'
											: ' ')) +
										'</th>')
									: '');
};

// Element Render: close
cXULElement_treecols.prototype.$getTagClose	= function()
{
	return 						'</tr>\
							</thead>\
						</table>\
					</div>\
				</td>\
			</tr>';
};

// Register Element with language
oXULNamespace.setElement("treecols", cXULElement_treecols);
