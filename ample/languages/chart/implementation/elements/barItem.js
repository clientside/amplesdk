/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_barItem	= function(){};
cChartElement_barItem.prototype	= new cChartElement;

// Register Element with language
oChartNamespace.setElement("barItem", cChartElement_barItem);