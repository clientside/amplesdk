/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2010 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


/*
 * jQuery Templating Plugin
 *   NOTE: Created for demonstration purposes.
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 */
(function(jQuery){
	// extend with missing functions
	jQuery.each	= function(oData, fCallback) {
		for (var sKey in oData)
			fCallback.call(this, oData[sKey], sKey);
		return oData;
	};

	jQuery.map	= function(oData, fCallback) {
		var oValue	= oData instanceof Array ? [] : {},
			vValue;
		for (var sKey in oData)
			if (typeof (vValue = fCallback.call(this, oData[sKey], sKey) != "undefined"))
				oData instanceof Array ? oValue.push(vValue) : oValue[sKey] = vValue;
		return oValue;
	};

	// Override the DOM manipulation function
//	var oldManip = jQuery.fn.domManip;

	jQuery./*fn.*/extend({
		render: function( data ) {
			return this.each(function(i, tmpl){
//			return this.map(function(i, tmpl){
				return jQuery.render( tmpl, data );
			});
		}/*,

		// This will allow us to do: .append( "template", dataObject )
		domManip: function( args ) {
			// This appears to be a bug in the appendTo, etc. implementation
			// it should be doing .call() instead of .apply(). See #6227
			if ( args.length > 1 && args[0].nodeType ) {
				arguments[0] = [ jQuery.makeArray(args) ];
			}

			if ( args.length === 2 && typeof args[0] === "string" && typeof args[1] !== "string" ) {
				arguments[0] = [ jQuery.render( args[0], args[1] ) ];
			}

			return oldManip.apply( this, arguments );
		}*/
	});

//	jQuery.extend({
//		render: function( tmpl, data ) {
		jQuery.render	= function( tmpl, data ) {
			var fn;

			// Use a pre-defined template, if available
			if ( jQuery.templates[ tmpl ] ) {
				fn = jQuery.templates[ tmpl ];

			// We're pulling from a script node
			} else if ( tmpl.nodeType ) {
				var node = tmpl, elemData = jQuery.data( node );
//				fn = elemData.tmpl || jQuery.tmpl( node.innerHTML );
				fn = elemData.tmpl || jQuery.tmpl( jQuery.query(node).html() );
			}

			fn = fn || jQuery.tmpl( tmpl );

			// We assume that if the template string is being passed directly
			// in the user doesn't want it cached. They can stick it in
			// jQuery.templates to cache it.

			if ( data instanceof Array ) {
				return jQuery.map( data, function( data, i ) {
//				return jQuery.map( data, function( data, i ) {
					return fn.call( data, jQuery, data, i );
				});

			} else {
				return fn.call( data, jQuery, data, 0 );
			}
//		},
		};

		// You can stick pre-built template functions here
//		templates: {},
		jQuery.templates	= {};

		/*
		 * For example, someone could do:
		 *   jQuery.templates.foo = jQuery.tmpl("some long templating string");
		 *   $("#test").append("foo", data);
		 */

//		tmplcmd: {
		jQuery.tmplcmd	= {
			"each": {
				_default: [ null, "$i" ],
				prefix: "jQuery.each($1,function($2){with(this){",
				suffix: "}});"
			},
			"if": {
				prefix: "if($1){",
				suffix: "}"
			},
			"else": {
				prefix: "}else{"
			},
			"html": {
				prefix: "_.push(typeof $1==='function'?$1.call(this):$1);"
			},
			"=": {
				_default: [ "this" ],
				prefix: "_.push($.encode(typeof $1==='function'?$1.call(this):$1));"
			}
//		},
		};

//		encode: function( text ) {
		jQuery.encode	= function( text ) {
			return text != null ? document.createTextNode( text.toString() ).nodeValue : "";
//		},
		};

//		tmpl: function(str, data, i) {
		jQuery.tmpl	= function(str, data, i) {
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			var fn = new Function("jQuery","$data","$i",
				"var $=jQuery,_=[];_.data=$data;_.index=$i;" +

				// Introduce the data as local variables using with(){}
				"with($data){_.push('" +

				// Convert the template into pure JavaScript
				str
					.replace(/[\r\t\n]/g, " ")
					.replace(/\${([^}]*)}/g, "{{= $1}}")
					.replace(/{{(\/?)(\w+|.)(?:\((.*?)\))?(?: (.*?))?}}/g, function(all, slash, type, fnargs, args) {
						var tmpl = jQuery.tmplcmd[ type ];

						if ( !tmpl ) {
							throw "Template not found: " + type;
						}

						var def = tmpl._default;

						return "');" + tmpl[slash ? "suffix" : "prefix"]
							.split("$1").join(args || def[0])
							.split("$2").join(fnargs || def[1]) + "_.push('";
					})
//				+ "');}return $(_.join('')).get();");
				+ "');}return $.query(_.join(''))");

			// Provide some basic currying to the user
			return data ? fn.call( this, jQuery, data, i ) : fn;
//		}
		};
//	});
})(ample);
