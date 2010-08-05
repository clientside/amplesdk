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
	var oLocales	= {},
		oLanguages	= {
			"en":	"us",
			"it":	"it"
		};

	// Public object
	return {
		register:	function(sLocale, oLocale) {
			oLocales[sLocale.toLowerCase()]	= oLocale;
		},
		getText:	function(sName) {
			var sLocale	= ample.config("user-locale").toLowerCase();
			if (sLocale.split("-").length < 2)
				sLocale+= "-" + oLanguages[sLocale];
			return (oLocales[sLocale] || oLocales["en-us"]).dictionary[sName] || 'null';
		}
	};
})();