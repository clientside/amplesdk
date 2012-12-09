/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_wizard	= function() {
	// Collections
	this.buttons	= {};
	this.wizardPages= new ample.classes.NodeList;
	//
	var that	= this;
	this.contentFragment	= ample.createDocumentFragment();
	// Back
	this.buttons.back	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.back.addEventListener("DOMActivate", function(oEvent) {
		that.rewind();
	}, false);
	this.buttons.back.setAttribute("label", ample.locale.localize("xul.dialog.button.previous"));
	this.buttons.back.setAttribute("class", "back");
	// Next
	this.buttons.next	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.next.addEventListener("DOMActivate", function(oEvent) {
		that.advance();
	}, false);
	this.buttons.next.setAttribute("label", ample.locale.localize("xul.dialog.button.next"));
	this.buttons.next.setAttribute("class", "next");
	// Finish
	this.buttons.finish	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.finish.addEventListener("DOMActivate", function(oEvent) {
		that.finish();
	}, false);
	this.buttons.finish.setAttribute("label", ample.locale.localize("xul.dialog.button.finish"));
	this.buttons.finish.setAttribute("class", "finish");
	// Cancel
	this.buttons.cancel	= this.contentFragment.appendChild(ample.createElementNS(this.namespaceURI, "xul:button"));
	this.buttons.cancel.addEventListener("DOMActivate", function(oEvent) {
		that.cancel();
	}, false);
	this.buttons.cancel.setAttribute("label", ample.locale.localize("xul.dialog.button.cancel"));
	this.buttons.cancel.setAttribute("class", "cancel");
};
cXULElement_wizard.prototype	= new cXULWindowElement("wizard");

// Public Properties
cXULElement_wizard.prototype.currentPage	= null;
cXULElement_wizard.prototype.wizardPages	= null;
cXULElement_wizard.prototype.buttons		= null;

// Attributes Defaults
cXULElement_wizard.attributes	= {};
cXULElement_wizard.attributes.width		= "400";
cXULElement_wizard.attributes.height	= "300";

// Public Methods
cXULElement_wizard.prototype.advance	= function(sId) {
	if (this.currentPage) {
		if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "hide"))
			return;

		if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "advanced"))
			return;
	}

	if (!cXULElement_wizard.dispatchEvent_onWizard(this, "next"))
		return;

	if (this.currentPage) {
		var oPage	= sId ? this.getPage(sId) : cXULElement_wizard.getNextPage(this, this.currentPage);
		if (oPage) {
			cXULElement_wizard.goTo(this, oPage);
			//
			cXULElement_wizardpage.dispatchEvent_onPage(oPage, "show");
		}
	}
};

cXULElement_wizard.prototype.rewind	= function() {
	if (this.currentPage) {
		if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "hide"))
			return;

		if (!cXULElement_wizardpage.dispatchEvent_onPage(this.currentPage, "rewound"))
			return;
	}

	if (!cXULElement_wizard.dispatchEvent_onWizard(this, "back"))
		return;

	if (this.currentPage) {
		var oPage	= cXULElement_wizard.getPrevPage(this, this.currentPage);
		if (oPage) {
			cXULElement_wizard.goTo(this, oPage);
			//
			cXULElement_wizardpage.dispatchEvent_onPage(oPage, "show");
		}
	}
};

cXULElement_wizard.prototype.cancel	= function() {
	if (cXULElement_wizard.dispatchEvent_onWizard(this, "cancel"))
		this.hide();
};

cXULElement_wizard.prototype.finish	= function() {
	if (cXULElement_wizard.dispatchEvent_onWizard(this, "finish"))
		this.hide();
};

cXULElement_wizard.prototype.goTo	= function(sId) {
	var oPage	= this.getPageById(sId);
	if (oPage)
		cXULElement_wizard.goTo(this, oPage);
};

cXULElement_wizard.prototype.getPageById	= function(sId) {
	for (var nIndex = 0; nIndex < this.wizardPages.length; nIndex++)
		if (this.wizardPages[nIndex].getAttribute("pageid") == sId)
			return this.wizardPages[nIndex];

	return null;
};

cXULElement_wizard.prototype.getButton	= function(sName) {
	return this.buttons[sName];
};

// Redefine cXULElement.prototype.reflow behavior
cXULElement_wizard.prototype.reflow	= function() {
	if (this.currentPage)
		this.currentPage.reflow();
};

// Static methods
cXULElement_wizard.dispatchEvent_onWizard	= function(oElement, sName) {
	var oEvent	= oElement.ownerDocument.createEvent("Event");
	oEvent.initEvent("wizard" + sName, true, true);

	return oElement.dispatchEvent(oEvent);
};

// Class events handlers
cXULElement_wizard.handlers	= {
	"DOMNodeInserted":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_wizardpage)
				this.wizardPages.$add(oEvent.target);
	},
	"DOMNodeRemoved":	function(oEvent) {
		if (oEvent.target.parentNode == this)
			if (oEvent.target instanceof cXULElement_wizardpage)
				this.wizardPages.$remove(oEvent.target);
	},
	"dragstart":	function(oEvent) {
		if (oEvent.target == this && oEvent.$pseudoTarget != this.$getContainer("title"))
			oEvent.preventDefault();
	}
};

