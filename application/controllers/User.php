<?php if(!defined('BASEPATH'))
	exit('No direct script allowed');

class User extends MY_Controller{
	const USER_SAVED_SUCCESS = 'Se ha guardado el usuario correctamente';
	const USER_NOT_FOUND = 'No se encontró el usuario';
	public function __construct() {
		parent::__construct();
		$this->load->model('users_model');
		$this->load->helper('form');
	}

	public function index_get($user_id){
		$user = $this->users_model->get($user_id);
		if($user){
			$skip = [
				'activation_code',
				'active',
				'company',
				'created_on',
				'forgotten_password_code',
				'forgotten_password_time',
				'id',
				'ip_address',
				'last_login',
				'password',
				'remember_code',
				'salt',
				'username',
				'password'
			];
			$user = prepare_data($user, $skip);
			$this->response($user, REST_Controller::HTTP_OK);
		}
		$this->response(['status' => false, 'message' => self::USER_NOT_FOUND], REST_Controller::HTTP_BAD_REQUEST);
	}

	public function index_put($user_id){
		$post_vars = json_decode($this->input->raw_input_stream);
		$this->load->library('form_validation');
		$validation = $this->form_validation;
		$data = prepare_data($post_vars);
		$validation->set_data($data);
		if(!$validation->run('user')){
			$this->response(['message' => $validation->error_string()], REST_Controller::HTTP_BAD_REQUEST);
		} else {
			$this->users_model->update($user_id, $data);
			$this->response(['message' => self::USER_SAVED_SUCCESS], REST_Controller::HTTP_CREATED);
		}
		$this->response(['message' => MY_Controller::GENERIC_ERROR_MESSAGE], REST_Controller::HTTP_BAD_REQUEST);
	}
}