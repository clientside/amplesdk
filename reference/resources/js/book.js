function onTocClick(sId) {
	var oElement;
	with (document.getElementById(sId)) {
		if (style.display == 'none') {
			oElement		= document.getElementById('img_'+sId);
			oElement.src	= oElement.src.replace('close', 'open');
			oElement		= document.getElementById('toc_'+sId);
			oElement.src	= oElement.src.replace('close', 'open');
			style.display	= '';
		} else {
			oElement		= document.getElementById('img_'+sId);
			oElement.src	= oElement.src.replace('open', 'close');
			oElement		= document.getElementById('toc_'+sId);
			oElement.src	= oElement.src.replace('open', 'close');
			style.display	= 'none';
		}
	}
}