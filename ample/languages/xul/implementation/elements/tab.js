/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_tab	= function(){};
cXULElement_tab.prototype	= new cXULElement;
cXULElement_tab.prototype.$hoverable	= true;

// Public Methods
cXULElement_tab.prototype.setAttribute   = function(sName, sValue)
{
    if (sName == "selected")
    {
    	this.$setPseudoClass("selected", sValue == "true");
    }
    else
    {
        this._setAttribute(sName, sValue);
    }
    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Events handlers
cXULElement_tab.handlers	= {
	"mousedown":	function(oEvent) {
		if (oEvent.button == 0)
			this.$activate();
	},
	"DOMActivate":	function(oEvent) {
		if (!this.$isAccessible())
			return;

		this.parentNode.goTo(this.parentNode.items.$indexOf(this));
		this.doCommand();
	},
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabs)
			this.parentNode.items.$add(this);
	},
	"DOMNodeRemovedFromDocument":	function(oEvent) {
		if (this.parentNode instanceof cXULElement_tabs)
			this.parentNode.items.$remove(this);
	}
};

// Element Render: open
cXULElement_tab.prototype.$getTagOpen	= function()
{
    var sHtml   = '<td class="xul-tab' + (this.attributes["disabled"] ? " xul-tab_disabled" : "") +(this.attributes["class"] ? " " + this.attributes["class"] : "") + '">';
    if (this.attributes["image"])
        sHtml  += '<img src="' + this.attributes["image"] + '" border="0" align="absmiddle"/> ';
    if (this.attributes["label"])
        sHtml  += this.attributes["label"];

    return sHtml;
};

// Element Render: close
cXULElement_tab.prototype.$getTagClose	= function()
{
    var sHtml   = '';
    sHtml  += '</td>';
    sHtml  += '<td class="xul-tab-separator"><img width="1" height="1" /></td>';

    return sHtml;
};

// Register Element with language
oXULNamespace.setElement("tab", cXULElement_tab);
