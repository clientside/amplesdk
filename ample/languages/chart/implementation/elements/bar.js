/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_bar	= function(){};
cChartElement_bar.prototype	= new cChartElement;

// Register Element with language
oChartNamespace.setElement("bar", cChartElement_bar);