cXULElement_wizard.prototype.$mapAttribute	= function(sName, sValue) {
	if (sName == "pagestep") {
		if (this.wizardPages[sValue])
			cXULElement_wizard.goTo(this, this.wizardPages[sValue]);
	}
	else
	if (sName == "canAdvance" || sName == "canRewind") {
		if (this.currentPage)
			cXULElement_wizard.goTo(this, this.currentPage);
	}
	else
		cXULWindowElement.prototype.$mapAttribute.call(this, sName, sValue);
};

// Static methods
cXULElement_wizard.goTo	= function(oElement, oPage) {
	// Hide previous page
	if (oElement.currentPage)
		oElement.currentPage.$getContainer().style.display	= "none";

	// Show new page
	oPage.$getContainer().style.display	= "";

	// Set header label and description
	oElement.$getContainer("label").innerHTML	= ample.$encodeXMLCharacters(oPage.getAttribute("label") || " ");
	oElement.$getContainer("description").innerHTML	= ample.$encodeXMLCharacters(oPage.getAttribute("description") || " ");
	oElement.$getContainer("header").className	= "xul-wizardheader xul-wizard--header " + (oPage.getAttribute("class") || "");

	// Set buttons state
	var bNext	= cXULElement_wizard.getNextPage(oElement, oPage) != null,	// Is there next page?
		bPrev	= cXULElement_wizard.getPrevPage(oElement, oPage) != null;	// Is there prev page?
	oElement.buttons["back"].setAttribute("disabled", String(!bPrev || oElement.getAttribute("canRewind") == "false"));
	oElement.buttons["next"].setAttribute("disabled", String(oElement.getAttribute("canAdvance") == "false"));
	oElement.buttons["next"].setAttribute("hidden", bNext ? "false" : "true");
	oElement.buttons["finish"].setAttribute("hidden", bNext ? "true" : "false");

	// Set new current page
	oElement.currentPage	= oPage;
};

cXULElement_wizard.getPrevPage	= function(oElement, oPage) {
	var sId	= oPage.getAttribute("pageid");
	if (sId)
		for (var oNode = oElement.lastChild; oNode; oNode = oNode.previousSibling)
			if (oNode instanceof cXULElement_wizardpage && oNode.getAttribute("next") == sId)
				return oNode;
	while (oPage = oPage.previousSibling)
		if (oPage instanceof cXULElement_wizardpage)
			return oPage;
	return null;
};

cXULElement_wizard.getNextPage	= function(oElement, oPage) {
	var sId	= oPage.getAttribute("next");
	if (sId)
		for (var oNode = oElement.firstChild; oNode; oNode = oNode.nextSibling)
			if (oNode instanceof cXULElement_wizardpage && oNode.getAttribute("pageid") == sId)
				return oNode;
	while (oPage = oPage.nextSibling)
		if (oPage instanceof cXULElement_wizardpage)
			return oPage;
	return null;
};

// Element Render: open
cXULElement_wizard.prototype.$getTagOpen	= function() {
	return '<div class="xul-wizard'+(this.hasAttribute("class") ? " " + this.getAttribute("class") : "") + '" style="' +
				(this.hasAttribute("width") ? 'width:' + this.getAttribute("width") + 'px;' : '') +
				(this.hasAttribute("height") ? 'height:' + (this.getAttribute("heigh") - 100) + 'px;' : '') +
				(this.getAttribute("hidden") == "true" ? 'display:none;' : '') +
				(this.hasAttribute("style") ? this.getAttribute("style") : '') + '">\
				<div class="xul-wizard--head" ' +(this.getAttribute("hidechrome") == "true" ? ' style="display:none"': '')+ '>\
					<table cellpadding="0" cellspacing="0" border="0" width="100%">\
						<tbody>\
							<tr><td class="xul-wizard--title">' +(this.hasAttribute("title") ? ample.$encodeXMLCharacters(this.getAttribute("title")) : " ")+ '</td></tr>\
						</tbody>\
					</table>\
				</div>\
				<div class="xul-wizardheader xul-wizard--header"><div class="xul-wizardheader--title xul-wizard--label"></div><div class="xul-wizardheader--description xul-wizard--description"></div></div>\
				<div class="xul-wizard--body" style="height:100%">\
					<div class="xul-wizard--gateway" style="height:100%">';
};

// Element Render: close
cXULElement_wizard.prototype.$getTagClose	= function() {
	return '		</div>\
					<div class="xul-wizard--footer">\
						<table cellpadding="0" cellspacing="0" border="0" height="100%" align="' +(this.getAttribute("buttonalign") == "start" ? "left" : this.getAttribute("buttonalign") == "center" ? "center" : "right")+ '">\
							<tbody>\
								<tr>\
									<td>' + this.buttons['back'].$getTag() + '</td>\
									<td>' + this.buttons['next'].$getTag() + '</td>\
									<td>' + this.buttons['finish'].$getTag() + '</td>\
									<td width="8"><br /></td>\
									<td>' + this.buttons['cancel'].$getTag() + '</td>\
								</tr>\
							</tbody>\
						</table>\
					</div>\
				</div>\
			</div>';
};

// Register Element
ample.extend(cXULElement_wizard);
