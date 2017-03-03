<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class Users extends MY_Controller {
	public function __construct() {
		parent::__construct();
		$this->load->model('users_model');
	}

	public function index_get(){
		$users = $this->users_model->get();
		if($users){
			$this->response($users, REST_Controller::HTTP_OK);
		}
		$this->response(['status' => false, 'message' => 'No se encontraron usuarios'], REST_Controller::HTTP_BAD_REQUEST);
	}
}