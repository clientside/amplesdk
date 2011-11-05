/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2011 Sergey Ilinsky, Tudor Holton
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXULElement_overlay	= function(){};
cXULElement_overlay.prototype	= new cXULElement("overlay");

// Class Events Handlers
cXULElement_overlay.handlers	= {
	"DOMAttrModified":	function(oEvent) {
		if (oEvent.target == this) {
			this.$mapAttribute(oEvent.attrName, oEvent.newValue);
		}
	}
};

function processOverlay(oOverlayDoc) {
    var oRootEl = oOverlayDoc.documentElement;
    var oMatchRootEl = null;
    if (oRootEl.hasAttribute('id')) {
        oMatchRootEl = ample.query('//'+oRootEl.getAttribute('id'));
    }
    if (oMatchRootEl) processOverlayRecurse(oRootEl,aMatchRootEl);
    else {
        for (var iIndex = 0; iIndex < oOverlayEl.childNodes.length; iIndex++) {
            var oChild = oOverlayEl.item(iIndex);
            var oNewDocEl = ample.getElementById(oChild.getAttribute('id'));
            if (oNewDocEl) processOverlayRecurse(oOverlayEl,oNewDocEl);  //Our id matches an existing element.
        }
    }

}

function processOverlayRecurse(oOverlayEl,oDocEl) {
    //Action...
    for (var iIndex = 0; iIndex < oOverlayEl.childNodes.length; iIndex++) {
        var oChild = oOverlayEl.item(iIndex);
        if (oChild.hasAttribute('id')) {
            //We have an id
            var oNewDocEl = ample.query(oChild.getAttribute('id'),oDocEl);
            if (oNewDocEl) processOverlayRecurse(oOverlayEl,oNewDocEl);  //Our id matches an existing element.
            else importAndAdd(oChild,oDocEl); //Our id doesn't insert it at the current location with the id.
        }
        else importAndAdd(oChild,oDocEl); //We don't have an id, so insert.
    }
}

function importAndAdd(oNodeToAdd,oParent) {
    var newNode = ample.importNode(oNodeToAdd);
    if (oNodeToAdd.hasAttribute('position')) {
        var position = oNodeToAdd.getAttribute('position');
        oParent.insertBefore(oNodeToAdd,oParent.childNodes.item(position));
    } else
        oParent.appendChild(oNodeToAdd);
}


// Element Render: open
cXULElement_overlay.prototype.$getTagOpen	= function() {
    return '<div class="xul-overlay' + (this.attributes["class"] ? " " + this.attributes["class"] : "") + '"><br /></div>';
};

// Register Element
ample.extend(cXULElement_overlay);
