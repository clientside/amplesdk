var aTransports	= {};

function onCmdSignIn()
{
	signIn();
}

function onCmdSignOut()
{
	signOut();
}

function signIn()
{
	onSrvSignIn();
}

function signOut()
{
	onSrvSignOut();
}

function onSrvSignIn()
{
	ample.document.getElementById("workspace").setAttribute("selectedIndex", 1);
}

function onSrvSignOut()
{
	ample.document.getElementById("workspace").setAttribute("selectedIndex", 0);
}

/*

*/

function onCmdGroupsOpen()
{
	var aGroups	= ample.document.getElementById("contactlist").body.children.items;
	for (var nIndex = 0; nIndex < aGroups.length; nIndex++)
		aGroups[nIndex].setAttribute("open", "true");
}

function onCmdGroupsClose()
{
	var aGroups	= ample.document.getElementById("contactlist").body.children.items;
	for (var nIndex = 0; nIndex < aGroups.length; nIndex++)
		aGroups[nIndex].setAttribute("open", "false");
}

function onGroupSelected(oElement)
{
	ample.document.getElementById("cmd_group_options").setAttribute("disabled", "false");
	ample.document.getElementById("cmd_contact_options").setAttribute("disabled", "true");
}

function onContactSelected(oElement)
{
	ample.document.getElementById("cmd_group_options").setAttribute("disabled", "true");
	ample.document.getElementById("cmd_contact_options").setAttribute("disabled", "false");
}

//
function onPopupTransportShowing(oElement)
{

}

