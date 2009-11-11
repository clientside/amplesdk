/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2009 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/ample/licensing/
 *
 */

var cChartElement_map	= function(){};
cChartElement_map.prototype	= new cChartElement;

// Register Element with language
oChartNamespace.setElement("map", cChartElement_map);