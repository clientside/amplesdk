/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

if (bTrident && nVersion < 10) {
	var oXMLHttpRequest	= cXMLHttpRequest;
	//
	cXMLHttpRequest	= function() {
		if (!(this instanceof cXMLHttpRequest))
			throw new cAmpleException(cAmpleException.OBJECT_CONSTRUCTOR_ERR
//->Debug
					, cXMLHttpRequest.caller
					, ["XMLHttpRequest"]
//<-Debug
			);

		this._object	= oXMLHttpRequest && !(/*bTrident && */nVersion == 7) ? new oXMLHttpRequest : new cActiveXObject("Microsoft.XMLHTTP");
	};

	// Constants
	cXMLHttpRequest.UNSENT				= 0;
	cXMLHttpRequest.OPENED				= 1;
	cXMLHttpRequest.HEADERS_RECEIVED	= 2;
	cXMLHttpRequest.LOADING				= 3;
	cXMLHttpRequest.DONE				= 4;

	// Public Properties
	cXMLHttpRequest.prototype.readyState	= 0 /* cXMLHttpRequest.UNSENT */;
	cXMLHttpRequest.prototype.responseText	= '';
	cXMLHttpRequest.prototype.responseXML	= null;
	cXMLHttpRequest.prototype.status		= 0;
	cXMLHttpRequest.prototype.statusText	= '';

	// Instance-level Events Handlers
	cXMLHttpRequest.prototype['on' + "readystatechange"]	= null;

	// Public Methods
	cXMLHttpRequest.prototype.open	= function(sMethod, sUrl, bAsync, sUser, sPassword) {
//->Guard
		fGuard(arguments, [
			["method",	cString],
			["url",		cString],
			["async",	cBoolean, true]
		]);
//<-Guard

		// Delete headers, required when object is reused
		delete this._headers;

		// When bAsync parameter value is omitted, use true as default
		if (arguments.length < 3)
			bAsync	= true;

		// Save async parameter for fixing Gecko bug with missing readystatechange in synchronous requests
		this._async		= bAsync;

		// Set the onreadystatechange handler
		var oRequest	= this,
			nState		= this.readyState,
			fOnUnload;

		// BUGFIX: IE - memory leak on page unload (inter-page leak)
		if (/*bTrident && */nVersion < 9 && bAsync) {
			fOnUnload	= function() {
				if (nState != 4 /* cXMLHttpRequest.DONE */) {
					fCleanTransport(oRequest);
					// Safe to abort here since onreadystatechange handler removed
					oRequest.abort();
				}
			};
			fBrowser_attachEvent(window, "unload", fOnUnload);
		}
/*
		// Add method sniffer
		if (cXMLHttpRequest.onopen)
			cXMLHttpRequest.onopen.apply(this, arguments);
*/
		// Opera issue
		if (arguments.length > 4)
			this._object.open(sMethod, sUrl, bAsync, sUser, sPassword);
		else
		if (arguments.length > 3)
			this._object.open(sMethod, sUrl, bAsync, sUser);
		else
			this._object.open(sMethod, sUrl, bAsync);
/*
		if (!bGecko && !bTrident) {
			this.readyState	= cXMLHttpRequest.OPENED;
			fReadyStateChange(this);
		}
*/
		this._object['on' + "readystatechange"]	= function() {
/*
			if (bGecko && !bAsync)
				return;
*/
			// Synchronize state
			oRequest.readyState		= oRequest._object.readyState;

			//
			fSynchronizeValues(oRequest);

			// BUGFIX: Firefox fires unnecessary DONE when aborting
			if (oRequest._aborted) {
				// Reset readyState to UNSENT
				oRequest.readyState	= 0 /*cXMLHttpRequest.UNSENT*/;

				// Return now
				return;
			}

			if (oRequest.readyState == 4 /* cXMLHttpRequest.DONE */) {
				//
				fCleanTransport(oRequest);

				// BUGFIX: IE - memory leak in interrupted
				if (/*bTrident && */nVersion < 9 && bAsync)
					fBrowser_detachEvent(window, "unload", fOnUnload);
			}

			// BUGFIX: Some browsers (Internet Explorer, Gecko) fire OPEN readystate twice
			if (nState != oRequest.readyState)
				fReadyStateChange(oRequest);

			nState	= oRequest.readyState;
		};
	};
	cXMLHttpRequest.prototype.send	= function(vData) {
/*
		// Add method sniffer
		if (cXMLHttpRequest.onsend)
			cXMLHttpRequest.onsend.apply(this, arguments);
*/
		// BUGFIX: Safari - fails sending documents created/modified dynamically, so an explicit serialization required
		// BUGFIX: IE - rewrites any custom mime-type to "text/xml" in case an XMLNode is sent
		// BUGFIX: Gecko - fails sending Element (this is up to the implementation either to standard)
		if (vData && vData.nodeType) {
			vData	= /*window.XMLSerializer ? new window.XMLSerializer().serializeToString(vData) : */vData.xml;
			if (!this._headers["Content-Type"])
				this._object.setRequestHeader("Content-Type", "application/xml");
		}

		this._object.send(vData);
/*
		// BUGFIX: Gecko - missing readystatechange calls in synchronous requests
		if (bGecko && !this._async) {
			this.readyState	= cXMLHttpRequest.OPENED;

			// Synchronize state
			fSynchronizeValues(this);

			// Simulate missing states
			while (this.readyState < cXMLHttpRequest.DONE) {
				this.readyState++;
				fReadyStateChange(this);
				// Check if we are aborted
				if (this._aborted)
					return;
			}
		}
*/
	};
	cXMLHttpRequest.prototype.abort	= function() {
/*
		// Add method sniffer
		if (cXMLHttpRequest.onabort)
			cXMLHttpRequest.onabort.apply(this, arguments);
*/
/*
		// BUGFIX: Gecko - unnecessary DONE when aborting
		if (this.readyState > cXMLHttpRequest.UNSENT)
			this._aborted	= true;
*/
		this._object.abort();

		// BUGFIX: IE - memory leak
		fCleanTransport(this);
	};
	cXMLHttpRequest.prototype.getAllResponseHeaders	= function() {
		return this._object.getAllResponseHeaders();
	};
	cXMLHttpRequest.prototype.getResponseHeader	= function(sName) {
		return this._object.getResponseHeader(sName);
	};
	cXMLHttpRequest.prototype.setRequestHeader	= function(sName, sValue) {
		// BUGFIX: IE - cache issue
		if (!this._headers)
			this._headers	= {};
		this._headers[sName]	= sValue;

		return this._object.setRequestHeader(sName, sValue);
	};


	// Helper function
	function fReadyStateChange(oRequest) {
/*
		// Sniffing code
		if (cXMLHttpRequest.onreadystatechange)
			cXMLHttpRequest.onreadystatechange.apply(oRequest);
*/
		if (oRequest['on' + "readystatechange"] instanceof cFunction)
			oRequest['on' + "readystatechange"]();
	};

	function fSynchronizeValues(oRequest) {
		try {	oRequest.responseText	= oRequest._object.responseText;	} catch (oException) {}
		try {
			if (oRequest.readyState == 4 /* cXMLHttpRequest.DONE */ && oRequest.getResponseHeader("Content-Type").match(/xml(;.*)?$/))
				oRequest.responseXML	= fBrowser_getResponseDocument(oRequest._object);
		} catch (oException) {}
		try {	oRequest.status			= oRequest._object.status;			} catch (oException) {}
		try {	oRequest.statusText		= oRequest._object.statusText;		} catch (oException) {}
	};

	function fCleanTransport(oRequest) {
		// BUGFIX: IE - memory leak (on-page leak)
		oRequest._object['on' + "readystatechange"]	= new cFunction;
	};

	// Export
	fExporter_export(cXMLHttpRequest,	"XMLHttpRequest",	window);
}
