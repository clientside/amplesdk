/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cProcessingInstruction	= function(){};

cProcessingInstruction.prototype	= new cNode;
cProcessingInstruction.prototype.nodeType	= cNode.PROCESSING_INSTRUCTION_NODE;

// nsIDOMProcessingInstruction
cProcessingInstruction.prototype.data	= null;
cProcessingInstruction.prototype.target	= null;
