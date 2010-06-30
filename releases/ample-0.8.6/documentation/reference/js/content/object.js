window.onload = function () {
	window.top._helpOpen = !window.top._helpOpen;
	if (window.onMenuClick && document.getElementById('eTableMembersMenu'))
		onMenuClick(document.getElementById('eTableMembersMenu').firstChild);

	var oFrame	= top.frames['book'];
	if (oFrame) {
		var oCollection = oFrame.document.getElementsByTagName('a');
		for (var i=0; i<oCollection.length; i++) {
			if (oCollection[i].href == location.href) {
				var oTmp = oCollection[i];
				while (oTmp = oTmp.parentNode) {
					if (oTmp.nodeName == 'UL' && oTmp.id && oFrame.document.getElementById(oTmp.id).style.display == 'none') {
						oFrame.onTocClick(oTmp.id);
					}
				}
				oCollection[i].className = "active";
	//			oCollection[i].previousSibling.scrollIntoView(true);
			} else {
				oCollection[i].className = oCollection[i].className.replace(/(^|\s)active/gi, "");
			}
		}
	}

	if (window.location.hash)
		var sHash	= window.location.hash.substr(1),
			aHash	= sHash.split('-'),
			aNames	= {	'property':	'properties',
						'method':	'methods',
						'attribute':'attributes',
						'constant':	'constants',
						'event':	'events'},
			sTab	= aNames[aHash[0]],
			oMember	= document.getElementById(sHash);

		if (sTab)
			onTabClick(aNames[aHash[0]]);
		if (oMember)
			oMember.scrollIntoView();

	// Prettify
	prettyPrint();
}

function onTabClick(sId)
{
    var sCurrentId	= document.getElementById('eTableMembers').getAttribute("tab");
    if (sCurrentId)
    {
        document.getElementById('eTab_'+sCurrentId).className		= document.getElementById('eTab_'+sCurrentId).className.replace('pressed', 'normal');
        document.getElementById('ePane_'+sCurrentId).style.display	= 'none';
    }
    document.getElementById('eTab_'+sId).className		= document.getElementById('eTab_'+sId).className.replace(/hover|normal/, 'pressed');
    document.getElementById('ePane_'+sId).style.display	= '';
    document.getElementById('eTableMembers').setAttribute("tab", sId);
    document.getElementById('eTableMembersHeader').innerHTML    = document.getElementById('eTab_'+sId).innerHTML;
}

function onMenuClick(oElement)
{
	var oPane	= document.getElementById("eTableMembersPane");
	if (window.top._helpOpen)
	{
		window.top._helpOpen	= false;
		oElement.className	= oElement.className.replace("open", "close");
		oPane.className		= oPane.className.replace("open", "close");
		oPane.style.height = '240px';
	}
	else
	{
		window.top._helpOpen	= true;
		oElement.className	= oElement.className.replace("close", "open");
		oPane.className		= oPane.className.replace("close", "open");
		oPane.style.height = 'auto';
	}
}

function onShowInheritedClick(oElement) {
	document.getElementById('eTableMembers').tBodies[0].className	= oElement.checked ? '' : "hide-inherited";
}