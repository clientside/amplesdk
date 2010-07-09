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