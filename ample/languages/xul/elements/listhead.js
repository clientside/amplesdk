/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_listhead	= function() {
	// Collections
	this.items	= new ample.classes.NodeList;
};
cXULElement_listhead.prototype	= new cXULElement("listhead");

// Private Methods
cXULElement_listhead.$isAccessible	= function() {
	return this.parentNode ? this.parentNode.$isAccessible() : true;
};

cXULElement_listhead.prototype._getPrimaryColIndex	= function() {
	for (var nIndex = 0; nIndex < this.items.length; nIndex++)
		if (this.items[nIndex].attributes["primary"] == "true")
			return nIndex;
	return -1;
};

// Events Handlers
cXULElement_listhead.prototype._onCommandClick	= function(oEvent) {
	if (this.parentNode.attributes["type"] == "checkbox") {
		if (this.$getContainer("command").checked)
			this.parentNode.selectAll();
		else
			this.parentNode.clearSelection();
	}
	else
	if (this.parentNode.attributes["type"] == "radio") {
		if (this.$getContainer("command").checked)
			this.parentNode.clearSelection();
	}
};

// Class events handlers
cXULElement_listhead.handlers	= {
	"click":	function(oEvent) {
		if (!this.$isAccessible() || !this.parentNode.$isAccessible() || !this.parentNode.parentNode.$isAccessible())
			return;

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
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_listheader)
				this.items.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_listheader)
				this.items.$remove(oEvent.target);
	}
};

// Element Render: open
cXULElement_listhead.prototype.$getTagOpen	= function() {
	return '<tr' + (this.attributes["hidden"] == "true" ? ' style="display:none"' : '') + '>\
				<td class="xul-listhead--container">\
					<div class="xul-listheader" style="float:right;width:16px"><div class="xul-listhead--settings"><br /></div></div>\
					<div class="xul-listhead--area" style="height:20px;overflow:hidden;position:relative;">\
						<table cellpadding="0" cellspacing="0" border="0" style="position:absolute;" class="xul-listhead' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '">\
							<tbody>\
								<tr class="xul-listhead--gateway" style="height:1em;vertical-align:top">' +
									(this.parentNode.attributes["type"] == "checkbox" || this.parentNode.attributes["type"] == "radio"
									? ('<td class="xul-listheader" style="width:20px;padding:0;">' +
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
cXULElement_listhead.prototype.$getTagClose	= function() {
	return 						'</tr>\
							</tbody>\
						</table>\
					</div>\
				</td>\
			</tr>';
};

// Register Element
ample.extend(cXULElement_listhead);
