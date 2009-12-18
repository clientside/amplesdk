/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cRPCClient	= function(sUrl, sVersion) {

};

// Constants
cRPCClient.UNINITIALIZED	= 0;
cRPCClient.SENT		= 1;
cRPCClient.RECEIVED	= 2;

// Public Properties
cRPCClient.prototype.status		= cRPCClient.UNINITIALIZED;
cRPCClient.prototype.async		= true;
cRPCClient.prototype.timeout	= nInfinity;

// Public Methods
cRPCClient.prototype.call	= function(sMethod, oParams, fCallback) {
	return nCall;
};

cRPCClient.prototype.abort	= function(nCall) {

};