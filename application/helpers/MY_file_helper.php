<?php

if (!function_exists('read_and_print_js')) {
	function read_and_print_js($folder, $showHeaderFolder = false) {
		$path = FCPATH;
		if ($showHeaderFolder) {
			echo "\n\t<!-- " . $folder . " -->";
		}
		if ($handle = opendir($folder)) {
			while(false !== ($entry = readdir($handle))){
				if ($entry != "." && $entry != ".." && $entry[0] != ".") {
					$pwd      = $folder . '/' . $entry;
					$checkDir = is_dir($pwd);
					if ($checkDir == 1) {
						read_and_print_js($pwd, false);
					} else {
						if (!(strpos($entry, '.jst.ejs') > 0)) {
							echo "\n\t<script src='" . str_replace($path, '', $pwd) . "'></script>\n";
						}
					}
				}
			}
			closedir($handle);
		}
	}
}