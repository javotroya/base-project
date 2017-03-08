<?php
if (!defined('BASEPATH')) {
	exit('No direct script allowed');
}

if (!is_cli()) {
	exit('Only CLI access allowed');
}

class Generate extends CI_Controller {
	private $help_request;

	public function __construct() {
		parent::__construct();
		$this->load->library('cli_colors');
		$this->help_request = ['h', '-h', '--h', '--help', '-help', 'help'];
	}

	public function generate($generate = null) {
		global $argv;
		if (!isset($argv[4]) || $generate == null) {
			$this->cli_colors->box('ALERTA', 'Debes colocar un argumento válido', 'red');
			exit;
		}
	}

	public function view($value) {
		$uri = str_replace('generate/view/', '', $this->uri->uri_string());
		$explode_uri = explode('/', $uri);
		if(count($explode_uri) > 1){
			$value = $uri;
		}
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

		$file = fopen($file_name, "w") or exit('No se pudo crear el archivo');

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
		$file_template = fopen("$template_name", "w") or exit('No se pudo crear el archivo');
		fwrite($file_template, "<div>View for $view</div>");
		fclose($file_template);

		if (count($folder_created) > 0) {
			$this->cli_colors->string('Los siguientes directorios fueron creados:', 'blue');
			foreach ($folder_created as $path) {
				$this->cli_colors->string("\t- $path", 'brown');
			}
		}
		$this->cli_colors->string("La vista $view fue creada con exito!", 'blue');
	}

	public function model($value){
		$this->resource('models', $value);
	}

	public function collection($value, $model = null){
		$this->resource('collections', $value, $model);
	}

	public function route($value){
		$this->resource('routes', $value);
	}

	public function resource($route = 'routes', $value, $collection_model = null) {
		$path = FCPATH . "source/$route/";
		$function = 'route';
		switch($route){
			case 'models':
				$function = 'model';
				break;
			case 'collections':
				$function = 'collection';
				break;
		}
		if (in_array($value, $this->help_request)) {
			$help_text = $this->cli_colors->string("Use este script para generar {$route} relativas a {$path}", 'blue', null, true);
			$help_text .= $this->cli_colors->string('Ejemplo:', 'blue', null, true);
			$help_text .= $this->cli_colors->string("php console generate $function users", 'blue', null, true);
			$help_text .= $this->cli_colors->string("Solo se pueden crear $route directamente en el directorio $route. No se permiten $route anidadas.", 'blue', null, true);
			$this->cli_colors->box("php console generate $function", $help_text, 'red');
			exit;
		}

		$file_exp = explode('/', $value);
		if(count($file_exp) > 1){
			$this->cli_colors->string("No se permiten $route hijas o anidadas.", 'red');
			exit;
		}

		$capital_route_name = ucwords(strtolower($value));
		$route_name = strtolower($value);
		$file_name = "{$path}{$route_name}.js";
		$file = fopen($file_name, "w") or exit('No se pudo crear el archivo.');
		$route_file_content = 'Empty file';
		if($route == 'routes') {
			$route_file_content = <<<EOF
'use strict';
App.Router.$capital_route_name = App.Helpers.Router.extend({
    className   : '$capital_route_name',
    routes      : {}
});

let {$capital_route_name}Router = new App.Router.$capital_route_name();
{$capital_route_name}Router.on('route', function (actions) {
    if(App.Const.debug){
        console.log( actions );
    }
});
EOF;
		} elseif ($route == 'models'){
			$route_file_content = <<<EOF
'use strict';
App.Models.$capital_route_name = App.Helpers.Model.extend({
    idAttribute   : '',
    url      : function(){ return '/'; }
});
EOF;
		} elseif ($route == 'collections'){
			$collection_model = ucwords(strtolower($collection_model));
			$model = $collection_model ? "App.Models.$collection_model" : 'App.Models';
			$route_file_content = <<<EOF
'use strict';
App.Collections.$capital_route_name = App.Helpers.Collection.extend({
    url      : function(){ return '/'; },
    model    : $model
});
EOF;
		}
		fwrite($file, $route_file_content);
		fclose($file);
		$this->cli_colors->string("Se creo el $route $capital_route_name correctamente", 'blue');
	}

	public function component($value = '', $plural = ''){
		if(empty($value) || empty($plural)){
			$this->cli_colors->string('Uso: php console generate component nombre_singular nombre_plural', 'red');
			exit;
		}
		$this->view($value);
		$this->model($value);
		$this->collection($plural, $value);
		$this->route($value);
	}
}