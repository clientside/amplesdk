/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXHTMLElement_a	= function(){};
cXHTMLElement_a.prototype	= new cXHTMLElement("a");
cXHTMLElement_a.prototype.tabIndex	= 0;
cXHTMLElement_a.prototype.$hoverable= true;

// Class Events Handlers
cXHTMLElement_a.handlers	= {
	"focus":	function(oEvent) {
		this.$getContainer().focus();
	},
	"blur":		function(oEvent) {
		this.$getContainer().blur();
	},
	"click":	function(oEvent) {
		if (oEvent.button == 0) {
			var oDOMActivateEvent	= this.ownerDocument.createEvent("UIEvent");
			oDOMActivateEvent.initUIEvent("DOMActivate", true, true, window, null);
			if (!this.dispatchEvent(oDOMActivateEvent))
				oEvent.preventDefault();
		}
	},
	"DOMActivate":	function(oEvent) {
		// Handle @href="#href"
		if (document.namespaces) {
			var sHref	= this.$getContainer().href,
				aUrl	= sHref.match(/^([^#]*)#(.*)/);
			if (aUrl && window.location.href.match(/^([^#]*)#/) && aUrl[1] == window.RegExp.$1)
				ample.bookmark(aUrl[2]);
		}

		// Handle @target="#target"
		var sTarget	= this.getAttribute("target"),
			oTarget;
		if (sTarget && sTarget.match(/#(.+)$/) && (oTarget = this.ownerDocument.getElementById(window.RegExp.$1)))	{
			// Load content into target
			ample.query(oTarget).load(this.getAttribute("href"));

			// Prevent following link
			oEvent.preventDefault();
		}
	}
};

// Register Element
ample.extend(cXHTMLElement_a);
