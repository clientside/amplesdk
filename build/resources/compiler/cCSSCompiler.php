<?
	class cCSSCompiler
	{
		var $output		= "";

		var $debug		= false;

		function cCSSCompiler()
		{

		}

		function readFromString($sString)
		{
			$this->output	= $sString;
		}

		function readFromFile($sFileName)
		{
			$this->output	= $this->output . join("", file($sFileName));
		}

		function getOutput()
		{
			return $this->output;
		}

		function stripComments()
		{
			$sData	= $this->output;

	        // Strip '/* comment */' comments
	        $sData	= preg_replace('/\/\*.+\*\//Us', "", $sData);

	        $this->output	= $sData;
		}

	    function stripSpaces()
	    {
			$sData	= $this->output;

			// replace tabs with spaces
	        $sData	= str_replace("	",   		" ",   		$sData);

	        // Strip ' : ' spaces around
	        $sData	= preg_replace('/ *([=\+\:\|\^<>\{\};]) */', '$1', $sData);

	        // strip all more than one spaces
	        $sData	= preg_replace("/\s\s+/",	"",			$sData);

	        $sData	= preg_replace("/;;+/",		";",		$sData);
	        $sData	= str_replace(";}",			"}",		$sData);

	        $this->output	= $sData;
	    }

	    function obfuscate()
	    {
			$sCSS	= $this->output;

			// Rewrite display:inline-block to display:inline (IE8-)
			// display:inline-block
			//	-> display:inline-block;
			//	-> *display:inline;
			$sCSS	= preg_replace("/display\s*:\s*inline-block/",	"display:inline-block;zoom:1;*display:inline",		$sCSS);

			// Rewrite opacity
			// opacity : .5
			//	-> opacity: .5;
			//	-> -ms-filter:Alpha(opacity=' + nOpacity * 100 + ');
			//	-> filter:Alpha(opacity=' + nOpacity * 100 + ');
			$sCSS	= preg_replace_callback("/opacity\s*:\s*(\d?\.?\d+)/",	"cCSSCompiler_replaceOpacity",			$sCSS);

			// Remove prefix declaration
			$sCSS	= preg_replace("/@namespace\s+([\w-]+\s+)?(url\()?(['\"])?[^'\";\s]+(['\"])?\)?;?/", "", $sCSS);

			//
			$aCSS	= array();
			if (preg_match_all("/([^{]+)({[^}]*})/", $sCSS, $aRules)) {
				for ($nIndex = 0, $nLength = count($aRules[0]); $nIndex < $nLength; $nIndex++) {

					$sCSSSelector	= $aRules[1][$nIndex];
					$sCSSSelector	= preg_replace("/\|/", '-', $sCSSSelector);								// Namespace
					$sCSSSelector	= preg_replace("/(^|[\s>+~,}]|not\()([\w])/", '$1.$2', $sCSSSelector);	// Element
					$sCSSSelector	= preg_replace("/\[([\w]+)=?([\w]+)?\]/", '-$1-$2', $sCSSSelector);		// Attribute
					$sCSSSelector	= preg_replace("/::/", '--', $sCSSSelector);							// Pseudo-element
					$sCSSSelector	= preg_replace("/:(?!last-child|first-child|not)/", '_', $sCSSSelector);// Pseudo-class
//					$sCSSSelector	= preg_replace("/>/g, '--' + "gateway" + '>', $sCSSSelector);
//					$sCSSSelector	= preg_replace("/(--gateway){2,}/g, '--' + "gateway", $sCSSSelector);	// > selector

					$aCSS[]	= $sCSSSelector;
					$aCSS[]	= $aRules[2][$nIndex];
				}

				$sCSS	= join('', $aCSS);
			}
			$this->output	= $sCSS;
	    }
	}

	function cCSSCompiler_replaceOpacity($matches) {
		return $matches[0] . ";" .
				"-ms-filter:\"progid:DXImageTransform.Microsoft.Alpha(opacity=" . ($matches[1] * 100) . ")\";".
				"*filter:progid:DXImageTransform.Microsoft.Alpha(opacity=" . ($matches[1] * 100) . ")";
	}

?>