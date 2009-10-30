/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cXULElement_deck	= function(){};
cXULElement_deck.prototype	= new cXULElement;
//cXULElement_deck.prototype.viewType	= cXULElement.VIEW_TYPE_BOXED;

// Public Properties
cXULElement_deck.prototype.selectedIndex	=-1;
cXULElement_deck.prototype.selectedPanel	= null;

// Attributes Defaults
cXULElement_deck.attributes	= {};
cXULElement_deck.attributes.selectedIndex	= "0";

// Public Methods
cXULElement_deck.prototype.setAttribute  = function(sName, sValue)
{
    if (sName == "selectedIndex")
    {
        if (this.childNodes.length > 0)
        {
            if (isNaN(sValue) || this.childNodes.length < sValue * 1)
                sValue  = "0";

            this.selectedIndex  = sValue * 1;
            this.selectedPanel  = this.childNodes[this.selectedIndex];

            for (var nIndex = 0; nIndex < this.childNodes.length; nIndex++)
                this.childNodes[nIndex].setAttribute("hidden", this.selectedIndex == nIndex ? "false" : "true");

            // send event
            var oEvent  = this.ownerDocument.createEvent("Events");
            oEvent.initEvent("select", false, true);
            this.dispatchEvent(oEvent);
        }
    }
    else
    {
        this._setAttribute(sName, sValue);
    }

    this.AMLElement.setAttribute.call(this, sName, sValue);
};

// Class event handlers
cXULElement_deck.handlers	= {
	"DOMNodeInsertedIntoDocument":	function(oEvent) {
		if (!isNaN(this.attributes["selectedIndex"]))
			this.setAttribute("selectedIndex", this.attributes["selectedIndex"]);
	}
};

// Element Render: open
cXULElement_deck.prototype.$getTagOpen	= function()
{
    return '<div class="xul-deck">';
};

// Element Render: close
cXULElement_deck.prototype.$getTagClose	= function()
{
    return '</div>';
};

// Register Element with language
oXULNamespace.setElement("deck", cXULElement_deck);
