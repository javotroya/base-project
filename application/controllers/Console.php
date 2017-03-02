<?php
if (!defined('BASEPATH')) {
	exit('No direct script allowed');
}

if (!is_cli()) {
	exit('Only CLI access allowed');
}

class Console extends CI_Controller {
	private $help_request;

	public function __construct() {
		parent::__construct();
		$this->load->library('cli_colors');
		$this->help_request = ['h', '-h', '--h', '--help', '-help', 'help'];
	}

	public function generate($generate) {
		global $argv, $argc;
		switch ($generate) {
			case 'view':
				$this->_generate_view($argv[4]);
				break;
		}
	}

	private function _generate_view($value) {
		$path = FCPATH . 'source/views/';
		if (in_array($value, $this->help_request)) {
			$help_text = $this->cli_colors->string("Use este script para generar vistas relativas a {$path}", 'blue', null, true);
			$help_text .= $this->cli_colors->string('Ejemplo:', 'blue', null, true);
			$help_text .= $this->cli_colors->string('php index.php console generate view users/list', 'blue', null, true);
			$this->cli_colors->box('php console generate view', $help_text, 'red');
			exit;
		}
		$file_name     = "{$path}$value.js";
		$template_name = "{$path}$value.jst.ejs";
		$files_exp     = explode("/", $value);

		$list_name_space_file = explode("/", $value);

		// Remove the file name from the array
		array_pop($files_exp);

		// Create Path if not exists
		$folder_created = array();
		if (!is_dir(join('/', $files_exp))) {
			$path_temp = '';
			foreach ($files_exp as $folder) {
				$path_temp .= "{$path}$folder/";
				if (!file_exists($path_temp)) {
					array_push($folder_created, $path_temp);
					mkdir($path_temp, 0777);
				}
			}
		}
		// Upper each name of folder
		foreach ($files_exp as &$name_path) {
			$underscore = explode('_', $name_path);
			if (sizeof($underscore) > 1) {
				$name_path_temp = lcfirst($underscore[0]);
				for ($i = 1; $i < sizeof($underscore); $i ++) {
					$name_path_temp = $name_path_temp . ucfirst($underscore[ $i ]);
				}
				$name_path = $name_path_temp;
			}
			$name_path = ucfirst($name_path);
		}

		// Conditions name space for header
		$header_name_space = '';
		$path_name_space   = '';
		foreach ($files_exp as $path_folder) {
			$path_name_space .= '.' . $path_folder;
			$header_name_space .=
				<<<EOF
if (_.isUndefined(App.Views{$path_name_space})) {
    App.Views{$path_name_space} = {};
}
EOF;
		}
		// Upper each name of folder
		foreach ($list_name_space_file as &$name_path) {
			$underscore = explode('_', $name_path);
			if (sizeof($underscore) > 1) {
				$name_path_temp = lcfirst($underscore[0]);
				for ($i = 1; $i < sizeof($underscore); $i ++) {
					$name_path_temp = $name_path_temp . ucfirst($underscore[ $i ]);
				}
				$name_path = $name_path_temp;
			}
			$name_path = ucfirst($name_path);
		}

		// Name Space of view
		$name_space_file            = join('.', $list_name_space_file);
		$name_space_file_class_name = join('', $list_name_space_file);
		// ClassName of view
		$view = lcfirst($list_name_space_file[ count($list_name_space_file) - 1 ]);

		$file = fopen($file_name, "w") or exit("Unable to create view file!");

		// Name Space of template
		$template_path_relative = lcfirst(join('', $list_name_space_file));

		$file_text = <<<EOF
'use strict';
{$header_name_space}
App.Views.{$name_space_file} = App.Helpers.View.extend({
    template: App.Templates.{$template_path_relative},
    className: '{$name_space_file_class_name}',
    initialize: function(options) {
        App.Helpers.View.prototype.initialize.apply(this, [options]);
    },
    events: {

    }
});
EOF;

		fwrite($file, $file_text);
		fclose($file);
		$file_template = fopen("$template_name", "w") or exit("Unable to create template file!");
		fwrite($file_template, "<div>View for $view</div>");
		fclose($file_template);

		if (count($folder_created) > 0) {
			$this->cli_colors->string("The following directories have been created:", 'blue');
			foreach ($folder_created as $path) {
				$this->cli_colors->string("\t- $path", 'brown');
			}
		}
		$this->cli_colors->string("The view $view has been created successfully!.", 'blue');
	}
}