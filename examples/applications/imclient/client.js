var aTransports	= {};

function onCmdSignIn() {
	signIn();
}

function onCmdSignOut() {
	signOut();
}

function signIn() {
	onSrvSignIn();
}

function signOut() {
	onSrvSignOut();
}

function onSrvSignIn() {
	ample.getElementById("cmd_signout").setAttribute("disabled", "false");
	ample.getElementById("cmd_signin").setAttribute("disabled", "true");
	ample.getElementById("workspace").setAttribute("selectedIndex", 1);
}

function onSrvSignOut() {
	ample.getElementById("cmd_signout").setAttribute("disabled", "true");
	ample.getElementById("cmd_signin").setAttribute("disabled", "false");
	ample.getElementById("workspace").setAttribute("selectedIndex", 0);
}

/*

*/

function onCmdGroupsOpen() {
	var aGroups	= ample.getElementById("contactlist").body.children.items;
	for (var nIndex = 0; nIndex < aGroups.length; nIndex++)
		aGroups[nIndex].setAttribute("open", "true");
}

function onCmdGroupsClose() {
	var aGroups	= ample.getElementById("contactlist").body.children.items;
	for (var nIndex = 0; nIndex < aGroups.length; nIndex++)
		aGroups[nIndex].setAttribute("open", "false");
}

function onGroupSelected(oElement) {
	ample.getElementById("cmd_group_options").setAttribute("disabled", "false");
	ample.getElementById("cmd_contact_options").setAttribute("disabled", "true");
}

function onContactSelected(oElement) {
	ample.getElementById("cmd_group_options").setAttribute("disabled", "true");
	ample.getElementById("cmd_contact_options").setAttribute("disabled", "false");
}

//
function onPopupTransportShowing(oElement) {

}

