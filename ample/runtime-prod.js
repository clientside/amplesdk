/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 * Note: Strips "Source"/"Debug"/"Guard" tags from source code
 */

(function() {
	// Get base folder
	var scripts	= document.getElementsByTagName("script"),
		self	= scripts[scripts.length-1],
		base	= self.src.replace(/\/?[^\/]+$/, '/');
	// Remove self
	self.parentNode.removeChild(self);
	// Include loader
	document.write('<script type="text/javascript" src="' + base + '../resources/assemble.js?path=' + base + 'runtime/"></script>');
})();
