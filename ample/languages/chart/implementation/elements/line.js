/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_line	= function(){};
cChartElement_line.prototype	= new cChartElement;

// Register Element with language
oChartNamespace.setElement("line", cChartElement_line);