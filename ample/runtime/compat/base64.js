/*
 * Ample SDK - JavaScript GUI Framework
 *
 * Copyright (c) 2012 Sergey Ilinsky
 * Dual licensed under the MIT and GPL licenses.
 * See: http://www.amplesdk.com/about/licensing/
 *
 */


//
if (!window.btoa) {
	var aBase64EncodeChars	= "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split('');
	fExporter_export(function(vValue) {
		var aValue	= [],
			sValue	= cString(vValue);
		for (var nIndex = 0, nLength = sValue.length, nValue1, nValue2, nValue3; nIndex < nLength;) {
			nValue1	= sValue.charCodeAt(nIndex++) & 255;
			if (nIndex == nLength) {
				aValue.push(aBase64EncodeChars[nValue1 >> 2]);
				aValue.push(aBase64EncodeChars[(nValue1 & 3) << 4]);
				aValue.push('==');
				break;
			}
			nValue2	= sValue.charCodeAt(nIndex++);
			if (nIndex == nLength) {
				aValue.push(aBase64EncodeChars[nValue1 >> 2]);
				aValue.push(aBase64EncodeChars[((nValue1 & 3) << 4) | ((nValue2 & 240) >> 4)]);
				aValue.push(aBase64EncodeChars[(nValue2 & 15) << 2]);
				aValue.push('=');
				break;
			}
			nValue3	= sValue.charCodeAt(nIndex++);
			aValue.push(aBase64EncodeChars[nValue1 >> 2]);
			aValue.push(aBase64EncodeChars[((nValue1 & 3) << 4) | ((nValue2 & 240) >> 4)]);
			aValue.push(aBase64EncodeChars[((nValue2 & 15) << 2) | ((nValue3 & 192) >> 6)]);
			aValue.push(aBase64EncodeChars[nValue3 & 63]);
		}
		return aValue.join('');
	}, "btoa", window);
}

if (!window.atob) {
	var aBase64DecodeChars	= new cArray(
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
			-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
			52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
			-1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
			15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
			-1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
			41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
	fExporter_export(function(sValue) {
//->Guard
		fGuard(arguments, [
			["value",	cString]
		]);
//<-Guard

		var aValue	= [];
		for (var nIndex = 0, nLength = sValue.length, nValue1, nValue2, nValue3, nValue4; nIndex < nLength;) {
			/* c1 */
			do {
				nValue1	= aBase64DecodeChars[sValue.charCodeAt(nIndex++) & 255];
			} while (nIndex < nLength && nValue1 ==-1);
			if (nValue1 ==-1)
				break;

			/* c2 */
			do {
				nValue2	= aBase64DecodeChars[sValue.charCodeAt(nIndex++) & 255];
			} while (nIndex < nLength && nValue2 ==-1);
			if (nValue2 ==-1)
				break;

			aValue.push(cString.fromCharCode((nValue1 << 2) | ((nValue2 & 48) >> 4)));

			/* c3 */
			do {
				nValue3	= sValue.charCodeAt(nIndex++) & 255;
				if (nValue3 == 61)
					return aValue.join('');
				nValue3	= aBase64DecodeChars[nValue3];
			} while (nIndex < nLength && nValue3 ==-1);
			if (nValue3 ==-1)
				break;

			aValue.push(cString.fromCharCode(((nValue2 & 15) << 4) | ((nValue3 & 60) >> 2)));

			/* c4 */
			do {
				nValue4	= sValue.charCodeAt(nIndex++) & 255;
				if (nValue4 == 61)
					return aValue.join('');
				nValue4	= aBase64DecodeChars[nValue4];
			} while (nIndex < nLength && nValue4 ==-1);
			if (nValue4 ==-1)
				break;

			aValue.push(cString.fromCharCode(((nValue3 & 3) << 6) | nValue4));
		}
		return aValue.join('');
	}, "atob", window);
}