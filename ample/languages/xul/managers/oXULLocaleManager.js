/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var oXULLocaleManager	=(function(){
	// Private variables
	var oLocales	= {};

	// Public object
	return {
		register:	function(sLocale, oLocale) {
			oLocales[sLocale.toLowerCase()]	= oLocale;
		},
		getText:	function(sName) {
			return (oLocales[ample.domConfig.getParameter("ample-user-locale").toLowerCase()] || oLocales["en-us"]).dictionary[sName] || '???';
		}
	};
})();