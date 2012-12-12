/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

//->Source
/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 *
 */

(function() {
	// Get base folder
	var scripts	= document.getElementsByTagName("script"),
		self	= scripts[scripts.length-1],
		base	= self.src.replace(/\/?[^\/]+$/, '/');
	// Remove self
	self.parentNode.removeChild(self);
	// Include loader
	document.write('<script type="text/javascript" src="' + base + '../../../resources/assemble.js?path=' + base + '"></script>');
})();
//<-Source
