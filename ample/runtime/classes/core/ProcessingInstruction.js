/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */

var cProcessingInstruction	= function(){};

cProcessingInstruction.prototype	= new cNode;
cProcessingInstruction.prototype.nodeType	= 7;	// cNode.PROCESSING_INSTRUCTION_NODE

// nsIDOMProcessingInstruction
cProcessingInstruction.prototype.data	= null;
cProcessingInstruction.prototype.target	= null;
