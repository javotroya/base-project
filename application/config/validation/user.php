<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

$config['user'] = [
	[
		'field' => 'first_name',
		'label' => 'nombre',
		'rules' => 'required|trim|alpha_numeric_spaces|min_length[3]',
	],
	[
		'field' => 'last_name',
		'label' => 'apellido',
		'rules' => 'required|trim|alpha_numeric_spaces|min_length[2]',
	],
	[
		'field' => 'email',
		'label' => 'emaill',
		'rules' => 'required|trim|valid_email',
	],
];