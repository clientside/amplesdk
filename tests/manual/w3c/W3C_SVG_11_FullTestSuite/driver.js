// Load ample files
var oRequest	= new XMLHttpRequest;
// #include runtime
oRequest.open("GET", "../../../../../ample/runtime.js", false);
oRequest.send(null);
eval(oRequest.responseText);
// #include SVG implementationoRequest.open("GET", "../../../../../ample/languages/svg/svg.js", false);
oRequest.send(null);
eval(oRequest.responseText);

// Load and and replace embed tag
ample.addEventListener("load", function() {
	var oElementOld	= document.getElementsByTagName("embed")[0],
		sLocation	= oElementOld.getAttribute("src"),
		sWidth		= oElementOld.getAttribute("width"),
		sHeight		= oElementOld.getAttribute("height"),
		oElementNew	= document.createElement("div"),
		oElement	= ample.documentElement.appendChild(ample.createElement("fake"));
	// Replace embed element with div
	oElementOld.parentNode.replaceChild(oElementNew, oElementOld);
	oElementNew.parentNode.setAttribute("align", "left");
	oElementNew.style.width		= sWidth + "px";
	oElementNew.style.height	= sHeight + "px";
	// Bind Ample SDK fake element with browser DOM
	oElementNew.setAttribute("id", "example");
	oElement.setAttribute("id", "example");
	// Load example
	var oRequest = new XMLHttpRequest;
	oRequest.open("GET", sLocation, true);
	oRequest.onreadystatechange	= function() {
		if (oRequest.readyState == 4) {
			// Reparse
			var oDocument	= new DOMParser().parseFromString(oRequest.responseText, "text/xml");
			// Ample SDK doesn't support percent units yet!
			oDocument.documentElement.setAttribute("width", sWidth);
			oDocument.documentElement.setAttribute("height", sHeight);
			// Append SVG fragment to Ample SDK DOM
			oElement.appendChild(ample.importNode(oDocument.documentElement, true));
		}
	}
	oRequest.send(null);
}, false);