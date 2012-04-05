/*
 * Source-only loader (fallback for missing Apache+mod_rewrite+PHP installation)
 * Note: Strips "Source" tags from source code
 */

(function() {

	var source	= [],
		scripts	= document.getElementsByTagName("script"),
		path	= scripts[scripts.length-1].src.replace(/\/?[^\/]+$/, '/'),
		cXMLHttpRequest	= window.XMLHttpRequest || function() {
			return new ActiveXObject("Microsoft.XMLHTTP");
		};

	function fStripTags($sInput, $sTagName) {
		return $sInput.replace(new RegExp('(//->' + $sTagName + '[\\s\\S.]*?//<-' + $sTagName + ')', 'gm'), "");
	}

	// get files list
	var oRequest	= new cXMLHttpRequest;
	oRequest.open("GET", path + ".files", false);
	oRequest.send(null);
	var files	= oRequest.responseText.split(/\n/g);

	// load files
	for (var n = 0, file; n < files.length; n++) {
		if ((file = files[n].replace(/^\s+/, "").replace(/\s+$/, "")) != '' && file.substr(0, 1) != "#") {
			var oRequest	= new cXMLHttpRequest;
			oRequest.open("GET", path + file, false);
			oRequest.send(null);
			source[source.length]	= fStripTags(oRequest.responseText, "Source");
		}
	}
	var oScript	= document.getElementsByTagName("head")[0].appendChild(document.createElement("script"));
	oScript.type	= "text/javascript";
	oScript.text	= "(function(){" + source.join("\n") + "})()";
	oScript.parentNode.removeChild(oScript);
})();