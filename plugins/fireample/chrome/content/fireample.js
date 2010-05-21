FBL.ns(function() { with (FBL) {

	// Helper for debug logs.
	if (typeof FBTrace == "undefined")
	    FBTrace = { sysout: function() {}, dumpProperties: function() {} };

	// Ample panel ID.
	const panelName = "ample";

	// Firecookie module object
	Firebug.FireAmpleModule = extend(Firebug.ActivableModule,
	{
	    // extends ActivableModule
	    initialize:	function()
	    {
	        this.panelName		= panelName;
	        this.description	= $FA_STR(panelName + ".modulemanager.description");

	        Firebug.ActivableModule.initialize.apply(this, arguments);
	    },

	    getMenuLabel: function(option, location)
	    {
	        var host = getURIHost(location);

	        // Translate these two options in panel activable menu from firecookie.properties
	        switch (option)
	        {
		        case "disable-site":
		            return $FA_STRF("ample.HostDisable", [host]);
		        case "enable-site":
		            return $FA_STRF("ample.HostEnable", [host]);
	        }

	        return Firebug.ActivableModule.getMenuLabel.apply(this, arguments);
	    },

	    initContext: function(context)
	    {
			Firebug.ActivableModule.initContext.apply(this, arguments);

			context.window.addEventListener("DOMContentLoaded", function() {

				//
				var wWindow	= context.window.wrappedJSObject,
					panel	= context.getPanel(panelName),
					element = panel.panelNode.appendChild(panel.panelNode.ownerDocument.createElement("div")),
					message	= "Ample SDK was not found";

				element.style.cssText	= "padding: 5px";

				function fUpdate(oEvent) {
					message	= "# " + oEvent.type + " on " + oEvent.target.nodeName + " (uniqueID: " + oEvent.target.uniqueID + ")";
					if (oEvent.type == "DOMAttrModified")
						message+= " @" + oEvent.attrName + ", newValue " + oEvent.newValue + ", prevValue " + oEvent.prevValue;
					else
					if (oEvent.type == "readystatechange")
						message+= " ample.readyState: " + oEvent.target.readyState;

					var div	= element.appendChild(element.ownerDocument.createElement("div"));
					div.style.color	= oEvent.initUIEvent ? 'green' : oEvent.initMutationEvent ? (oEvent.type == "DOMAttrModified" ? 'brown' : 'red') : 'black';
					div.innerHTML	= message;
					element.scrollIntoView(false);
				}

				if (wWindow.ample) {
					// Mutation Events
					wWindow.ample.addEventListener("readystatechange", fUpdate, true);
					wWindow.ample.addEventListener("DOMNodeInsertedIntoDocument", fUpdate, true);
					wWindow.ample.addEventListener("DOMNodeRemovedFromDocument", fUpdate, true);
					wWindow.ample.addEventListener("DOMNodeInserted", fUpdate, true);
					wWindow.ample.addEventListener("DOMNodeRemoved", fUpdate, true);
					wWindow.ample.addEventListener("DOMAttrModified", fUpdate, true);
					wWindow.ample.addEventListener("DOMActivate", fUpdate, true);
					wWindow.ample.addEventListener("focus", fUpdate, true);
					wWindow.ample.addEventListener("blur", fUpdate, true);
					wWindow.ample.addEventListener("unload", fUpdate, true);
					wWindow.ample.addEventListener("load", fUpdate, true);

					message	= "Running " + wWindow.ample.domConfig.getParameter("ample-version");
				}

				//
				element.appendChild(element.ownerDocument.createTextNode(message));
				element.appendChild(element.ownerDocument.createElement("br"));
			}, false);
	    },

	    onPanelActivate: function(context, init, activatedPanelName)
	    {
	        if (activatedPanelName != panelName)
	            return;

	        if (!init)
	            context.window.location.reload();
	    },

		// Ample Tree update
		doTreeAttributeUpdate:	function(oTree, oElement) {
//			var oTreeNode	= this.getElementById(oElement.uniqueID);
		},

		doTreeElementUpdate:	function(oTree, oElement) {

		},

	    clear:	function(context) {
	    	var output	= context.getPanel(panelName).panelNode.firstChild;
	    	while (output.lastChild)
	    		output.removeChild(output.lastChild);
	    }
	});

	// Localization
	function $FA_STR(name)
	{
	    try
	    {
	        return document.getElementById("strings_fireample").getString(name);
	    }
	    catch (err)
	    {
	        if (FBTrace.DBG_COOKIES)
	        {
	            FBTrace.sysout("---------> Missing translation for: " + name + "\n");
	            FBTrace.dumpProperties("---------> getString FAILS ", err);
	        }
	    }

	    return name;
	}

	function $FA_STRF(name, args)
	{
	    try
	    {
	        return document.getElementById("strings_fireample").getFormattedString(name, args);
	    }
	    catch (err)
	    {
	        if (FBTrace.DBG_COOKIES)
	        {
	            FBTrace.sysout("---------> Missing translation for: " + name + "\n");
	            FBTrace.dumpProperties("---------> getString FAILS ", err);
	        }
	    }

	    return name;
	}

	// Panel Implementation
	//-----------------------------------------------------------------------------
	Firebug.FireAmplePanel	= function () {}

	Firebug.FireAmplePanel.prototype = extend(Firebug.Panel,
	{
		// Panel
		name:		panelName,
		title:		$FA_STR("fireample.Panel"),
		searchable:	true,
		editable:	false,

		initialize:	function(context, doc)
		{
			Firebug.Panel.initialize.apply(this, arguments);
		},

	    shutdown:	function() {

	    },
/*
	    search:	function(text)
	    {
	        if (!text)
	            return;

	        // TODO: Implement
	    },
*/
	    show:	function(state)
	    {
	        this.showToolbarButtons("fbAmpleButtons", true);
	    },

	    hide:	function()
	    {
			this.showToolbarButtons("fbAmpleButtons", false);
	    }
	});

	// Firebug Registration
	//-----------------------------------------------------------------------------

	Firebug.registerActivableModule(Firebug.FireAmpleModule);
	Firebug.registerPanel(Firebug.FireAmplePanel);
}});