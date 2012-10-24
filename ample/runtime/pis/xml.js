/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cXmlPI	= function(){};
cXmlPI.prototype	= new cProcessingInstruction;

cXmlPI.prototype.nodeName	=
cXmlPI.prototype.target	= "xml";

// Register Processing Instruction
fAmple_extend(cXmlPI);