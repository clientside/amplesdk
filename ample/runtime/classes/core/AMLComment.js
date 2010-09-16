/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLComment	= function(){};

cAMLComment.prototype	= new cAMLCharacterData;
cAMLComment.prototype.nodeType	= cAMLNode.COMMENT_NODE;
cAMLComment.prototype.nodeName	= "#comment";

// nsIDOMComment
//->Source
/*
cAMLComment.prototype.$getTag	= function()
{
	return "<!--" + this.nodeValue + "-->";
};
*/
//<-Source
