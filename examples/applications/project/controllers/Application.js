var Application	= (function(){

	// Implementation
	var oView	= ample;
	// Event Bus
	var oSubscribers	= {};

	function fSubscribe(sType, fHandler) {
		var aType	= oSubscribers[sType];
		if (!aType)
			aType	= oSubscribers[sType]	= [];
		aType.push(fHandler);
	};

	function fUnsubscribe(sType, fHandler) {
		var aType	= oSubscribers[sType];
		if (aType) {
			for (var nIndex = 0, bFound	= false; nIndex < aType.length; nIndex++)
				if (bFound)
					aType[nIndex - 1]	= aType[nIndex];
				else
				if (aType[nIndex] == fHandler)
					bFound	= true;
			if (bFound)
				aType.length--;
		}
	};

	function fNotify(sType, oDetail) {
		var aType	= oSubscribers[sType];
		if (aType)
			for (var nIndex = 0; nIndex < aType.length; nIndex++)
				aType[nIndex](oDetail);
	};

	// Register with View
	oView.addEventListener("load", function() {
		Application.notify("Application:init");
	}, false);

	// Public API
	return {
		notify:	function(sType, oDetail) {
			fNotify(sType, oDetail || {});
		},
		subscribe:		function(sType, fHandler) {
			fSubscribe(sType, fHandler);
		},
		unsubscribe:	function(sType, fHandler) {
			fUnsubscribe(sType, fHandler);
		}
	};
});