/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cAMLProcessingInstruction	= function(){};

cAMLProcessingInstruction.prototype	= new cAMLNode;
cAMLProcessingInstruction.prototype.nodeType	= cAMLNode.PROCESSING_INSTRUCTION_NODE;

// nsIDOMProcessingInstruction
cAMLProcessingInstruction.prototype.data	= null;
cAMLProcessingInstruction.prototype.target	= null;
