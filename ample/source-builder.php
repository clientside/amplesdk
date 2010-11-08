<?php
	if (isset($_GET["path"])) {
		$path	= $_GET["path"];
		$files	= file($path . ".files");

		$output	= "";
		for ($n = 0; $n < count($files); $n++)
			if (($file = trim($files[$n])) != "" && substr($file, 0, 1) != "#")
				$output	.= join('', file($path . $file)) . "\n";

		header("Content-type: application/javascript");

		echo 	"" .
//				"var d = new Date;" .
				"(function(){" .
					$output .
				"})()".
//				";alert(new Date - d)" .
				"";
	}
	else {
		echo "GET path parameter missing.";
	}
?>