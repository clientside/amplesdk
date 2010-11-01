ample.ready(function() {
	ample.get("server/messages.js", null, function(data) {
		var messages	= JSON.parse(data);
		for (var n = 0, l = messages.length; n < l; n++) {
			ample.query("#messages").append(
					'<xul:listitem id="message_' + messages[n].id + '" xmlns:xul="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">\
						<xul:listcell>' + messages[n].f + '</xul:listcell>\
						<xul:listcell>' + messages[n].h + '</xul:listcell>\
						<xul:listcell>' + messages[n].l + '</xul:listcell>\
						<xul:listcell>' + messages[n].a + '</xul:listcell>\
						<xul:listcell>' + messages[n].t + '</xul:listcell>\
					</xul:listitem>');
		}
	});

	ample.get("server/labels.js", null, function(data) {
		var labels	= JSON.parse(data);
		for (var n = 0, l = labels.length; n < l; n++) {
			ample.query("#pop_moveto_after").after('<xul:menuitem xmlns:xul="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">' + labels[n].id + '</xul:menuitem>');
			ample.query("#pop_labels_after").after('<xul:menuitem type="checkbox" xmlns:xul="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">' + labels[n].id + '</xul:menuitem>');
		}
	});

	ample.get("server/folders.js", null, function(data) {
		var folders	= JSON.parse(data);
		for (var n = 0, l = folders.length; n < l; n++) {
			ample.query("#folders-custom").append(
					'<xul:treeitem xmlns:xul="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul">\
						<xul:treerow>\
							<xul:treecell>'+ folders[n].id + '</xul:treecell>\
						</xul:treerow>\
					</xul:treeitem>');
		}
	});
});