/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listhead	= function()
{
    // Collections
    this.items  = new AMLNodeList;
};
cXULElement_listhead.prototype   = new cXULElement;

// Public Methods
cXULElement_listhead.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "hidden")
    {
        // TODO
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Private Methods
cXULElement_listhead.prototype._getPrimaryColIndex   = function()
{
    for (var nIndex = 0; nIndex < this.items.length; nIndex++)
        if (this.items[nIndex].attributes["primary"] == "true")
            return nIndex;
    return -1;
};

// Events Handlers
cXULElement_listhead.prototype._onCommandClick   = function(oEvent)
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
cXULElement_listhead.handlers	= {
	"click":	function(oEvent) {
		if (oEvent.button == 2 || (oEvent.button == 0 && oEvent.target == this && oEvent.$pseudoTarget == this.$getContainer("settings"))) {
			var oPopup	= cXULSelectElement.getSettingsPopup(this);
			oPopup.showPopup(this, 0, 0, cXULPopupElement.POPUP_TYPE_POPUP);

			if (oEvent.button == 2) {
				// context menu
				var oPositionPopup	= oPopup.getBoundingClientRect();
				//
				oPopup.moveTo(	oEvent.clientX - oPositionPopup.left,
								oEvent.clientY - oPositionPopup.top);

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
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.head = this;
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_listbox)
			this.parentNode.head = null;
	}
};

// Element Render: open
cXULElement_listhead.prototype.$getTagOpen	= function()
{
    return '<tr' + (this.attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>\
				<td class="xul-listhead--container">\
					<div class="xul-listheader" style="float:right"><div class="xul-listheader--label"><div class="xul-listhead--settings"><br /></div></div></div>\
					<div class="xul-listhead--area" style="height:18px;overflow:hidden;position:relative;">\
						<table cellpadding="0" cellspacing="0" border="0" width="100%" style="position:absolute;" class="xul-listhead">\
							<thead>\
								<tr class="xul-listhead--gateway">' +
    								(this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio"
    								? ('<td class="xul-listheader" width="20" align="center" style="width:20px;padding:0;">' +
    										'<div>' +
		        								(this.parentNode.attributes["type"] == "checkbox"
        										? '<input type="checkbox" name="' + this.parentNode.uniqueID + '_cmd" class="xul-listheader--command" onclick="return ample.$instance(this)._onCommandClick(event)" autocomplete="off" />'
												: (this.parentNode.attributes["type"] == "radio"
													? '<input type="radio" name="' + this.parentNode.uniqueID + '_cmd" class="xul-listheader--command" checked="true" onclick="return ample.$instance(this)._onCommandClick(event)"/>'
													: ' ')) +
											'</div>' +
											'<div style="height:1pt;font-size:1px;width:20px;"></div>'+
										'</td>')
									: '');
};

// Element Render: close
cXULElement_listhead.prototype.$getTagClose	= function()
{
	return 						'</tr>\
							</thead>\
						</table>\
					</div>\
				</td>\
			</tr>';
};

// Register Element with language
oXULNamespace.setElement("listhead", cXULElement_listhead);
